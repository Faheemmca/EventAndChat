import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth, db } from '../firebase'
import { useState, useEffect } from 'react'
import { color } from 'react-native-reanimated'
import * as ImagePicker from 'expo-image-picker'
import { onSnapshot,doc, getDoc, updateDoc } from 'firebase/firestore'

export default Profile = ({navigation, route}) => {
  
  const userId = auth.currentUser.uid
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
        console.log(userDoc.data())
      } else {
        console.log('User does not exist');
      }
    };
  
    fetchUser();
    return () => fetchUser()
  }, [userId])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3,4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // set the uri field in user data if it does not exist
      
      if (user) {
        console.log('this is uri',result.assets[0].uri)
     await   updateDoc(doc(db, 'Users', userId), { uri: result.assets[0].uri });

      }
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth.currentUser) {
        console.log('user signed out', auth.currentUser.email);
        await AsyncStorage.setItem('email','')
        await AsyncStorage.setItem('password','')
        await auth.signOut();
      }
    }
    catch(error) {
      alert(error.message)
    } 
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>

      <TouchableOpacity style={styles.selctImagebutton} onPress={pickImage}>
        <View style={styles.photo}>
          <Image source={{ uri: image || ((user && user.uri) && user.uri) }} style={styles.avatar}
          onLoad ={() => {
            if(!user || !user.uri){
              console.log('there is no image')
            }
          }}
          />
          <Text style={{ color: '#0782f9' }}>
  {image || (user && user.uri) ? 'Edit picture' : 'Select a picture'}
</Text>

        </View>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.description}>Mobile: {user?.mobile}</Text>
        <Text style={styles.description}>Email: {user?.email}</Text>
        <Text style={styles.description}>Education: {user?.education}</Text>
        <Text style={styles.description}>City: {user?.city}</Text>


        <TouchableOpacity >
          <Text style={styles.signOut}
          onPress ={()=>navigation.navigate('Editprofile',{user:user})}
          >Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    header: {
      backgroundColor: '#00BFFF',
      height: 200,
      display:'flex',
      alignItems:'center'
    },
    signOut:{
    marginTop:30,
    fontSize:15,
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:'#00BFFF',
borderRadius:10
    },
   
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: 'white',
      marginBottom: 10,
      alignSelf: 'center',
     
      
    },
   
    name: {
      fontSize: 28,
      color: 'black',
      fontWeight: '600',
      marginTop:50
    },
    body: {
      marginTop: 60,
      alignItems:'center'
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding: 30,
    },
    info: {
      fontSize: 16,
      color: '#00BFFF',
      marginTop: 10,
    },
    description: {
      fontSize: 16,
      color: '#696969',
      marginTop: 10,
      textAlign: 'center',
    },
    buttonContainer: {
      marginTop: 10,
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      width: 250,
      borderRadius: 30,
      backgroundColor: '#00BFFF',
    },
    photo:{
      display:'flex',
      width:'100%',
      alignItems:'center'
    },
    selctImagebutton:{
      display:'flex',
      position:'absolute',
      marginTop:130,
      alignItems:'center',
      width:'100%',
      

    },
  });