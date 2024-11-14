import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import Flag from 'react-native-flags'; // Import Flag component
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const translateText = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.1.17:8000/translate',  // Ensure this IP matches your backend server
        { text: inputText },
        { timeout: 10000 }  // 10 seconds timeout
      );
      console.log("Backend response:", response.data);
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating text:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3D5AFE', '#2196F3']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>🌍 English to German Translator</Text>

          {/* English Input Section */}
          <View style={styles.languageContainer}>
            <Flag code="GB" size={32} style={styles.flag} />
            <Text style={styles.languageLabel}>English</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your text here..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCount}>{inputText.length} / 200 characters</Text>

          {/* Translate Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={translateText}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Translate</Text>
            )}
          </TouchableOpacity>

          {/* German Translation Section */}
          {translatedText ? (
            <View style={styles.translationContainer}>
              <View style={styles.languageContainer}>
                <Flag code="DE" size={32} style={styles.flag} />
                <Text style={styles.languageLabel}>German</Text>
              </View>
              <Text style={styles.translatedText}>{translatedText}</Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  flag: {
    marginRight: 10,
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFFAA', // Semi-transparent background
    textAlignVertical: 'top',
    marginBottom: 10,
    color: '#333',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#FFF',
    fontSize: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFA726',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  translationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFFDD', // Light background
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  translatedText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
});
