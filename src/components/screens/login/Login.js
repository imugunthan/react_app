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
import axios from 'axios';
import React, {useState} from 'react';
import Loader from '../../components/Loader';
import {apiData} from '../../../static/Static';
import TextBox from '../../components/TextBox';
import {BlurView} from '@react-native-community/blur';
import CookieManager from '@react-native-community/cookies';
import image from '../../../assets/images/login-background.png';
import {getData} from '../../services/AsyncStorage';

const Login = ({authHandler, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [headers, setHeaders] = useState({
    tenant: '',
    type: 2,
  });
  React.useEffect(() => {
    getHeaders();
  }, [navigation]);

  const getHeaders = async () => {
    try {
      const tenantName = await getData('tenant');
      setHeaders((prevState) => ({
        ...prevState,
        tenant: tenantName,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const loginHandler = () => {
    const validation = validateEmail(credentials.username.toLocaleLowerCase());
    if (validation && credentials.password !== '') {
      setIsLoading(true);
      CookieManager.clearAll()
        .then((data) => {
          axios
            .post(`${apiData.apiUrl}/login`, credentials, {
              headers: headers,
            })
            .then((data) => {
              authHandler(true, data.data);
              setIsLoading(false);
            })
            .catch((er) => {
              Alert.alert('Error', er.response.data.message, [
                {text: 'Ok', onPress: () => console.log('Ok Pressed')},
              ]);
              setIsLoading(false);
            });
        })
        .catch((err) => console.log(err));
    } else if (credentials.username == '' && credentials.password == '') {
      Alert.alert('Error', 'Please Enter a valid credentials', [
        {text: 'Ok', onPress: () => console.log('Ok Pressed')},
      ]);
    } else if (validation && credentials.password == '') {
      Alert.alert('Error', 'Please Enter your password', [
        {text: 'Ok', onPress: () => console.log('Ok Pressed')},
      ]);
    } else if (!validation && credentials.password != '') {
      Alert.alert('Error', 'Please Enter a valid email', [
        {text: 'Ok', onPress: () => console.log('Ok Pressed')},
      ]);
    }
  };

  const validateEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <View style={style.container}>
      <ImageBackground source={image} style={style.image}>
        <Text style={style.text}>
          Start Your First step by learning online course now
        </Text>
        <KeyboardAvoidingView>
          <View animation="fadeInUpBig" style={style.loginContainer}>
            <BlurView style={[style.absolute]} blurAmount={5} />
            <Text style={style.signIn}>Sign in</Text>
            <TextBox style={style.signInsub}>
              Please sign in using your credentials
            </TextBox>
            <View style={style.inputWrap}>
              <TextInput
                placeholder="Email"
                textContentType="emailAddress"
                style={style.inputboxborderBottom}
                placeholderTextColor={'hsla(0, 0%, 95%, 0.7)'}
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials((prevState) => ({
                    ...prevState,
                    username: text,
                  }))
                }
                value={credentials.username}
              />
              <TextInput
                placeholder="Password"
                style={style.inputbox}
                placeholderTextColor={'hsla(0, 0%, 95%, 0.7)'}
                onChangeText={(text) =>
                  setCredentials((prevState) => ({
                    ...prevState,
                    password: text,
                  }))
                }
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity
              style={style.buttonPrimary}
              onPress={() => {
                Keyboard.dismiss();
                loginHandler();
              }}>
              <Text style={style.buttonPrimaryText}>Login Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.buttonSecondary}>
              <Text style={style.buttonSecondaryText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
      {isLoading ? <Loader /> : null}
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
  inputboxborderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    paddingHorizontal: 15,
    paddingVertical: 7,
    color: 'hsla(0, 0%, 95%, 1)',
    fontSize: 15,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
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
  buttonSecondary: {
    backgroundColor: '#dadada',
    borderRadius: 2,
    padding: 12,
    marginBottom: 10,
  },
  buttonSecondaryText: {
    color: '#2D2D2E',
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

export default Login;
