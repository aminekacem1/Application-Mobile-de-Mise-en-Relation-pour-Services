import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

// --- Palette de Couleurs ---
const COULEURS = {
  brandBlue: '#0D47A1',
  lightBg: '#F0F0F0',
  white: '#FFFFFF',
  gray: '#6C757D',
  darkGray: '#343A40',
  lightGray: '#CED4DA',
  userBubble: '#F39C12',
  technicianBubble: '#FFFFFF',
  sendButton: '#E67E22',
};

// --- Barre de Navigation du Bas ---
const BarreDeNavigation = () => {
  const router = useRouter();

};

// --- Composant Principal de la Page de Chat ---
export default function PageDeChat() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const nomBrut = params.name || 'Technicien';
  const nomTechnicien = String(nomBrut).split(' (')[0];
  const technicienId = params.technicianId;

  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const scrollViewRef = useRef();

  // Function to send a message
  const gererEnvoi = () => {
    if (nouveauMessage.trim() === '') return;
    const messageUtilisateur = {
      id: messages.length + 1,
      texte: nouveauMessage,
      timestamp: new Date(),
      emetteur: 'user',
    };
    setMessages(prev => [...prev, messageUtilisateur]);
    setNouveauMessage('');

    if (scrollViewRef.current) {
      setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
    }

    // Simulate technician response
    setTimeout(() => {
      const reponseTechnicien = {
        id: messages.length + 2,
        texte: "Bien reçu ! Je regarde ça tout de suite.",
        timestamp: new Date(),
        emetteur: 'technician',
      };
      setMessages(prev => [...prev, reponseTechnicien]);
      if (scrollViewRef.current) {
        setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
      }
    }, 1500);
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <StatusBar barStyle="light-content" backgroundColor={COULEURS.brandBlue} />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
       <TouchableOpacity onPress={() => router.back()} style={styles.boutonRetour}>
  <Icon name="arrow-left" size={20} color={COULEURS.white} />
</TouchableOpacity>

        <Text style={styles.headerTitre}>Discuter avec {nomTechnicien}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContentContainer}>
          {messages.length === 0 ? (
            <Text style={styles.texteConversationVide}>Démarrez la conversation !</Text>
          ) : (
            messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.bulleMessage,
                  msg.emetteur === 'user' ? styles.bulleUtilisateur : styles.bulleTechnicien,
                ]}
              >
                <Text
                  style={msg.emetteur === 'user' ? styles.texteUtilisateur : styles.texteTechnicien}
                >
                  {msg.texte}
                </Text>
                <Text style={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputAreaContainer}>
          <TouchableOpacity
            style={styles.boutonSignaler}
            onPress={() =>
              Alert.alert('Signalement', 'Êtes-vous sûr de vouloir signaler ce contact ?')
            }
          >
            <Text style={styles.texteBoutonSignaler}>Signaler un message inapproprié</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Écrire un message..."
              placeholderTextColor={COULEURS.gray}
              value={nouveauMessage}
              onChangeText={setNouveauMessage}
              multiline
            />
            <TouchableOpacity style={styles.boutonEnvoyer} onPress={gererEnvoi}>
              <Text style={styles.texteBoutonEnvoyer}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Nav */}
      <View style={[styles.navBarWrapper, { paddingBottom: insets.bottom }]}>
        <BarreDeNavigation />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  fullScreenWrapper: { flex: 1, backgroundColor: COULEURS.white },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COULEURS.brandBlue,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitre: { color: COULEURS.white, fontSize: 20, fontWeight: 'bold' },
  boutonRetour: { padding: 5 },

  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: COULEURS.lightBg,
  },
  messagesContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  texteConversationVide: { textAlign: 'center', color: COULEURS.gray, marginTop: 50, fontSize: 16 },
  bulleMessage: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  bulleUtilisateur: { backgroundColor: COULEURS.userBubble, alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  bulleTechnicien: {
    backgroundColor: COULEURS.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  texteUtilisateur: { color: COULEURS.white, fontSize: 16 },
  texteTechnicien: { color: COULEURS.darkGray, fontSize: 16 },
  timestamp: { fontSize: 10, color: COULEURS.lightGray, alignSelf: 'flex-end', marginTop: 5 },

  inputAreaContainer: { paddingHorizontal: 10, paddingTop: 10, backgroundColor: COULEURS.lightBg },
  boutonSignaler: {
    alignSelf: 'center',
    backgroundColor: COULEURS.userBubble,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  texteBoutonSignaler: { color: COULEURS.white, fontSize: 12, fontWeight: 'bold' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COULEURS.white,
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 5,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COULEURS.lightGray,
  },
  textInput: { flex: 1, fontSize: 16, color: COULEURS.darkGray, maxHeight: 100 },
  boutonEnvoyer: {
    backgroundColor: COULEURS.sendButton,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  texteBoutonEnvoyer: { color: COULEURS.white, fontWeight: 'bold' },

  navBarWrapper: { backgroundColor: COULEURS.white },
  navBarContent: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COULEURS.white,
    borderTopWidth: 1,
    borderTopColor: COULEURS.lightGray,
  },
  navBarButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navBarText: { color: COULEURS.gray, fontWeight: '500', fontSize: 12, marginTop: 4 },
});
