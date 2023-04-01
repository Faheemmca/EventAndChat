import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './src/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';


import SignIn from './src/SignedOut/Login';
import HomeScreen from './src/SignedIn/EventListScreen';
import SignUp from './src/SignedOut/SignUp';
import AddEventDetails from './src/SignedIn/addEventDetails';
import Chat from './src/SignedIn/chat';
import AddMembersScreen from './src/SignedIn/addMembersScreen';
import GroupDetailsPage from './src/SignedIn/groupDetailScreen';
import AddParticipantsScreen from './src/SignedIn/addParticipants';
import GroupDetailHeader from './src/SignedIn/rough';
import Profile from './src/SignedIn/profileScreen'


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function App(){
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null);



  useEffect(() =>{
    const subscriber = ()=>{
      onAuthStateChanged(auth,(user)=>{
        if(user){
          setUser(user);
          if(loading) setLoading(false);
          console.log('in app.js, user email: ',user.email)
        }
        else{
          setLoading(false)
          setUser(null)
        }
      } )
    }
    return subscriber()
  },[])

  if(loading) return (
    <View style={styles.container}>
      <ActivityIndicator color='#0782f9' size='large' />
    </View>
  )

  const HomeStack =()=>(
    <Stack.Navigator >

       <Stack.Screen name='HomeScreen' component={HomeScreen}  options={{headerShown:false}} />
        <Stack.Screen name='addEventDetails' component={AddEventDetails} options={{headerShown:false}} />
        <Stack.Screen name='addMembers' component={AddMembersScreen} options={{headerShown:false}} />
        <Stack.Screen name='Chat' component={Chat} options={{headerShown:false}} />
        <Stack.Screen name='details' component={GroupDetailsPage} options={{headerShown:false}} />
        <Stack.Screen name='addParticipants' component={AddParticipantsScreen} options={{headerShown:false}} />
        <Stack.Screen name='groupDetaiHeader' component={GroupDetailHeader} options={{headerShown:false}} />
        <Stack.Screen name='profile' component={Profile} options={{headerShown:false}} />


        {/* options={({navigation,route}) =>
      ({
        title: route.params.name,
        headerRight: () =>(
          <TouchableOpacity onPress={()=> navigation.navigate('addMembers',{id:route.params.id})}>
            <Ionicons name='add-circle' size={24} color='blue'/>
          </TouchableOpacity>
        )
      })} /> */}

    </Stack.Navigator>
  )

const SignInStack = () =>(
  <Stack.Navigator>
  <Stack.Screen name='SignIn' component={SignIn} options={{headerShown:false}} />
  <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}} />
  </Stack.Navigator>
)

  return(
    <NavigationContainer>
      
      {user ?
       (  
     <HomeStack />
       ):
       (
       <SignInStack />
       )

      }
    </NavigationContainer>
  )



}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
