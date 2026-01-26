import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateProfile, logout } from '../../store/authSlice';
import { COLORS, SPACING } from '../../constants';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!phone.trim() || !validatePhone(phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const updatedData: any = {
          name,
          surname,
          email,
          phone,
          address: {
            street,
            city,
            state,
            zipCode,
          },
        };

        if (cardNumber && cardholderName && expiryDate && cvv) {
          if (!validateCard(cardNumber)) {
            Alert.alert('Error', 'Invalid card number');
            setLoading(false);
            return;
          }
          updatedData.cardDetails = {
            cardNumber: cardNumber.slice(-4).padStart(cardNumber.length, '*'),
            expiryDate,
            cvv: '***',
            cardholderName,
          };
        }

        dispatch(updateProfile(updatedData));
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(logout());
        },
        style: 'destructive',
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view your profile</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={surname}
              onChangeText={setSurname}
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={street}
              onChangeText={setStreet}
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={city}
              onChangeText={setCity}
              editable={isEditing && !loading}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.infoItem, styles.halfItem]}>
              <Text style={styles.label}>State</Text>
              <TextInput
                style={[styles.input, styles.smallInput, !isEditing && styles.inputDisabled]}
                value={state}
                onChangeText={setState}
                editable={isEditing && !loading}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={[styles.infoItem, styles.halfItem]}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={[styles.input, styles.smallInput, !isEditing && styles.inputDisabled]}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
                editable={isEditing && !loading}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details (Optional)</Text>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Leave blank to keep current card"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                editable={!loading}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.infoItem, styles.halfItem]}>
                <Text style={styles.label}>Expiry (MM/YY)</Text>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="number-pad"
                  editable={!loading}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
              <View style={[styles.infoItem, styles.halfItem]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  secureTextEntry
                  editable={!loading}
                  placeholderTextColor={COLORS.textLight}
                />
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={[styles.input]}
                value={cardholderName}
                onChangeText={setCardholderName}
                editable={!loading}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>
        )}

        {isEditing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsEditing(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  editButtonText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: '#F8F8F8',
    padding: SPACING.md,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoItem: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    fontSize: 14,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: COLORS.textLight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfItem: {
    flex: 0.48,
  },
  smallInput: {
    marginBottom: 0,
  },
  buttonContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  logoutButton: {
    backgroundColor: '#DC3545',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default ProfileScreen;
