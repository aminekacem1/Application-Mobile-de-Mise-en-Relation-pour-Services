import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';

// --- Palette de Couleurs ---
const COULEURS = {
  brandBlue: '#0D47A1',
  lightBg: '#F0F0F0',
  white: '#FFFFFF',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
  // Couleurs pour les statuts
  inProgress: '#F39C12', // Orange
  pending: '#3498DB',    // Bleu
  completed: '#2ECC71',  // Vert
  canceled: '#E74C3C',   // Rouge
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
        <View style={styles.navBarContainer}>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/bookings')}><Icon name="bookmark" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Réservations</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton}><Icon name="clipboard-check" solid size={22} color={COULEURS.brandBlue} /><Text style={[styles.navBarText, { color: COULEURS.brandBlue }]}>Suivi Service</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/chatList')}><Icon name="comments" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Chat</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/profile')}><Icon name="user-circle" solid size={22} color={COULEURS.gray} /><Text style={styles.navBarText}>Profil</Text></TouchableOpacity>
        </View>
    );
};

// --- MODIFICATION DU COMPOSANT ServiceCard ---
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
    // On enveloppe la carte dans un bouton désactivé si le statut n'est pas "Terminé"
    <TouchableOpacity
      disabled={!isCompleted}
      onPress={() => router.push({ pathname: '/payment', params: { ...item } })}
      style={[styles.card, !isCompleted && styles.disabledCard]} // Style optionnel pour les cartes non cliquables
      activeOpacity={0.7}
    >
      <Text style={styles.cardText}>Service : {item.service}</Text>
      <Text style={styles.cardText}>Technicien : {item.technicien}</Text>
      <Text style={styles.cardText}>Date : {item.date}</Text>
      <Text style={[styles.cardText, { color: statusColor, fontWeight: 'bold' }]}>
        Statut : {item.status}
      </Text>
      {/* On ajoute une indication visuelle pour l'action */}
      {isCompleted && (
        <Text style={styles.paymentPrompt}>Cliquer pour Payer</Text>
      )}
    </TouchableOpacity>
  );
};
// --- FIN DE LA MODIFICATION ---

// --- Composant principal ---
export default function ServiceTrackingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />
      
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/userPage')} style={styles.backButton}><Icon name="arrow-left" size={20} color={COULEURS.white} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi du Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {servicesEnCours.map(item => <ServiceCard key={item.id} item={item} />)}
          <TouchableOpacity style={styles.mapButton}><Text style={styles.mapButtonText}>Voir sur la carte (Position du technicien)</Text></TouchableOpacity>
          <View style={styles.updatesContainer}>
            {misesAJour.map((update, index) => (
                <View key={index} style={styles.updateItem}>
                    <View style={styles.updateLine} /><Text style={styles.updateText}>{update}</Text>
                </View>
            ))}
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
  card: {
    backgroundColor: COULEURS.white, borderRadius: 8, padding: 15, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
  },
  disabledCard: { // Style pour les cartes non cliquables
    backgroundColor: '#F8F9F9', 
  },
  cardText: { fontSize: 16, color: COULEURS.darkGray, marginBottom: 4 },
  paymentPrompt: { // Nouveau style pour le texte d'incitation
    marginTop: 10, color: COULEURS.completed, fontSize: 14, fontWeight: 'bold', textAlign: 'right',
  },
  mapButton: { backgroundColor: COULEURS.brandBlue, borderRadius: 8, paddingVertical: 15, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  mapButtonText: { color: COULEURS.white, fontSize: 16, fontWeight: 'bold' },
  updatesContainer: { backgroundColor: COULEURS.white, borderRadius: 8, padding: 15 },
  updateItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  updateLine: { width: 3, backgroundColor: COULEURS.brandBlue, marginRight: 10, alignSelf: 'stretch' },
  updateText: { flex: 1, color: COULEURS.gray, fontSize: 14 },
  navBarContainer: { flexDirection: 'row', height: 60, backgroundColor: COULEURS.white, borderTopWidth: 1, borderTopColor: COULEURS.lightGray },
  navBarButton: {  flex: 1,  alignItems: 'center', justifyContent: 'center' },
  navBarText: {  color: COULEURS.gray,  fontWeight: '500', fontSize: 12, marginTop: 4 },
});