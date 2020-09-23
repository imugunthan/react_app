import React from 'react';
import {View, StyleSheet} from 'react-native';
import color from '../../assets/styles/color';

const ProgressBar = ({width}) => {
  return (
    <View style={style.progressWrap}>
      <View style={[{...style.progressBar}, {width: width}]}></View>
    </View>
  );
};

const style = StyleSheet.create({
  progressWrap: {
    width: '100%',
    height: 11,
    backgroundColor: 'rgba(150, 163, 169, 0.58)',
    borderRadius: 4,
    marginTop: 15,
  },
  progressBar: {
    height: 11,
    backgroundColor: color.primaryBrandColor,
    borderRadius: 4,
  },
});

export default ProgressBar;
