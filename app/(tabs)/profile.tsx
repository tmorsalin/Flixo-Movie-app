import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export default function ProfileScreen() {
  const [username, setUsername] = useState<string>('Your Name');
  const [bio, setBio] = useState<string>('Your bio goes here...');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);

  const pickImage = async () => {
    // ❌ Prevent crash on web
    if (Platform.OS === 'web') {
      alert("Image picking doesn't work on web.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    // TODO: Implement login/logout system
    console.log('Logged Out');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#111' : '#fff' },
      ]}
    >
      {/* PROFILE IMAGE */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require('../../assets/images/default-avatar.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* USERNAME */}
      <TextInput
        style={[styles.input, { color: darkMode ? '#fff' : '#000' }]}
        value={username}
        onChangeText={setUsername}
      />

      {/* BIO */}
      <TextInput
        style={[styles.textArea, { color: darkMode ? '#fff' : '#000' }]}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* DARK MODE */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* NOTIFICATIONS */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>
          Notifications
        </Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* WATCHLIST BUTTON */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>My Favorites / Watchlist</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e63946' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    borderBottomWidth: 1,
    fontSize: 18,
    marginBottom: 15,
  },
  textArea: {
    width: '90%',
    borderWidth: 1,
    padding: 10,
    height: 80,
    marginBottom: 20,
  },
  section: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
  },
  button: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#6200ee',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});