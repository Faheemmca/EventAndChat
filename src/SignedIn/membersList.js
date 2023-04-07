import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { getDoc, doc, onSnapshot } from 'firebase/firestore';

const MembersList = ({navigation, id,membersList}) => {
 const [members,setMembers] = useState([])

useEffect(()=>{
  setMembers(membersList)
},[id])


console.log('in memberList',members)

  return (
    <View style={styles.membersList}>
      <Text style={styles.header}>Members List</Text>
      <FlatList
        data={members}
        renderItem={({ item }) => 
        <View style={styles.contactList}>
          <Text style={{fontSize:20}}>{item.name}</Text>
          <Text>{item.mobile}</Text>
        </View>
      }
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={!membersList && <Text>No members to display</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  membersList: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
  },
  contactList:{
    display:'flex',
    alignItems:'center',
    backgroundColor:'#7BE3DD',
    marginBottom:10
  }
});

export default MembersList;
