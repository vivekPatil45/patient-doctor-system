import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import {
  Text,
  TextInput,
  Button,
  Card,
  Snackbar,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { patientApi } from '@/api/patientApi';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('error');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await patientApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.success) {
        setSnackbarMessage('Account created successfully! Please login.');
        setSnackbarType('success');
        setSnackbarVisible(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setSnackbarMessage(response.message || 'Registration failed');
        setSnackbarType('error');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineLarge" style={styles.title}>
            Create Account 🩺
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join Clinix Sphere to book appointments and manage your health
          </Text>

          <Card style={styles.form}>
            <Card.Content>
              {/* Full Name */}
              <Controller
                control={control}
                rules={{
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Full Name"
                    placeholder="Enter your full name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    error={!!errors.name}
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                )}
                name="name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

              {/* Email */}
              <Controller
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Email Address"
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                  />
                )}
                name="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

              {/* Password */}
              <Controller
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                  />
                )}
                name="password"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

              {/* Confirm Password */}
              <Controller
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    mode="outlined"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                    error={!!errors.confirmPassword}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
              >
                Create Account
              </Button>

              {/* Login Link */}
              <View style={styles.loginLink}>
                <Text variant="bodyMedium" style={styles.loginLinkText}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text variant="bodyMedium" style={styles.loginLinkButton}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={snackbarType === 'success' ? 2000 : 4000}
          style={snackbarType === 'success' ? styles.successSnackbar : styles.errorSnackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  form: { marginTop: 16 },
  input: { marginBottom: 16 },
  errorText: {
    color: '#DC2626',
    marginTop: -12,
    marginBottom: 8,
  },
  registerButton: { marginTop: 16 },
  buttonContent: { paddingVertical: 8 },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: { marginRight: 4 },
  loginLinkButton: {
    color: '#2563EB',
    fontWeight: '600',
  },
  successSnackbar: { backgroundColor: '#16A34A' },
  errorSnackbar: { backgroundColor: '#DC2626' },
});
