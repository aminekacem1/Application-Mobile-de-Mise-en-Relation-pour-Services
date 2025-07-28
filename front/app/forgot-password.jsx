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
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  primary: '#4A0D66',
  secondary: '#E87A5D',
  lightText: '#FFFFFF',
  darkText: '#000000',
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
      await axios.post('http://192.168.1.2:5000/api/auth/forgot-password', { email });
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
      <ImageBackground
        source={require('@/assets/background-shapes.png')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={COLORS.lightText} />
        </TouchableOpacity>

        <View style={styles.innerContainer}>
          <Text style={styles.title}>Réinitialiser le mot de passe</Text>

          <View style={styles.inputContainer}>
            <Feather name="mail" size={24} color={COLORS.lightText} style={styles.icon} />
            <View>
              <Text style={styles.inputLabel}>Adresse Email</Text>
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

          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Envoyer le lien</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  imageBackground: { flex: 1, width: '100%' },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.lightText,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
  },
  icon: { marginRight: 10 },
  inputLabel: { color: COLORS.lightText, fontSize: 14 },
  input: { color: COLORS.lightText, fontSize: 16, width: 220 },
  resetButton: {
    width: '90%',
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  resetButtonText: {
    color: COLORS.darkText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
