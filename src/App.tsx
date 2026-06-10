/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppView, Booking, Account, SystemAlert } from './types';
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
  deleteBooking,
  listenToAlerts,
  addNewAlert,
  deleteAlert,
  listenToAccounts
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

  // Coordinated shared bookings state - initialized as empty to represent real-time synchronization
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Coordinated real-time alerts state for driver announcements
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  // Synced partner accounts list
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Synchronize with Firebase
  useEffect(() => {
    // 1. Seed dummy orders into Firestore if database is empty on launch
    initializeDummyDataIfEmpty();

    // 2. Unsubscribe handle for live snapshot events of bookings
    const unsubscribeBookings = listenToBookings((liveBookings) => {
      if (liveBookings) {
        setBookings(liveBookings);
      }
    });

    // 3. Unsubscribe handle for live snapshot events of system alerts
    const unsubscribeAlerts = listenToAlerts((liveAlerts) => {
      if (liveAlerts) {
        setAlerts(liveAlerts);
      }
    });

    // 4. Unsubscribe handle for live snapshot events of system user accounts
    const unsubscribeAccounts = listenToAccounts((liveAccounts) => {
      if (liveAccounts) {
        setAccounts(liveAccounts);
      }
    });

    return () => {
      unsubscribeBookings();
      unsubscribeAlerts();
      unsubscribeAccounts();
    };
  }, []);

  // Actions synced with Firebase
  const handlePostAlert = async (newAlert: SystemAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    try {
      await addNewAlert(newAlert);
    } catch (e) {
      console.warn("Firestore alert post deferred:", e);
    }
  };

  const handleResolveAlert = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAlert(id);
    } catch (e) {
      console.warn("Firestore alert resolve deferred:", e);
    }
  };

  const handleAddBooking = async (newBooking: Booking) => {
    const bookingWithUser = {
      ...newBooking,
      customerId: currentUser?.email || ''
    };
    setBookings((prev) => [bookingWithUser, ...prev]);
    try {
      await addNewBooking(bookingWithUser);
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
    const partnerEmail = currentUser?.email || '';
    setBookings((prev) => 
      prev.map((b) => b.id === id ? { ...b, status: 'DALAM PERJALANAN', partnerId: partnerEmail, currentLocation: 'Armada berangkat, sedang memuat di gudang.' } : b)
    );
    try {
      await updateBookingStatus(id, 'DALAM PERJALANAN', partnerEmail);
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
            accounts={accounts}
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
            alerts={alerts}
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
            alerts={alerts}
            onPostAlert={handlePostAlert}
            onResolveAlert={handleResolveAlert}
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
