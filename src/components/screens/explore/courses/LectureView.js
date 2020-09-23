import React, {useState} from 'react';
import Loader from '../../../components/Loader';
import {apiData} from '../../../../static/Static';
import color from '../../../../assets/styles/color';
import {View, Text, StyleSheet, Alert, StatusBar} from 'react-native';
import HtmlComponent from './components/HtmlComponent';
import QuizComponent from './components/QuizComponent';
import {getData} from '../../../services/AsyncStorage';
import MediaComponent from './components/MediaComponent';
import axiosInstance from '../../../services/AxiosInterceptor';
import TextLectureComponent from './components/TextLectureComponent';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {BackHandler} from 'react-native';
import Orientation from 'react-native-orientation';

const LectureView = ({navigation, route}) => {
  const [courseData, setCourseData] = useState({});
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    courseId,
    lectureId,
    sectionId,
    lectureList,
    sectionList,
  } = route.params;
  const [currentLecture, setCurrentLecture] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(0);
  const [activeLectureId, setActiveLectureId] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('');
  const [isfullscreenMode, setIsfullScreenMode] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    setComponents([]);
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({
        headerBackTitle: 'Progress',
        title: 'Lecture',
      });
    });

    getLectureDatas(lectureId);
    setActiveSectionId(sectionId);
    setActiveLectureId(lectureId);
    setSelectedLecture(lectureList.indexOf(lectureId));
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: !isfullscreenMode,
    });
  }, [isfullscreenMode]);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const handleBackButtonClick = () => {
    Orientation.lockToPortrait();
    StatusBar.setHidden(false);
  };

  const getLectureDatas = async (lecId) => {
    try {
      await axiosInstance
        .get(`${apiData.apiUrl}/course/${courseId}`)
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((er) => console.log(er));
      await axiosInstance
        .get(`${apiData.apiUrl}/lecture/${lecId}`)
        .then((res) => {
          setCurrentLecture(res.data);
          if (res.data.components.length != 0) {
            res.data.components.forEach(async (com, index) => {
              await axiosInstance
                .get(`${apiData.apiUrl}/component/${com.id}/content`)
                .then(async (data) => {
                  data.data.showAnswer = false;
                  data.data.disableSubmitButton = false;
                  const newData = await dataModificationHandler(data);
                  setComponents((prevState) => [...prevState, newData.data]);
                  setIsLoading(false);
                })
                .catch((er) => {
                  setIsLoading(false);
                  console.log(er);
                });
            });
          } else {
            setIsLoading(false);
          }
        })
        .catch((er) => {
          console.log(er);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const checkboxHanlder = (compIndex, optionIndex) => {
    setComponents((prevState) => [
      ...prevState,
      (prevState[compIndex].options[optionIndex].isChecked = !prevState[
        compIndex
      ].options[optionIndex].isChecked),
    ]);
  };

  const submitAnswerHandler = (compIndex) => {
    setComponents((prevState) => [
      ...prevState,
      (prevState[compIndex].disableSubmitButton = true),
    ]);
    if (components[compIndex].settings.show_answer == 'after_question') {
      setComponents((prevState) => [
        ...prevState,
        (prevState[compIndex].showAnswer = true),
      ]);
    }
  };

  const selectBoxHandler = (compIndex, value) => {
    setComponents((prevState) => [
      ...prevState,
      (prevState[compIndex].selectedValue = value),
    ]);
  };

  const navigationHandler = async (stepValue, steptype) => {
    try {
      const current_user = await getData('user_id');
      const isCompleteIndex = currentLecture.lecture_status_lecture.findIndex(
        (lecture) => lecture.user_id == current_user,
      );
      const activeSectionIndex = sectionList.findIndex(
        (section) => section.section.id == activeSectionId,
      );
      const activeLectureInSectionIndex = sectionList[
        activeSectionIndex
      ].lectures.findIndex((lec) => lec.lecture.id == activeLectureId);
      if (isCompleteIndex >= 0 && (steptype == 'next' || steptype == 'prev')) {
        navigationDataHandler(stepValue);
      } else if (isCompleteIndex < 0) {
        if (
          activeLectureInSectionIndex ==
          sectionList[activeSectionIndex].lectures.length - 1
        ) {
        }
        axiosInstance
          .post(`${apiData.apiUrl}/lecture_status`, {
            is_completed: true,
            lecture_id: activeLectureId,
            user_id: current_user,
          })
          .then((data) => {
            axiosInstance
              .post(`${apiData.apiUrl}/section_status`, {
                user_id: current_user,
                section_id: activeSectionId,
                is_completed: true,
              })
              .then((data) => {
                if (steptype == 'prev' || steptype == 'next') {
                  navigationDataHandler(stepValue);
                }
              })
              .catch((er) => console.log(er));
          })
          .catch((er) => console.log(er));
      }
      if (steptype == 'next' || steptype == 'prev') {
        if (
          stepValue == 1 &&
          activeLectureInSectionIndex ==
            sectionList[activeSectionIndex].lectures.length - 1
        ) {
          setActiveSectionId(
            sectionList[activeSectionIndex + stepValue].section.id,
          );
        } else if (stepValue == -1 && activeLectureInSectionIndex == 0) {
          setActiveSectionId(
            sectionList[activeSectionIndex + stepValue].section.id,
          );
        }
      } else if (steptype == 'finish') {
        axiosInstance
          .get(`${apiData.apiUrl}/course/${courseId}`)
          .then((data) => {
            const completedData = data.data.meta_data.completed_per.filter(
              (x) => x.user_id == current_user,
            );
            navigation.navigate('Course Progress', {
              courseId: courseId,
              completedPer: completedData[0].completed_per,
            });
          })
          .catch((er) => console.log(er));
      } else if (steptype == 'finish & take exam') {
        axiosInstance
          .get(`${apiData.apiUrl}/course/${courseId}`)
          .then((data) => {
            const completedData = data.data.meta_data.completed_per.filter(
              (x) => x.user_id == current_user,
            );
            if (completedData[0].completed_per == 100) {
              navigation.navigate('Exam Preview', {
                courseId: courseId,
                courseData: data.data,
              });
            } else {
              Alert.alert(
                'Error',
                'Please complete all the lectures to take exam',
                [{text: 'Ok', onPress: () => console.log('Ok Pressed')}],
              );
            }
          })
          .catch((er) => console.log(er));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigationDataHandler = (stepValue) => {
    let count = selectedLecture + stepValue;
    setSelectedLecture(count);
    let id = lectureList[selectedLecture + stepValue];
    setActiveLectureId(id);
    setComponents([]);
    setIsLoading(true);
    getLectureDatas(id);
  };

  const dataModificationHandler = async (data) => {
    if (data.data.content_kind == 2 && data.data.quiz_kind == 1) {
      data.data.options.forEach((option) => {
        option.isChecked = false;
      });
      return data;
    } else if (data.data.content_kind == 2 && data.data.quiz_kind == 2) {
      data.data.selectedValue = data.data.options[0].option;
      return data;
    } else if (data.data.content_kind == 3 && data.data.type == 'vimeo_link') {
      const result = await vimeoVideoHandler(data.data.key);
      data.data.videoUrl = result;
      return data;
    } else {
      return data;
    }
  };

  const vimeoVideoHandler = async (key) => {
    const result = await fetch(
      `https://player.vimeo.com/video/${key.replace('vimeo-', '')}/config`,
    ).then((res) => res.json());
    return result.request.files.hls.cdns[result.request.files.hls.default_cdn]
      .url;
  };

  const fullScreenHandler = () => {
    setIsfullScreenMode(!isfullscreenMode);
    StatusBar.setHidden(true);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <View style={{flex: 1}}>
      <ScrollView>
        <View
          style={
            !isfullscreenMode
              ? {padding: 25, backgroundColor: '#fff', marginTop: 15}
              : null
          }>
          {components.length != 0
            ? components.map((comp, compIndex) => {
                return comp.content_kind == 1 && !isfullscreenMode ? (
                  <TextLectureComponent
                    key={compIndex + comp.pg_id}
                    data={comp}
                  />
                ) : comp.content_kind == 2 && !isfullscreenMode ? (
                  <QuizComponent
                    key={compIndex + comp.pg_id}
                    data={comp}
                    compIndex={compIndex}
                    checkboxHanlder={checkboxHanlder}
                    selectBoxHandler={selectBoxHandler}
                    submitAnswerHandler={submitAnswerHandler}
                  />
                ) : comp.content_kind == 3 ? (
                  <MediaComponent
                    data={comp}
                    key={compIndex + comp.pg_id}
                    fullScreenHandler={fullScreenHandler}
                    isfullscreenMode={isfullscreenMode}
                  />
                ) : comp.content_kind == 4 && !isfullscreenMode ? (
                  <HtmlComponent data={comp} key={compIndex + comp.pg_id} />
                ) : null;
              })
            : null}
        </View>
      </ScrollView>
      {!isfullscreenMode ? (
        <View style={style.buttonWrap}>
          <View style={style.cancelButton}>
            <TouchableOpacity
              disabled={selectedLecture == 0}
              onPress={() => navigationHandler(-1, 'prev')}>
              <Text style={style.cancelButtonText}>Prev Lecture</Text>
            </TouchableOpacity>
          </View>
          {selectedLecture == lectureList.length - 1 ? (
            courseData.enable_exam && courseData.exams.length ? (
              <View style={style.resetButton}>
                <TouchableOpacity
                  onPress={() => navigationHandler(1, 'finish & take exam')}>
                  <Text style={style.resetButtonText}>Finish & Take Exam</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={style.resetButton}>
                <TouchableOpacity
                  onPress={() => navigationHandler(1, 'finish')}>
                  <Text style={style.resetButtonText}>Finish</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View style={style.resetButton}>
              <TouchableOpacity onPress={() => navigationHandler(1, 'next')}>
                <Text style={style.resetButtonText}>Next Lecture</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  buttonWrap: {
    flexDirection: 'row',
  },
  cancelButton: {
    padding: 20,
    width: '50%',
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
    width: '50%',
    backgroundColor: color.primaryBrandColor,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    textAlign: 'center',
  },
});

export default LectureView;
