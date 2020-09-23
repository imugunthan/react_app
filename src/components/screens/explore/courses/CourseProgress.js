import React, {useState} from 'react';
import Body from '../../../components/Body';
import Loader from '../../../components/Loader';
import {apiData} from '../../../../static/Static';
import color from '../../../../assets/styles/color';
import {getData} from '../../../services/AsyncStorage';
import CourseCard from '../../../components/CourseCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../../../services/AxiosInterceptor';
import {Text, View, StyleSheet, LayoutAnimation} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const CourseProgress = ({navigation, route}) => {
  const [userId, setUserId] = useState('');
  const {courseId, completedPer} = route.params;
  const [courseData, setCourseData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const [lectureList, setLectureList] = useState([]);
  const [collapseList, setCollapseList] = useState([]);

  React.useEffect(() => {
    setIsLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    setCollapseList([]);
    setLectureList([]);
    getCourseData();
    return unsubscribe;
  }, [navigation]);

  const getCourseData = async () => {
    try {
      const current_user = await getData('user_id');
      setUserId(current_user);
      axiosInstance
        .get(`${apiData.apiUrl}/course/${courseId}/section_list`)
        .then((data) => {
          setCourseData(data.data.course);
          setIsLoading(false);
          setSectionList(data.data.section_list);
          data.data.section_list.forEach((sec, index) => {
            sec.lectures.forEach((lec, i) => {
              setLectureList((prevState) => [...prevState, lec.lecture.id]);
              setCollapseList((prevState) => [
                ...prevState,
                index == 0 && i == 0 ? true : false,
              ]);
            });
          });
        })
        .catch((er) => console.log(error));
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : !isLoading && courseData != '' ? (
        <Body>
          <View style={{marginHorizontal: -10}}>
            <CourseCard
              progressVisible={true}
              progressWidth={completedPer}
              cardData={{
                title: courseData.title,
                courseId: courseData.id,
                imageUrl: courseData.meta_data.image_url,
              }}
            />
          </View>
          {sectionList.length != 0 ? (
            <ScrollView style={{marginTop: 10}}>
              {sectionList.map((lecture, index) => {
                return (
                  <View
                    style={[{...style.lectureCard}]}
                    key={index + lecture.section.id}>
                    <View style={{flexGrow: 1}}>
                      <Text style={style.lectureTitle}>
                        {lecture.section.title}
                      </Text>
                      {collapseList[index] ? (
                        <View
                          style={{
                            marginTop: 15,
                          }}>
                          {lecture.lectures.map((lec, index) => {
                            return (
                              <View
                                key={index + lec.lecture.id}
                                style={{
                                  borderColor: '#dadada',
                                  borderWidth: 1,
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor:
                                    lec?.lecture_status_lecture?.findIndex(
                                      (x) => x.user.id == userId,
                                    ) != -1
                                      ? 'rgb(237, 239, 247)'
                                      : 'white',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Inter-Regular',
                                    fontSize: 12,
                                  }}>
                                  {lec.lecture.title}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate('Lecture View', {
                                      lectureId: lec.lecture.id,
                                      lectureList: lectureList,
                                      sectionList: sectionList,
                                      sectionId: lecture.section.id,
                                      courseId: courseId,
                                    });
                                  }}
                                  style={{
                                    backgroundColor: color.primaryBrandColor,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 2,
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontFamily: 'Inter-SemiBold',
                                      fontSize: 14,
                                    }}>
                                    Start
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut,
                        );
                        const newList = [...collapseList];
                        newList[index] = !newList[index];
                        setCollapseList(newList);
                      }}>
                      <Icon
                        name={
                          collapseList[index]
                            ? 'keyboard-arrow-down'
                            : 'keyboard-arrow-right'
                        }
                        size={24}
                        color={color.primaryTextColor}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </Body>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  lectureCard: {
    borderLeftColor: color.primaryBrandColor,
    borderLeftWidth: 5,
    padding: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  lectureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: color.primaryTextColor,
  },
});

export default CourseProgress;
