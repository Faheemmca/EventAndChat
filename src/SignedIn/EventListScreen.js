import {ActivityIndicator, View,FlatList, Text,StyleSheet,LogBox, TouchableOpacity, SafeAreaView, ToastAndroid } from 'react-native'
import React,{ useState, useEffect} from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Ionicons,FontAwesome } from '@expo/vector-icons'
import { collection,setDoc, getDocs,onSnapshot, doc, deleteDoc, query, orderBy, getDoc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../components/Loading'

const HomeScreen = ({navigation}) => {

const [loading,setLoading] = useState(true)
const [data, setData] = useState([]);

const [group, setGroup] = useState([])

const [user, setUser] = useState([])
const [members, setMembers] = useState([])

useEffect(()=>{
  const id = auth.currentUser.uid
  const q = query(collection(db, 'Threads'),where('createdBy','==',id))
  const unsubscribe = onSnapshot(q, (querysnapshot)=>{
   
  const groups =  querysnapshot.forEach((doc)=>{
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    setGroup(groups)

  setLoading(false)
  })
 return () => unsubscribe()
},[])











  if(loading){
    return <Loading/>
  }

const renderItem = ({ item }) => (
  <View >
    <View style= {styles.eventCard} >
      {/* <TouchableOpacity onPress={()=>navigation.navigate('Chat',{name:item.groupName,
       id:item.id,
       members:members
     })}>
      <Text style= {styles.eventTitle} >{item.groupName}</Text>
      </TouchableOpacity> */}
      <Text style= {styles.eventDate}>{item.date}</Text>
      <Text style= {styles.eventDate}>Venue: {item.Venue}</Text>
     <View style={styles.sideButtons}>
     <TouchableOpacity 
    //  onPress={()=> handledeleteDoc(item.id)}
      
      >
         <Ionicons name="trash-outline" size={18} color="red" style={styles.sideButtonsText}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>{
    console.log("in home",item)
    navigation.navigate('addEventDetails',{
      id:item.id,
      event: item,
    })

  }}
      >
         <Ionicons style={styles.sideButtonsText}
         name="create-outline" size={18} color="#0782f9" />
      </TouchableOpacity>
     </View>

  </View>
  </View>
)


const handleAddEvent =() =>{

  navigation.navigate('addEventDetails')
}

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.titleContainer}>
      <Text style={styles.title}>Events</Text>
      <TouchableOpacity 
      onPress={handleAddEvent} 
      >
        <Ionicons name="add-outline" style ={styles.addEvent}/> 
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        
        <TouchableOpacity
        onPress={()=>navigation.navigate('profile',{user:user})} 
        >
          <FontAwesome name='user-circle' size={24} />
        </TouchableOpacity>
      </View>
    </View>
    <SafeAreaView style={styles.ListContainer}>
    <FlatList
    style={styles.list}
           data={data}
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
      position:'absolute',
      top:0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      height: 80,
      width:'100%',
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
    buttonText: {
      marginTop:25,
      paddingHorizontal: 7,
    fontSize:14,
    color:'#0782f9'
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
   EventCard:{
    marginBottom:10,
    backgroundColor:'skyblue'
   },
   dbutton:{
color:'red',
padding:7
   },
   eventCard: {
    backgroundColor: '#eee',
    width:300,
    borderRadius: 10,
    padding: 20,
   
    marginBottom: 20,
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
