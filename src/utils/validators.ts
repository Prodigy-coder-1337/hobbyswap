export function validateName(value: string) {
  if (!value.trim()) {
    return 'Please enter your name.';
  }

  if (value.trim().length < 2) {
    return 'Name should be at least 2 characters.';
  }

  return '';
}

export function validateEmailOrPhone(value: string) {
  const trimmed = value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^(\+63|0)?9\d{9}$/;

  if (!trimmed) {
    return 'Use your email or Philippine mobile number.';
  }

  if (!emailPattern.test(trimmed) && !phonePattern.test(trimmed.replace(/\s/g, ''))) {
    return 'Enter a valid email or mobile number.';
  }

  return '';
}

export function validatePassword(value: string) {
  if (value.length < 8) {
    return 'Password should be at least 8 characters.';
  }

  if (!/[A-Z]/.test(value) || !/\d/.test(value)) {
    return 'Use at least one uppercase letter and one number.';
  }

  return '';
}

export function validateRequired(value: string, label: string) {
  return value.trim() ? '' : `${label} is required.`;
}

export function validateSelection<T>(value: T[], label: string) {
  return value.length > 0 ? '' : `Choose at least one ${label.toLowerCase()}.`;
}
