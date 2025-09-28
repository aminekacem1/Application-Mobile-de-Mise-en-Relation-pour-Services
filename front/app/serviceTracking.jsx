import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Palette de Couleurs ---
const COULEURS = {
  brandBlue: '#0D47A1',
  lightBg: '#F0F0F0',
  white: '#FFFFFF',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
  inProgress: '#F39C12',
  pending: '#3498DB',
  completed: '#2ECC71',
  canceled: '#E74C3C',
};

// --- Données d'Exemple ---
const servicesEnCours = [
  { id: 1, service: 'Réparation de Plomberie', technicien: 'Amine', date: '2025-07-28', status: 'En cours', amount: 75.00 },
  { id: 2, service: 'Entretien du Jardin', technicien: 'Kacem', date: '2025-07-30', status: 'Terminé', amount: 50.00 },
  { id: 3, service: 'Réparation Électrique', technicien: 'Leila', date: '2025-07-29', status: 'En attente', amount: 90.00 },
  { id: 4, service: 'Vérification Chauffage', technicien: 'Amine', date: '2025-07-27', status: 'Annulé', amount: 40.00 },
];

const misesAJour = [
  "Nouveau : Amine a accepté votre demande de plomberie - 11:46, 27 Juil 2025",
  "Update : L'entretien du jardin par Kacem est terminé - 10:00, 27 Juil 2025",
];

// --- Barre de Navigation ---
const BarreDeNavigation = () => {
  const router = useRouter();
  return (
    <View style={styles.navBarContent}>
      <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/bookings')}>
        <Icon name="bookmark" size={22} color={COULEURS.gray} />
        <Text style={styles.navBarText}>Réservations</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBarButton}>
        <Icon name="clipboard-check" size={22} color={COULEURS.brandBlue} />
        <Text style={[styles.navBarText, { color: COULEURS.brandBlue }]}>Suivi Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/chatList')}>
        <Icon name="comments" size={22} color={COULEURS.gray} />
        <Text style={styles.navBarText}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/profile')}>
        <Icon name="user-circle" size={22} color={COULEURS.gray} />
        <Text style={styles.navBarText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- ServiceCard ---
const ServiceCard = ({ item }) => {
  const router = useRouter();
  const isCompleted = item.status === 'Terminé';

  const statusColor = {
    'En cours': COULEURS.inProgress,
    'En attente': COULEURS.pending,
    'Terminé': COULEURS.completed,
    'Annulé': COULEURS.canceled,
  }[item.status] || COULEURS.gray;

  return (
    <TouchableOpacity
      disabled={!isCompleted}
      onPress={() => router.push({ pathname: '/payment', params: { ...item } })}
      style={[styles.card, !isCompleted && styles.disabledCard]}
      activeOpacity={0.7}
    >
      <Text style={styles.cardText}>Service : <Text style={{ fontWeight: 'normal' }}>{item.service}</Text></Text>
      <Text style={styles.cardText}>Technicien : <Text style={{ fontWeight: 'normal' }}>{item.technicien}</Text></Text>
      <Text style={styles.cardText}>Date : <Text style={{ fontWeight: 'normal' }}>{item.date}</Text></Text>
      <Text style={[styles.cardText, { color: statusColor, fontWeight: 'bold' }]}>
        Statut : <Text style={{ color: statusColor, fontWeight: 'normal' }}>{item.status}</Text>
      </Text>
      {isCompleted && (
        <Text style={styles.paymentPrompt}>Cliquer pour Payer</Text>
      )}
    </TouchableOpacity>
  );
};

// --- Composant principal ---
export default function ServiceTrackingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.fullScreenWrapper}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />

      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.push('/userPage')} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={COULEURS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi du Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.pageContentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {servicesEnCours.map(item => <ServiceCard key={item.id} item={item} />)}
          <TouchableOpacity style={styles.mapButton}>
            <Text style={styles.mapButtonText}>Voir sur la carte (Position du technicien)</Text>
          </TouchableOpacity>
          <View style={styles.updatesContainer}>
            {misesAJour.map((update, index) => (
              <View key={index} style={styles.updateItem}>
                <View style={styles.updateLine} />
                <Text style={styles.updateText}>{update}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ backgroundColor: COULEURS.white, paddingBottom: insets.bottom }} />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: COULEURS.lightBg,
  },
  pageContentContainer: {
    flex: 1,
    backgroundColor: COULEURS.lightBg,
  },
  headerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COULEURS.brandBlue, paddingVertical: 15, paddingHorizontal: 15,
  },
  headerTitle: {
    color: COULEURS.white,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COULEURS.white, borderRadius: 8, padding: 15, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
  },
  disabledCard: {
    backgroundColor: '#F8F9F9',
  },
  cardText: { fontSize: 16, color: COULEURS.darkGray, marginBottom: 4 },
  paymentPrompt: {
    marginTop: 10, color: COULEURS.completed, fontSize: 14, fontWeight: 'bold', textAlign: 'right',
  },
  mapButton: { backgroundColor: COULEURS.brandBlue, borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  mapButtonText: { color: COULEURS.white, fontSize: 16, fontWeight: 'bold' },
  updatesContainer: { backgroundColor: COULEURS.white, borderRadius: 8, padding: 15 },
  updateItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  updateLine: { width: 3, backgroundColor: COULEURS.brandBlue, marginRight: 10, alignSelf: 'stretch' },
  updateText: { flex: 1, color: COULEURS.gray, fontSize: 14 },

  navBarContainer: { flexDirection: 'row', height: 60, backgroundColor: COULEURS.white, borderTopWidth: 1, borderTopColor: COULEURS.lightGray },
  navBarButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navBarText: { color: COULEURS.gray, fontWeight: '500', fontSize: 12, marginTop: 4 },
});
