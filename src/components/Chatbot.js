import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Modal, 
  StyleSheet,
  Image,
  Platform,
  useWindowDimensions 
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import LoadingComponent from './admin/components/LoadingComponent';

const ChatAssistant = () => {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width > 500;

  // Responsive sizing
  const responsiveSizes = {
    modalWidth: isLargeScreen ? 400 : isSmallScreen ? width - 40 : 360,
    modalHeight: height * 0.6,
    inputHeight: Platform.OS === 'ios' ? 48 : 44,
    avatarSize: isSmallScreen ? 32 : 40,
    fontSize: isSmallScreen ? 13 : 14,
    iconSize: isSmallScreen ? 18 : 20
  };

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const scrollViewRef = useRef();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: height * 0.03,
      right: width * 0.05,
      zIndex: 20,
    },
    floatingButton: {
      width: responsiveSizes.avatarSize * 1.4,
      height: responsiveSizes.avatarSize * 1.4,
      borderRadius: responsiveSizes.avatarSize * 0.7,
      backgroundColor: '#1166ee',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    listeningButton: {
      backgroundColor: '#ef4444',
    },
    modalContainer: {
      position: 'absolute',
      bottom: height * 0.1,
      right: width * 0.05,
      width: responsiveSizes.modalWidth,
      height: responsiveSizes.modalHeight,
      maxHeight: height * 0.7,
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
      overflow: 'hidden',
    },
    modalHeader: {
      padding: 16,
      backgroundColor: '#1166ee',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerButton: {
      padding: 4,
      borderRadius: 20,
    },
    chatContainer: {
      flex: 1,
      backgroundColor: '#f9fafb',
    },
    chatContent: {
      padding: 16,
    },
    messageWrapper: {
      marginBottom: 16,
    },
    userWrapper: {
      alignItems: 'flex-end',
    },
    botWrapper: {
      alignItems: 'flex-start',
    },
    messageContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      maxWidth: '80%',
      gap: 8,
    },
    userContent: {
      flexDirection: 'row-reverse',
    },
    botContent: {
      flexDirection: 'row',
    },
    avatar: {
      width: responsiveSizes.avatarSize,
      height: responsiveSizes.avatarSize,
      borderRadius: responsiveSizes.avatarSize / 2,
    },
    userAvatar: {
      backgroundColor: '#1166ee',
    },
    botAvatar: {
      backgroundColor: 'transparent',
    },
    botImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    botImageSmall: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    userBubble: {
      backgroundColor: '#1166ee',
      borderTopRightRadius: 0,
    },
    botBubble: {
      backgroundColor: 'white',
      borderTopLeftRadius: 0,
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    userText: {
      color: 'white',
      fontSize: responsiveSizes.fontSize,
    },
    botText: {
      color: '#1f2937',
      fontSize: responsiveSizes.fontSize,
    },
    loadingWrapper: {
      marginBottom: 16,
      alignItems: 'flex-start',
    },
    loadingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    loadingBubble: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    spinner: {
      transform: [{ rotate: '0deg' }],
    },
    loadingText: {
      fontSize: 14,
      color: '#1f2937',
    },
    inputContainer: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      backgroundColor: 'white',
    },
    inputWrapper: {
      position: 'relative',
    },
    textInput: {
      width: '100%',
      height: responsiveSizes.inputHeight,
      paddingLeft: 16,
      paddingRight: responsiveSizes.avatarSize * 2,
      borderRadius: responsiveSizes.inputHeight / 2,
      borderWidth: 1,
      borderColor: '#d1d5db',
      fontSize: responsiveSizes.fontSize,
    },
    actionButtons: {
      position: 'absolute',
      right: 8,
      top: '50%',
      transform: [{ translateY: -12 }],
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    normalActionButton: {
      backgroundColor: '#1166ee',
    },
    listeningActionButton: {
      backgroundColor: '#ef4444',
    },
    sendButton: {
      backgroundColor: '#1166ee',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  // Welcome message
  useEffect(() => {
    if (isModalOpen && messages.length === 0) {
      addBotMessage("How can I help you today?");
    }
  }, [isModalOpen]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      stopVoiceInput();
    }
  };

  const clearAllMessages = () => {
    stopVoiceInput();
    setMessages([]);
    addBotMessage("How can I help you today?");
  };

  const addBotMessage = (text) => {
    const newMessage = {
      sender: 'bot',
      text: text,
      isTyping: false,
      displayText: '',
    };
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
    typeMessage(newMessage);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Voice Input Functions
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsListening(false);
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    
    if (userInput.trim()) {
      sendMessage();
    }
  };

  const stopVoiceInput = () => {
    if (isListening) {
      stopRecording();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startRecording();
    }
  };

  // Message Display Functions
  const typeMessage = (message) => {
    setMessages(prev => prev.map(msg => 
      msg === message 
        ? { ...msg, displayText: message.text, isTyping: false }
        : msg
    ));
    scrollToBottom();
  };

  // Message Sending
  const sendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    try {
      setIsLoading(true);
      stopVoiceInput();

      // Add user message
      const userMessage = {
        sender: 'user',
        text: userInput,
        isTyping: false,
      };
      setMessages(prev => [...prev, userMessage]);
      setUserInput('');
      scrollToBottom();

      const response = await axios.post('/chat', {
        message: userInput,
        language: 'en-US',
      });

      const botResponse = response.data.reply;
      addBotMessage(botResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage("Sorry, I couldn't process your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Button */}
      <TouchableOpacity
        style={[styles.floatingButton, isListening && styles.listeningButton]}
        onPress={toggleModal}
        accessibilityLabel="Open chat"
      >
        <Ionicons
          name={isModalOpen ? 'close' : 'chatbubble'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Virtual Assistant</Text>
            
            <View style={styles.headerButtons}>
              {/* Clear Chat */}
              <TouchableOpacity
                onPress={clearAllMessages}
                style={styles.headerButton}
                disabled={messages.length === 0}
                accessibilityLabel="Clear chat"
              >
                <Ionicons
                  name="reload"
                  size={20}
                  color="white"
                  style={messages.length === 0 && styles.disabledIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat Display Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={scrollToBottom}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageWrapper,
                  message.sender === 'user' ? styles.userWrapper : styles.botWrapper
                ]}
              >
                <View style={[
                  styles.messageContent,
                  message.sender === 'user' ? styles.userContent : styles.botContent
                ]}>
                  {/* Avatar */}
                  <View style={[
                    styles.avatar,
                    message.sender === 'user' ? styles.userAvatar : styles.botAvatar
                  ]}>
                    {message.sender === 'user' ? (
                      <Image 
                        source={{ uri: 'https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833572.jpg' }} 
                        style={styles.botImage}
                      />
                    ) : (
                      <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8649/8649595.png' }} 
                        style={styles.botImage}
                      />
                    )}
                  </View>

                  {/* Message Bubble */}
                  <View style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.botBubble
                  ]}>
                    <Text style={message.sender === 'user' ? styles.userText : styles.botText}>
                      {message.displayText || message.text}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingWrapper}>
                <View style={styles.loadingContent}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8649/8649595.png' }}
                    style={styles.botImageSmall}
                  />
                  <View style={styles.loadingBubble}>
                    <LoadingComponent isActive={true} color='green'/>
                    <Text style={styles.loadingText}>Responding...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={userInput}
                onChangeText={setUserInput}
                onSubmitEditing={sendMessage}
                placeholder="Type your question..."
                placeholderTextColor="#999"
                editable={!isLoading}
                style={styles.textInput}
                accessibilityLabel="Type your question"
              />

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {/* Microphone Button */}
                <TouchableOpacity
                  onPress={toggleVoiceInput}
                  disabled={isLoading}
                  style={[
                    styles.actionButton,
                    isListening ? styles.listeningActionButton : styles.normalActionButton,
                    isLoading && styles.disabledButton
                  ]}
                  accessibilityLabel="Toggle voice input"
                >
                  <Ionicons
                    name={isListening ? 'mic-off' : 'mic'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>

                {/* Send Button */}
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={isLoading || !userInput.trim()}
                  style={[
                    styles.actionButton,
                    styles.sendButton,
                    (!userInput.trim() || isLoading) && styles.disabledButton
                  ]}
                  accessibilityLabel="Send message"
                >
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatAssistant;