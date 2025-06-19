/**
 * Generate referral code from sequential ID
 */
export const generateReferralCode = (sequentialId: number): string => {
  return sequentialId.toString().padStart(5, '0');
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('hi-IN')}`;
};

/**
 * Format date in Hindi locale
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('hi-IN');
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  return /^[0-9]{10}$/.test(phone);
};

/**
 * Validate UTR number (12 digits)
 */
export const validateUTRNumber = (utr: string): boolean => {
  return /^[0-9]{12}$/.test(utr);
};

/**
 * Calculate commission amount for a level
 */
export const calculateCommission = (level: number, baseAmount: number = 100): number => {
  const rates = [0.25, 0.15, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01];
  if (level < 1 || level > 10) return 0;
  return Math.floor(baseAmount * rates[level - 1]);
};

/**
 * Get status color class
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get status text in Hindi
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'पेंडिंग';
    case 'approved':
      return 'स्वीकृत';
    case 'rejected':
      return 'अस्वीकृत';
    case 'completed':
      return 'पूर्ण';
    case 'cancelled':
      return 'रद्द';
    default:
      return status;
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Share text using Web Share API or fallback to clipboard
 */
export const shareText = async (title: string, text: string): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return true;
    } else {
      return await copyToClipboard(text);
    }
  } catch (error) {
    console.error('Failed to share text:', error);
    return false;
  }
};