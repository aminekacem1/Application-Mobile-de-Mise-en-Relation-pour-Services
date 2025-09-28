// front/app/(tabs)/technicianDashboard.jsx (Dashboard content - Image 4)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- Palette de Couleurs ---
const COLORS = {
  brandBlue: '#0D47A1',
  darkBackground: '#1A202C',
  cardBackground: '#2D3748',
  white: '#FFFFFF',
  gray: '#A0AEC0',
  darkGray: '#CBD5E0',
  red: '#E53E3E',
  green: '#38A169',
  lightBlue: '#63B3ED', // For active tab or button
  separator: '#4A5568', // For dividers
};

// --- Static Data (for UI demonstration) ---
const serviceTags = [
  'Électricité', 'Mécanique', 'Réparation de coque', 'Nettoyage',
  'Plomberie', 'Gréement', 'Électronique', 'Hivernage',
  'Sellerie', 'Entretien moteur', 'Finition', 'Peinture',
];

const overviewStats = [
  { label: 'Total des emplois', value: '0', color: COLORS.white },
  { label: 'Terminé', value: '0', color: COLORS.green },
  { label: 'En cours', value: '0', color: COLORS.orange },
  { label: 'Emplois ce mois-ci', value: '0', color: COLORS.lightBlue },
];

export default function TechnicianDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // For precise safe area control
  const [activeEarningsTab, setActiveEarningsTab] = useState('Mois'); // 'Semaine', 'Mois', 'Année'

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Oui", onPress: () => router.replace('/login') } // Navigate to login on logout
      ]
    );
  };

  const handleModifyProfile = () => {
    // Navigates to the separate profile editing page
    router.push('/profile'); // Assuming 'profile.jsx' is your edit profile page
  };

  const handleLanguageChange = (lang) => {
    Alert.alert("Changer la langue", `La langue sera changée en ${lang}.`);
  };

  return (
    // fullScreenWrapper now explicitly takes paddingTop for header.
    // The bottom padding for scroll content is adjusted for the tab bar.
    <View style={[styles.fullScreenWrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandBlue} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Service App</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.hiUserText}>Hi,User!</Text>
          <View style={styles.avatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {/* Language Selector Placeholder */}
            <TouchableOpacity onPress={() => handleLanguageChange('Français')} style={styles.languageSelector}>
              <Icon name="flag-fr" size={16} color={COLORS.darkGray} /> {/* Assuming flag-fr icon exists */}
              <Text style={styles.languageText}> Français</Text>
              <Icon name="chevron-down" size={10} color={COLORS.darkGray} style={{ marginLeft: 5 }} />
            </TouchableOpacity>
            <Text style={styles.profileTitle}>Profil</Text>
            <Text style={styles.profilePhone}>27132442</Text>
          </View>

          {/* Service Tags */}
          <View style={styles.tagsContainer}>
            {serviceTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Icon name={tag.toLowerCase().includes('electricite') ? 'bolt' : // Example icon logic
                            tag.toLowerCase().includes('mecanique') ? 'cogs' :
                            tag.toLowerCase().includes('plomberie') ? 'faucet' :
                            tag.toLowerCase().includes('jardinage') ? 'seedling' :
                            tag.toLowerCase().includes('nettoyage') ? 'broom' :
                            tag.toLowerCase().includes('peinture') ? 'paint-roller' :
                            'wrench'} // Default icon
                      size={14} color={COLORS.darkGray} style={{ marginRight: 5 }} />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleModifyProfile} style={styles.modifyProfileButton}>
            <Icon name="edit" size={16} color={COLORS.white} style={{ marginRight: 10 }} />
            <Text style={styles.modifyProfileButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Aperçu (Overview) Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aperçu</Text>
        </View>
        <View style={styles.overviewGrid}>
          {overviewStats.map((stat, index) => (
            <View key={index} style={styles.overviewCard}>
              <Text style={[styles.overviewValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.overviewLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Gains (Earnings) Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gains</Text>
          <View style={styles.earningsTag}>
            <Text style={styles.earningsTagText}>$0 ce mois-ci</Text>
          </View>
        </View>
        <View style={styles.earningsCard}>
          <Text style={styles.totalEarningsLabel}>Gains totaux</Text>
          <Text style={styles.totalEarningsValue}>$0</Text>
          <Text style={styles.earningsSource}>Provenant de 0 emplois terminés</Text>

          <View style={styles.earningsTabs}>
            {['Semaine', 'Mois', 'Année'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.earningsTabButton, activeEarningsTab === tab && styles.earningsTabButtonActive]}
                onPress={() => setActiveEarningsTab(tab)}
              >
                <Text style={[styles.earningsTabButtonText, activeEarningsTab === tab && styles.earningsTabButtonTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Placeholder for the graph */}
          <View style={styles.graphPlaceholder}>
            <Text style={styles.graphPlaceholderText}>Graphique des gains ici</Text>
            <View style={styles.graphLine}></View>
            <View style={styles.graphMarkers}>
                <Text style={styles.graphMarkerText}>W4</Text>
                <Text style={styles.graphMarkerText}>W3</Text>
                <Text style={styles.graphMarkerText}>W2</Text>
                <Text style={styles.graphMarkerText}>W1</Text>
            </View>
          </View>
        </View>

        {/* Déconnexion Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="sign-out-alt" size={18} color={COLORS.white} style={{ marginRight: 10 }} />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* NO TechnicianBottomNavBar HERE, it's provided by (tabs)/_layout.jsx */}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: COLORS.darkBackground, // Overall dark background
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.brandBlue,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiUserText: {
    color: COLORS.white,
    fontSize: 18,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray, // Placeholder color
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20, // Default padding, (tabs)/_layout.jsx will handle bottom inset for the tab bar
  },
  profileSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  languageText: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  profileTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profilePhone: {
    color: COLORS.darkGray,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8, // Spacing between tags
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tagText: {
    color: COLORS.darkGray,
    fontSize: 13,
  },
  modifyProfileButton: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifyProfileButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    width: (width - 60) / 2, // (screen_width - paddingHorizontal * 2 - gap) / 2
    aspectRatio: 1.1, // Slightly taller than wide
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
  },
  overviewValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overviewLabel: {
    color: COLORS.darkGray,
    fontSize: 14,
    textAlign: 'center',
  },
  earningsTag: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  earningsTagText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  earningsCard: {
    backgroundColor: COLORS.brandBlue, // Blue background for earnings section
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  totalEarningsLabel: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 5,
  },
  totalEarningsValue: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  earningsSource: {
    color: COLORS.darkGray,
    fontSize: 14,
    marginBottom: 20,
  },
  earningsTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  earningsTabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  earningsTabButtonActive: {
    backgroundColor: COLORS.brandBlue, // Active tab color
  },
  earningsTabButtonText: {
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
  earningsTabButtonTextActive: {
    color: COLORS.white,
  },
  graphPlaceholder: {
    height: 150, // Height for the graph area
    backgroundColor: COLORS.darkBackground, // Darker background for graph
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 20, // Space for markers
  },
  graphPlaceholderText: {
    color: COLORS.gray,
    fontSize: 16,
  },
  graphLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 1,
    backgroundColor: COLORS.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  graphMarkers: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  graphMarkerText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: COLORS.red,
    borderRadius: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20, // Ensure space at the bottom
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});