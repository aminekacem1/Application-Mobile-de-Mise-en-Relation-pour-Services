import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Palette de Couleurs ---
const COULEURS = {
  brandBlue: '#0D47A1',
  white: '#FFFFFF',
  lightBg: '#F0F0F0',
  cardBg: '#EAE6E1',
  darkGray: '#3A3A3A',
  gray: '#6C757D',
  orange: '#F39C12',
  orangeDark: '#E67E22',
};

// --- Options de Paiement ---
const paymentOptions = ['Stripe', 'PayPal', 'Argent Mobile'];

// --- Composant Principal de la Page de Paiement ---
export default function PaymentPage() {
  const router = useRouter();
  const serviceDetails = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [selectedMethod, setSelectedMethod] = useState('Stripe');
  const [escrow, setEscrow] = useState(false);

  const handlePayment = () => {
    Alert.alert(
      "Paiement Confirmé",
      `Le paiement de ${parseFloat(serviceDetails.amount).toFixed(2)} € pour le service "${serviceDetails.service}" a été effectué avec succès via ${selectedMethod}.`,
      [{ text: "OK", onPress: () => router.push('/userPage') }]
    );
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />
      
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.push('/serviceTracking')} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={COULEURS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.paymentCard}>
            <Text style={styles.sectionTitle}>Méthode de Paiement</Text>
            
            {paymentOptions.map(option => (
              <TouchableOpacity 
                key={option} 
                style={styles.radioContainer} 
                onPress={() => setSelectedMethod(option)}
              >
                <View style={styles.radioOuter}>
                  {selectedMethod === option && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{option}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Paiement Séquestre{' '}
              <Text style={{ fontWeight: 'normal', color: COULEURS.gray }}>
                (Bloqué jusqu'à la fin du service)
              </Text>
            </Text>

            <TouchableOpacity style={styles.radioContainer} onPress={() => setEscrow(!escrow)}>
              <View style={styles.checkbox}>
                {escrow && <Icon name="check" size={12} color={COULEURS.brandBlue} />}
              </View>
              <Text style={styles.radioLabel}>Activer le séquestre</Text>
            </TouchableOpacity>

            <Text style={styles.totalText}>
              Total : {parseFloat(serviceDetails.amount).toFixed(2)} €
            </Text>

            <View style={styles.actionButtonContainer}>
              <TouchableOpacity 
                onPress={() => Alert.alert("Facture", "La fonctionnalité de téléchargement est en cours de développement.")}
              >
                <Text style={styles.buttonText}>Télécharger la facture</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity onPress={handlePayment}>
                <Text style={styles.buttonText}>Payer Maintenant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Spacer for bottom safe area */}
      <View style={{ backgroundColor: COULEURS.white, paddingBottom: insets.bottom }} />
    </View>
  );
}

// --- Feuille de Styles ---
const styles = StyleSheet.create({
  fullScreenWrapper: { 
    flex: 1, 
    backgroundColor: COULEURS.lightBg,
  },
  pageContainer: { 
    flex: 1, 
    backgroundColor: COULEURS.lightBg,
  },
  headerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: COULEURS.brandBlue, 
    paddingVertical: 15, 
    paddingHorizontal: 15,
  },
  headerTitle: { 
    color: COULEURS.white, 
    fontSize: 22, 
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  backButton: { 
    padding: 5,
    width: 40,
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonSpacer: { 
    width: 40, 
    height: 40,
  },
  scrollContent: { 
    padding: 20 
  },
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
    marginRight: 10, 
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
});
