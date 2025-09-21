import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
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
import { useAuthStore } from '@/store/authStore';

interface FormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setToken, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      router.replace('/(tabs)/doctors');
    }
  }, [user]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await patientApi.login(data);

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        router.replace('/(tabs)/doctors');
      } else {
        setSnackbarMessage(response.message || 'Login failed');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage('Something went wrong. Please try again.');
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
        <View style={styles.content}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome Back 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue managing your health
          </Text>

          <Card style={styles.form}>
            <Card.Content>
              {/* Email Input */}
              <Controller
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
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
              {errors.email && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.email.message}
                </Text>
              )}

              {/* Password Input */}
              <Controller
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
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
              {errors.password && (
                <Text variant="bodySmall" style={styles.errorText}>
                  {errors.password.message}
                </Text>
              )}

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Sign In
              </Button>

              {/* Register Link */}
              <View style={styles.registerLink}>
                <Text variant="bodyMedium" style={styles.registerLinkText}>
                  Don’t have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text variant="bodyMedium" style={styles.registerLinkButton}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Snackbar for errors */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  loginButton: { marginTop: 16 },
  buttonContent: { paddingVertical: 8 },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerLinkText: { marginRight: 4 },
  registerLinkButton: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
