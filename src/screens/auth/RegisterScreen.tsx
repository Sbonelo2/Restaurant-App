import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess, registerFailure, UserProfile } from '../../store/authSlice';
import { COLORS } from '../../constants';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateCard = (cardNumber: string) => {
    return cardNumber.replace(/\s/g, '').length >= 13 && cardNumber.replace(/\s/g, '').length <= 19;
  };

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }
    if (!surname.trim()) {
      Alert.alert('Error', 'Please enter your surname');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your contact number');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }
    if (!cardNumber.trim()) {
      Alert.alert('Error', 'Please enter your card number');
      return;
    }
    if (!validateCard(cardNumber)) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }
    if (!expiryDate.trim()) {
      Alert.alert('Error', 'Please enter card expiry date (MM/YY)');
      return;
    }
    if (!cvv.trim()) {
      Alert.alert('Error', 'Please enter card CVV');
      return;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    setLoading(true);
    dispatch(registerStart());

    // Simulate registration - replace with actual API call
    setTimeout(() => {
      try {
        const user: UserProfile = {
          id: Date.now().toString(),
          email,
          name,
          surname,
          phone,
          address: {
            street,
            city,
            state,
            zipCode,
          },
          cardDetails: {
            cardNumber: cardNumber.slice(-4).padStart(cardNumber.length, '*'),
            expiryDate,
            cvv: '***',
            cardholderName,
          },
          role: 'user',
        };
        dispatch(registerSuccess(user));
        Alert.alert('Success', 'Registration successful!');
      } catch (error) {
        dispatch(registerFailure('Registration failed'));
        Alert.alert('Error', 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join KomEat today</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name *"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname *"
            value={surname}
            onChangeText={setSurname}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Street Address *"
            value={street}
            onChangeText={setStreet}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="City *"
            value={city}
            onChangeText={setCity}
            editable={!loading}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State *"
              value={state}
              onChangeText={setState}
              editable={!loading}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="ZIP Code *"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="number-pad"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Card Number *"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            editable={!loading}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY *"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="number-pad"
              editable={!loading}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVV *"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              secureTextEntry
              editable={!loading}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Cardholder Name *"
            value={cardholderName}
            onChangeText={setCardholderName}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
