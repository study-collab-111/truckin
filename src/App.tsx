/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppView, Booking, Account } from './types';
import { Language } from './lib/translations';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import RegisterCustomer from './components/RegisterCustomer';
import RegisterPartner from './components/RegisterPartner';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardPartner from './components/DashboardPartner';
import DashboardAdmin from './components/DashboardAdmin';
import { 
  listenToBookings, 
  initializeDummyDataIfEmpty, 
  addNewBooking, 
  updateBookingStatus, 
  updateBookingLocation, 
  deleteBooking 
} from './lib/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [userMode, setUserMode] = useState<'customer' | 'partner' | 'admin'>('customer');
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  
  // Track active language ('id' | 'en')
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('trukin_lang') as Language) || 'id';
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('trukin_lang', newLang);
  };

  // Coordinated shared bookings state - initialized with 2 requested dummy data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '#TK-8821',
      pickup: 'Jakarta Barat (DC)',
      destination: 'Surabaya Hub Center',
      cargoDetail: 'Peralatan Elektronik Konsumer',
      weight: 18,
      priority: 'EKSPRES',
      truckType: 'TRAILER',
      date: '25 Mei 2026',
      amount: 'Rp 6.800.000',
      status: 'DALAM PERJALANAN',
      currentLocation: 'Sedang transit di Jembatan Timbang Losarang, Indramayu'
    },
    {
      id: '#TK-9011',
      pickup: 'Jakarta Barat (DC)',
      destination: 'Bandung Logistics Center',
      cargoDetail: 'Bahan Baku Tekstil Premium',
      weight: 5,
      priority: 'STANDAR',
      truckType: 'TRUK BOKS',
      date: '26 Mei 2026',
      amount: 'Rp 1.850.000',
      status: 'MENUNGGU',
      currentLocation: 'Menunggu pemuatan kargo di gudang utama'
    }
  ]);

  // Synchronize with Firebase
  useEffect(() => {
    // 1. Seed dummy orders into Firestore if database is empty on launch
    initializeDummyDataIfEmpty();

    // 2. Unsubscribe handle for live snapshot events
    const unsubscribe = listenToBookings((liveBookings) => {
      if (liveBookings && liveBookings.length > 0) {
        setBookings(liveBookings);
      }
    });

    return () => unsubscribe();
  }, []);

  // Actions synced with Firebase
  const handleAddBooking = async (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    try {
      await addNewBooking(newBooking);
    } catch (e) {
      console.warn("Firestore save deferred:", e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteBooking(id);
    } catch (e) {
      console.warn("Firestore delete deferred:", e);
    }
  };

  const handleAcceptBooking = async (id: string) => {
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, status: 'DALAM PERJALANAN', currentLocation: 'Armada berangkat, sedang memuat di gudang.' } : b)
    );
    try {
      await updateBookingStatus(id, 'DALAM PERJALANAN');
    } catch (e) {
      console.warn("Firestore accept status deferred:", e);
    }
  };

  const handleDeliveredBooking = async (id: string) => {
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, status: 'SELESAI', currentLocation: 'Kargo telah berhasil ditarik & dibongkar di gudang tujuan.' } : b)
    );
    try {
      await updateBookingStatus(id, 'SELESAI');
    } catch (e) {
      console.warn("Firestore delivered status deferred:", e);
    }
  };

  const handleUpdateBookingStatus = async (id: string, nextStatus: Booking['status']) => {
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, status: nextStatus } : b)
    );
    try {
      await updateBookingStatus(id, nextStatus);
    } catch (e) {
      console.warn("Firestore override manual status deferred:", e);
    }
  };

  const handleUpdateBookingLocation = async (id: string, text: string) => {
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, currentLocation: text } : b)
    );
    try {
      await updateBookingLocation(id, text);
    } catch (e) {
      console.warn("Firestore location description deferred:", e);
    }
  };

  const navigateTo = (view: AppView) => {
    if (view === 'landing' || view === 'login' || view === 'admin-login') {
      setCurrentUser(null);
    }
    setCurrentView(view);
    // Scroll to top of window upon view changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Coordinated router
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} lang={lang} onSetLang={handleSetLang} />;
      
      case 'login':
        return <Login onNavigate={navigateTo} setUserMode={setUserMode} onLoginSuccess={setCurrentUser} lang={lang} onSetLang={handleSetLang} />;
      
      case 'admin-login':
        return <AdminLogin onNavigate={navigateTo} setUserMode={setUserMode} onLoginSuccess={setCurrentUser} lang={lang} onSetLang={handleSetLang} />;
      
      case 'register-customer':
        return <RegisterCustomer onNavigate={navigateTo} setUserMode={setUserMode} lang={lang} onSetLang={handleSetLang} />;
      
      case 'register-partner':
        return <RegisterPartner onNavigate={navigateTo} setUserMode={setUserMode} lang={lang} onSetLang={handleSetLang} />;
      
      case 'dashboard-customer':
        return (
          <DashboardCustomer 
            bookings={bookings}
            currentUser={currentUser}
            onAddBooking={handleAddBooking}
            onDeleteBooking={handleDeleteBooking}
            onNavigate={navigateTo}
            lang={lang}
            onSetLang={handleSetLang}
          />
        );
      
      case 'dashboard-partner':
        return (
          <DashboardPartner 
            bookings={bookings}
            currentUser={currentUser}
            onAcceptBooking={handleAcceptBooking}
            onDeliveredBooking={handleDeliveredBooking}
            onUpdateLocation={handleUpdateBookingLocation}
            onNavigate={navigateTo}
            lang={lang}
            onSetLang={handleSetLang}
          />
        );
      
      case 'dashboard-admin':
        return (
          <DashboardAdmin 
            bookings={bookings}
            currentUser={currentUser}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
            onNavigate={navigateTo}
            lang={lang}
            onSetLang={handleSetLang}
          />
        );
      
      default:
        return <LandingPage onNavigate={navigateTo} lang={lang} onSetLang={handleSetLang} />;
    }
  };

  return (
    <div className="selection:bg-[#C5FF00]/40 selection:text-black">
      {renderActiveView()}
    </div>
  );
}
