import {ActivityIndicator, View,FlatList,Dimensions, Text,StyleSheet,LogBox, TouchableOpacity, SafeAreaView, ToastAndroid } from 'react-native'
import React,{ useState, useEffect} from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Ionicons,FontAwesome } from '@expo/vector-icons'
import { collection,setDoc, getDocs,onSnapshot, doc, deleteDoc, query, orderBy, getDoc, runTransaction,where } from 'firebase/firestore'
import { db } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../components/Loading'

const { width, height} = Dimensions.get('window')


const HomeScreen = ({navigation}) => {

  
const userId = auth.currentUser.uid
const [loading,setLoading] = useState(true)
const [data, setData] = useState([]);

const [group, setGroup] = useState([])

const [user, setUser] = useState([])
const [members, setMembers] = useState([])


useEffect(() => {
  const q = query(collection(db, 'Threads'), where('member', 'array-contains', userId));
  const unsubscribe = ()=>{
    onSnapshot(q, (querySnapshot) => {
      const groups = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      setGroup(groups)
      setLoading(false)
    }, (error) => {
      console.error(error);
    });
  }
  unsubscribe()

  return () => {
    unsubscribe();
  };
}, []);


  if(loading){
    return <Loading/>
  }




  const handleDelete =async(item)=>{
    const docRef = doc(db,'Threads',item.id)
    if(userId === item.createdBy ){
      setLoading(true)
      await deleteDoc(docRef)
      setLoading(false)
    }
  }

const renderItem = ({ item }) => (
  <View style={{marginTop:10}} >
    <View style= {styles.eventCard} >
      <TouchableOpacity 
      // onPress={()=>navigation.navigate('Chat',{name:item.groupName,
      //  id:item.id, })}
      onPress={()=>{
        navigation.navigate('trialPic')
      }}
     
     >
      <Text style= {styles.eventTitle} >{item.groupName}</Text>
      </TouchableOpacity>
      <Text style= {styles.eventDate}>{item.date}</Text>
      <Text style= {styles.eventDate}>Venue: {item.venue}</Text>
      {userId === item.createdBy ? (
        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <Ionicons
              name="trash-outline"
              size={18}
              color="red"
              style={styles.sideButtonsText}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('addEventDetails',{
          groupid:item.id,
          event:item,
        })}>
            <Ionicons
              style={styles.sideButtonsText}
              name="create-outline"
              size={18}
              color="#0782f9"
            />
          </TouchableOpacity>
        </View>
      ) : null}

  </View>
  </View>
)



  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Events</Text>
      <TouchableOpacity 
      onPress={()=>{
        navigation.navigate('addEventDetails',{
          groupid:null,
          event:null,
        })
      }} 
      >
        <Ionicons name="add-outline" style ={styles.addEvent}/> 
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        
        <TouchableOpacity
        onPress={()=>navigation.navigate('profile',{user:user})} 
        >
          <FontAwesome name='user-circle' size={24} color='#0782f9' />
        </TouchableOpacity>
      </View>
    </View>
    <SafeAreaView style={styles.ListContainer}>
    <FlatList
    style={styles.list}
           data={group}
                renderItem={renderItem}
            />
            </SafeAreaView>
    </View>
    
    
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'white'
    },
    header: {
      position: 'absolute',
      top: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#7BE3DD',
      height: '10%',
      width: '100%',
      paddingHorizontal: 20,
    },
    titleContainer:{
      marginTop:25,
      flexDirection:'row',
      alignItems:'center'
    },
    title: {
     fontSize: 24,
     fontWeight:'bold',
    },
 
    addEvent:{
      color:'#0782f9',
    fontSize:32,
    paddingHorizontal:7,
    marginTop:5
    },
   ListContainer:{
    flex:1,
    alignItems:'center',
    marginTop:80,
   width:'100%',
   },
  
 
   eventCard: {
    backgroundColor: '#99EBE7',
    width: width * 0.9,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 16,
    marginBottom: 5,
  },
  
  sideButtons:{
    flexDirection:'column',
    justifyContent:'space-between',
    position:'absolute',
    right:20,
    top:30,
    
  },
  sideButtonsText:{
    paddingBottom:30
  },
  profileContainer:{
    marginTop:20
  }
  
  });
