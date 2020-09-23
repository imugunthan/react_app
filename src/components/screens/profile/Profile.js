import React, {useState} from 'react';
import Body from '../../components/Body';
import {apiData} from '../../../static/Static';
import color from '../../../assets/styles/color';
import {getData} from '../../services/AsyncStorage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../../services/AxiosInterceptor';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import profileImage from '../../../assets/images/default-profile-picture.png';
import Loader from '../../components/Loader';

const Profile = ({navigation, route}) => {
  const {authHandler} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState('');

  React.useEffect(() => {
    setIsLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    });
    getProfileData();
    return unsubscribe;
  }, [navigation]);

  const getProfileData = async () => {
    try {
      const organization_id = await getData('organization_id');
      const current_user = await getData('user_id');
      const tenant = await getData('tenant');
      axiosInstance
        .get(`${apiData.apiUrl}/student/${current_user}`, {
          headers: {
            current_user: current_user,
            org_id: organization_id,
            tenant: tenant,
            type: 2,
          },
        })
        .then((data) => {
          setProfileData(data.data.student_details);
          setIsLoading(false);
        })
        .catch((er) => {
          console.log(er);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : !isLoading && profileData != '' ? (
    <View style={{flex: 1}}>
      <View style={style.profileCard}>
        <Image
          source={
            profileData.user_details.image_url
              ? {uri: profileData.user_details.image_url}
              : profileImage
          }
          style={style.userImage}
        />
        <View style={style.userInfo}>
          <Text style={style.userName}>{profileData.user_details.name}</Text>
          {/* <Text style={style.designation}>UI/UX Designer</Text> */}
          <Text style={style.email}>{profileData.user_details.email}</Text>
        </View>
      </View>
      <Body style={{flex: 1}}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('Basic Info', {
              profileData: profileData,
            })
          }>
          <View style={style.lectureCard}>
            <Text style={style.lectureTitle}>Basic Information</Text>
            <Icon
              name="keyboard-arrow-right"
              size={24}
              color={color.primaryTextColor}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('My Certificates', {
              certificates: profileData.certificates,
            })
          }>
          <View style={style.lectureCard}>
            <Text style={style.lectureTitle}>My Certificates</Text>
            <Icon
              name="keyboard-arrow-right"
              size={24}
              color={color.primaryTextColor}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('Badges', {
              badges: profileData.badge_obj,
            })
          }>
          <View style={style.lectureCard}>
            <Text style={style.lectureTitle}>My Badges</Text>
            <Icon
              name="keyboard-arrow-right"
              size={24}
              color={color.primaryTextColor}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Change Password')}>
          <View style={style.lectureCard}>
            <Text style={style.lectureTitle}>Change Password</Text>
            <Icon
              name="keyboard-arrow-right"
              size={24}
              color={color.primaryTextColor}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={{marginTop: 30}}>
          <Button title="Logout" onPress={() => authHandler(false)}></Button>
        </View>
      </Body>
    </View>
  ) : null;
};

const style = StyleSheet.create({
  profileCard: {
    backgroundColor: '#293239',
    paddingTop: 32,
    paddingHorizontal: 26,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 81,
    height: 81,
    resizeMode: 'cover',
    borderRadius: 81 / 2,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 5,
  },
  designation: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    opacity: 0.6,
  },
  lectureCard: {
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  lectureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: color.primaryTextColor,
  },
});

export default Profile;
