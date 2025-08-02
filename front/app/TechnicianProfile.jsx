import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView, // Utilisation du SafeAreaView de base
  StatusBar,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

// --- Palette de Couleurs (Identique à vos autres écrans) ---
const COULEURS = {
  brandBlue: '#0D47A1',
  lightBlue: '#E3F2FD',
  white: '#FFFFFF',
  lightBg: '#F7F9FC',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
  star: '#FFC107',
  buttonBlue: '#D6EAF8',
};

// --- Données d'Exemple pour le Technicien (si l'API échoue) ---
const creerTechnicienExemple = (params) => ({
  _id: params.id,
  name: params.name || 'Technicien Inconnu',
  profession: params.profession || 'Non spécifié',
  rating: parseFloat(params.rating) || 4.0,
  reviews: ["Excellent service (avis d'exemple)."],
  certifications: `Certifié en ${params.profession || 'général'}, 5 ans d'expérience.`,
  specialties: "Spécialisé dans diverses réparations (données d'exemple).",
});

// --- Barre de Navigation du Bas ---
const BarreDeNavigation = () => {
    const router = useRouter();
    return (
        <View style={styles.navBarContainer}>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/bookings')}>
            <Icon name="bookmark" solid size={22} color={COULEURS.gray} />
            <Text style={styles.navBarText}>Réservations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/chat')}>
            <Icon name="comments" solid size={22} color={COULEURS.gray} />
            <Text style={styles.navBarText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/profile')}>
            <Icon name="user-circle" solid size={22} color={COULEURS.brandBlue} />
            <Text style={[styles.navBarText, {color: COULEURS.brandBlue}]}>Profil</Text>
        </TouchableOpacity>
        </View>
    );
};

// --- Composant Principal de la Page Profil ---
export default function ProfilTechnicien() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [technicien, setTechnicien] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!id) {
      setErreur("Aucun ID de technicien n'a été fourni.");
      setChargement(false);
      return;
    }
    const recupererDonneesTechnicien = async () => {
      setChargement(true);
      setErreur(null);
      try {
        const reponse = await axios.get(`http://192.168.1.3:5000/api/technicians/${id}`);
        setTechnicien(reponse.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          console.warn(`AVERTISSEMENT : API non trouvée. Chargement des données d'exemple DYNAMIQUES.`);
          setTechnicien(creerTechnicienExemple(params));
        } else {
          console.error("Échec de la récupération des détails du technicien :", err);
          setErreur("Impossible de charger le profil. Veuillez réessayer.");
        }
      } finally {
        setChargement(false);
      }
    };
    recupererDonneesTechnicien();
  }, [id]);

  if (chargement) {
    return (
      <View style={[styles.pageContainer, styles.centre]}>
        <ActivityIndicator size="large" color={COULEURS.brandBlue} />
      </View>
    );
  }

  if (erreur || !technicien) {
    return (
      <View style={[styles.pageContainer, styles.centre]}>
        <Text style={styles.texteErreur}>{erreur || "Technicien non trouvé."}</Text>
      </View>
    );
  }

  return (
    // --- NOUVELLE STRUCTURE IDENTIQUE À LA PAGE DE RÉSERVATION ---
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />
      
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/userPage')} style={styles.boutonRetour}>
          <Icon name="arrow-left" size={20} color={COULEURS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitre}>Profil du Technicien</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarConteneur}>
              <View style={styles.avatar} />
          </View>
          
          <Text style={styles.nom}>{technicien.name || 'N/A'}</Text>
          <Text style={styles.note}>
            Note : {technicien.rating?.toFixed(1) || 'N/A'} <Icon name="star" solid color={COULEURS.star} />
          </Text>

          <View style={styles.sectionDetails}>
            <Text style={styles.titreDetail}>Avis :</Text>
            <Text style={styles.texteDetail}>"{technicien.reviews?.[0] || 'Aucun avis pour le moment.'}"</Text>
          </View>

          <View style={styles.sectionDetails}>
            <Text style={styles.titreDetail}>Certifications et Spécialités :</Text>
            <Text style={styles.texteDetail}>{technicien.certifications || 'Aucune certification listée.'}</Text>
            <Text style={styles.texteDetail}>{technicien.specialties || ''}</Text>
          </View>

          <View style={styles.boutonsConteneur}>
            <TouchableOpacity 
              style={styles.boutonAction}
              onPress={() => router.push({ pathname: '/reservation', params: { name: technicien.name, profession: technicien.profession }})}
            >
              <Text style={styles.boutonActionTexte}>Réserver</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.boutonAction}
              onPress={() => router.push({ pathname: '/chat', params: { technicianId: technicien._id, name: technicien.name }})}
            >
              <Text style={styles.boutonActionTexte}>Discuter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <BarreDeNavigation />
      </View>
    </SafeAreaView>
  );
}

// --- Feuille de Styles ---
const styles = StyleSheet.create({
  safeArea: { // S'assure que le fond de la zone de statut est bleu
    flex: 1,
    backgroundColor: COULEURS.brandBlue,
  },
  pageContainer: { // Le conteneur principal avec le fond clair
    flex: 1,
    backgroundColor: COULEURS.lightBg,
  },
  centre: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COULEURS.brandBlue,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitre: {
    color: COULEURS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  boutonRetour: {
    padding: 5,
  },
  scrollContent: {
    padding: 24, // Padding identique à la page de réservation
  },
  avatarConteneur: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COULEURS.brandBlue,
    marginBottom: 20,
  },
  nom: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COULEURS.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  note: {
    fontSize: 18,
    color: COULEURS.darkGray,
    textAlign: 'center',
    marginBottom: 25,
  },
  sectionDetails: {
    marginBottom: 20,
    width: '100%',
  },
  titreDetail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COULEURS.darkGray,
    marginBottom: 5,
  },
  texteDetail: {
    fontSize: 16,
    color: COULEURS.gray,
    lineHeight: 22,
  },
  boutonsConteneur: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  boutonAction: {
    backgroundColor: COULEURS.buttonBlue,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#A9CCE3',
  },
  boutonActionTexte: {
    color: COULEURS.brandBlue,
    fontWeight: 'bold',
    fontSize: 16,
  },
  texteErreur: {
    color: COULEURS.gray,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  navBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COULEURS.white,
    borderTopWidth: 1,
    borderTopColor: COULEURS.lightGray,
  },
  navBarButton: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarText: { 
    color: COULEURS.gray, 
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
});