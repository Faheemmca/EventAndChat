import {ActivityIndicator, View,FlatList, Text,StyleSheet,LogBox, TouchableOpacity, SafeAreaView, ToastAndroid } from 'react-native'
import React,{ useState, useEffect} from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'
import { collection, getDocs,onSnapshot, doc, deleteDoc, query, orderBy, getDoc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'





const handledeleteDoc = async (id) => {
    setLoading(true);
  
    const userID = auth.currentUser.uid;
    const userDocRef = doc(db, 'Users', userID);
  
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
  
      if (!userDoc.exists()) {
        throw new Error('User document does not exist!');
      }
  
      const userData = userDoc.data();
      const groups = userData.groups || [];
      const groupIndex = groups.indexOf(id);
  
      if (groupIndex < 0) {
        throw new Error(`Group with ID ${id} not found in user document!`);
      }
  
      const groupDocRef = doc(db, 'Groups', id);
      const groupDoc = await transaction.get(groupDocRef);
  
      if (!groupDoc.exists()) {
        throw new Error(`Group document with ID ${id} does not exist!`);
      }
  
      const groupData = groupDoc.data();
      const createdBy = groupData.createdBy || '';
  
      if (createdBy == auth.currentUser.email) {
        groups.splice(groupIndex, 1);
        transaction.update(userDocRef, { groups });
        transaction.delete(groupDocRef);
   } else {
    ToastAndroid.show('only the creator of the group can delete it!', ToastAndroid.SHORT)  
    setLoading(false) 
   }
   
      
    });
  
    setLoading(false);
  };
  