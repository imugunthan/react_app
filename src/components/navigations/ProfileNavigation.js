import React from 'react';
import {navOptions} from './navOptions';
import Badges from '../screens/profile/Badges';
import Profile from '../screens/profile/Profile';
import BasicInfo from '../screens/profile/BasicInfo';
import {createStackNavigator} from '@react-navigation/stack';
import ChangePassword from '../screens/profile/ChangePassword';
import MyCertificates from '../screens/profile/MyCertificates';

export const ProfileNavigation = ({route}) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={navOptions(true)}>
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={{authHandler: route.params.authHandler}}
      />
      <Stack.Screen name="Basic Info" component={BasicInfo} />
      <Stack.Screen name="Badges" component={Badges} />
      <Stack.Screen name="My Certificates" component={MyCertificates} />
      <Stack.Screen name="Change Password" component={ChangePassword} />
    </Stack.Navigator>
  );
};
