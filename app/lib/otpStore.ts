// Shared in-memory OTP store
// In production replace with Redis
const otpStore = new Map<string, { code: string; expiresAt: number }>();
export default otpStore;
