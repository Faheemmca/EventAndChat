import { View, Text, TouchableOpacity,TextInput, StyleSheet } from 'react-native'
import React,{useState, useEffect} from 'react' 
import { setDoc,doc, getDoc,getDocs,collection, arrayUnion, query, where, updateDoc } from 'firebase/firestore';
import { auth,db } from '../firebase';
import { async } from '@firebase/util';


const HandleAddMembers = async (props) => {
  
  const SelectedMembers = props.selectedItems
const id = props.id
  for(const member of SelectedMembers){

    const memberUid = member.id
  
    if (memberUid) {
      const userRef = doc(db, 'Users', memberUid);
  
      await updateDoc(userRef, {
        groups: arrayUnion(id),
      });
  
      const docRef = doc(db, 'Threads', id);
      await updateDoc(docRef, {
        member: arrayUnion(memberUid),
      });
    } 
  }
  
  return null;
};


// const getUserUidByMobileNumber = async (mobileNumber) => {
//   const q = query(collection(db, 'Users'), where('mobile', '==', mobileNumber));
//   const querySnapshot = await getDocs(q);

//   if (querySnapshot.empty) {
//     return null;
//   } else {
//     return querySnapshot.docs[0].id;
//   }
// }




export default HandleAddMembers;
