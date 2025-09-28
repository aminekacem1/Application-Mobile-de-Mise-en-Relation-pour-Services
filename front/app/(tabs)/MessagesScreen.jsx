// front/app/(tabs)/MessagesScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your actual backend API URL
const API_BASE_URL = 'http://192.168.1.8:5000/api'; // CONFIRM THIS IS YOUR PC'S LOCAL IP

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
                <Text style={styles.headerTitle}>{title}</Text>
            )}
            {showUserInfo && (
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Hi, User!</Text>
                    <View style={styles.userAvatar} />
                </View>
            )}
        </View>
    );
};

const UserListItem = ({ user }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/IndividualChatScreen',
            params: {
                userId: user._id,
                userName: user.name,
                userEmail: user.email,
                // profession: user.profession // You can pass profession if needed on chat screen
            },
        });
    };

    return (
        <TouchableOpacity style={styles.userItem} onPress={handlePress}>
            <View style={styles.userInfoText}>
                <Text style={styles.userNameItem}>{user.name}</Text>
                <Text style={styles.userEmailItem}>{user.email}</Text>
                {user.profession && user.profession.length > 0 && ( // Ensure profession is an array with content
                    <Text style={styles.userProfessionItem}>Profession: {Array.isArray(user.profession) ? user.profession.join(', ') : user.profession}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const MessagesScreen = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            setError(null);
            try {
                // If your backend /auth/clients route requires a token, uncomment below:
                // const token = await AsyncStorage.getItem('userToken');
                // const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await axios.get(`${API_BASE_URL}/auth/clients` /* , { headers } */);
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (err) {
                console.error('Failed to fetch clients (FRONTEND):', err.response?.data || err.message);
                setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(lowerCaseQuery) ||
                user.email.toLowerCase().includes(lowerCaseQuery) ||
                (Array.isArray(user.profession) && user.profession.some(p => p.toLowerCase().includes(lowerCaseQuery)))
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
                <Header showBackButton={false} title="Messages" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
                <Header showBackButton={false} title="Messages" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => { /* Implement full retry logic here if needed */ }}>
                        <Text style={styles.retryButton}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
            <Header showBackButton={false} title="Messages" />

            <View style={styles.content}>
                <Text style={styles.pageTitle}>Messages</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#a0aec0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher des utilisateurs par nom ou email..."
                        placeholderTextColor="#a0aec0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView>
                    {filteredUsers.length === 0 && searchQuery !== '' ? (
                         <View style={styles.emptySearchContainer}>
                            <Ionicons name="people-outline" size={80} color="#a0aec0" />
                            <Text style={styles.emptySearchText}>Aucun utilisateur trouvé</Text>
                        </View>
                    ) : (
                        filteredUsers.map(user => (
                            <UserListItem key={user._id} user={user} />
                        ))
                    )}
                    {filteredUsers.length === 0 && searchQuery === '' && (
                         <View style={styles.emptySearchContainer}>
                            <Ionicons name="people-outline" size={80} color="#a0aec0" />
                            <Text style={styles.emptySearchText}>Aucun utilisateur client enregistré</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282c34',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#1e3a8a',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#a0aec0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingRight: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    pageTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    userInfoText: {
        flex: 1,
    },
    userNameItem: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmailItem: {
        color: '#a0aec0',
        fontSize: 14,
    },
    userProfessionItem: {
        color: '#cbd5e0',
        fontSize: 12,
        marginTop: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#a0aec0',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptySearchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptySearchText: {
        color: '#a0aec0',
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
    },
});

export default MessagesScreen;