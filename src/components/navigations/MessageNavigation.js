import React from 'react';
import {navOptions} from './navOptions';
import {createStackNavigator} from '@react-navigation/stack';
import Conversations from '../screens/messages/Conversations';
import ConversationDetail from '../screens/messages/ConversationDetail';

export const MessageNavigation = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={navOptions(true)}>
      <Stack.Screen name="Messages" component={Conversations} />
      <Stack.Screen
        name="Conversation Detail"
        component={ConversationDetail}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};
