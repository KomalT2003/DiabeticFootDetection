import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function InitialScreen() {
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