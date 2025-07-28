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
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Couleurs
const COLORS = {
  primary: '#4A0D66',
  secondary: '#E87A5D',
  lightText: '#FFFFFF',
  darkText: '#000000',
};

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');

  // --- Logique d'inscription (inchangée) ---
  const handleRegister = async () => {
    if (!name || !email || !password || !phone || !role) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et sélectionner un rôle.');
      return;
    }
    try {
      await axios.post('http://192.168.1.2:5000/api/auth/register', { name, email, password, phone, role });
      Alert.alert(
        'Succès',
        'Votre compte a été créé. Veuillez vous connecter.',
        [{ text: 'OK', onPress: () => router.push('/login') }]
      );
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || "Une erreur est survenue.");
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
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.headerText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={[styles.headerText, styles.activeHeaderText]}>S'inscrire</Text>
            </TouchableOpacity>
          </View>

          {/* ... Le reste du formulaire reste inchangé ... */}
          <View style={styles.inputContainer}><Feather name="user" size={24} color={COLORS.lightText} style={styles.icon} /><View><Text style={styles.inputLabel}>Nom</Text><TextInput value={name} onChangeText={setName} autoCapitalize="words" style={styles.input} placeholder="Votre nom complet" placeholderTextColor="#EEDFF2" /></View></View>
          <View style={styles.inputContainer}><MaterialCommunityIcons name="email-outline" size={24} color={COLORS.lightText} style={styles.icon} /><View><Text style={styles.inputLabel}>Email</Text><TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} placeholder="nom@exemple.com" placeholderTextColor="#EEDFF2" /></View></View>
          <View style={styles.inputContainer}><MaterialCommunityIcons name="lock-outline" size={24} color={COLORS.lightText} style={styles.icon} /><View><Text style={styles.inputLabel}>Mot de passe</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholder="**********" placeholderTextColor="#EEDFF2" /></View></View>
          <View style={styles.inputContainer}><Feather name="phone" size={24} color={COLORS.lightText} style={styles.icon} /><View><Text style={styles.inputLabel}>Téléphone</Text><TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} placeholder="**********" placeholderTextColor="#EEDFF2" /></View></View>
          <Text style={styles.roleLabel}>Je suis un :</Text>
          <View style={styles.roleSelectorContainer}><TouchableOpacity style={[styles.roleButton, role === 'client' && styles.activeRoleButton]} onPress={() => setRole('client')}><Text style={[styles.roleButtonText, role === 'client' && styles.activeRoleButtonText]}>Client</Text></TouchableOpacity><TouchableOpacity style={[styles.roleButton, role === 'technicien' && styles.activeRoleButton]} onPress={() => setRole('technicien')}><Text style={[styles.roleButtonText, role === 'technicien' && styles.activeRoleButtonText]}>Technicien</Text></TouchableOpacity></View>
          <View style={styles.footerContainer}><Text style={styles.footerText}>Vous avez déjà un compte ?{' '}<Pressable onPress={() => router.push('/login')}><Text style={styles.footerLink}>connectez-vous.</Text></Pressable></Text></View>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}><Text style={styles.registerButtonText}>S'inscrire</Text></TouchableOpacity>
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
    top: 60,
    left: 20,
    zIndex: 10,
  },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.1)' },
  // ... Le reste des styles est inchangé
  headerContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25, gap: 30 },
  headerText: { fontSize: 22, color: COLORS.lightText, opacity: 0.7 },
  activeHeaderText: { fontWeight: 'bold', opacity: 1, borderBottomColor: COLORS.secondary, borderBottomWidth: 3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '90%', backgroundColor: COLORS.secondary, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 15 },
  icon: { marginRight: 10 },
  inputLabel: { color: COLORS.lightText, fontSize: 14 },
  input: { color: COLORS.lightText, fontSize: 16, width: 200 },
  roleLabel: { color: COLORS.lightText, fontSize: 16, width: '90%', textAlign: 'left', marginBottom: 10, fontWeight: 'bold' },
  roleSelectorContainer: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', marginBottom: 20 },
  roleButton: { flex: 1, paddingVertical: 12, marginHorizontal: 5, borderRadius: 15, backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.secondary, alignItems: 'center' },
  activeRoleButton: { backgroundColor: COLORS.secondary },
  roleButtonText: { color: COLORS.lightText, fontSize: 16, fontWeight: '600' },
  activeRoleButtonText: { color: COLORS.darkText },
  footerContainer: { width: '90%', alignItems: 'center', marginTop: 10 },
  footerText: { color: COLORS.lightText, fontSize: 14 },
  footerLink: { color: COLORS.lightText, fontWeight: 'bold' },
  registerButton: { width: '90%', backgroundColor: COLORS.secondary, padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  registerButtonText: { color: COLORS.darkText, fontSize: 18, fontWeight: 'bold' },
});