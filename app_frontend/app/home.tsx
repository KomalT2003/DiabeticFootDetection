// app/index.tsx (Home Screen)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

//get username
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();  

  const AssessmentButton = ({ 
    title, 
    description, 
    onPress, 
    gradientColors 
  }: { 
    title: string, 
    description: string, 
    onPress: () => void, 
    gradientColors: string[] 
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Welcome, {user?.username} </Text>
      <Text style={styles.subtitle}>Diabetes Management Validation App</Text>
      <Text style={styles.subtitle}>Lets get you started !</Text>
      
      <View style={styles.assessmentContainer}>
        <AssessmentButton
          title="Demographic Assessment"
          description="Basic personal information"
          onPress={() => router.push('/demographic')}
          gradientColors={['#20B2AA', '#00f2fe']}
        />
        
        <AssessmentButton
          title="Diabetes Risk"
          description="Assess your diabetes potential"
          onPress={() => router.push('/diabetes')}
          gradientColors={['#20B2AA', '#38f9d7']}
        />
        
        <AssessmentButton
          title="Diabetic Foot Care"
          description="Comprehensive foot health check"
          onPress={() => router.push('/footcare')}
          gradientColors={['#20B2AA', '#20B2AA']}
        />

        {/* Create a new TouchableOpacity to show results of the user  */}
        <TouchableOpacity onPress={() => router.push('/results')} style={styles.cardContainer2}>
            <Text style={styles.cardTitle2}>View Results</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
        

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
      backgroundColor: '#F0F8FF', // Very light blue
      borderWidth: 1,
      borderColor: '#20B2AA', // Light blue
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
  },
  logoutButtonText: {
    color: '#20B2AA', // Light sea green
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  assessmentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  card: {
    padding: 20,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  cardTitle2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#20B2AA', // Light sea green
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: 'white',
  },
  cardContainer2: {
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
      backgroundColor: '#F0F8FF', // Very light blue
      borderWidth: 1,
      borderColor: '#20B2AA', // Light sea green
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    }
});

