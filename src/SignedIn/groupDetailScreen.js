import React,{useState,useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import MembersList from './membersList';
import GroupDetailHeader from './groupDetailHeader';


const GroupDetailsPage = ({navigation,route}) => {
const {  id,members } = route.params 
const [groupId,setGroupId] = useState('')
const [membersList,setMembersList] = useState([])
useEffect(()=>{
function handleset(){
  setGroupId(id)
setMembersList(members)
}
handleset()

},[members])

  return (
    <View style={styles.container}>
        <GroupDetailHeader navigation={navigation} id={id}  members={membersList} />
        <MembersList navigation={navigation} id={groupId} members={membersList}/>
      
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
