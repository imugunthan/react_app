import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FooterButton = (props) => {
  return (
    <View
      style={[
        {...style.button},
        {backgroundColor: props.bgColor},
        {...props.style},
      ]}>
      <Text style={[{...style.buttonText}, {color: props.textColor}]}>
        {props.title}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  button: {
    borderRadius: 2,
    padding: 20,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
});
export default FooterButton;
