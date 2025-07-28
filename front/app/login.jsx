import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Pressable
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Couleurs
const COLORS = {
  primary: '#4A0D66',
  secondary: '#E87A5D',
  lightText: '#FFFFFF',
  darkText: '#000000',
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Logique de connexion (inchangée) ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    try {
      const res = await axios.post('http://192.168.1.2:5000/api/auth/login', { email, password });
      const { token, user } = res.data;
      await AsyncStorage.setItem('token', token);
      if (user.role === 'client') {
        router.push('/userPage');
      } else if (user.role === 'technicien') {
        router.push('/technicianPage');
      }
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require('@/assets/background-shapes.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* === FLÈCHE DE RETOUR AJOUTÉE === */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={COLORS.lightText} />
        </TouchableOpacity>
        {/* ============================== */}

        <View style={styles.innerContainer}>

          <View style={styles.headerContainer}>
            <TouchableOpacity>
              <Text style={[styles.headerText, styles.activeHeaderText]}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.headerText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>

          {/* ... Le reste du formulaire reste inchangé ... */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={24} color={COLORS.lightText} style={styles.icon} />
            <View>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholder="nom@exemple.com"
                placeholderTextColor="#EEDFF2"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.lightText} style={styles.icon} />
            <View>
              <Text style={styles.inputLabel}>Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholder="**********"
                placeholderTextColor="#EEDFF2"
              />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Vous n'avez pas de compte ?{' '}
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.footerLink}>inscrivez-vous.</Text>
              </Pressable>
            </Text>
            <Text style={styles.footerText}>
              Mot de passe oublié ? cliquez{' '}
              <Pressable onPress={() => router.push('/forgot-password')}>
                <Text style={styles.footerLink}>ici.</Text>
              </Pressable>
            </Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

// --- Styles mis à jour ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  imageBackground: { flex: 1, width: '100%' },
  // NOUVEAU STYLE POUR LE BOUTON DE RETOUR
  backButton: {
    position: 'absolute',
    top: 60, // Ajustez cette valeur si nécessaire (pour la barre de statut)
    left: 20,
    zIndex: 10, // Assure que la flèche est au-dessus des autres éléments
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  // ... Le reste des styles est inchangé
  headerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 30 },
  headerText: { fontSize: 22, color: COLORS.lightText, opacity: 0.7 },
  activeHeaderText: {
    fontWeight: 'bold',
    opacity: 1,
    borderBottomColor: COLORS.secondary,
    borderBottomWidth: 3,
  },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '90%', backgroundColor: COLORS.secondary, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 20 },
  icon: { marginRight: 10 },
  inputLabel: { color: COLORS.lightText, fontSize: 14 },
  input: { color: COLORS.lightText, fontSize: 16, width: 200 },
  footerContainer: { width: '90%', alignItems: 'flex-start', marginTop: 10 },
  footerText: { color: COLORS.lightText, fontSize: 14 },
  footerLink: { color: COLORS.lightText, fontWeight: 'bold' },
  loginButton: { width: '90%', backgroundColor: COLORS.secondary, padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  loginButtonText: { color: COLORS.darkText, fontSize: 18, fontWeight: 'bold' },
});