import React from 'react';
import color from '../../assets/styles/color';
import {View, ActivityIndicator} from 'react-native';

const Loader = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
      }}>
      <ActivityIndicator size="large" color={color.primaryBrandColor} />
    </View>
  );
};

export default Loader;
