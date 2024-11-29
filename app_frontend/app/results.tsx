// default react snippet
import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function ResultsScreen() {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, go to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // If authenticated, redirect based on role
  return user?.role === 'admin' 
    ? <Redirect href="/admin/dashboard" /> 
    : <Redirect href="/home" />;
}

