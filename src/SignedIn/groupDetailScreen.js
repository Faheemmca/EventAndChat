import React,{useState,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import MembersList from './membersList';
import GroupDetailHeader from './groupDetailHeader';
import { doc,getDoc, } from 'firebase/firestore';
import { db } from '../firebase';
import Loading from '../components/Loading'

const GroupDetailsPage = ({navigation,route}) => {
const {  id, groupName } = route.params 
const [membersList,setMembersList] = useState([])
const [total, setTotal] = useState(0)
const [loading,setLoading] = useState(true)


useEffect(()=>{
  
async function getInfo(){
 const members = await getMembersInfo(id)
 setTotal(members.length)
 setLoading(false)

}
getInfo()
console.log(total)
console.log(membersList)
},[id])

const getMembersInfo = async (groupId) => {
  try {
    const groupDocRef = doc(db, 'Threads', groupId);
    const groupDocSnap = await getDoc(groupDocRef);
    const memberUids = groupDocSnap.data().member;

    const members = [];
    for (const uid of memberUids) {
      const userDocRef = doc(db, 'Users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const { name, mobile } = userDocSnap.data();
        members.push({ name, mobile });
      } else {
        console.log(`User document with id ${uid} does not exist`);
      }
    }
    setMembersList(members)
    return members;
  } catch (error) {
    console.error('Error fetching members information:', error);
  }
};

if(loading){
  return <Loading />
}

  return (
    <View style={styles.container}>
        <GroupDetailHeader navigation={navigation} id={id} total={total} groupName={groupName}/>
        <MembersList navigation={navigation} id={id} membersList={membersList} />
      
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButton: {
    color: '#007aff',
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberItem: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#007aff',
    alignItems: 'center',
    paddingVertical: 16,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default GroupDetailsPage;
