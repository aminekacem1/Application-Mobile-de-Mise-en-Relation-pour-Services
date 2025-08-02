import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';

// --- Palette de Couleurs ---
const COULEURS = {
  brandBlue: '#0D47A1',
  white: '#FFFFFF',
  lightBg: '#F0F0F0', // Fond général de la page
  cardBg: '#EAE6E1',    // Fond de la carte de paiement
  darkGray: '#3A3A3A',
  gray: '#6C757D',
  orange: '#F39C12',
  orangeDark: '#E67E22',
};

// --- Options de Paiement ---
const paymentOptions = ['Stripe', 'PayPal', 'Argent Mobile'];

// --- Barre de Navigation du Bas ---
const BarreDeNavigation = () => {
    const router = useRouter();
    return (
        <View style={styles.navBarContainer}>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/bookings')}><Icon name="bookmark" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Réservations</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/serviceTracking')}><Icon name="clipboard-check" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Suivi</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/chatList')}><Icon name="comments" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Chat</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/profile')}><Icon name="user-circle" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Profil</Text></TouchableOpacity>
        </View>
    );
};

// --- Composant Principal de la Page de Paiement ---
export default function PaymentPage() {
  const router = useRouter();
  const serviceDetails = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState('Stripe');
  const [escrow, setEscrow] = useState(false);

  const handlePayment = () => {
      Alert.alert(
          "Paiement Confirmé",
          `Le paiement de ${serviceDetails.amount} € pour le service "${serviceDetails.service}" a été effectué avec succès via ${selectedMethod}.`,
          [{ text: "OK", onPress: () => router.push('/userPage') }]
      );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />
      
      <View style={styles.headerContainer}>
        {}
        {}
        <TouchableOpacity onPress={() => router.push('/serviceTracking')} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={COULEURS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.paymentCard}>
                <Text style={styles.sectionTitle}>Méthode de Paiement</Text>
                {paymentOptions.map(option => (
                    <TouchableOpacity key={option} style={styles.radioContainer} onPress={() => setSelectedMethod(option)}>
                        <View style={styles.radioOuter}>
                            {selectedMethod === option && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>{option}</Text>
                    </TouchableOpacity>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Paiement Séquestre <Text style={{fontWeight: 'normal', color: COULEURS.gray}}>(Bloqué jusqu'à la fin du service)</Text></Text>
                <TouchableOpacity style={styles.radioContainer} onPress={() => setEscrow(!escrow)}>
                    <View style={styles.checkbox}>
                        {escrow && <Icon name="check" size={12} color={COULEURS.brandBlue} />}
                    </View>
                </TouchableOpacity>

                <Text style={styles.totalText}>Total : {parseFloat(serviceDetails.amount).toFixed(2)} €</Text>

                <View style={styles.actionButtonContainer}>
                    <TouchableOpacity onPress={() => Alert.alert("Facture", "La fonctionnalité de téléchargement est en cours de développement.")}>
                        <Text style={styles.buttonText}>Télécharger la facture</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={handlePayment}>
                        <Text style={styles.buttonText}>Payer Maintenant</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        <BarreDeNavigation />
      </View>
    </SafeAreaView>
  );
}

// --- Feuille de Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COULEURS.brandBlue },
  pageContainer: { flex: 1, backgroundColor: COULEURS.lightBg },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COULEURS.brandBlue, paddingVertical: 15, paddingHorizontal: 15 },
  headerTitle: { color: COULEURS.white, fontSize: 22, fontWeight: 'bold' },
  backButton: { padding: 5 },
  scrollContent: { padding: 20 },
  paymentCard: {
    backgroundColor: COULEURS.cardBg,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COULEURS.orange,
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COULEURS.brandBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COULEURS.brandBlue,
  },
  radioLabel: {
    fontSize: 16,
    color: COULEURS.darkGray,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: COULEURS.darkGray,
    backgroundColor: COULEURS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COULEURS.darkGray,
    marginTop: 20,
    marginBottom: 20,
  },
  actionButtonContainer: {
    backgroundColor: COULEURS.orange,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: COULEURS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: '30%',
    backgroundColor: COULEURS.white,
    marginVertical: 10,
  },
  navBarContainer: { flexDirection: 'row', height: 60, backgroundColor: COULEURS.white, borderTopWidth: 1, borderTopColor: COULEURS.lightGray },
  navBarButton: {  flex: 1,  alignItems: 'center', justifyContent: 'center' },
  navBarText: {  color: COULEURS.gray,  fontWeight: '500', fontSize: 12, marginTop: 4 },
});