export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

export const validateAddress = (address: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address must be at least 5 characters');
  }
  
  if (!address.city || address.city.trim().length < 2) {
    errors.push('City must be at least 2 characters');
  }
  
  if (!address.state || address.state.trim().length < 2) {
    errors.push('State must be at least 2 characters');
  }
  
  if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
    errors.push('Invalid zip code format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCard = (card: {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Card number validation (basic Luhn algorithm)
  const cleanCardNumber = card.number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanCardNumber)) {
    errors.push('Invalid card number');
  } else {
    // Luhn algorithm check
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) {
      errors.push('Invalid card number');
    }
  }
  
  // Expiry validation (MM/YY format)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
    errors.push('Expiry date must be in MM/YY format');
  } else {
    const [month, year] = card.expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    
    if (expiryDate <= currentDate) {
      errors.push('Card has expired');
    }
  }
  
  // CVV validation
  if (!/^\d{3,4}$/.test(card.cvv)) {
    errors.push('Invalid CVV');
  }
  
  // Name validation
  if (!validateName(card.name)) {
    errors.push('Invalid name on card');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
