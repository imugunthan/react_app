import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {
  LoginState,
  onLogin,
  onLogout,
} from './src/components/services/Authentiaction';
import {NavigationContainer} from '@react-navigation/native';
import {AppNavigation} from './src/components/navigations/AppNavigation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const App = () => {
  const [isLoggedin, setloggedIn] = useState(false);
  LoginState().then((data) => setloggedIn(data));
  const loginHandler = (loginStatevalue, data) => {
    loginStatevalue ? onLogin(data) : onLogout();
    setloggedIn(loginStatevalue);
  };

  return (
    <SafeAreaView style={style.container}>
      <SafeAreaProvider>
        <NavigationContainer style={style.bodyContainer}>
          <AppNavigation isLoggedin={isLoggedin} authHandler={loginHandler} />
        </NavigationContainer>
      </SafeAreaProvider>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bodyContainer: {
    backgroundColor: '#E5E5E5',
  },
});

export default App;
