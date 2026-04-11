export type Role = 'patient' | 'doctor' | 'student' | 'admin';
export type ConsultationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';
export type TransactionType =
  | 'payment'
  | 'escrow_hold'
  | 'escrow_release'
  | 'refund'
  | 'withdrawal'
  | 'commission';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type TransactionMode = 'mock' | 'live';
export type EscrowState = 'held' | 'released' | 'refunded';
export type DoctorTier = 'GeneralPractitioner' | 'Specialist' | 'SuperSpecialist';

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  experience: number;
  bio?: string;
  contactInfo?: string;
  profilePictureUrl?: string;
  certifications?: any[];
  consultationFee: number;
  tier: DoctorTier;
  availabilitySchedule?: any;
  averageRating: number;
  totalRatings: number;
  user?: User;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  status: ConsultationStatus;
  scheduledAt?: string;
  notes?: string;
  patientConfirmed: boolean;
  doctorConfirmed: boolean;
  createdAt: string;
  patient?: User;
  doctor?: User;
  doctorProfile?: DoctorProfile;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: User;
}

export interface Rating {
  id: string;
  patientId: string;
  doctorId: string;
  consultationId?: string;
  score: number;
  comment?: string;
  isHidden: boolean;
  createdAt: string;
  patient?: User;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  consultationId?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionMode: TransactionMode;
  mockOutcome?: string;
  isRealMoney: boolean;
  escrowState?: EscrowState;
  description?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
