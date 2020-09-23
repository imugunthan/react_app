import React from 'react';
import HTML from 'react-native-render-html';
import {View, Text, StyleSheet} from 'react-native';
import color from '../../../../../assets/styles/color';

const HtmlComponent = ({data}) => {
  return (
    <View style={{marginBottom: 30}}>
      {data.hide_title ? null : (
        <Text style={style.sectionTitle}>{data.title}</Text>
      )}
      <HTML html={data.description} />
    </View>
  );
};

const style = StyleSheet.create({
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
});

export default HtmlComponent;
