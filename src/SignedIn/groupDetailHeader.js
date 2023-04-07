import { View, Text, StyleSheet,TouchableOpacity,LogBox } from 'react-native'
import React, { useState,useEffect } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'


LogBox.ignoreAllLogs()

const GroupDetailHeader = ({navigation, id,total, groupName}) => {



 
console.log('in header detail',id)

    return (
      <View style={styles.container}>
        <TouchableOpacity
        style={{paddingTop:25,paddingLeft:10}}
         onPress={()=>navigation.goBack()}
         >
      
        <Ionicons name='arrow-back' size={24} color="black" />
      
    </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{groupName}</Text>
          <Text style={styles.participants}>{total} participants</Text>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={()=>{
            navigation.navigate('addParticipants',{id:id})
            }}>
            <FontAwesome name='user-plus' size={24} color='#0782f9' style={styles.icon} />
            </TouchableOpacity>
            <Ionicons name='search' size={24} color='#0782f9' style={styles.icon} />
          </View>
        </View>


      </View>
    )
  }

  export default GroupDetailHeader


const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent:'flex-start'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  title:{
fontSize:24,
fontWeight:'bold'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
})



