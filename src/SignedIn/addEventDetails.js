 import { View,ScrollView, Text, TextInput,StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React,{useState, useEffect} from 'react'
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import HomeScreen from './EventListScreen';

const AddEventDetails = ({navigation , route}) => {

  const [loading, setLoading] = useState(false);
  const { id,  event } = route.params || {};


  useEffect(() => {
    
    if (id) {
      setState({
        title: event.Title,
        date: event.Date,
        venue: event.Venue,
        cheifGuest: event.CheifGuest,
        description: event.Description
      });
      console.log(title)

    } else  {
      console.log('id is empty in addEvent...');
    }
  }, []);

  const [state, setState] = useState({
    id: id ? id : '',
    title: event ? event.Title : '',
    date: event ? event.Date : '',
    venue: event ? event.Venue : '',
    cheifGuest: event ? event.CheifGuest : '',
    description: event ? event.Description : ''
  });

  const { title, date, venue, cheifGuest, description } = state;

  const handleChange = (text, id) => {
    setState({
      ...state,
      [id]: text,
    });
  };

  // const updateUser = async() => {
  //   setLoading(true);
  //   const useremail = auth.currentUser.email
  //   const docID = event.id;
  //   console.log(useremail, docID)
  //  await updateDoc(doc(db, useremail, docID),{
  //     Title: title,
  //     Date: date,
  //     Venue: venue,
  //     CheifGuest: cheifGuest,
  //     Description: description
  //   }).then(() => {
  //     setState({
  //       id: '',
  //       title: '',
  //       date: '',
  //       venue: '',
  //       cheifGuest: '',
  //       description: ''
  //     })
  //     setLoading(false);
  //     navigation.navigate('HomeScreen');
  //     console.log('doc updated',docID)
  //   })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //       setLoading(false);
  //     });
  // };

  const handlecreateDoc = async () => {
    try {
      const UserID = auth.currentUser.uid
      setLoading(true);
     

   const groupRef =   await addDoc(collection(db,'Groups'),{
        createdAt: new Date().getTime(),
        createdBy: auth.currentUser.email,
        groupName: title,
        date:date,
        member:[],
        venue:venue,
        description:description,
      })
     

      await updateDoc(doc(db,'Users', UserID),{
        groups: arrayUnion(groupRef.id)
      })

      
      const docRef = doc(db, 'Messages',);
      const newDocRef = await addDoc(docRef, {
        name: title,
        latestMessage: {
          text: `You have joined the room ${title}.`,
          createdAt: new Date().getTime()
        }
      });
      const messagesRef = collection(newDocRef, 'messages');
      await addDoc(messagesRef, {
        text: `You have joined the room ${title}.`,
        createdAt: new Date().getTime(),
        system: true
      });
      



      console.log("Document written with ID: ", groupRef.id);
    } catch (e) {
      setLoading(false);
      console.error("Error adding document: ", e);
    }

  };



  const handleAddEvent = async () => {
    setLoading(true);

    if (id) {
      await updateUser();
    } else {
      await handlecreateDoc();
    }
    setLoading(false);

    navigation.navigate('HomeScreen');
  };




  if(loading){
    return(
      <View style={styles.container}>
      <ActivityIndicator size="large" color="0000ff" />
     </View>
    )
  }


  return (
    <ScrollView >
        <View style={styles.container}>
        <View style={styles.inputContainer}> 
 <Text>Event Title:</Text>
 <TextInput 
 placeholder='Event Title'
 value={title}
 onChangeText={text =>handleChange(text, 'title')}
 style={styles.input}
 />

  <Text>Date:</Text>
  <TextInput 
 placeholder='Date'
 value={date}
 onChangeText={text =>handleChange(text, 'date')}

 style={styles.input}
 />

  <Text>Venue:</Text>
  <TextInput 
 placeholder='Venue'
 value={venue}
 onChangeText={text =>handleChange(text, 'venue')}

 style={styles.input}
 />

  <Text>Cheif Guest:</Text>
  <TextInput 
 placeholder='Cheif Guest'
 value={cheifGuest}
 onChangeText={text =>handleChange(text, 'cheifGuest')}

 style={styles.input}
 />

<Text>Description:</Text>
 <TextInput 
 placeholder='Description'
 value={description}
 onChangeText={text =>handleChange(text, 'description')}

 style={styles.input}
 multiline
 />
 </View>
 <View>
    <TouchableOpacity 
    onPress={handleAddEvent}
    >
        <Text style={styles.button}>
            Add Event
        </Text>
    </TouchableOpacity>
 </View>
        </View>
 
    </ScrollView>
  )
}

export default AddEventDetails

const styles = StyleSheet.create({
    container:{
flex:1,
marginTop:30,
justifyContent:'center',
alignItems:'center'
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
        marginBottom:15
      },
      button:{
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        color:'white',
        marginTop:20,
        alignItems: 'center',
      }
})