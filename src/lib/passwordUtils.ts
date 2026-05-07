// Password helpers — strength meter, generator, error message mapper

const COMMON_WEAK_PASSWORDS = new Set([
  '123456', '12345678', '123456789', '1234567890', 'password', 'password1',
  'password123', 'qwerty', 'qwerty123', 'abc123', '111111', '000000',
  '12345', '1234', 'iloveyou', 'admin', 'admin123', 'welcome', 'monkey',
  'letmein', 'dragon', 'sunshine', 'princess', '654321', '666666',
]);

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordCheck {
  strength: PasswordStrength;
  score: number; // 0-100
  label: string; // Bengali label
  isCommon: boolean;
}

export function checkPasswordStrength(password: string): PasswordCheck {
  if (!password) {
    return { strength: 'weak', score: 0, label: '', isCommon: false };
  }

  const isCommon = COMMON_WEAK_PASSWORDS.has(password.toLowerCase());

  let score = 0;
  if (password.length >= 6) score += 15;
  if (password.length >= 8) score += 15;
  if (password.length >= 10) score += 15;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  if (isCommon) score = Math.min(score, 20);

  let strength: PasswordStrength = 'weak';
  let label = 'দুর্বল';
  if (score >= 70) {
    strength = 'strong';
    label = 'শক্তিশালী';
  } else if (score >= 45) {
    strength = 'medium';
    label = 'মাঝারি';
  }

  return { strength, score: Math.min(score, 100), label, isCommon };
}

export function generateStrongPassword(length = 12): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*?';
  const all = upper + lower + digits + symbols;

  // Guarantee at least one of each category
  const out = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  for (let i = out.length; i < length; i++) {
    out.push(all[Math.floor(Math.random() * all.length)]);
  }
  // Shuffle
  return out.sort(() => Math.random() - 0.5).join('');
}

export function mapAuthErrorToBangla(rawMessage: string | undefined | null): string {
  const msg = (rawMessage || '').toLowerCase();

  if (!msg) return 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে';

  if (msg.includes('pwned') || msg.includes('weak_password') || msg.includes('known to be weak') || msg.includes('compromised')) {
    return 'এই পাসওয়ার্ডটি অনলাইনে অনেকবার leak হয়েছে। আরও শক্তিশালী একটি দিন (যেমন: Rony@2026!)। নিচের 🎲 বাটনে ক্লিক করে auto-generate করতে পারেন।';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered') || msg.includes('email already')) {
    return 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা হয়েছে। লগইন করুন।';
  }
  if (msg.includes('password') && msg.includes('6 characters')) {
    return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
  }
  if (msg.includes('password') && (msg.includes('short') || msg.includes('length'))) {
    return 'পাসওয়ার্ড অনেক ছোট। কমপক্ষে ৮ অক্ষর দিন।';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email') || msg.includes('email_address_invalid')) {
    return 'ইমেইল ঠিকানাটি সঠিক নয়। আবার চেক করুন।';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'অনেক বার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
  }
  if (msg.includes('signup') && msg.includes('disabled')) {
    return 'এই মুহূর্তে নতুন রেজিস্ট্রেশন বন্ধ আছে।';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'ইন্টারনেট সংযোগ চেক করুন।';
  }

  return `রেজিস্ট্রেশন ব্যর্থ: ${rawMessage}`;
}
