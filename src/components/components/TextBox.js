import React from 'react';
import {Text, StyleSheet} from 'react-native';

const TextBox = (props) => {
  return (
    <Text style={[{fontFamily: 'Inter-Regular', ...props.style}]}>
      {props.children}
    </Text>
  );
};

export default TextBox;
