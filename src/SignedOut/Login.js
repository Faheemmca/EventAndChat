import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect executed')
      const getValues = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        console.log('email',savedEmail)
     await signInWithEmailAndPassword(auth, savedEmail, savedPassword)
     .catch(e=>console.log('in useEffect',e))   
     setLoading(false)
   } else {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
    getValues();
  }, []);

  const handleLogin = async() => {
    setLoading(true);

  await  signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error in handleLogin',errorCode, errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveValues = async () => {
    if (email && password) {
      try {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        console.log('saved Email: ', email, 'saved Password:', password);
      } catch (e) {
        console.error(e);
      }
    }
    handleLogin();
  };



  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={saveValues}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.register}>New user? Register here.</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  register:{
    color:'#0782F9',
    marginTop:10
  }
})