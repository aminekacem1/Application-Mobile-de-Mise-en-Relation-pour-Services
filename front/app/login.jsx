// front/app/login.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  ActivityIndicator,
  ImageBackground,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005A9C',
  background: '#F8F8F8',
  inputBackground: '#DDE8F5',
  lightText: '#FFFFFF',
  darkText: '#333333',
  inactiveText: '#A9A9A9',
};

const AnimatedEntry = ({ children, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], width: '100%', alignItems: 'center' }}>
      {children}
    </Animated.View>
  );
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(emailAnim, { toValue: isEmailFocused ? 1 : 0, duration: 300, useNativeDriver: false }).start();
  }, [isEmailFocused]);

  useEffect(() => {
    Animated.timing(passwordAnim, { toValue: isPasswordFocused ? 1 : 0, duration: 300, useNativeDriver: false }).start();
  }, [isPasswordFocused]);

  const handleLogin = async () => {
    if (isLoading) return;
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setLoginError('');
    try {
      const res = await axios.post('http://192.168.1.8:5000/api/auth/login', { email, password });
      const { token, user } = res.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', user.role);

      Alert.alert('Succès', 'Connexion réussie!');

      if (user.role === 'client') {
        router.replace('/userPage');
      } else if (user.role === 'technicien') {
        router.replace('/(tabs)/technicianPage');
      }
    } catch (error) {
      setLoginError('Adresse e-mail ou mot de passe incorrect');
      console.log('Login error (frontend)', error.message); // Keep for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const onPressIn = () => Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  const emailContainerStyle = { 
    ...styles.inputContainer, 
    borderColor: emailAnim.interpolate({ inputRange: [0, 1], outputRange: [COLORS.inputBackground, COLORS.primary] }), 
    transform: [{ scale: emailAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }] 
  };

  const passwordContainerStyle = { 
    ...styles.inputContainer, 
    borderColor: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: [COLORS.inputBackground, COLORS.primary] }), 
    transform: [{ scale: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }] 
  };

  return (
    <ImageBackground
      source={require('app/assets/background-shapes.png')}
      style={styles.backgroundContainer}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.innerContainer}>
            
            <AnimatedEntry index={0}>
              <View style={styles.headerContainer}>
                <TouchableOpacity><Text style={[styles.headerText, styles.activeHeaderText]}>Se connecter</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/register')}><Text style={styles.headerText}>S'inscrire</Text></TouchableOpacity>
              </View>
            </AnimatedEntry>

            <AnimatedEntry index={1}>
              <Animated.View style={emailContainerStyle}>
                <Feather name="user" size={24} color={COLORS.primary} style={styles.icon} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="nom@exemple.com"
                    placeholderTextColor={COLORS.inactiveText}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>
              </Animated.View>
            </AnimatedEntry>
            
            <AnimatedEntry index={2}>
              <Animated.View style={passwordContainerStyle}>
                <MaterialIcons name="lock-outline" size={24} color={COLORS.primary} style={styles.icon} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Mot de passe</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholder="**********"
                    placeholderTextColor={COLORS.inactiveText}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </View>
              </Animated.View>
            </AnimatedEntry>

            {/* Display login error inline */}
            {loginError ? <Text style={styles.loginErrorText}>{loginError}</Text> : null}

            <AnimatedEntry index={3}>
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                  Vous n'avez pas de compte ? 
                  <Pressable onPress={() => router.push('/register')}><Text style={styles.footerLink}> inscrivez-vous.</Text></Pressable>
                </Text>
                <Text style={styles.footerText}>
                  Mot de passe oublié ? cliquez 
                  <Pressable onPress={() => router.push('/forgot-password')}><Text style={styles.footerLink}> ici.</Text></Pressable>
                </Text>
              </View>
            </AnimatedEntry>

            <AnimatedEntry index={4}>
              <Pressable onPress={handleLogin} onPressIn={onPressIn} onPressOut={onPressOut} disabled={isLoading}>
                <Animated.View style={[styles.loginButton, { transform: [{ scale: buttonScale }] }]}>
                  {isLoading ? <ActivityIndicator size="small" color={COLORS.lightText} /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
                </Animated.View>
              </Pressable>
            </AnimatedEntry>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 30 },
  headerText: { fontSize: 22, color: COLORS.inactiveText },
  activeHeaderText: { color: COLORS.darkText, fontWeight: 'bold', borderBottomColor: COLORS.primary, borderBottomWidth: 3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '95%', backgroundColor: COLORS.inputBackground, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20, borderWidth: 2 },
  icon: { marginRight: 15 },
  inputWrapper: { flex: 1 },
  inputLabel: { color: COLORS.darkText, fontSize: 16, marginBottom: 2 },
  input: { color: COLORS.darkText, fontSize: 16, padding: 0 },
  footerContainer: { width: '90%', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  footerText: { color: COLORS.darkText, fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: 'bold' },
  loginButton: { width: '100%', backgroundColor: COLORS.primary, padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: COLORS.lightText, fontSize: 18, fontWeight: 'bold' },
  loginErrorText: { color: '#ef4444', fontSize: 14, marginTop: -10, marginBottom: 10, textAlign: 'center' },
});
