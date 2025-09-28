// front/app/(tabs)/profile.jsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.8:5000/api';

const allCompetencies = [
    'Électricité', 'Mécanique', 'Nettoyage', 'Réparation de coque',
    'Entretien moteur', 'Plomberie', 'Peinture', 'Électronique',
    'Sellerie', 'Gréement', 'Hivernage', 'Finition'
];

const Header = ({ onBackPress }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitlePage}>Modifier le Profil</Text>
        <View style={styles.rightSpacer} />
    </View>
);

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCompetencies, setSelectedCompetencies] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    Alert.alert('Erreur', 'Non authentifié. Veuillez vous connecter.');
                    router.replace('/login');
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/auth/technician/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const technicianData = response.data || {};

                setEmail(String(technicianData.email || ''));
                setName(String(technicianData.name || ''));
                setPhone(String(technicianData.phone || ''));
                setSelectedCompetencies(Array.isArray(technicianData.profession) ? technicianData.profession : [technicianData.profession].filter(Boolean));

            } catch (err) {
                console.error('Error fetching profile (FRONTEND):', err.response?.data || err.message);
                setError('Erreur lors du chargement du profil.');
                Alert.alert('Erreur', err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleCompetencyToggle = (competency) => {
        setSelectedCompetencies(prev =>
            prev.includes(competency)
                ? prev.filter(c => c !== competency)
                : [...prev, competency]
        );
    };

    const handleSaveModifications = async () => {
        setSubmitting(true);
        setError(null);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Erreur', 'Non authentifié. Veuillez vous connecter.');
                router.replace('/login');
                return;
            }

            const updatedData = {
                name: String(name),
                phone: String(phone),
                email: String(email),
                profession: selectedCompetencies,
            };

            await axios.put(`${API_BASE_URL}/auth/technician/profile`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Succès', 'Profil mis à jour avec succès!');
            router.back();
        } catch (err) {
            console.error('Error saving profile (FRONTEND):', err.response?.data || err.message);
            setError('Erreur lors de la sauvegarde du profil.');
            Alert.alert('Erreur', err.response?.data?.message || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Chargement du profil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
            <Header onBackPress={() => router.back()} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {error && <Text style={styles.errorMessage}>{String(error)}</Text>}

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#a0aec0" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#a0aec0"
                        value={String(email)}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#a0aec0" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        placeholderTextColor="#a0aec0"
                        value={String(name)}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#a0aec0" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Téléphone"
                        placeholderTextColor="#a0aec0"
                        value={String(phone)}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                <Text style={styles.sectionTitleCompetencies}>Sélectionnez vos compétences en entretien de bateaux</Text>
                <Text style={styles.subTextCompetencies}>Choisissez tout ce qui s'applique</Text>
                <View style={styles.competenciesContainer}>
                    {allCompetencies.map(competency => (
                        <TouchableOpacity
                            key={String(competency)}
                            style={[
                                styles.competencyTag,
                                selectedCompetencies.includes(competency) && styles.selectedCompetencyTag
                            ]}
                            onPress={() => handleCompetencyToggle(competency)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[
                                    styles.competencyTagText,
                                    selectedCompetencies.includes(competency) && styles.selectedCompetencyTagText
                                ]}>
                                    {String(competency)}
                                </Text>
                                {selectedCompetencies.includes(competency) && (
                                    <Ionicons name="checkmark" size={14} color="#1e3a8a" style={{ marginLeft: 5 }} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.selectedCountText}>Sélectionné: {Array.isArray(selectedCompetencies) ? selectedCompetencies.length : 0} compétences</Text>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveModifications}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="save-outline" size={20} color="white" />
                            <Text style={styles.saveButtonText}> Enregistrer les modifications</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles remain unchanged
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#282c34' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#1e3a8a' },
    backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingRight: 10, width: 60 },
    headerTitlePage: { color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    rightSpacer: { width: 60 },
    scrollContent: { padding: 15, paddingBottom: 40 },
    errorMessage: { color: '#ef4444', textAlign: 'center', marginBottom: 10, fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b5998', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: 'white', fontSize: 16, paddingVertical: 12 },
    sectionTitleCompetencies: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
    subTextCompetencies: { color: '#a0aec0', fontSize: 14, marginBottom: 15 },
    competenciesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
    competencyTag: { backgroundColor: '#4a5568', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, margin: 5 },
    selectedCompetencyTag: { backgroundColor: 'white' },
    competencyTagText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
    selectedCompetencyTagText: { color: '#1e3a8a' },
    selectedCountText: { color: '#a0aec0', fontSize: 14, textAlign: 'right', marginBottom: 20 },
    saveButton: { backgroundColor: '#3b82f6', paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#a0aec0', marginTop: 10 },
});
