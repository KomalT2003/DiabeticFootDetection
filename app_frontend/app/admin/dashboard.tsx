import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import axios, { all } from 'axios';

// Interfaces
interface User {
  id: string;
  username: string;
  age: number;
  gender: string;
  occupation: string;
  height: number;
  weight: number;
  physical_activity: string;
  timestamp: string;
}

interface DiabetesAssessment {
  username: string;
  observed_diabetes: string;
  high_glucose: string;
  close_family: string;
  far_family: string;
  waist_circumference: number;
  kidney: string;
  thyroid: string;
  blood_pressure: string;
  cholestral: string;
  heart_disease: string;
  smoke: string;
  alcohol: string;
  diet: string;
  symptom_fatigue: string;
  symptom_blurred_vision: string;
  symptom_fruiity_breath: string;
  symptom_excessive_thirst: string;
  symptom_increased_urination: string;
  symptom_nausea: string;
  diabetes_risk_score: number;
}

interface FootAssessment {
  username: string;
  observed_foot: string;
  history_amputation: string;
  history_foot_ulcer: string;
  history_calf_pain: string;
  history_healing_wound: string;
  redness: number;
  swelling: number;
  pain: number;
  numbness: number;
  sensation: number;
  recent_cut: string;
  foot_risk_score: number;
}

interface ValidationResult {
  username: string;
  assessment_type: 'diabetes' | 'foot';
  is_correct: boolean;
  risk_rating: number;
  feedback: string;
  validated_at?: string;
}

interface UserDetails {
  user: User;
  diabetesAssessment?: DiabetesAssessment;
  footAssessment?: FootAssessment;
  diabetesValidation?: ValidationResult;
  footValidation?: ValidationResult;
}

const VIEWS = {
  DEMOGRAPHICS: 'demographics',
  DIABETES: 'diabetes',
  FOOT: 'foot'
} as const;

const TABS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted'
} as const;

export default function AdminDashboardScreen() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [validatedUsers, setValidatedUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<typeof VIEWS[keyof typeof VIEWS]>(VIEWS.DEMOGRAPHICS);
  const [currentTab, setCurrentTab] = useState<typeof TABS[keyof typeof TABS]>(TABS.PENDING);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    fetchInitialData();
  }, []);


  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [allUsersResponse, validatedResponse] = await Promise.all([
        axios.get('http://192.168.38.114:5000/users'),
        axios.get('http://192.168.38.114:5000/validations')
      ]);

      const allUsersData = allUsersResponse.data;
      const validatedData = validatedResponse.data;

      // Get unique validated usernames (both diabetes and foot assessments)
      const validatedUsernames = [...new Set(validatedData.map((validation: any) => 
        validation.username.trim()
      ))];

      setAllUsers(allUsersData.map((user: User) => ({
        ...user,
        username: user.username.trim()
      })));
      
      setValidatedUsers(validatedUsernames);
      
      const pendingUsersList = allUsersData.filter((user: User) => 
        !validatedUsernames.includes(user.username.trim())
      );
      setPendingUsers(pendingUsersList);

    } catch (error) {
      console.error('Failed to fetch data', error);
      Alert.alert('Error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Update the filteredUsers calculation
  const filteredUsers = React.useMemo(() => {
    if (currentTab === TABS.PENDING) {
      return allUsers.filter(user => !validatedUsers.includes(user.username.trim()));
    } else {
      return allUsers.filter(user => validatedUsers.includes(user.username.trim()));
    }
  }, [currentTab, validatedUsers, allUsers]);

  // Add a useEffect to monitor state changes
  useEffect(() => {
    console.log('State Updated:', {
      validatedUsers,
      allUsersCount: allUsers.length,
      pendingUsersCount: pendingUsers.length,
      currentTab,
      filteredUsersCount: filteredUsers.length
    });
  }, [validatedUsers, allUsers, pendingUsers, currentTab, filteredUsers]);


  const fetchUserDetails = async (username: string) => {
    setLoading(true);
    try {
      const [diabetesResponse, footResponse, validationsResponse] = await Promise.all([
        axios.post('http://192.168.38.114:5000/get_diabetic_detection', { username }),
        axios.post('http://192.168.38.114:5000/get_diabetic_foot', { username }),
        axios.get('http://192.168.38.114:5000/validations')
      ]);
  
      const user = allUsers.find(u => u.username === username);
      if (!user) throw new Error('User not found');
      
      
      const validations = validationsResponse.data;
      const diabetesValidation = validations.find(
        (v: ValidationResult) => v.username === username && v.assessment_type === 'diabetes'
      );
      const footValidation = validations.find(
        (v: ValidationResult) => v.username === username && v.assessment_type === 'foot'
      );
  
      const userDetails: UserDetails = {
        user,
        diabetesAssessment: diabetesResponse.data,
        footAssessment: footResponse.data, 
        diabetesValidation,
        footValidation
      };
  
      setSelectedUser(userDetails);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch user details', error);
      Alert.alert('Error', 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };
  

    const ValidationSection: React.FC<ValidationSectionProps> = ({ 
      assessmentType,
      riskScore,
      username,
      existingValidation,
      onValidationSubmit 
    }) => {
      const [isCorrect, setIsCorrect] = useState<boolean>(existingValidation?.is_correct ?? false);
      const [riskRating, setRiskRating] = useState<number>(existingValidation?.risk_rating ?? 1);
      const [feedback, setFeedback] = useState<string>(existingValidation?.feedback ?? '');
      const [isSubmitting, setIsSubmitting] = useState(false);
  
      const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
          const validationData = {
            username,
            assessment_type: assessmentType,
            [`validation_${assessmentType}_correct`]: isCorrect ? 'true' : 'false',
            [`validation_${assessmentType}_rating`]: riskRating.toString(),
            [`validation_${assessmentType}_feedback`]: feedback
          };
  
          await axios.post('http://192.168.38.114:5000/add_validation', validationData);
          
          // Refresh all data after successful validation
          await fetchInitialData();
          
          if (onValidationSubmit) {
            await onValidationSubmit();
          }
  
          Alert.alert('Success', 'Validation saved successfully');
        } catch (error) {
          console.error('Error saving validation:', error);
          Alert.alert('Error', 'Failed to save validation. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };


    return (
      <View style={styles.validationSection}>
        <Text style={styles.validationTitle}>Validation</Text>
        
        <View style={styles.validationRow}>
          <Text style={styles.validationLabel}>Assessment Accuracy:</Text>
          <View style={styles.validationButtons}>
            <TouchableOpacity 
              style={[
                styles.validationButton, 
                isCorrect && styles.validationButtonSelected,
                { backgroundColor: isCorrect ? '#4CAF50' : undefined }
              ]}
              onPress={() => setIsCorrect(true)}
            >
              <Text style={[styles.validationButtonText, isCorrect && styles.validationButtonTextSelected]}>✓</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.validationButton, 
                !isCorrect && styles.validationButtonSelected,
                { backgroundColor: !isCorrect ? '#F44336' : undefined }
              ]}
              onPress={() => setIsCorrect(false)}
            >
              <Text style={[styles.validationButtonText, !isCorrect && styles.validationButtonTextSelected]}>✗</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.validationRow}>
          <Text style={styles.validationLabel}>Risk Rating (1-5):</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  riskRating === rating && styles.ratingButtonSelected
                ]}
                onPress={() => setRiskRating(rating)}
              >
                <Text style={[
                  styles.ratingButtonText,
                  riskRating === rating && styles.ratingButtonTextSelected
                ]}>
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <Text style={styles.validationLabel}>Feedback:</Text>
          <TextInput
            style={styles.feedbackInput}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Enter validation feedback..."
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Save Validation</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const UserDetailsModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setModalVisible(false)}
    >
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>User Details</Text>
        </View>

        {selectedUser && (
          <>
            <View style={styles.navigationButtons}>
              <TouchableOpacity 
                style={[styles.navButton, currentView === VIEWS.DEMOGRAPHICS && styles.navButtonActive]}
                onPress={() => setCurrentView(VIEWS.DEMOGRAPHICS)}
              >
                <Text style={[styles.navButtonText, currentView === VIEWS.DEMOGRAPHICS && styles.navButtonTextActive]}>
                  Demographics
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, currentView === VIEWS.DIABETES && styles.navButtonActive]}
                onPress={() => setCurrentView(VIEWS.DIABETES)}
              >
                <Text style={[styles.navButtonText, currentView === VIEWS.DIABETES && styles.navButtonTextActive]}>
                  Diabetes Assessment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.navButton, currentView === VIEWS.FOOT && styles.navButtonActive]}
                onPress={() => setCurrentView(VIEWS.FOOT)}
              >
                <Text style={[styles.navButtonText, currentView === VIEWS.FOOT && styles.navButtonTextActive]}>
                  Foot Assessment
                </Text>
              </TouchableOpacity>
            </View>

            {currentView === VIEWS.DEMOGRAPHICS && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Demographics</Text>
                <View style={styles.detailsGrid}>
                  <DetailItem label="Username" value={selectedUser.user.username} />
                  <DetailItem label="Age" value={selectedUser.user.age.toString()} />
                  <DetailItem label="Gender" value={selectedUser.user.gender} />
                  <DetailItem label="Occupation" value={selectedUser.user.occupation} />
                  <DetailItem label="Height" value={`${selectedUser.user.height} cm`} />
                  <DetailItem label="Weight" value={`${selectedUser.user.weight} kg`} />
                  <DetailItem label="Activity Level" value={selectedUser.user.physical_activity} />
                </View>
              </View>
            )}

            {currentView === VIEWS.DIABETES && selectedUser.diabetesAssessment && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Diabetes Assessment</Text>
                <Text style={styles.riskScore}>
                  Predicted Risk Score: {(selectedUser.diabetesAssessment.diabetes_risk_score).toFixed(2)}%
                </Text>
                <Text style={styles.actualOutcome}>
                  Actual Observation: {(selectedUser.diabetesAssessment.observed_diabetes)}
                </Text>
                <View style={styles.detailsGrid}>
                  <DetailItem label="High Glucose" value={selectedUser.diabetesAssessment.high_glucose} />
                  <DetailItem label="Close Family History" value={selectedUser.diabetesAssessment.close_family} />
                  <DetailItem label="Far Family History" value={selectedUser.diabetesAssessment.far_family} />
                  <DetailItem label="Waist Circumference" value={`${selectedUser.diabetesAssessment.waist_circumference} cm`} />
                  <DetailItem label="Kidney Disease" value={selectedUser.diabetesAssessment.kidney} />
                  <DetailItem label="Thyroid Disease" value={selectedUser.diabetesAssessment.thyroid} />
                  <DetailItem label="Blood Pressure" value={selectedUser.diabetesAssessment.blood_pressure} />
                  <DetailItem label="Cholesterol" value={selectedUser.diabetesAssessment.cholestral} />
                  <DetailItem label="Heart Disease" value={selectedUser.diabetesAssessment.heart_disease} />
                  <DetailItem label="Smoking" value={selectedUser.diabetesAssessment.smoke} />
                  <DetailItem label="Alcohol" value={selectedUser.diabetesAssessment.alcohol} />
                  <DetailItem label="Diet" value={selectedUser.diabetesAssessment.diet} />
                </View>
                
                <Text style={styles.subSectionTitle}>Symptoms</Text>
                <View style={styles.detailsGrid}>
                  <DetailItem label="Fatigue" value={selectedUser.diabetesAssessment.symptom_fatigue} />
                  <DetailItem label="Blurred Vision" value={selectedUser.diabetesAssessment.symptom_blurred_vision} />
                  <DetailItem label="Fruity Breath" value={selectedUser.diabetesAssessment.symptom_fruiity_breath} />
                  <DetailItem label="Excessive Thirst" value={selectedUser.diabetesAssessment.symptom_excessive_thirst} />
                  <DetailItem label="Increased Urination" value={selectedUser.diabetesAssessment.symptom_increased_urination} />
                  <DetailItem label="Nausea" value={selectedUser.diabetesAssessment.symptom_nausea} />
                </View>

                <ValidationSection
                  assessmentType="diabetes"
                  riskScore={selectedUser.diabetesAssessment.diabetes_risk_score}
                  username={selectedUser.user.username}
                  existingValidation={selectedUser.diabetesValidation}
                  onValidationSubmit={async () => {
                    // Only fetch updated details, no need to post again
                    await fetchUserDetails(selectedUser.user.username);
                  }}
                />
              </View>
            )}

            {currentView === VIEWS.FOOT && selectedUser.footAssessment && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foot Assessment</Text>
                {
                  selectedUser.footAssessment? (
                  <>
                  <Text style={styles.riskScore}>
                  Predicted Risk Score: {(selectedUser.footAssessment.foot_risk_score * 100).toFixed(1)}%
                </Text>
                <Text style={styles.actualOutcome}>
                  Actual Observation: {(selectedUser.footAssessment.observed_foot)}
                </Text>

                <Text style={styles.subSectionTitle}>Medical History</Text>
                <View style={styles.detailsGrid}>
                <DetailItem label="Amputation History" value={selectedUser.footAssessment.history_amputation} />
                  <DetailItem label="Foot Ulcer History" value={selectedUser.footAssessment.history_foot_ulcer} />
                  <DetailItem label="Calf Pain History" value={selectedUser.footAssessment.history_calf_pain} />
                  <DetailItem label="Healing Wound History" value={selectedUser.footAssessment.history_healing_wound} />
                </View>

                <Text style={styles.subSectionTitle}>Current Symptoms</Text>
                <View style={styles.detailsGrid}>
                  <DetailItem label="Pain Level" value={selectedUser.footAssessment.pain.toString()} />
                  <DetailItem label="Numbness Level" value={selectedUser.footAssessment.numbness.toString()} />
                  <DetailItem label="Sensation Level" value={selectedUser.footAssessment.sensation.toString()} />
                  <DetailItem label="Redness Level" value={selectedUser.footAssessment.redness.toString()} />
                  <DetailItem label="Swelling Level" value={selectedUser.footAssessment.swelling.toString()} />
                  <DetailItem label="Recent Cut" value={selectedUser.footAssessment.recent_cut} />
                </View>

                <ValidationSection
                  assessmentType="foot"
                  riskScore={selectedUser.footAssessment.foot_risk_score}
                  username={selectedUser.user.username}
                  existingValidation={selectedUser.footValidation}
                  onValidationSubmit={async () => {
                    // Only fetch updated details, no need to post again
                    await fetchUserDetails(selectedUser.user.username);
                  }}
                />
                </>) : (
                  <Text style={styles.noDataText}>No foot assessment data available for this user</Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Modal>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => fetchUserDetails(item.username)}
    >
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userInfo}>Age: {item.age}</Text>
        <Text style={styles.userInfo}>Gender: {item.gender}</Text>
        <Text style={styles.userInfo}>Occupation: {item.occupation}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, currentTab === TABS.PENDING && styles.activeTab]}
          onPress={() => setCurrentTab(TABS.PENDING)}
        >
          <Text style={[styles.tabText, currentTab === TABS.PENDING && styles.activeTabText]}>
            Pending ({allUsers.length - validatedUsers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, currentTab === TABS.SUBMITTED && styles.activeTab]}
          onPress={() => setCurrentTab(TABS.SUBMITTED)}
        >
          <Text style={[styles.tabText, currentTab === TABS.SUBMITTED && styles.activeTabText]}>
            Submitted ({validatedUsers.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {currentTab === TABS.PENDING ? 'No pending validations' : 'No submitted validations'}
            </Text>
          </View>
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}

      <UserDetailsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  userDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  userInfo: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#2c3e50',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#2196F3',
  },
  navButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  navButtonTextActive: {
    color: 'white',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 10,
  },
  riskScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  actualOutcome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'column',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f4f8',
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  validationSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  validationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  validationLabel: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  validationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  validationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  validationButtonSelected: {
    borderColor: 'transparent',
  },
  validationButtonText: {
    fontSize: 20,
    color: '#666',
  },
  validationButtonTextSelected: {
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ratingButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: 'transparent',
  },
  ratingButtonText: {
    fontSize: 14,
    color: '#666',
  },
  ratingButtonTextSelected: {
    color: 'white',
  },
  feedbackContainer: {
    marginBottom: 15,
  },
  feedbackInput: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});