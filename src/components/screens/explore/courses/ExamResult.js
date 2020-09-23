import React from 'react';
import TextBox from '../../../components/TextBox';
import color from '../../../../assets/styles/color';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const ExamResult = ({navigation, route}) => {
  const {courseData, resultData, noOfQuestion} = route.params;
  console.log(courseData, resultData);
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          marginTop: 15,
          flex: 1,
        }}>
        <ScrollView>
          <View style={{padding: 25}}>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Marks Obtained</TextBox>
              <TextBox style={style.value}>{resultData.obtain_mark}</TextBox>
            </View>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Total Marks</TextBox>
              <TextBox style={style.value}>{noOfQuestion}</TextBox>
            </View>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Result Status</TextBox>
              <TextBox style={style.value}>
                {(resultData.obtain_mark / noOfQuestion) * 100 >
                courseData.exams[0].passing_percentage
                  ? 'Pass'
                  : 'Fail'}
              </TextBox>
            </View>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Grading</TextBox>
              <View style={{flexDirection: 'row', marginTop: 7}}>
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: '#FD5F53',
                    width: '50%',
                    alignItems: 'flex-end',
                  }}>
                  <TextBox
                    style={{
                      fontSize: 12,
                      lineHeight: 15,
                      color: '#fff',
                    }}>
                    Fail (0-49)
                  </TextBox>
                </View>
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    backgroundColor: '#8BCB75',
                    width: '50%',
                    alignItems: 'flex-end',
                  }}>
                  <TextBox
                    style={{
                      fontSize: 12,
                      lineHeight: 15,
                      color: '#fff',
                    }}>
                    Pass(50-100)
                  </TextBox>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={style.buttonWrap}>
        <TouchableOpacity
          style={{width: Dimensions.get('window').width / 2}}
          onPress={() => {
            navigation.navigate('Course Progress');
          }}>
          <View style={style.cancelButton}>
            <Text style={style.cancelButtonText}>Retake Exam</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: Dimensions.get('window').width / 2}}
          onPress={() => navigation.navigate('Profile')}>
          <View style={style.resetButton}>
            <Text style={style.resetButtonText}>Finish</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  buttonWrap: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: color.primaryTextColor,
    textAlign: 'center',
  },
  resetButton: {
    padding: 20,
    width: '100%',
    backgroundColor: color.primaryBrandColor,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    color: color.primaryTextColor,
    opacity: 0.7,
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    lineHeight: 19,
    color: color.primaryTextColor,
  },
});
export default ExamResult;
