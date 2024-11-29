import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface UserAssessment {
  id: string;
  name: string;
  demographicScore?: number;
  diabetesRiskScore?: number;
  footCareScore?: number;
  completedAssessments: number;
}

export default function AdminDashboardScreen() {
  const [users, setUsers] = useState<UserAssessment[]>([]);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    fetchUserAssessments();
  }, []);

  const fetchUserAssessments = async () => {
    try {
      // Mock data - replace with actual backend call
      const mockUsers: UserAssessment[] = [
        {
          id: '1',
          name: 'Sanika',
          demographicScore: 75,
          diabetesRiskScore: 45,
          footCareScore: 60,
          completedAssessments: 3
        },
        {
          id: '2',
          name: 'Komal',
          demographicScore: 80,
          diabetesRiskScore: 30,
          footCareScore: 55,
          completedAssessments: 3
        }
      ];

      // Uncomment for actual backend call
      // const response = await axios.get('http://your-backend-url/admin/user-assessments');
      // setUsers(response.data);

      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch user assessments', error);
    }
  };

  const renderUserItem = ({ item }: { item: UserAssessment }) => (
    <TouchableOpacity style={styles.userCard}>
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.assessmentCount}>
          Completed: {item.completedAssessments}/3
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          {/* <Text style={styles.scoreLabel}>Demographic</Text>
          <Text style={styles.scoreValue}>
            {item.demographicScore || 'N/A'}
          </Text> */}
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Diabetes Risk</Text>
          <Text style={styles.scoreValue}>
            {item.diabetesRiskScore || 'N/A'}
          </Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>Foot Care</Text>
          <Text style={styles.scoreValue}>
            {item.footCareScore || 'N/A'}
          </Text>
        </View>
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
      
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No user assessments found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
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
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  assessmentCount: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
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
  }
});
