import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleSwitcherBar from '../components/common/RoleSwitcherBar';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LaboratoryLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner message="Checking authentication..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'laboratory' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB]">
      <RoleSwitcherBar />
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto items-start">
        <Sidebar role="laboratory" />
        <main className="flex-1 p-6 sm:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
