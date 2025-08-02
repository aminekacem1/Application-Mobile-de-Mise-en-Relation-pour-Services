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
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// --- NOUVELLE PALETTE DE COULEURS (IDENTIQUE AUX AUTRES PAGES) ---
const COLORS = {
  primary: '#005A9C',        // Bleu principal
  background: '#F8F8F8',     // Arrière-plan blanc cassé
  inputBackground: '#EBF2FA',// Arrière-plan bleu clair pour les champs
  lightText: '#FFFFFF',       // Texte blanc
  darkText: '#333333',        // Texte principal sombre
  inactiveText: '#A9A9A9',    // Gris pour placeholders
};

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
      return;
    }

    try {
      await axios.post('http://192.168.1.3:5000/api/auth/forgot-password', { email });
      Alert.alert(
        'Succès',
        'Un email pour réinitialiser votre mot de passe a été envoyé.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la demande.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.innerContainer}>
          <Text style={styles.title}>Réinitialiser le mot de passe</Text>
          <Text style={styles.subtitle}>
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Text>

          {/* --- CHAMP DE SAISIE MIS À JOUR --- */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color={COLORS.primary} style={styles.icon} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Adresse Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholder="nom@exemple.com"
                placeholderTextColor={COLORS.inactiveText}
              />
            </View>
          </View>

          {/* --- BOUTON MIS À JOUR --- */}
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Envoyer le lien</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
}

// --- STYLES MIS À JOUR ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  backButton: { 
    position: 'absolute', 
    top: 60, 
    left: 20, 
    zIndex: 10 
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.inactiveText,
    textAlign: 'center',
    marginBottom: 40,
    width: '90%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 25, // Coins très arrondis
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
  },
  icon: { 
    marginRight: 15 
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: { 
    color: COLORS.darkText, 
    fontSize: 16,
    marginBottom: 2,
  },
  input: { 
    color: COLORS.darkText, 
    fontSize: 16,
    padding: 0,
  },
  resetButton: {
    width: '95%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50, // Style "pilule"
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetButtonText: {
    color: COLORS.lightText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});