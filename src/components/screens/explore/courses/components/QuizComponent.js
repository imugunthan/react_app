import React from 'react';
import CheckBox from 'react-native-check-box';
import TextBox from '../../../../components/TextBox';
import {Picker} from '@react-native-community/picker';
import color from '../../../../../assets/styles/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';

const QuizComponent = ({
  data,
  compIndex,
  checkboxHanlder,
  selectBoxHandler,
  submitAnswerHandler,
}) => {
  return (
    <View style={{marginBottom: 15}}>
      <View style={style.question}>
        <Text style={style.sectionTitle}>Q. {data.title}</Text>
        {data.quiz_kind == 1 ? (
          <View style={style.optionsWrap}>
            {data.options.map((option, index) => {
              return (
                <View
                  key={index + option.option}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}>
                  <CheckBox
                    onClick={() => checkboxHanlder(compIndex, index)}
                    checkedCheckBoxColor={color.primaryBrandColor}
                    uncheckedCheckBoxColor={color.primaryTextColor}
                    isChecked={option.isChecked}
                  />
                  <TextBox style={{marginLeft: 10}}>{option.option}</TextBox>
                </View>
              );
            })}
            {data.showAnswer ? (
              <View>
                <Text style={[{...style.sectionTitle}, {marginTop: 15}]}>
                  Answer:
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {data.options.map((x, index) =>
                    x.value ? (
                      <Text key={index + x.option}>{x.option} </Text>
                    ) : null,
                  )}
                </View>
              </View>
            ) : null}
          </View>
        ) : data.quiz_kind == 2 ? (
          <View
            style={{
              borderColor: Platform.OS == 'android' ? '#dadada' : '',
              borderWidth: Platform.OS == 'android' ? 1 : 0,
            }}>
            <Picker
              selectedValue={data.selectedValue}
              onValueChange={(value) => selectBoxHandler(compIndex, value)}>
              {data.options.map((opt, index) => {
                return (
                  <Picker.Item
                    key={index + opt.option}
                    label={opt.option}
                    value={opt.option}></Picker.Item>
                );
              })}
            </Picker>
            {data.showAnswer ? (
              <View>
                <Text style={[{...style.sectionTitle}, {marginTop: 15}]}>
                  Answer:
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {data.options.map((x, index) =>
                    x.value ? (
                      <Text key={index + x.option}>{x.option} </Text>
                    ) : null,
                  )}
                </View>
              </View>
            ) : null}
          </View>
        ) : data.quiz_kind == 3 ? (
          <View>
            <TextInput
              placeholder={'Enter your answer'}
              style={{
                borderWidth: 1,
                borderColor: '#dadada',
                padding: 10,
                borderRadius: 4,
              }}
            />
            {data.showAnswer ? (
              <View>
                <Text style={[{...style.sectionTitle}, {marginTop: 15}]}>
                  Answer:
                </Text>
                <Text>{data.answer}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <View style={{alignItems: 'center', paddingTop: 15}}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5.5,
              backgroundColor: color.primaryBrandColor,
              opacity: data.disableSubmitButton ? 0.5 : 1,
            }}
            onPress={() => submitAnswerHandler(compIndex)}
            disabled={data.disableSubmitButton}>
            <Text style={style.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  question: {
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DADADA',
    padding: 20,
  },
  optionsWrap: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
  },
});

export default QuizComponent;
