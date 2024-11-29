import React from 'react';
import { Slot, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  // Redirect to login if not an admin
  if (!user || user.role !== 'admin') {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}