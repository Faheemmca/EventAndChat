import { doc, updateDoc } from 'firebase/firestore';
import { View,ActivityIndicator, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { db } from '../firebase';
import Loading from '../components/Loading';

export default EditProfile = ({ route, navigation }) => {
    const [loading, setLoading] = useState(false)

  const { user } = route.params;
  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile);
  const [education, setEducation] = useState(user.education);
  const [city, setCity] = useState(user.city);

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateDoc(doc(db, 'Users', user.userUID), {
       name: name,
       mobile: mobile,
       education: education,
       city: city,
      });
      navigation.goBack();
      setLoading(false)
    } catch (error) {
        setLoading(false)
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text> Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
    <Text> Mobile:</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
      />
    <Text> Education:</Text>

      <TextInput
        style={styles.input}
        placeholder="Education"
        value={education}
        onChangeText={setEducation}
      />
    <Text> City:</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      
      </View>
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity  onPress={handleSave}>
        <Text style={styles.button}>Save</Text>
      </TouchableOpacity>
      </View>
     
      
    </View>
  );
};

const styles= StyleSheet.create({
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderRadius: 10,
        marginBottom: 20,
        paddingVertical:5,
        marginTop:5

      },
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:40
      },
      inputContainer: {
        width: '80%',
        
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
        color:'white'
      },
})