 import { View,ScrollView, Text, TextInput,StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React,{useState, useEffect} from 'react'
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import HomeScreen from './EventListScreen';
import Loading from '../components/Loading';
import { async } from '@firebase/util';

const AddEventDetails = ({navigation , route}) => {

  const [loading, setLoading] = useState(false);
  const { groupid,  event } = route.params || {};


  useEffect(() => {
    
    if (groupid) {
      setState({
        title: event.groupName,
        date: event.date,
        venue: event.venue,
        cheifGuest: event.cheifGuest,
        description: event.description
      });
      console.log(title)

    } else  {
      console.log('create new group');
    }
  }, []);

  const [state, setState] = useState({
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

  

  const handleEditDoc = async() => {
    try {
      setLoading(true);
      const groupRef = doc(db, 'Threads', groupid);
      await updateDoc(groupRef, {
        groupName: title,
        date: date,
        venue: venue,
        cheifGuest: cheifGuest,
        description: description,
      });
      setLoading(false);
      console.log('Document updated');
      navigation.goBack();
    } catch (e) {
      setLoading(false);
      console.error('Error updating document: ', e);
    }
  };
  


  const handlecreateDoc = async () => {
    try {
      const UserID = auth.currentUser.uid
      setLoading(true);
     

   const groupRef =   await addDoc(collection(db,'Threads'),{
        createdAt: new Date().getTime(),
        createdBy: auth.currentUser.uid,
        groupName: title,
        date:date,
        member:arrayUnion(auth.currentUser.uid),
        venue:venue,
        cheifGuest:cheifGuest,
        description:description,
        latestMessage:{
          text: `You have joined the event ${title}`,
          createdAt: new Date().getTime()
        }
      })
     await addDoc(collection(groupRef,'messages'),{
      text: `You have joined the event ${title}`,
          createdAt: new Date().getTime(),
          system: true
     })
      console.log(title)


      console.log("Document written with ID: ", groupRef.id);
      navigation.replace('HomeScreen');

    } catch (e) {
      setLoading(false);
      console.error("Error adding document: ", e);
    }

  };



  const handleAddEvent = async () => {
    setLoading(true);
 if(groupid){
  await   handleEditDoc()
 }   
 else{
  await   handlecreateDoc() 
 }
    setLoading(false);

  };




  if(loading){
    return <Loading />
  }


  return (
    <ScrollView >
        <View style={styles.container}>
        <View style={styles.inputContainer}> 
        
 <Text style={{color:'#4D9B99'}}>Event Title:</Text>
 <TextInput 
 placeholder='Event Title'
 value={title}
 onChangeText={text =>handleChange(text, 'title')}
 style={styles.input}
 />

  <Text style={{color:'#4D9B99'}}>Date:</Text>
  <TextInput 
 placeholder='Date'
 value={date}
 onChangeText={text =>handleChange(text, 'date')}

 style={styles.input}
 />

  <Text style={{color:'#4D9B99'}}>Venue:</Text>
  <TextInput 
 placeholder='Venue'
 value={venue}
 onChangeText={text =>handleChange(text, 'venue')}

 style={styles.input}
 />

  <Text style={{color:'#4D9B99'}}>Cheif Guest:</Text>
  <TextInput 
 placeholder='Cheif Guest'
 value={cheifGuest}
 onChangeText={text =>handleChange(text, 'cheifGuest')}

 style={styles.input}
 />

<Text style={{color:'#4D9B99'}}>Description:</Text>
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
     {  groupid ?<Text style={styles.button}>Done</Text>  : <Text style={styles.button}>
            Add Event
        </Text>}
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
        marginBottom:15,
        borderWidth:1,
        borderColor:'#7BE3DD'
      },
      button:{
        backgroundColor: '#5AC2B9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        color:'white',
        marginTop:20,
        alignItems: 'center',
      }
})