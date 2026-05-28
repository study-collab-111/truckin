/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppView =
  | 'landing'
  | 'login'
  | 'register-customer'
  | 'register-partner'
  | 'admin-login'
  | 'dashboard-customer'
  | 'dashboard-admin'
  | 'dashboard-partner';

export interface Booking {
  id: string;
  pickup: string;
  destination: string;
  cargoDetail: string;
  weight: number;
  priority: 'STANDAR' | 'EKSPRES';
  truckType: 'TRAILER' | 'BAK TERBUKA' | 'TRUK BOKS' | 'TRUK PENDINGIN';
  date: string;
  amount: string;
  status: 'SELESAI' | 'DALAM PERJALANAN' | 'MENUNGGU';
  currentLocation?: string;
  customerId?: string;
  partnerId?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface ActiveShipment {
  id: string;
  destination: string;
  eta: string;
  vehicle: string;
  status: 'DALAM PERJALANAN' | 'TERMUAT';
}

export interface SystemAlert {
  id: string;
  type: 'critical' | 'info';
  title: string;
  message: string;
  time: string;
}

export interface Account {
  email: string;
  password?: string;
  name: string;
  role: 'customer' | 'partner' | 'admin';
  phoneNumber?: string;
  city?: string;
  plateNumber?: string;
  truckType?: string;
}

