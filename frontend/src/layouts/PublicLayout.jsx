import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleSwitcherBar from '../components/common/RoleSwitcherBar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB]">
      <RoleSwitcherBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
