import {
  View,
  Text,
  Alert,
  Keyboard,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import TextBox from '../../components/TextBox';
import {setData} from '../../services/AsyncStorage';
import {BlurView} from '@react-native-community/blur';
import image from '../../../assets/images/login-background.png';

const Tenant = ({navigation}) => {
  const [tenant, setTenant] = useState('');
  const saveTenant = async () => {
    try {
      if (tenant != '') {
        await setData('tenant', tenant);
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Please Enter a valid Tenant Name', [
          {text: 'Ok', onPress: () => console.log('OK Pressed')},
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={style.container}>
      <ImageBackground source={image} style={style.image}>
        <KeyboardAvoidingView>
          <View style={style.loginContainer}>
            <BlurView style={[style.absolute]} blurAmount={5} />
            <Text style={style.signIn}>Tenant</Text>
            <TextBox style={style.signInsub}>
              Please enter your tenant details
            </TextBox>
            <View style={style.inputWrap}>
              <TextInput
                placeholder="Tenant Name"
                style={style.inputbox}
                placeholderTextColor={'hsla(0, 0%, 95%, 0.7)'}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setTenant(text);
                }}
                value={tenant}
              />
            </View>
            <TouchableOpacity
              style={style.buttonPrimary}
              onPress={() => {
                Keyboard.dismiss();
                saveTenant();
              }}>
              <Text style={style.buttonPrimaryText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  text: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 39,
    maxWidth: 380,
    paddingHorizontal: 40,
    marginBottom: 50,
    position: 'relative',
    zIndex: 2,
  },
  loginContainer: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 30,
    paddingVertical: 35,
    borderRadius: 21,
    backgroundColor:
      'linear-gradient(180deg, rgba(0, 0, 0, 0.27) 0%, rgba(5, 18, 37, 1) 100%)',
    overflow: 'hidden',
  },
  signIn: {
    fontSize: 18,
    lineHeight: 22,
    color: '#FFF',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  signInsub: {
    fontSize: 14,
    lineHeight: 17,
    color: '#F2F2F2',
    opacity: 0.8,
    marginBottom: 25,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#fff',
    backgroundColor: 'hsla(0, 100%, 100%, 0.27)',
    marginBottom: 15,
  },
  inputbox: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: 'hsla(0, 0%, 95%, 1)',
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  buttonPrimary: {
    backgroundColor: '#4768FD',
    borderRadius: 2,
    padding: 12,
    marginBottom: 10,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 21,
  },
});

export default Tenant;
