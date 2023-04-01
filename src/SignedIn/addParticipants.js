import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { db } from '../firebase';
import { collection, getDocs, onSnapshot, setDoc,  } from 'firebase/firestore';
import AddMembersScreen from './addMembersScreen';
import HandleAddMembers from './addMembersScreen';
import { async } from '@firebase/util';

const AddParticipantsScreen = ({ navigation, route }) => {
  const [contacts, setContacts] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
const [filteredContacts,setFilteredContacts] = useState([])
  const id = route.params.id;
  useEffect(() => {
    async function fetchData () {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data;
          setContacts(contact)
        }
        console.log('contacts fetched')
      }
    }
    fetchData()

    const unsubscribe = () =>{
      onSnapshot(collection(db, 'Users'), (snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
        
          users.push({ id: doc.id, ...doc.data() });
        });
        setRegisteredUsers(users);
      });

    }
    
unsubscribe()
    return()=> fetchData()
  }, []);

  


  
  

  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Add Participants</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#0782f9" />
        </TouchableOpacity>
      </View>

     {
      registeredUsers
      .filter((val)=>{
  if(contacts == []){
    return val
  } else {
    let x =[] ;
    contacts.forEach(function (item){

     if(item.mobile === val.mobile){
     x.push(val)
     } 

    })
    return x
  }
      })
      .map((val, key) => (
        
          <TouchableOpacity key={key} style={styles.contactList}
          onPress={()=>HandleAddMembers({mobile:val.mobile,id:id})}>
            <Text style={{fontSize:20}}>{val.name}</Text>
            <Text>{val.mobile}</Text>
          </TouchableOpacity>
        
      ))
     }

      {/* <FlatList
        data={registeredUsers}
        keyExtractor={(item) => item.userUID}
        renderItem={renderItem}
        contentContainerStyle={styles.body}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingTop: 25,
    paddingLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 10,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
contactList:{
  display:'flex',
  alignItems:'center',
  backgroundColor:'#7BE3DD',
  marginBottom:10
}
});

export default AddParticipantsScreen;
