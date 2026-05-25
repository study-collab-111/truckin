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
import { Booking, OperationType, Account } from '../types';

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
          currentLocation: booking.currentLocation || 'Menunggu jadwal operasional'
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
          currentLocation: data.currentLocation || 'Dalam proses penjadwalan'
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
      currentLocation: booking.currentLocation || 'Menunggu penugasan supir armada'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `bookings/${docId}`);
  }
}

/**
 * Updates status of a booking
 */
export async function updateBookingStatus(id: string, nextStatus: Booking['status']) {
  try {
    const docRef = doc(db, 'bookings', id);
    // If setting status to finished or waiting, update location text accordingly for convenience
    const updates: Partial<Booking> = { status: nextStatus };
    if (nextStatus === 'SELESAI') {
      updates.currentLocation = 'Kargo telah berhasil dibongkar di tujuan';
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
