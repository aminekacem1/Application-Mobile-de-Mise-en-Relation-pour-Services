import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'; // Importez Animated
import { useRouter } from 'expo-router';

// Définition des couleurs pour une réutilisation facile
const COLORS = {
  primary: '#4A0D66',
  secondary: '#F88F4E',
};

export default function Home() {
  const router = useRouter();

  // On utilise useRef pour garder les valeurs d'animation sans re-déclencher de rendu
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Valeur initiale pour la taille (commence à 50%)
  const opacityAnim = useRef(new Animated.Value(0)).current;   // Valeur initiale pour l'opacité (commence invisible)

  // useEffect se lance une seule fois au chargement du composant
  useEffect(() => {
    // Animated.timing permet de créer une animation basée sur le temps
    Animated.parallel([
      // Animation pour la taille
      Animated.timing(scaleAnim, {
        toValue: 1, // La valeur finale de l'échelle (100%)
        duration: 1000, // Durée de l'animation en millisecondes
        useNativeDriver: true, // Améliore les performances
      }),
      // Animation pour l'opacité
      Animated.timing(opacityAnim, {
        toValue: 1, // La valeur finale de l'opacité (complètement visible)
        duration: 1200, // Un peu plus long pour un effet plus doux
        useNativeDriver: true,
      })
    ]).start(); // Démarre les animations en parallèle
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      {/* 
        On utilise Animated.Image au lieu de Image.
        Le style de transformation (transform) applique l'animation de taille.
        Le style d'opacité (opacity) applique l'animation de fondu.
      */}
      <Animated.Image 
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim 
          }
        ]} 
      />

      <Text style={styles.tagline}>Connect with Trusted Technicians</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// StyleSheet mis à jour
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  logo: {
    // TAILLE AUGMENTÉE
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});