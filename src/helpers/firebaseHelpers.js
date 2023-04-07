import { auth,db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection ,setDoc,doc} from "firebase/firestore";
// import React, { useState } from 'react';

const handleSignUp = async(Email,Password,Mobile,Name,Education,City) => {
    // const [Loading, setLoading] = useState(false)
    if(!Email || !Password || !Mobile || !Name){
      alert("please fill all the details")
    }
else{
    // setLoading(true)
    console.log(Email,Password,Mobile,Name,Education,City)
  try{
   const userCredential= await  createUserWithEmailAndPassword(auth, Email, Password)
  const useremail = userCredential.user.email
  const userUID = userCredential.user.uid
  await createDoc(useremail, userUID,Name,Email,Mobile,Education,City)
//   setLoading(false)
  } 
    catch(error) {
        // setLoading(false)
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
      // ..
    };
}

}


const createDoc = async(useremail, userUID,Name,Email,Mobile,Education,City) =>{
    try {
      
      await setDoc(doc(db,'Users', userUID),{
        name: Name,
        email: Email,
        mobile : '+91 '+Mobile,
        education:Education,
        city:City,
        userUID: userUID,
      })
    console.log("collection written with email: ", useremail );
    console.log('document written with ID', userUID)
    } catch (e) {
      console.error("Error adding document: ", e);
    } 
  }


export default handleSignUp