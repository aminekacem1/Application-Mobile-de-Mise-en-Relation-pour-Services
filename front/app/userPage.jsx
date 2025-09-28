// front/app/userPage.jsx (MODIFIED to pass certifications)
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  brandBlue: '#0D47A1',
  lightBlue: '#E3F2FD',
  white: '#FFFFFF',
  lightBg: '#F7F9FC',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
  star: '#FFC107',
  categoryBg: '#E4EFF8',
};

const categories = [
  { name: 'Maison', icon: 'home' },
  { name: 'Voiture', icon: 'car' },
  { name: 'Jardinage', icon: 'seedling' },
  { name: 'Plomberie', icon: 'wrench' },
  { name: 'Électricité', icon: 'bolt' },
  { name: 'Nettoyage', icon: 'broom' },
];

const Header = () => {
  const router = useRouter();
  const handleGoToLogin = () => {
    router.replace('/login');
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleGoToLogin} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color={COLORS.white} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>App de Service</Text>
      <View style={styles.headerUser}>
        <Text style={styles.headerUserText}>Bonjour !</Text>
        <View style={styles.avatar} />
      </View>
    </View>
  );
};

const FilterButton = ({ label }) => (
  <TouchableOpacity style={styles.filterButton}>
    <Text style={styles.filterButtonText}>{label}</Text>
  </TouchableOpacity>
);

const TechnicianCard = ({ item }) => {
  const router = useRouter();

  return (
    <View style={styles.technicianCard}>
      <TouchableOpacity
        style={styles.technicianPressableArea}
        onPress={() => router.push({
          pathname: '/TechnicianProfile',
          params: { 
            id: item._id,
            name: item.name,
            profession: item.profession,
            rating: item.rating,
            distance: item.distance,
            description: item.description,
            certifications: item.certifications, // <-- PASS THE CERTIFICATIONS HERE
          }
        })}
      >
        <View style={styles.technicianAvatar} />
        <View style={styles.technicianInfo}>
          <Text style={styles.technicianName}>{item.name}</Text>
          <Text style={styles.technicianDetails}>{item.profession}</Text>
          <Text style={styles.technicianDetails}>
            Note: {item.rating.toFixed(1)} <Icon name="star" solid color={COLORS.star} />
          </Text>
          <Text style={styles.technicianDetails}>{`${item.distance} km`}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => router.push({
          pathname: '/reservation',
          params: { name: item.name, profession: item.profession }
        })}
      >
        <Text style={styles.bookButtonText}>Réserver</Text>
      </TouchableOpacity>
    </View>
  );
};

const BottomNavBar = () => {
  const router = useRouter();
  return (
    <View style={styles.navBarContainer}>
      <TouchableOpacity style={styles.navBarButton} onPress={() => {}}> 
        <Icon name="bookmark" solid size={22} color={COLORS.gray} />
        <Text style={styles.navBarText}>Réservations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navBarButton} onPress={() => router.push('/serviceTracking')}>
        <Icon name="clipboard-check" solid size={22} color={COLORS.gray} />
        <Text style={styles.navBarText}>Suivi Service</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navBarButton} onPress={() => {}}> 
        <Icon name="comments" solid size={22} color={COLORS.gray} />
        <Text style={styles.navBarText}>Chat</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navBarButton} onPress={() => {}}> 
        <Icon name="user-circle" solid size={22} color={COLORS.gray} />
        <Text style={styles.navBarText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function TechnicianList() {
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTechnicians = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.1.8:5000/api/technicians?q=${query}`);
      const updatedTechs = res.data.map((tech) => ({
        ...tech,
        profession: tech.profession || ['Plombier', 'Électricien', 'Jardinier'][Math.floor(Math.random() * 3)],
        rating: 4.5 + Math.random() * 0.5,
        distance: (Math.random() * 5 + 1).toFixed(1),
        description: tech.description || `Spécialiste en ${tech.profession || 'services généraux'}: ${tech.name} offre des solutions fiables et efficaces.`,
        certifications: tech.certifications || `Certifié en ${tech.profession || 'maintenance'} (5 ans d'expérience).`, // <-- ADD DEFAULT/FALLBACK CERTIFICATIONS
      }));
      setTechnicians(updatedTechs);
    } catch (err) {
      console.error("Échec de la récupération des techniciens:", err);
      // Fallback mock data when API call fails - ADD CERTIFICATIONS HERE
      const mockData = [
        { _id: '1', name: 'Amine', profession: 'Plombier', rating: 4.8, distance: '2.6', description: 'Amine est un plombier certifié avec 5 ans d\'expérience, spécialisé dans les réparations de fuites, l\'installation de chauffe-eau et les dépannages urgents.', certifications: 'Licence de Plomberie (2020), Certifié en Dépannage Rapide.' },
        { _id: '2', name: 'Kacem', profession: 'Jardinier', rating: 4.6, distance: '4.7', description: 'Kacem est un jardinier passionné, expert en aménagement paysager, tonte de pelouse, taille d\'arbustes et entretien de jardins pour particuliers et entreprises.', certifications: 'Certificat d\'Aménagement Paysager, Expert en Horticulture Biologique.' },
        { _id: '3', name: 'Leila', profession: 'Électricien', rating: 4.9, distance: '3.1', description: 'Leila est une électricienne qualifiée, offrant des services d\'installation électrique, de dépannage, de mise aux normes et de rénovation pour des projets résidentiels et commerciaux.', certifications: 'Habilitation Électrique, Diplôme en Génie Électrique (2019).' },
      ];
      setTechnicians(mockData);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTechnicians();
    }, [])
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTechnicians(search);
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brandBlue} />
      <View style={styles.container}>
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContentContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.searchWrapper}>
                <Icon name="search" size={15} color={COLORS.gray} style={styles.searchIcon} />
                <TextInput
                  placeholder="Rechercher..."
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  placeholderTextColor={COLORS.gray}
                />
              </View>
              <View style={styles.filtersContainer}>
                <FilterButton label="Lieu" />
                <FilterButton label="Budget" />
                <FilterButton label="Disponibilité" />
                <FilterButton label="Évaluations" />
              </View>
              <Text style={styles.sectionTitle}>Catégories</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((cat, index) => (
                  <TouchableOpacity key={index} style={styles.categoryCard}>
                    <Icon name={cat.icon} size={24} color={COLORS.darkGray} />
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sectionTitle}>Techniciens à proximité</Text>
              {loading ? (
                <ActivityIndicator size="large" color={COLORS.brandBlue} style={{ marginTop: 20 }} />
              ) : technicians.length === 0 ? (
                <Text style={styles.emptyText}>Aucun technicien trouvé</Text>
              ) : (
                <View>
                  {technicians.map(item => <TechnicianCard key={item._id} item={item} />)}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.brandBlue, },
    container: { flex: 1, backgroundColor: COLORS.lightBg, },
    scrollContentContainer: { paddingHorizontal: 20, paddingBottom: 100, },
    headerContainer: { backgroundColor: COLORS.brandBlue, paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    backButton: { marginRight: 15, padding: 5, },
    headerTitle: { color: COLORS.white, fontSize: 22, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    headerUser: { flexDirection: 'row', alignItems: 'center' },
    headerUserText: { color: COLORS.white, fontSize: 16, marginRight: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray },
    searchWrapper: { flexDirection: 'row', alignItems: 'center', position: 'relative', marginTop: 16, marginBottom: 12 },
    searchIcon: { position: 'absolute', left: 15, zIndex: 1 },
    searchInput: { flex: 1, backgroundColor: COLORS.white, borderRadius: 12, paddingVertical: 12, paddingLeft: 40, fontSize: 16, borderWidth: 1, borderColor: COLORS.lightGray, color: COLORS.darkGray, },
    filtersContainer: { flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 24, },
    filterButton: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, },
    filterButtonText: { color: COLORS.darkGray, fontWeight: '500' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
    categoryCard: { width: '30%', aspectRatio: 1, backgroundColor: COLORS.categoryBg, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12, },
    categoryName: { marginTop: 8, fontWeight: 'bold', color: COLORS.darkGray },
    technicianCard: { backgroundColor: COLORS.lightBlue, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, },
    technicianPressableArea: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 16, },
    technicianAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.brandBlue, marginRight: 16, },
    technicianInfo: { flex: 1 },
    technicianName: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray },
    technicianDetails: { color: COLORS.gray, marginTop: 4 },
    bookButton: { backgroundColor: COLORS.brandBlue, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 22, },
    bookButtonText: { color: COLORS.white, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.gray, fontSize: 16 },
    navBarContainer: { flexDirection: 'row', height: 60, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.lightGray, justifyContent: 'space-around', alignItems: 'center', },
    navBarButton: { flex: 1, alignItems: 'center', justifyContent: 'center', },
    navBarText: { color: COLORS.gray, fontWeight: '500', fontSize: 12, marginTop: 4, },
});