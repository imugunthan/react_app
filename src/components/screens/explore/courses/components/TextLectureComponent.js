import React from 'react';
import HTML from 'react-native-render-html';
import {View, Text, StyleSheet} from 'react-native';
import color from '../../../../../assets/styles/color';
import TextBox from '../../../../components/TextBox';

const TextLectureComponent = ({data}) => {
  return (
    <View>
      {data.hide_title ? null : (
        <Text style={style.sectionTitle}>{data?.title}</Text>
      )}
      <HTML
        baseFontStyle={{fontFamily: 'Inter-Regular'}}
        ignoredStyles={['font-family']}
        style={style.lectureDescription}
        html={data.description}
      />
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
  lectureDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4f4f4f',
    marginRight: 15,
    marginBottom: 25,
  },
});

export default TextLectureComponent;
