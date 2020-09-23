import React from 'react';
import Login from '../screens/login/Login';
import Tenant from '../screens/login/Tenant';
import {CourseNavigation} from './CourseNavigation';
import {MessageNavigation} from './MessageNavigation';
import {ProfileNavigation} from './ProfileNavigation';
import {createStackNavigator} from '@react-navigation/stack';
import {tabBarSettings, tabBarIconSettings, navOptions} from './navOptions';
import Notifications from '../screens/notification/Notifications';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

export const UnAuthenticatedScreens = ({authHandler}) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={navOptions(false)}>
      <Stack.Screen name="Tenant Entry" component={Tenant} />
      <Stack.Screen name="Login">
        {(props) => <Login {...props} authHandler={authHandler} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export const AuthenticatedScreens = ({authHandler}) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="Explore" tabBarOptions={tabBarSettings()}>
      <Tab.Screen
        name="Explore"
        component={CourseNavigation}
        initialParams={{defaultRouteName: 'Explore'}}
        options={tabBarIconSettings(24, 'chrome-reader-mode', 'Explore')}
      />
      <Tab.Screen
        name="My Feed"
        component={CourseNavigation}
        initialParams={{defaultRouteName: 'Feeds'}}
        options={tabBarIconSettings(24, 'book', 'My Feed')}
      />
      <Tab.Screen
        name="Messages"
        component={MessageNavigation}
        options={tabBarIconSettings(24, 'email', 'Messages')}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={tabBarIconSettings(24, 'notifications', 'Notifications')}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        initialParams={{authHandler}}
        options={tabBarIconSettings(24, 'person', 'Profile')}
      />
    </Tab.Navigator>
  );
};

export const AppNavigation = ({isLoggedin, authHandler}) =>
  !isLoggedin ? (
    <UnAuthenticatedScreens authHandler={authHandler} />
  ) : (
    <AuthenticatedScreens authHandler={authHandler} />
  );
