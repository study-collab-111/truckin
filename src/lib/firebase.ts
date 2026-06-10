/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs, 
  getDocFromServer, 
  getDoc,
  writeBatch 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Booking, OperationType, Account, SystemAlert } from '../types';

// Initialize the Firebase app instance
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

/**
 * Custom error handler to log structural details when actions fail
 */
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Verify client network connection on load
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Client is offline or Firebase context has not been configured yet.");
    }
  }
}

// Trigger initial connection verification
testConnection();

// Dynamic seeding coordinates
const DUMMY_ALERTS: SystemAlert[] = [
  {
    id: 'alt-01',
    type: 'critical',
    title: 'KEMACETAN EKSTRIM TOL CIPALI KM 102',
    message: 'Estimasi perlambatan keterlambatan pengiriman rute Jakarta-Surabaya sekitar +45 Menit.',
    time: '15 MENIT LALU'
  },
  {
    id: 'alt-02',
    type: 'info',
    title: 'PENGISIAN BAHAN BAKAR TERPADU JKI',
    message: 'Diskon avtur solar subsidi mitra TrukIn di rest area Pertamina KM 45 divalidasi.',
    time: '1 JAM LALU'
  }
];

const DUMMY_BOOKINGS: Booking[] = [
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
    currentLocation: 'Sedang transit di Jembatan Timbang Losarang, Indramayu',
    customerId: 'dummy@trukin.com',
    partnerId: 'dummy_driver@trukin.com'
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
    currentLocation: 'Menunggu pemuatan kargo di gudang utama',
    customerId: 'dummy@trukin.com',
    partnerId: ''
  }
];

/**
 * Automatically seeds 2 dummy bookings on startup if firestore collections are empty
 */
const DUMMY_ACCOUNTS: Account[] = [
  {
    email: 'admin.control@trukin.co.id',
    name: 'Central Administrator',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'alex.rivera@globalstore.id',
    name: 'Alex Rivera (PT GlobalStore Indonesia)',
    password: 'demo1234',
    role: 'customer',
    phoneNumber: '08123456789',
    city: 'Jakarta Barat'
  },
  {
    email: 'samsul.arifin@trukinkarsa.com',
    name: 'Samsul Arifin',
    password: 'demo1234',
    role: 'partner',
    phoneNumber: '081398765432',
    plateNumber: 'B 9821 TKI',
    truckType: 'TRAILER'
  }
];

export async function initializeDummyDataIfEmpty() {
  // Seed bookings
  const ref = collection(db, 'bookings');
  try {
    const snapshot = await getDocs(ref);
    if (snapshot.empty) {
      console.log('Seeding initial dummy bookings into Firestore...');
      const batch = writeBatch(db);
      for (const booking of DUMMY_BOOKINGS) {
        const docRef = doc(db, 'bookings', booking.id);
        batch.set(docRef, {
          pickup: booking.pickup,
          destination: booking.destination,
          cargoDetail: booking.cargoDetail,
          weight: booking.weight,
          priority: booking.priority,
          truckType: booking.truckType,
          date: booking.date,
          amount: booking.amount,
          status: booking.status,
          currentLocation: booking.currentLocation || 'Menunggu jadwal operasional',
          customerId: booking.customerId || '',
          partnerId: booking.partnerId || ''
        });
      }
      await batch.commit();
      console.log('Dummy bookings seeded successfully!');
    }
  } catch (error) {
    console.warn('Failed to auto seed data (likely because rules or credentials are not provisioned yet):', error);
  }

  // Seed accounts
  const accRef = collection(db, 'accounts');
  try {
    const accSnapshot = await getDocs(accRef);
    if (accSnapshot.empty) {
      console.log('Seeding initial dummy user accounts into Firestore...');
      const batch = writeBatch(db);
      for (const acc of DUMMY_ACCOUNTS) {
        const docRef = doc(db, 'accounts', acc.email.toLowerCase().trim());
        batch.set(docRef, {
          email: acc.email.toLowerCase().trim(),
          name: acc.name,
          password: acc.password,
          role: acc.role,
          phoneNumber: acc.phoneNumber || '',
          city: acc.city || '',
          plateNumber: acc.plateNumber || '',
          truckType: acc.truckType || ''
        });
      }
      await batch.commit();
      console.log('Dummy user accounts seeded successfully!');
    }
  } catch (error) {
    console.warn('Failed to seed user accounts:', error);
  }

  // Seed alerts
  const alertRef = collection(db, 'alerts');
  try {
    const alertSnapshot = await getDocs(alertRef);
    if (alertSnapshot.empty) {
      console.log('Seeding initial dummy system alerts into Firestore...');
      const batch = writeBatch(db);
      for (const alert of DUMMY_ALERTS) {
        const docRef = doc(db, 'alerts', alert.id);
        batch.set(docRef, {
          id: alert.id,
          type: alert.type,
          title: alert.title,
          message: alert.message,
          time: alert.time
        });
      }
      await batch.commit();
      console.log('Dummy system alerts seeded successfully!');
    }
  } catch (error) {
    console.warn('Failed to seed system alerts:', error);
  }
}

/**
 * Register a new customer or partner account dynamically in Firestore
 */
export async function registerNewAccount(account: Account) {
  const docId = account.email.toLowerCase().trim();
  try {
    const docRef = doc(db, 'accounts', docId);
    await setDoc(docRef, {
      email: docId,
      name: account.name,
      password: account.password,
      role: account.role,
      phoneNumber: account.phoneNumber || '',
      city: account.city || '',
      plateNumber: account.plateNumber || '',
      truckType: account.truckType || ''
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accounts/${docId}`);
  }
}

/**
 * Validates login credentials against Firestore accounts
 */
export async function authenticateAccount(email: string, passwordEntered: string, expectedRole: 'customer' | 'partner' | 'admin'): Promise<Account | null> {
  const docId = email.toLowerCase().trim();
  try {
    const docRef = doc(db, 'accounts', docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data();
    if (data.role !== expectedRole) {
      return null;
    }
    if (data.password !== passwordEntered) {
      return null;
    }
    return {
      email: data.email,
      name: data.name,
      role: data.role as 'customer' | 'partner' | 'admin',
      phoneNumber: data.phoneNumber,
      city: data.city,
      plateNumber: data.plateNumber,
      truckType: data.truckType
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `accounts/${docId}`);
    return null;
  }
}

/**
 * Real-time listener for logistics bookings
 */
export function listenToBookings(onChange: (bookings: Booking[]) => void) {
  const ref = collection(db, 'bookings');
  return onSnapshot(
    ref,
    (snapshot) => {
      const items: Booking[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          pickup: data.pickup || '',
          destination: data.destination || '',
          cargoDetail: data.cargoDetail || '',
          weight: Number(data.weight) || 0,
          priority: data.priority as Booking['priority'] || 'STANDAR',
          truckType: data.truckType as Booking['truckType'] || 'TRUK BOKS',
          date: data.date || '',
          amount: data.amount || '',
          status: data.status as Booking['status'] || 'MENUNGGU',
          currentLocation: data.currentLocation || 'Dalam proses penjadwalan',
          customerId: data.customerId || '',
          partnerId: data.partnerId || ''
        });
      });
      // Sort so newest are on top (or maintain standard layout)
      onChange(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'bookings');
    }
  );
}

/**
 * Publishes a new logistics order to Firestore
 */
export async function addNewBooking(booking: Booking) {
  const docId = booking.id;
  try {
    const docRef = doc(db, 'bookings', docId);
    await setDoc(docRef, {
      pickup: booking.pickup,
      destination: booking.destination,
      cargoDetail: booking.cargoDetail,
      weight: booking.weight,
      priority: booking.priority,
      truckType: booking.truckType,
      date: booking.date,
      amount: booking.amount,
      status: booking.status,
      currentLocation: booking.currentLocation || 'Menunggu penugasan supir armada',
      customerId: booking.customerId || '',
      partnerId: booking.partnerId || ''
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `bookings/${docId}`);
  }
}

/**
 * Updates status of a booking
 */
export async function updateBookingStatus(id: string, nextStatus: Booking['status'], partnerId?: string) {
  try {
    const docRef = doc(db, 'bookings', id);
    // If setting status to finished or waiting, update location text accordingly for convenience
    const updates: Partial<Booking> = { status: nextStatus };
    if (nextStatus === 'SELESAI') {
      updates.currentLocation = 'Kargo telah berhasil dibongkar di tujuan';
    }
    if (partnerId !== undefined) {
      updates.partnerId = partnerId;
    }
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
  }
}

/**
 * Updates custom currentLocation text for a booking
 */
export async function updateBookingLocation(id: string, trackingText: string) {
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, { currentLocation: trackingText });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
  }
}

/**
 * Deletes / cancels a logic booking from Firestore
 */
export async function deleteBooking(id: string) {
  try {
    const docRef = doc(db, 'bookings', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
  }
}

/**
 * Real-time listener for system alerts/announcements
 */
export function listenToAlerts(onChange: (alerts: SystemAlert[]) => void) {
  const ref = collection(db, 'alerts');
  return onSnapshot(
    ref,
    (snapshot) => {
      const items: SystemAlert[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          type: data.type as 'critical' | 'info' || 'critical',
          title: data.title || '',
          message: data.message || '',
          time: data.time || ''
        });
      });
      // Sort newest (by ID text or customized timestamp/lexicographical order if needed)
      onChange(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'alerts');
    }
  );
}

/**
 * Publishes a new system alert to Firestore
 */
export async function addNewAlert(alert: SystemAlert) {
  const docId = alert.id;
  try {
    const docRef = doc(db, 'alerts', docId);
    await setDoc(docRef, {
      id: alert.id,
      type: alert.type,
      title: alert.title,
      message: alert.message,
      time: alert.time
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `alerts/${docId}`);
  }
}

/**
 * Deletes / resolves a system alert from Firestore
 */
export async function deleteAlert(id: string) {
  try {
    const docRef = doc(db, 'alerts', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `alerts/${id}`);
  }
}

/**
 * Real-time listener for all user accounts
 */
export function listenToAccounts(onChange: (accounts: Account[]) => void) {
  const ref = collection(db, 'accounts');
  return onSnapshot(
    ref,
    (snapshot) => {
      const items: Account[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          email: data.email || docSnap.id,
          name: data.name || '',
          role: data.role as 'customer' | 'partner' | 'admin',
          phoneNumber: data.phoneNumber || '',
          city: data.city || '',
          plateNumber: data.plateNumber || '',
          truckType: data.truckType || ''
        });
      });
      onChange(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'accounts');
    }
  );
}


