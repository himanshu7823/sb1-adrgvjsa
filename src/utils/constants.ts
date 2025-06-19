// Commission rates for 10 levels
export const COMMISSION_RATES = [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];

// Book activation price
export const BOOK_PRICE = 100;

// Admin credentials
export const ADMIN_PHONE = 'admin';
export const ADMIN_PASSWORD = 'admin123';

// Default referral code for first registration
export const DEFAULT_REFERRAL_CODE = 'ADMIN001';

// Supported mobile operators
export const MOBILE_OPERATORS = [
  { value: 'jio', label: 'Jio' },
  { value: 'airtel', label: 'Airtel' },
  { value: 'vi', label: 'Vi (Vodafone Idea)' },
  { value: 'bsnl', label: 'BSNL' }
];

// Status types
export const STATUS_TYPES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser'
} as const;