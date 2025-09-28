import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Définition des couleurs pour la cohérence avec vos autres écrans
const COLORS = {
  brandBlue: '#0D47A1',
  lightBlue: '#E3F2FD',
  white: '#FFFFFF',
  lightBg: '#F7F9FC',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
};

// --- COMPOSANTS INTERNES ---

// Composant pour afficher une ligne d'information
const InfoField = ({ label, value }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Text style={styles.inputValue}>{value}</Text>
    </View>
  </View>
);

// Barre de navigation du bas
const BottomNavBar = () => {
    const router = useRouter();
    
};


// --- ÉCRAN PRINCIPAL ---

export default function ReservationPage() {
  const router = useRouter();
  
  const params = useLocalSearchParams();
  const technicianName = params.name || "John Doe";
  const technicianProfession = params.profession || "Plombier";

  const handleConfirm = () => {
    Alert.alert(
      "Réservation Confirmée",
      `Votre rendez-vous avec ${technicianName} a été enregistré avec succès.`,
      [{ text: "OK" }]
    );
  };

  return (
    // MODIFICATION : On ajoute 'bottom' ici pour protéger la barre de navigation
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandBlue} />
      
      {/* En-tête avec flèche de retour */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/userPage')} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réservation</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <InfoField
            label="Technicien Sélectionné"
            value={`${technicianName} (${technicianProfession})`}
          />
          <InfoField
            label="Date"
            value="30/07/2025"
          />
          <InfoField
            label="Heure"
            value="11 : 35 AM"
          />
          <InfoField
            label="Lieu"
            value="Msaken"
          />

          <Text style={styles.priceText}>Prix Estimé: $50.00</Text>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmer la Réservation</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

// --- FEUILLE DE STYLES ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.brandBlue,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  headerContainer: {
    backgroundColor: COLORS.brandBlue,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  headerRightPlaceholder: {
    width: 30,
  },
  scrollContent: {
    padding: 24,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#B0C4DE',
  },
  inputValue: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 24,
    marginBottom: 32,
  },
  confirmButton: {
    backgroundColor: '#D6EAF8',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A9CCE3',
  },
  confirmButtonText: {
    color: COLORS.brandBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navBarButton: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarText: { 
    color: COLORS.gray, 
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
});