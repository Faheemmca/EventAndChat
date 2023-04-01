import { View, Text, TouchableOpacity,TextInput, StyleSheet } from 'react-native'
import React,{useState, useEffect} from 'react' 
import { setDoc,doc, getDoc,getDocs,collection, arrayUnion, query, where, updateDoc } from 'firebase/firestore';
import { auth,db } from '../firebase';
import { async } from '@firebase/util';


const HandleAddMembers = async (props) => {
  const mobile = props.mobile;
  const id = props.id;
  console.log(mobile,' ' , id)
  const docRef = doc(db, 'Groups', id);
  const memberUid = await getUserUidByMobileNumber(mobile);

  if (memberUid) {
    const userRef = doc(db, 'Users', memberUid);

    await updateDoc(userRef, {
      groups: arrayUnion(id),
    });

    await updateDoc(docRef, {
      member: arrayUnion(memberUid),
    });
  } 
  return null;
};


const getUserUidByMobileNumber = async (mobileNumber) => {
  const q = query(collection(db, 'Users'), where('mobile', '==', mobileNumber));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  } else {
    return querySnapshot.docs[0].id;
  }
}


export const handlePress = async(props)=>{
const name = props.name
  console.log('Hi',name)
}

export default HandleAddMembers;
