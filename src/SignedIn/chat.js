import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity,Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { addDoc, collection, onSnapshot,doc, query, orderBy, where, getDoc, setDoc } from 'firebase/firestore';
import { auth,db } from '../firebase';

export default function RoomScreen({navigation,route}) {
  const [messages, setMessages] = useState([])
   
const {id, name,members } = route.params

useEffect(() =>{
  const docRef =doc(db,'Messages', id)
  const q = query(collection(docRef,'messages'), orderBy('sentAt', 'desc'))

  const messageListener = onSnapshot(q, (snapshot)=>{
    const newMessages = snapshot.docs.map(doc =>{
      const firebaseData = doc.data();
      
      const data ={
        _id: doc.id,
        text:'',
        createdAt: new Date().getTime(),
        ...firebaseData
      }
      if(!firebaseData.system){data.user={
        ...firebaseData.user,
        name: firebaseData.user.email
      }}
      if(firebaseData.system){
        console.log("system",firebaseData)
      }
      return data;
    })

    setMessages(newMessages)
  })

  return () => messageListener()
},[])



async function handleSend(messages){
  const text = messages[0].text;
  // Use the newMessage argument instead of the text variable
     const messagesRef = collection(db, 'Messages', id, 'messages');
     const newMessageRef = doc(messagesRef)
      await addDoc(messagesRef,{
       _id: newMessageRef.id,
       text,
       sentAt: new Date().getTime(),
       sentBy: auth.currentUser.uid,
       user:{
         _id:auth.currentUser.uid,
         email: auth.currentUser.email
       }
     })

await setDoc(doc(db,'Messages', id),{
  latestMessage:{
    text,
    createdAt: new Date().getTime()
  }
},{merge:true}
)   
 };
 const handleHeaderPress = () => {
  // Navigate to the GroupDetailsPage component
  navigation.navigate('details', {  id: id,members:members });
};





  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }


  
  function renderSend(props){
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
                    <IconButton icon='send-circle' size={32} iconColor='#6646ee' />

        {/* <Ionicons name='send-sharp' size={24} color='white' /> */}
        </View>
      </Send>
    );
  }

  // helper method that is sends a message


  const scrollToBottomComponent = () =>  {
    return (
      <View style={styles.bottomComponentContainer}>
      <Ionicons name='chevron-down-circle' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  const renderMessageText = ({ currentMessage }) => {
    return (
      <Text >{currentMessage.text}</Text>
    );
  };

  console.log('in chat',route.params.id)
  return (
    <View style={styles.container}>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',borderBottomWidth: 1,
    borderBottomColor: '#ccc',}}>
      <TouchableOpacity 
      style={{marginLeft:10, paddingTop:12}}
      onPress={()=>navigation.goBack()}
      >
    <Ionicons name="chevron-back" size={24} color="black"  />
    </TouchableOpacity>
      <TouchableOpacity 
            onPress={handleHeaderPress}
      style={styles.header}>
        <Text style={styles.headerTitle}>{route.params.name}</Text>
      </TouchableOpacity>
      </View>
   
   
    {/* Render the GiftedChat component here */}
    <GiftedChat
    messages={messages}
    onSend={handleSend}
    user={{ _id: auth.currentUser.uid}}
    placeholder='Type your message here...'
    alwaysShowSend
    showUserAvatar
    scrollToBottom
    renderBubble={renderBubble}
    renderSend={renderSend}
    scrollToBottomComponent={scrollToBottomComponent} // pass the scrollToBottomComponent function as a prop
    renderSystemMessage = {renderSystemMessage}
  />
  </View>
    
    
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width:'70%',
    paddingTop:25,
    
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  
})