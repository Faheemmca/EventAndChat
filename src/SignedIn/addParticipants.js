import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { db } from '../firebase';
import { collection, getDocs, onSnapshot, setDoc,  } from 'firebase/firestore';
import AddMembersScreen from './addMembersScreen';
import HandleAddMembers from './addMembersScreen';
import { async } from '@firebase/util';
import Loading from '../components/Loading';


const AddParticipantsScreen = ({ navigation, route }) => {
  const [contacts, setContacts] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
const [loading,setLoading] = useState(false)

  const id = route.params.id;
  console.log('in addParticipant',id)
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
        console.log('uri',users)
      });

    }
    
unsubscribe()
    return()=> fetchData()
  }, []);

  


  
  const handleItemPress = (item) => {
    // Check if the item is already in the selectedItems array
    const index = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id);
    if (index >= 0) {
      // If the item is already selected, remove it from the array
      setSelectedItems((prevItems) => prevItems.filter((selectedItem) => selectedItem.id !== item.id));
    } else {
      // If the item is not selected, add it to the array
      setSelectedItems((prevItems) => [...prevItems, item]);
    }
  };

  const isItemSelected = (item) => {
    return selectedItems.findIndex((selectedItem) => selectedItem.id === item.id) >= 0;
  };

  const handleAddMembers = async () => {
    try {
      setLoading(true);
      await HandleAddMembers({ selectedItems: selectedItems, id: id });
      setLoading(false);
      navigation.goBack({ id: id });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
if(loading){
  return <Loading />
}

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
        
          <TouchableOpacity key={key} style={[
            styles.contactList,
            isItemSelected(val) && { backgroundColor: '#F8D6CE' },
          ]}
          onPress={()=>handleItemPress(val)}>
            <View style={{display:'flex', flexDirection:'row',alignContent:'space-between'}}>

<View>
<Image source={{uri:val.uri}} style={styles.avatar}/>
</View>
            <View style={{alignItems:'center'}}>
            <Text style={{fontSize:20}}>{val.name}</Text>
            <Text>{val.mobile}</Text>
            </View>

            </View>
            
          </TouchableOpacity>
        
      ))
     }

      {
        selectedItems.length > 0 &&
        <View style={styles.checkmark}>
          <TouchableOpacity
          onPress={handleAddMembers}
          >
          <Ionicons name='checkmark-circle' size={50} color='green'  />
          </TouchableOpacity>
          </View>
      }
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
  alignItems:'center',
  backgroundColor:'#7BE3DD',
  marginBottom:10,
},
contactList:{
  alignItems:'center',
  backgroundColor:'#7BE3DD',
  marginBottom:10,
},
checkmark:{
  position:'absolute',
  bottom:50,
  right:30
},
avatar: {
  width: 50,
  height: 50,
  
  borderRadius: 63,
  borderWidth: 1,
  borderColor: 'white',
  marginBottom: 10,
  alignSelf: 'center',
 
},
});

export default AddParticipantsScreen;
