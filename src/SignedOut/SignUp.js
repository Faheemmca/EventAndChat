import React, { useState } from 'react';
import { View,ActivityIndicator, Text, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection ,setDoc,doc} from "firebase/firestore";
import { auth,db } from '../firebase';
import { ScrollView } from 'react-native-gesture-handler';
const SignUp = ({navigation}) => {
 
const [loading, setLoading] = useState(false)


const [state, setState] = useState({
  Name: '',
  Password: '',
  Email: '',
  Mobile: '',
  confirmPassword:'',
  Education:'',
  City:''
});

const { Name, Password, Email, Mobile, confirmPassword, Education, City } = state;

const handleChange = (text, id) => {
  setState({
    ...state,
    [id]: text,
  });
};





  const handleSignUp = async() => {
    if(!Email || !Password || !Mobile || !Name){
      alert("please fill all the details")
    }
else{
  try{
    setLoading(true);
   const userCredential= await  createUserWithEmailAndPassword(auth, Email, Password)
  const useremail = userCredential.user.email
  const userUID = userCredential.user.uid
  await createDoc(useremail, userUID)
  setLoading(false)
  } 
    catch(error) {
      setLoading(false)
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
      // ..
    };
}
  
   
   
  }

  const createDoc = async(useremail, userUID) =>{
    try {
      
      await setDoc(doc(db,'Users', userUID),{
        name: Name,
        email: Email,
        mobile : '+91 '+Mobile,
        Education:Education,
        City:City,
        userUID: userUID,
        groups:[]
      })
    console.log("collection written with email: ", useremail );
    console.log('document written with ID', userUID)
    } catch (e) {
      console.error("Error adding document: ", e);
    } 
  }



 


if(loading){
  return(
    <View style={styles.container}>
    <ActivityIndicator size="large" color="0000ff" />
   </View>
  )
}


  return (
      <ScrollView >
            <View style={styles.container} behavior="padding">

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          onChangeText={(text) => handleChange(text, 'Name')}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          onChangeText={(text) => handleChange(text, 'Email')}
          style={styles.input}
          
        />
        <TextInput
          placeholder="Mobile Number"
          maxLength={10}
          keyboardType='numeric'
          onChangeText={(text) => handleChange(text, 'Mobile')}
          style={styles.input}
        />
         <TextInput
          placeholder="Your Education"
          onChangeText={(text) => handleChange(text, 'Education')}
          style={styles.input}
        />
        <TextInput
          placeholder="Your City"
          onChangeText={(text) => handleChange(text, 'City')}
          style={styles.input}
        />
      
        <TextInput
          placeholder="Password"
          onChangeText={(text) => handleChange(text, 'Password')}
          style={styles.input}
          secureTextEntry
        />
         <TextInput
          placeholder="Confirm Password"
          onChangeText={(text) => handleChange(text, 'confirmPassword')}

          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
     
            <View style={{height:100}}/>
            </View>
    </ScrollView>
   
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:40
  },
  inputContainer: {
    width: '80%',
    
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F'
  }
})
