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
  ImageBackground
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#005A9C',
  background: '#F8F8F8',
  inputBackground: '#DDE8F5', // <-- THIS IS THE UPDATED COLOR
  lightText: '#FFFFFF',
  darkText: '#333333',
  inactiveText: '#A9A9A9',
};

const AnimatedEntry = ({ children, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], width: '100%', alignItems: 'center' }}>
      {children}
    </Animated.View>
  );
};

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');
  const [profession, setProfession] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [focusState, setFocusState] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    profession: false,
  });

  const animValues = {
    name: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    password: useRef(new Animated.Value(0)).current,
    phone: useRef(new Animated.Value(0)).current,
    profession: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Object.keys(focusState).forEach(key => {
      Animated.timing(animValues[key], {
        toValue: focusState[key] ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [focusState]);

  const handleRegister = async () => {
    if (isLoading) return;
    if (!name || !email || !password || !phone || !role) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (role === 'technicien' && profession.trim() === '') {
      Alert.alert('Erreur', 'Veuillez indiquer votre profession.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://192.168.1.8:5000/api/auth/register', {
        name,
        email,
        password,
        phone,
        role,
        ...(role === 'technicien' && { profession }),
      });
      Alert.alert('Succès', 'Votre compte a été créé.', [{ text: 'OK', onPress: () => router.push('/login') }]);
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

  const createAnimatedInputStyle = (name) => ({
    ...styles.inputContainer,
    borderColor: animValues[name].interpolate({ inputRange: [0, 1], outputRange: [COLORS.inputBackground, COLORS.primary] }),
    transform: [{ scale: animValues[name].interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] }) }]
  });

  return (
    <ImageBackground
      source={require('app/assets/background-shapes.png')}
      style={styles.backgroundContainer}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.innerContainer}>

          <AnimatedEntry index={0}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.headerText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.headerText, styles.activeHeaderText]}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </AnimatedEntry>

          <AnimatedEntry index={1}>
            <Animated.View style={createAnimatedInputStyle('name')}>
              <Feather name="user" size={24} color={COLORS.primary} style={styles.icon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nom</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  style={styles.input}
                  placeholder="Votre nom complet"
                  placeholderTextColor={COLORS.inactiveText}
                  onFocus={() => setFocusState(s => ({ ...s, name: true }))}
                  onBlur={() => setFocusState(s => ({ ...s, name: false }))}
                />
              </View>
            </Animated.View>
          </AnimatedEntry>

          <AnimatedEntry index={2}>
            <Animated.View style={createAnimatedInputStyle('email')}>
              <MaterialCommunityIcons name="email-outline" size={24} color={COLORS.primary} style={styles.icon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  style={styles.input}
                  placeholder="nom@exemple.com"
                  placeholderTextColor={COLORS.inactiveText}
                  onFocus={() => setFocusState(s => ({ ...s, email: true }))}
                  onBlur={() => setFocusState(s => ({ ...s, email: false }))}
                />
              </View>
            </Animated.View>
          </AnimatedEntry>

          <AnimatedEntry index={3}>
            <Animated.View style={createAnimatedInputStyle('password')}>
              <MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.primary} style={styles.icon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  placeholder="**********"
                  placeholderTextColor={COLORS.inactiveText}
                  onFocus={() => setFocusState(s => ({ ...s, password: true }))}
                  onBlur={() => setFocusState(s => ({ ...s, password: false }))}
                />
              </View>
            </Animated.View>
          </AnimatedEntry>

          <AnimatedEntry index={4}>
            <Animated.View style={createAnimatedInputStyle('phone')}>
              <Feather name="phone" size={24} color={COLORS.primary} style={styles.icon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Téléphone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.input}
                  placeholder="+33 6 12 34 56 78"
                  placeholderTextColor={COLORS.inactiveText}
                  onFocus={() => setFocusState(s => ({ ...s, phone: true }))}
                  onBlur={() => setFocusState(s => ({ ...s, phone: false }))}
                />
              </View>
            </Animated.View>
          </AnimatedEntry>

          <AnimatedEntry index={5}>
            <>
              <Text style={styles.roleLabel}>Je suis un :</Text>
              <View style={styles.roleSelectorContainer}>
                <TouchableOpacity style={[styles.roleButton, role === 'client' && styles.activeRoleButton]} onPress={() => setRole('client')}>
                  <Text style={[styles.roleButtonText, role === 'client' && styles.activeRoleButtonText]}>Client</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleButton, role === 'technicien' && styles.activeRoleButton]} onPress={() => setRole('technicien')}>
                  <Text style={[styles.roleButtonText, role === 'technicien' && styles.activeRoleButtonText]}>Technicien</Text>
                </TouchableOpacity>
              </View>
            </>
          </AnimatedEntry>

          {role === 'technicien' && (
            <AnimatedEntry index={6}>
              <Animated.View style={createAnimatedInputStyle('profession')}>
                <MaterialCommunityIcons name="briefcase-outline" size={24} color={COLORS.primary} style={styles.icon} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Profession</Text>
                  <TextInput
                    value={profession}
                    onChangeText={setProfession}
                    style={styles.input}
                    placeholder="Ex : Plomberie, Électricité"
                    placeholderTextColor={COLORS.inactiveText}
                    onFocus={() => setFocusState(s => ({ ...s, profession: true }))}
                    onBlur={() => setFocusState(s => ({ ...s, profession: false }))}
                  />
                </View>
              </Animated.View>
            </AnimatedEntry>
          )}

          <AnimatedEntry index={7}>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Vous avez déjà un compte ?{' '}
                <Pressable onPress={() => router.push('/login')}>
                  <Text style={styles.footerLink}>connectez-vous.</Text>
                </Pressable>
              </Text>
            </View>
          </AnimatedEntry>

          <AnimatedEntry index={8}>
            <Pressable onPress={handleRegister} onPressIn={onPressIn} onPressOut={onPressOut} disabled={isLoading}>
              <Animated.View style={[styles.registerButton, { transform: [{ scale: buttonScale }] }]}>
                {isLoading ? <ActivityIndicator size="small" color={COLORS.lightText} /> : <Text style={styles.registerButtonText}>S'inscrire</Text>}
              </Animated.View>
            </Pressable>
          </AnimatedEntry>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25, gap: 30 },
  headerText: { fontSize: 22, color: COLORS.inactiveText },
  activeHeaderText: { fontWeight: 'bold', color: COLORS.darkText, borderBottomColor: COLORS.primary, borderBottomWidth: 3 },
    inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 2,
  },
  icon: { marginRight: 15 },
  inputWrapper: { flex: 1 },
  inputLabel: { color: COLORS.darkText, fontSize: 16, marginBottom: 2 },
  input: { color: COLORS.darkText, fontSize: 16, padding: 0 },
  roleLabel: {
    color: COLORS.darkText,
    fontSize: 16,
    width: '90%',
    textAlign: 'left',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  activeRoleButton: { backgroundColor: COLORS.primary },
  roleButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  activeRoleButtonText: { color: COLORS.lightText },
  footerContainer: { width: '90%', alignItems: 'center', marginTop: 10 },
  footerText: { color: COLORS.darkText, fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: 'bold' },
  registerButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
  },
  registerButtonText: { color: COLORS.lightText, fontSize: 18, fontWeight: 'bold' },
});