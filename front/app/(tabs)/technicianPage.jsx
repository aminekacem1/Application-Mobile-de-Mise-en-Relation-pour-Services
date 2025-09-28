import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Header Component
const Header = ({ showBackButton = false, title = "Service App", showUserInfo = true }) => {
    const router = useRouter();
    return (
        <View style={styles.header}>
            {showBackButton ? (
                <TouchableOpacity onPress={() => router.replace('/login')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.headerTitle}>{String(title)}</Text>
            )}
            {showUserInfo && (
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Salut, {String('Utilisateur')} !</Text>
                    <View style={styles.userAvatar} />
                </View>
            )}
        </View>
    );
};

const TabNavigation = ({ activeTab, onSelectTab }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity
            style={[styles.tabButton, activeTab === 'open' && styles.activeTabButton]}
            onPress={() => onSelectTab('open')}
        >
            <Text style={[styles.tabButtonText, activeTab === 'open' && styles.activeTabButtonText]}>
                Emplois ouverts
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.tabButton, activeTab === 'my' && styles.activeTabButton]}
            onPress={() => onSelectTab('my')}
        >
            <Text style={[styles.tabButtonText, activeTab === 'my' && styles.activeTabButtonText]}>
                Mes emplois
            </Text>
        </TouchableOpacity>
    </View>
);

const JobCard = ({ job }) => (
    <View style={styles.jobCard}>
        <View style={styles.jobCardHeader}>
            <Text style={styles.jobTitle}>{String(job.title)}</Text>
            {job.status === 'open' && <Text style={styles.jobStatus}>Ouvert</Text>}
        </View>
        <Text style={styles.jobDescription}>{String(job.description)}</Text>
        <View style={styles.jobDetails}>
            <Text style={styles.jobDetailText}>📍 {String(job.location)}</Text>
            <Text style={styles.jobDetailText}>🗓️ {String(job.date)}</Text>
            <Text style={styles.jobDetailText}>💲 {String(job.price)}</Text>
        </View>
        <View style={styles.jobCardActions}>
            <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>💬 Contacter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>👁️ Détails</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const TechnicianPage = () => {
    const [activeTab, setActiveTab] = useState('open');

    const jobs = [
        { id: '1', title: 'Réparation moteur bateau', description: 'Le moteur du bateau fait un bruit anormal au démarrage. Diagnostic et réparation rapide.', location: 'Port El Kantaoui, Sousse', date: '13 Juin 2025', price: '250 DT', status: 'open' },
        { id: '2', title: 'Installation Climatiseur', description: 'Installation et mise en service d\'un système de climatisation split.', location: 'Lac 2, Tunis', date: '15 Juin 2025', price: '180 DT', status: 'open' },
        { id: '3', title: 'Rénovation Salle de Bain', description: 'Travaux de plomberie et carrelage pour une salle de bain complète.', location: 'Hammamet Sud, Nabeul', date: '20 Juin 2025', price: '900 DT', status: 'open' },
        { id: '4', title: 'Dépannage Électrique Maison', description: 'Diagnostic et réparation de panne électrique générale.', location: 'Ariana Ville, Ariana', date: '14 Juin 2025', price: '120 DT', status: 'open' },
    ];

    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'open') return job.status === 'open';
        if (activeTab === 'my') return job.status === 'assigned';
        return false;
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
            <Header showBackButton={true} title="Emplois" />

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Liste des emplois</Text>
                <TabNavigation activeTab={activeTab} onSelectTab={setActiveTab} />

                {activeTab === 'my' && filteredJobs.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="clipboard-outline" size={80} color="#a0aec0" />
                        <Text style={styles.emptyStateText}>{String('Aucun emploi ne vous est assigné')}</Text>
                        <Text style={styles.emptyStateSubText}>{String('Revenez plus tard pour de nouveaux emplois')}</Text>
                    </View>
                ) : (
                    filteredJobs.map(job => <JobCard key={String(job.id)} job={job} />)
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#282c34' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1e3a8a' },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    userName: { color: 'white', fontSize: 18, marginRight: 10 },
    userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#a0aec0' },
    backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingRight: 10 },
    backButtonText: { color: 'white', fontSize: 16, marginLeft: 5 },
    content: { flex: 1, padding: 15 },
    sectionTitle: { color: '#a0aec0', fontSize: 16, marginBottom: 10 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#3b5998', borderRadius: 10, marginBottom: 20, padding: 5 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    activeTabButton: { backgroundColor: 'white' },
    tabButtonText: { color: 'white', fontWeight: 'bold' },
    activeTabButtonText: { color: '#1e3a8a' },
    jobCard: { backgroundColor: '#3b5998', borderRadius: 10, padding: 15, marginBottom: 15 },
    jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    jobTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    jobStatus: { backgroundColor: '#22c55e', color: 'white', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, fontSize: 12, fontWeight: 'bold' },
    jobDescription: { color: '#a0aec0', marginBottom: 10 },
    jobDetails: { marginBottom: 15 },
    jobDetailText: { color: '#cbd5e0', marginBottom: 5 },
    jobCardActions: { flexDirection: 'row', justifyContent: 'space-around' },
    messageButton: { backgroundColor: '#3b82f6', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    messageButtonText: { color: 'white', fontWeight: 'bold' },
    detailsButton: { backgroundColor: '#6366f1', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    detailsButtonText: { color: 'white', fontWeight: 'bold' },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
    emptyStateText: { color: '#a0aec0', fontSize: 18, marginTop: 20, fontWeight: 'bold' },
    emptyStateSubText: { color: '#a0aec0', fontSize: 14, marginTop: 5, textAlign: 'center' },
});

export default TechnicianPage;
