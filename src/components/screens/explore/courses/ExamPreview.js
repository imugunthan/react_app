import React from 'react';
import TextBox from '../../../components/TextBox';
import color from '../../../../assets/styles/color';
import {getData} from '../../../services/AsyncStorage';
import {View, Text, StyleSheet, Dimensions, Alert} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const ExamPreview = ({navigation, route}) => {
  const {courseId, courseData} = route.params;

  const startExam = async () => {
    try {
      const current_user = await getData('user_id');
      let examIndex = courseData.exams_marks.findIndex(
        (exam) => exam.user_id == current_user,
      );
      if (
        examIndex != -1 &&
        courseData.exams_marks[examIndex].attempts >=
          courseData.exams[0].number_of_attempts
      ) {
        Alert.alert('Error', 'You have crossed maximum attempts!', [
          {text: 'Ok', onPress: () => navigation.navigate('Course Progress')},
        ]);
      } else {
        navigation.navigate('Exam', {
          exam_id: courseData.exams[0].id,
          courseId: courseId,
          courseData: courseData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
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
              <TextBox style={style.label}>Duration(Mins)</TextBox>
              <TextBox style={style.value}>
                {courseData.exams[0].duration}
              </TextBox>
            </View>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Expiry</TextBox>
              <TextBox style={style.value}>
                {courseData.exams[0].expiry} Days From Course End.
              </TextBox>
            </View>
            <View style={{marginBottom: 25}}>
              <TextBox style={style.label}>Description</TextBox>
              <TextBox style={style.value}>
                {courseData.exams[0].description}
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
                    Fail (0-{courseData.exams[0].passing_percentage - 1})
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
                    Pass({courseData.exams[0].passing_percentage}-100)
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
            <Text style={style.cancelButtonText}>Skip</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: Dimensions.get('window').width / 2}}
          onPress={() => startExam()}>
          <View style={style.resetButton}>
            <Text style={style.resetButtonText}>Start Exam</Text>
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
export default ExamPreview;
