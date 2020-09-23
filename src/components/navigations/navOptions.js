import React from 'react';
import color from '../../assets/styles/color';
import Icon from 'react-native-vector-icons//MaterialIcons';
import {CardStyleInterpolators} from '@react-navigation/stack';

export const navOptions = (headerVisible) => {
  return {
    headerShown: headerVisible,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    headerBackTitleStyle: {
      fontSize: 13,
    },
  };
};

export const tabBarSettings = () => {
  return {
    inactiveTintColor: '#4C4C4C',
    activeTintColor: color.primaryBrandColor,
    safeAreaInsets: {bottom: 10},
  };
};

export const tabBarIconSettings = (iconSize, iconName, tabBarLabel) => {
  return {
    tabBarLabel: tabBarLabel,
    tabBarIcon: ({color}) => (
      <Icon name={iconName} color={color} size={iconSize} />
    ),
  };
};
