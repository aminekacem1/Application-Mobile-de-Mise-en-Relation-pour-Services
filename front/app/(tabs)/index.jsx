import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';

// La palette de couleurs
const COLORS = {
  background: '#F0F2F5', 
  text: '#0D254E',
  buttonPrimary: '#005A9C',
  buttonText: '#F0F2F5',
};

export default function Home() {
  const router = useRouter();

  // Les animations restent les mêmes
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const button1Scale = useRef(new Animated.Value(0.5)).current;
  const button1Opacity = useRef(new Animated.Value(0)).current;
  const button2Scale = useRef(new Animated.Value(0.5)).current;
  const button2Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.parallel([
          Animated.spring(button1Scale, { toValue: 1, friction: 6, useNativeDriver: true }),
          Animated.timing(button1Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(button2Scale, { toValue: 1, friction: 6, useNativeDriver: true }),
          Animated.timing(button2Opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ])
    ]).start();
  }, []);

  return (
    // Ce conteneur centre tout son contenu
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/logo.png')}
        style={[
          styles.logo,
          { 
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }
        ]} 
      />

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Connect with Trusted Technicians
      </Animated.Text>
      
      <View style={styles.buttonContainer}>
        <Animated.View style={{ opacity: button1Opacity, transform: [{ scale: button1Scale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/register')}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ opacity: button2Opacity, transform: [{ scale: button2Scale }] }}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

// StyleSheet mis à jour pour un centrage parfait
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend toute la hauteur de l'écran
    justifyContent: 'center', // **C'est la clé : aligne les enfants verticalement au centre**
    alignItems: 'center', // Aligne les enfants horizontalement au centre
    backgroundColor: COLORS.background,
    paddingHorizontal: 20, // On garde un padding horizontal pour les bords
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 15, // Espace ajusté
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 35, // Espace ajusté
  },
  buttonContainer: {
    width: '85%',
  },
  button: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});