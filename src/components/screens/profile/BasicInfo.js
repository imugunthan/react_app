import React from 'react';
import TextBox from '../../components/TextBox';
import color from '../../../assets/styles/color';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FooterButton from '../../components/FooterButton';

const BasicInfo = ({navigation, route}) => {
  const {profileData} = route.params;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={style.card}>
          <View style={{marginBottom: 25}}>
            <Text style={style.label}>Name</Text>
            <TextBox style={style.value}>
              {profileData.user_details.name}
            </TextBox>
          </View>
          <View style={{marginBottom: 25}}>
            <Text style={style.label}>Email</Text>
            <TextBox style={style.value}>
              {profileData.user_details.email}
            </TextBox>
          </View>
          {/* <View style={{marginBottom: 25}}>
            <Text style={style.label}>Designation</Text>
            <TextBox style={style.value}>UI/UX Designer</TextBox>
          </View> */}
          <View style={{marginBottom: 25}}>
            <Text style={style.label}>Bio</Text>
            <TextBox style={style.value}>
              {profileData.invitation_obj.org_metadata?.Bio}
            </TextBox>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Change Password')}>
        <FooterButton
          title="Change Password"
          bgColor="#fff"
          textColor={color.primaryTextColor}
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#DADADA',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 25,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.3,
    color: color.primaryTextColor,
    opacity: 0.6,
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    lineHeight: 21,
    color: '#292929',
  },
});

export default BasicInfo;
