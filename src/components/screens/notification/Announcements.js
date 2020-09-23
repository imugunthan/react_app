import React, { useState } from 'react';
import TextBox from '../../components/TextBox';
import { View, Image, StyleSheet, FlatList,Text} from 'react-native';
import image from '../../../assets/images/default-profile-picture.png';
import axiosInstance from '../../services/AxiosInterceptor';
import { getData } from '../../services/AsyncStorage';
import { apiData } from '../../../static/Static';
import moment from 'moment';

const Announcements = ({navigation}) => {
  const [data, setData] =useState([])
  React.useEffect(()=>{
    getAnnouncement();
  },[])
  const getAnnouncement = async()=>{
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');
    try {
      await axiosInstance.post(`${apiData.apiUrl}/announcement/list`, {
        user_id: current_user,
      },
        {
          headers: {
            current_user: current_user,
            org_id: organization_id,
            tenant: tenant,
            type: 2,
          },
        },
    ).then((data)=>{
      setData(data.data.announcements)
    })
  }catch(error){
    console.log('error',error)
  }
  }
  const updateDate = (dateTime) => {
    var stillUtc = moment.utc(dateTime).toDate();
    var local = moment(stillUtc).local().format('lll');
    console.log('datetime', dateTime);
    return local;
  };
  return (
    <View style={{marginTop: 15}}>
      <FlatList
        data={data}
        keyExtractor={({id}, index) => id}
        renderItem={({item}) => (
          <View style={style.notificationCard}>
            <Image source={image} style={style.notificationImage} />
            <View style={style.notificationContent}>
              <TextBox style={style.notificationText}>{item.title}</TextBox>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextBox style={style.notificationDate}>
                  {item.description}
                </TextBox>
                <TextBox style={style.notificationDate}>
                  {updateDate(item.create_at)}
                </TextBox>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
  },
  notificationImage: {
    width: 33,
    height: 33,
    borderRadius: 33 / 2,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 15,
  },
  notificationDate: {
    alignSelf: 'flex-end',
    fontSize: 12,
    lineHeight: 15,
    color: '#697C8A',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#293239',
    marginBottom: 5,
  },
});

export default Announcements;
