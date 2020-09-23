import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Loader from '../../../components/Loader';
import React, {useState, useEffect} from 'react';
import TextBox from '../../../components/TextBox';
import {apiData} from '../../../../static/Static';
import color from '../../../../assets/styles/color';
import {Picker} from '@react-native-community/picker';
import {ScrollView} from 'react-native-gesture-handler';
import FooterButton from '../../../components/FooterButton';
import axiosInstance from '../../../services/AxiosInterceptor';
import {getData} from '../../../services/AsyncStorage';

const Exam = ({navigation, route}) => {
  const {exam_id, courseId, courseData} = route.params;
  const [minutes, setMinutes] = useState(
    courseData.exams[0].duration - 1 < 10
      ? ('0' + (courseData.exams[0].duration - 1)).slice(-2)
      : courseData.exams[0].duration - 1,
  );
  const [seconds, setSeconds] = useState(59);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [resultData, setResultData] = useState(resultData);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCounterExpired, setIsCounterExpired] = useState(false);

  React.useEffect(() => {
    // setMinutes(courseData.exams[0].duration);
    setAnswerSubmitted(false);
    setQuestions([]);
    setIsLoading(true);
    getQuestionForExam();
  }, [navigation]);

  useEffect(() => {
    // setMinutes(courseData.exams[0].duration);
    navigation.setOptions({
      headerRight: () => (
        <Text style={{marginRight: 20}}>
          {minutes}:{seconds}
        </Text>
      ),
    });
    let interval = null;
    interval = setInterval(() => {
      if (!isCounterExpired) {
        if (seconds <= 0) {
          if (minutes <= 0 && seconds <= 0) {
            setIsCounterExpired(true);
            clearInterval(interval);
            submitHandler();
          } else {
            setMinutes((minutes) =>
              minutes - 1 < 10 ? ('0' + (minutes - 1)).slice(-2) : minutes - 1,
            );
            setSeconds(59);
          }
        } else {
          setSeconds((seconds) =>
            seconds - 1 < 10 ? ('0' + (seconds - 1)).slice(-2) : seconds - 1,
          );
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const getQuestionForExam = async () => {
    try {
      axiosInstance
        .post(`${apiData.apiUrl}/question/added/list`, {
          exam_id: exam_id,
        })
        .then((data) => {
          data.data.questions.forEach((ques) => {
            if (ques.content.content_kind == 2 && ques.content.quiz_kind == 1) {
              ques.content.options.forEach((option) => {
                option.isChecked = false;
              });
            } else if (
              ques.content.content_kind == 2 &&
              ques.content.quiz_kind == 2
            ) {
              ques.content.selectedValue = ques.content.options[0].option;
            } else if (
              ques.content.content_kind == 2 &&
              ques.content.quiz_kind == 2
            ) {
              ques.content.userInput = '';
            }
          });
          data.data.questions.forEach((ques) => {
            setQuestions((prevState) => [...prevState, ques.content]);
          });
          setIsLoading(false);
        })
        .catch((er) => {
          setIsLoading(false);
          console.log(er);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const checkboxHanlder = (questionIndex, optionIndex) => {
    let newQues = [...questions];
    newQues[questionIndex].options[optionIndex].isChecked = !newQues[
      questionIndex
    ].options[optionIndex].isChecked;
    setQuestions(newQues);
  };

  const selectBoxHandler = (questionIndex, value) => {
    let newQues = [...questions];
    newQues[questionIndex].selectedValue = value;
    setQuestions(newQues);
  };

  const textInputHandler = (questionIndex, value) => {
    let newQues = [...questions];
    newQues[questionIndex].userInput = value;
    setQuestions(newQues);
  };

  const submitHandler = async () => {
    try {
      const current_user = await getData('user_id');
      const output = questions.map((ques) => {
        if (ques.quiz_kind == 1) {
          let valueArr = ques.options.map((x) => x.value);
          let selectArr = ques.options.map((x) => x.isChecked);
          return JSON.stringify(valueArr) == JSON.stringify(selectArr);
        } else if (ques.quiz_kind == 2) {
          let val = ques.options.filter((x) => x.value == true);
          return val[0].option == ques.selectedValue;
        } else if (ques.quiz_kind == 3) {
          return ques.answer.toLowerCase() == ques.userInput.toLowerCase();
        }
      });
      setAnswerSubmitted(true);
      let noOfCorrectAnswers = output.filter((x) => x == true).length;
      setCorrectAnswers(noOfCorrectAnswers);
      axiosInstance
        .post(`${apiData.apiUrl}/set/exam_marks`, {
          course_id: courseId,
          exam_id: exam_id,
          is_complete: true,
          obtain_mark: noOfCorrectAnswers,
          user_id: current_user,
        })
        .then((data) => {
          setResultData(data.data.questions);
        })
        .catch((er) => console.log(er));
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <View style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            padding: 25,
            backgroundColor: '#fff',
            marginTop: 15,
            flex: 1,
          }}>
          {questions.map((question, questionIndex) => {
            return (
              <View style={style.question} key={questionIndex + question.title}>
                <Text style={style.sectionTitle}>Q. {question.title}</Text>
                {question.quiz_kind == 1 ? (
                  <View style={style.optionsWrap}>
                    {question.options.map((option, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}>
                          <CheckBox
                            onClick={() =>
                              checkboxHanlder(questionIndex, index)
                            }
                            checkedCheckBoxColor={color.primaryBrandColor}
                            uncheckedCheckBoxColor={color.primaryTextColor}
                            isChecked={option.isChecked}
                          />
                          <TextBox style={{marginLeft: 10}}>
                            {option.option}
                          </TextBox>
                        </View>
                      );
                    })}
                    {answerSubmitted ? (
                      <View>
                        <Text
                          style={[
                            {...style.sectionTitle},
                            {marginTop: 15, color: 'green'},
                          ]}>
                          Answer:
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          {question.options.map((x, index) =>
                            x.value ? <Text>{x.option} </Text> : null,
                          )}
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : question.quiz_kind == 2 ? (
                  <View
                    style={{
                      borderColor: Platform.OS == 'android' ? '#dadada' : '',
                      borderWidth: Platform.OS == 'android' ? 1 : 0,
                    }}>
                    <Picker
                      selectedValue={question.selectedValue}
                      onValueChange={(value) =>
                        selectBoxHandler(questionIndex, value)
                      }>
                      {question.options.map((opt, index) => {
                        return (
                          <Picker.Item
                            label={opt.option}
                            value={opt.option}></Picker.Item>
                        );
                      })}
                    </Picker>
                    {answerSubmitted ? (
                      <View>
                        <Text
                          style={[
                            {...style.sectionTitle},
                            {marginTop: 15, color: 'green'},
                          ]}>
                          Answer:
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          {question.options.map((x, index) =>
                            x.value ? <Text>{x.option} </Text> : null,
                          )}
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : question.quiz_kind == 3 ? (
                  <View>
                    <TextInput
                      placeholder={'Enter your answer'}
                      style={{
                        borderWidth: 1,
                        borderColor: '#dadada',
                        padding: 10,
                        borderRadius: 4,
                      }}
                      value={question.userInput}
                      onChangeText={(text) =>
                        textInputHandler(questionIndex, text)
                      }
                    />
                    {answerSubmitted ? (
                      <View>
                        <Text
                          style={[
                            {...style.sectionTitle},
                            {marginTop: 15, color: 'green'},
                          ]}>
                          Answer:
                        </Text>
                        <Text>{question.answer}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </View>
            );
          })}
          {answerSubmitted ? (
            <View style={{marginTop: 30}}>
              <Text style={style.sectionTitle}>Your Score</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: color.primaryBrandColor,
                  backgroundColor: color.primaryBrandColor,
                  padding: 30,
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'Inter-Bold',
                  }}>
                  {correctAnswers} / {questions.length}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      {answerSubmitted ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Exam Result', {
              courseData: courseData,
              resultData: resultData,
              noOfQuestion: questions.length,
            })
          }>
          <FooterButton
            title="Result Details"
            bgColor={color.primaryBrandColor}
            textColor={'#fff'}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => submitHandler()}>
          <FooterButton
            title="Submit"
            bgColor={color.primaryBrandColor}
            textColor={'#fff'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  question: {
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DADADA',
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
});

export default Exam;
