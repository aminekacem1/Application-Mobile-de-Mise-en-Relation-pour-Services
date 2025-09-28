// front/app/IndividualChatScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, TextInput, StatusBar,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Header Component for the chat screen
const ChatHeader = ({ userName, onBackPress }) => (
    <View style={individualChatStyles.header}>
        <TouchableOpacity onPress={onBackPress} style={individualChatStyles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={individualChatStyles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <View style={individualChatStyles.chatUserInfo}>
            <Text style={individualChatStyles.chatUserName}>{userName ? String(userName) : 'Utilisateur'}</Text>
        </View>
        <View style={{ width: 40 }} />
    </View>
);

// Message Bubble Component
const MessageBubble = ({ message, isCurrentUser }) => {
    if (!message || !message.text) return null; // Guard against invalid message
    return (
        <View style={[
            individualChatStyles.messageBubbleContainer,
            isCurrentUser ? individualChatStyles.currentUserMessageContainer : individualChatStyles.otherUserMessageContainer
        ]}>
            <View style={[
                individualChatStyles.messageBubble,
                isCurrentUser ? individualChatStyles.currentUserMessage : individualChatStyles.otherUserMessage
            ]}>
                <Text style={individualChatStyles.messageText}>{String(message.text)}</Text>
                <Text style={individualChatStyles.messageTimestamp}>{message.timestamp ? String(message.timestamp) : ''}</Text>
            </View>
        </View>
    );
};

const IndividualChatScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { userId, userName } = params;

    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);

    const scrollViewRef = useRef();

    const currentUserId = 'currentUser';
    const otherUserId = userId || 'unknownUser';

    const getCurrentTimestamp = () => {
        return new Date().toLocaleString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            const userMessage = {
                id: String(Date.now()),
                text: messageInput.trim(),
                timestamp: getCurrentTimestamp(),
                senderId: currentUserId,
            };
            setMessages(prev => [...prev, userMessage]);
            setMessageInput('');

            setTimeout(() => {
                const responseMessage = {
                    id: String(Date.now() + 1),
                    text: "Je vais bien, merci! Comment puis-je vous aider?",
                    timestamp: getCurrentTimestamp(),
                    senderId: otherUserId,
                };
                setMessages(prev => [...prev, responseMessage]);
            }, 1500);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    if (!userName) {
        return (
            <SafeAreaView style={individualChatStyles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
                <View style={individualChatStyles.errorContainer}>
                    <Text style={individualChatStyles.errorText}>Utilisateur non trouvé pour la conversation.</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={individualChatStyles.retryButton}>Retour aux messages</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={individualChatStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
            <ChatHeader userName={userName} onBackPress={() => router.back()} />

            <KeyboardAvoidingView
                style={individualChatStyles.keyboardAvoidingContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={individualChatStyles.chatContent}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map(message => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.senderId === currentUserId}
                        />
                    ))}
                </ScrollView>

                <View style={individualChatStyles.messageInputContainer}>
                    <TextInput
                        style={individualChatStyles.messageInput}
                        placeholder="how are you"
                        placeholderTextColor="#a0aec0"
                        value={messageInput}
                        onChangeText={setMessageInput}
                        multiline={true}
                    />
                    <TouchableOpacity onPress={sendMessage} style={individualChatStyles.sendButton}>
                        <Ionicons name="send" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// --- Styles (unchanged) ---
const individualChatStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#282c34' },
    keyboardAvoidingContainer: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#1e3a8a' },
    backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingRight: 10 },
    backButtonText: { color: 'white', fontSize: 16, marginLeft: 5 },
    chatUserInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', marginLeft: -40 },
    chatUserName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    chatContent: { flexGrow: 1, paddingVertical: 10, paddingHorizontal: 15, justifyContent: 'flex-end' },
    messageBubbleContainer: { flexDirection: 'row', marginVertical: 5 },
    currentUserMessageContainer: { justifyContent: 'flex-end' },
    otherUserMessageContainer: { justifyContent: 'flex-start' },
    messageBubble: { maxWidth: '75%', padding: 10, borderRadius: 15, position: 'relative' },
    currentUserMessage: { backgroundColor: '#3b82f6', alignSelf: 'flex-end' },
    otherUserMessage: { backgroundColor: '#3b5998', alignSelf: 'flex-start' },
    messageText: { color: 'white', fontSize: 15, marginBottom: 5 },
    messageTimestamp: { color: 'rgba(255,255,255,0.7)', fontSize: 10, alignSelf: 'flex-end' },
    messageInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#1e3a8a', borderTopWidth: 1, borderTopColor: '#4a5568' },
    messageInput: { flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: '#3b5998', borderRadius: 20, color: 'white', paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16 },
    sendButton: { backgroundColor: '#3b82f6', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center', marginBottom: 15 },
    retryButton: { color: '#3b82f6', fontSize: 16, fontWeight: 'bold' },
});

export default IndividualChatScreen;
