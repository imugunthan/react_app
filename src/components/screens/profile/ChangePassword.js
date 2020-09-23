import React, {useState} from 'react';
import Body from '../../components/Body';
import color from '../../../assets/styles/color';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

const ChangePassword = ({navigation}) => {
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const resetPassword = () => {
    // console.log(passwordDetails);
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Body>
          <Text style={style.title}>Please enter the necessary Details</Text>
          <View style={style.inputWrap}>
            <Text style={style.label}>Old Password</Text>
            <TextInput
              style={style.inputBox}
              placeholder="********"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPasswordDetails((prevState) => ({
                  ...prevState,
                  oldPassword: text,
                }));
              }}
              value={passwordDetails.oldPassword}
            />
          </View>
          <View style={style.inputWrap}>
            <Text style={style.label}>New Password</Text>
            <TextInput
              style={style.inputBox}
              placeholder="********"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPasswordDetails((prevState) => ({
                  ...prevState,
                  newPassword: text,
                }));
              }}
              value={passwordDetails.newPassword}
            />
          </View>
          <View style={style.inputWrap}>
            <Text style={style.label}>Confirm Password</Text>
            <TextInput
              style={style.inputBox}
              placeholder="********"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPasswordDetails((prevState) => ({
                  ...prevState,
                  confirmPassword: text,
                }));
              }}
              value={passwordDetails.confirmPassword}
            />
          </View>
        </Body>
      </View>
      <View style={style.buttonWrap}>
        <TouchableOpacity
          style={{
            width: Dimensions.get('window').width / 2,
          }}
          onPress={() => navigation.navigate('Profile')}>
          <View style={style.cancelButton}>
            <Text style={style.cancelButtonText}>Cancel</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: Dimensions.get('window').width / 2,
          }}
          onPress={() => resetPassword()}>
          <View style={style.resetButton}>
            <Text style={style.resetButtonText}>Reset Password</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#000',
    marginBottom: 20,
  },
  inputWrap: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 16,
    color: '#2D2D2E',
    marginBottom: 8,
  },
  inputBox: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CFCFCF',
    fontSize: 12,
    lineHeight: 15,
    color: '#2D2D2E',
  },
  buttonWrap: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: color.primaryTextColor,
    textAlign: 'center',
  },
  resetButton: {
    padding: 20,
    width: '100%',
    backgroundColor: color.primaryBrandColor,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ChangePassword;
