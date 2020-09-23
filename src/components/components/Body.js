import React from 'react';
import {View} from 'react-native';

const Body = (props) => {
  return (
    <View
      style={[{paddingHorizontal: 10, paddingVertical: 15}, {...props.style}]}>
      {props.children}
    </View>
  );
};

export default Body;
