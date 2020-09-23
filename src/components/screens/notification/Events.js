import React,{useState} from 'react';
import Body from '../../components/Body';
import TextBox from '../../components/TextBox';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import image from '../../../assets/images/default-profile-picture.png';
import color from '../../../assets/styles/color';
import axiosInstance from '../../services/AxiosInterceptor';
import {getData} from '../../services/AsyncStorage';
import {apiData} from '../../../static/Static';
import moment from 'moment';

const Events = () => {

  const [data, setData] = useState([]);
  React.useEffect(() => {
    getEvents();
  },[]);
  const getEvents = async () => {
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');
    try {
      await axiosInstance
        .post(
          `${apiData.apiUrl}/events/list`,
          {
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
        )
        .then((data) => {
          setData(data.data.events);
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  const updateDate = (dateTime,time) => {
    var stillUtc = moment(dateTime).format("MMM Do, YYYY");
    return '(' +stillUtc + ',' + time +')';
  };
  const openPopup =(props)=>{
    console.log('agoraData','data');
    console.log('data', props);
  }
  return (
    <FlatList
      data={data}
      keyExtractor={({id}, index) => id}
      renderItem={({item}) => (
        <View style={style.card}>
          <Image source={image} style={style.notificationImage} />
          <View style={style.notificationContent}>
            <TextBox style={style.notificationText}>{item.title}</TextBox>
            <TextBox style={style.notificationDate}>
              {updateDate(item.start_date, item.time)}
            </TextBox>
            <TouchableOpacity key={item.id} onPress={()=>openPopup(item)}>
              <Text style={style.eventLink}>Open Meetings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );

  // return (
  //   <Body>
  //     <View style={style.card}>
  //       <Image source={image} style={style.notificationImage} />
  //       <View style={style.notificationContent}>
  //         <TextBox style={style.notificationText}>
  //           Live - iOS 11 &amp; Swift 4 - The Complete iOS App Development
  //           Bootcamp
  //         </TextBox>
  //         <TextBox style={style.notificationDate}>(03:00 - 03:30 pm)</TextBox>
  //         <Text style={style.eventLink}>Zoom.cou/mohanseturaman</Text>
  //       </View>
  //     </View>
  //   </Body>
  // );
};

const style = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C2CAD0',
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
  },
  notificationImage: {
    width: 33,
    height: 33,
    borderRadius: 33 / 2,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 15,
    maxWidth: '75%',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 18,
    color: color.primaryTextColor,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    lineHeight: 15,
    color: '#697C8A',
    marginBottom: 10,
  },
  eventLink: {
    color: color.primaryBrandColor,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    lineHeight: 15,
    marginBottom: 5,
  },
});

export default Events;
