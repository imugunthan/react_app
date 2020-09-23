import Moment from 'moment';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import React, {useState} from 'react';
import Body from '../../../components/Body';
import Loader from '../../../components/Loader';
import {apiData} from '../../../../static/Static';
import TextBox from '../../../components/TextBox';
import color from '../../../../assets/styles/color';
import {getData} from '../../../services/AsyncStorage';
import CourseCard from '../../../components/CourseCard';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterButton from '../../../components/FooterButton';
import axiosInstance from '../../../services/AxiosInterceptor';
import courseImage from '../../../../assets/images/sample-course-image.jpg';
import profilePicture from '../../../../assets/images/default-profile-picture.png';
import {razorpayPaymentGateway} from '../components/razorpayPaymentGateway';

const CurriculamDetails = ({navigation, route}) => {
  const {curriculamId} = route.params;
  const [userId, setUserId] = useState('');
  const [authorInfo, setAuthorInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trainerInfo, setTrainerInfo] = useState('');
  const [isEnrollNow, setIsEnrollNow] = useState(true);
  const [curriculamInfo, setCurriculamInfo] = useState('');
  const [disableEnrollNowButton, setDisableEnrollNowButton] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    getInitialRenderData();
    return unsubscribe;
  }, [navigation]);

  const getInitialRenderData = async () => {
    try {
      const current_user = await getData('user_id');
      setUserId(current_user);
      axiosInstance
        .get(`${apiData.apiUrl}/curriculum/${curriculamId}`)
        .then((data) => {
          data.data.curriculum_students.forEach((student) => {
            student.user_id == current_user
              ? setIsEnrollNow(false)
              : setIsEnrollNow(true);
          });
          setCurriculamInfo(data.data);
          axiosInstance
            .get(
              `${apiData.apiUrl}/student/curriculum/${curriculamId}/collaborators/list`,
            )
            .then((data) => {
              setAuthorInfo(data.data.collaborators.authors);
              setTrainerInfo(data.data.collaborators.trainers);
              setIsLoading(false);
            })
            .catch((er) => {
              console.log(er);
              setIsLoading(false);
            });
        })
        .catch((er) => {
          console.log(er);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const enrollCurriculam = () => {
    if (curriculamInfo.amount != 0) {
      axiosInstance
        .post(`${apiData.apiUrl}/razorpay/order/create`, {
          amount: curriculamInfo.amount,
          // amount: 1200,
          currency: 'INR',
          receipt: '11111',
          payment_capture: 1,
        })
        .then((data) => razorpayPaymentHandler(data.data))
        .catch((er) => console.log(er));
    } else {
      axiosInstance
        .post(`${apiData.apiUrl}/curriculum/add/users`, {
          user_ids: [userId],
          group_ids: [],
          curriculum_id: curriculamId,
        })
        .then((data) => {
          setIsEnrollNow(false);
        })
        .catch((er) => console.log(er));
    }
  };

  const unEnrollCurriculum = () => {
    axiosInstance
      .post(`${apiData.apiUrl}/curriculum/users/delete`, {
        curriculum_id: curriculamId,
        user_ids: [userId],
      })
      .then((data) => {
        setIsEnrollNow(true);
      })
      .catch((er) => console.log(er));
  };

  const razorpayPaymentHandler = async (data) => {
    const requiredDetails = {
      curriculumId: curriculamId,
      detail: curriculamInfo,
      courseId: '',
      paymentPrice: curriculamInfo.amount,
      currency: curriculamInfo.organization.currency,
      discountDetail: {
        id: '',
      },
      user: userId,
    };
    console.log('working');
    const paymentOutput = await razorpayPaymentGateway(data, requiredDetails);
    console.log(paymentOutput);
    axiosInstance
      .post(`${apiData.apiUrl}/transaction/create`, {
        order_id: paymentOutput.options.order_id,
        discount_id: '',
        user_id: userId,
        amount: curriculamInfo.amount.toString(),
        course_id: '',
        curriculum_id: curriculamId,
        payment_id: paymentOutput.data.razorpay_payment_id,
        response: JSON.stringify(paymentOutput.data),
        gateway: 'Razorpay',
      })
      .then((data) => {
        setIsEnrollNow(false);
      })
      .catch((er) => console.log(er));
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : !isLoading && curriculamInfo != '' ? (
        <View style={{flex: 1}}>
          <ScrollView>
            <View>
              <ImageBackground
                source={
                  curriculamInfo.meta_data_curriculum.cover_image_url
                    ? {uri: curriculamInfo.meta_data_curriculum.cover_image_url}
                    : courseImage
                }
                style={style.courseBackground}>
                <LinearGradient
                  colors={[
                    'rgba(0, 0, 0, 0.28)',
                    'rgba(0, 0, 0, 0.58)',
                    'rgba(0, 0, 0, 0.88)',
                  ]}
                  style={style.courseTop}>
                  <Text style={style.type}>
                    {curriculamInfo.category.title}
                  </Text>
                  <Text style={style.title}>{curriculamInfo.title}</Text>
                  <TextBox style={style.desc}>
                    Learn numpy, pandas,matplotlib , quantopian, finance,and
                    more for algorithmic trading with Python!
                  </TextBox>
                  <View style={{flexDirection: 'row'}}>
                    <View style={style.priceHolder}>
                      <Text style={style.priceText}>
                        ₹{curriculamInfo.amount}
                      </Text>
                    </View>
                  </View>
                  <Text style={style.courserCreatedAt}>
                    By {curriculamInfo.organization.name}, Created on{' '}
                    {Moment(curriculamInfo.created_at).format('DD MMM YYYY')}
                  </Text>
                  <Text style={style.courserCreatedAt}>
                    Last updated on 31 Jan 2019
                  </Text>
                </LinearGradient>
              </ImageBackground>
              <Body>
                <View style={style.card}>
                  <Text style={style.cardTitle}>Overview</Text>
                  <TextBox style={style.cardContent}>
                    {curriculamInfo.about}
                  </TextBox>
                </View>
                <View style={style.card}>
                  <Text style={style.cardTitle}>Schedule</Text>
                  <View style={style.labelValueWrap}>
                    <TextBox style={style.label}>Due Date</TextBox>
                    <TextBox style={style.value}>At your Leisure</TextBox>
                  </View>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={style.titleSub}>Courses</Text>
                  {curriculamInfo.course_id.map((course, index) => {
                    return (
                      <TouchableWithoutFeedback
                        key={index + course.id}
                        onPress={() =>
                          navigation.navigate('Course Details', {
                            courseId: course.id,
                          })
                        }
                        style={{marginHorizontal: -10}}>
                        <CourseCard
                          progressVisible={false}
                          cardData={{
                            title: course.title,
                            courseId: course.id,
                            imageUrl: '',
                          }}
                        />
                      </TouchableWithoutFeedback>
                    );
                  })}
                </View>
                <View style={style.card}>
                  <Text style={[{...style.titleSub}, {paddingTop: 5}]}>
                    Goals
                  </Text>
                  {curriculamInfo.goals.map((goal, index) => {
                    return (
                      <View style={style.goal} key={index + goal.title}>
                        <Icon name="done" size={24} color="#27AE60" />
                        <TextBox style={style.goalText}>{goal.title}</TextBox>
                      </View>
                    );
                  })}
                </View>
                {curriculamInfo.tags.length != 0 ? (
                  <View style={style.card}>
                    <Text style={[{...style.titleSub}, {paddingTop: 5}]}>
                      Tags
                    </Text>
                    {curriculamInfo.tags.map((tag, index) => {
                      return (
                        <View style={style.tagWrap} key={index}>
                          <View style={style.tag}>
                            <Text style={style.tagText}>Design</Text>
                          </View>
                          <View style={style.tag}>
                            <Text style={style.tagText}>Other</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
                <View style={style.card}>
                  <Text style={[{...style.titleSub}, {paddingTop: 5}]}>
                    Trainers
                  </Text>
                  {trainerInfo.length == 0 ? (
                    <Text>There are no trainers.</Text>
                  ) : (
                    trainerInfo.map((trainer, index) => {
                      return (
                        <View
                          style={{flexDirection: 'row', marginBottom: 20}}
                          key={index + trainer.user.name}>
                          <Image
                            source={
                              trainer.user.image_url
                                ? {uri: trainer.user.image_url}
                                : profilePicture
                            }
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35 / 2,
                              resizeMode: 'cover',
                              marginRight: 15,
                            }}
                          />
                          <View style={{flex: 1}}>
                            <Text style={style.reviewerName}>
                              {trainer.user.name}
                            </Text>
                            <TextBox style={style.reviewerDesignation}>
                              {trainer.course.title}
                            </TextBox>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
                <View style={style.card}>
                  <Text style={[{...style.titleSub}, {paddingTop: 5}]}>
                    Authors
                  </Text>
                  {authorInfo.length == 0 ? (
                    <Text>There are no authors.</Text>
                  ) : (
                    authorInfo.map((author, index) => {
                      return (
                        <View
                          style={{flexDirection: 'row', marginBottom: 20}}
                          key={index + author.user.name}>
                          <Image
                            source={
                              author.user.image_url
                                ? {uri: author.user.image_url}
                                : profilePicture
                            }
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35 / 2,
                              resizeMode: 'cover',
                              marginRight: 15,
                            }}
                          />
                          <View style={{flex: 1}}>
                            <Text style={style.reviewerName}>
                              {author.user.name}
                            </Text>
                            <TextBox style={style.reviewerDesignation}>
                              {author.course.title}
                            </TextBox>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              </Body>
            </View>
          </ScrollView>
          {isEnrollNow ? (
            <TouchableOpacity
              onPress={() => {
                enrollCurriculam();
              }}>
              <FooterButton
                title="Enroll Now"
                bgColor={color.primaryBrandColor}
                textColor={'#fff'}
                style={{opacity: disableEnrollNowButton ? 0.5 : 1}}
              />
            </TouchableOpacity>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  width: Dimensions.get('window').width / 2,
                }}
                onPress={() => {
                  navigation.navigate('My Feed');
                }}>
                <View style={style.cancelButton}>
                  <Text style={style.cancelButtonText}>Continue Learning</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: Dimensions.get('window').width / 2,
                }}
                onPress={() => unEnrollCurriculum()}>
                <View style={style.resetButton}>
                  <Text style={style.resetButtonText}>Unenroll</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    backgroundColor: 'white',
  },
  filterTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 22,
    color: color.primaryTextColor,
  },
  courseBackground: {
    width: '100%',
  },
  courseTop: {
    paddingTop: 15,
    paddingRight: 45,
    paddingBottom: 35,
    paddingLeft: 25,
  },
  type: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#fff',
    opacity: 0.76,
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    lineHeight: 30,
    color: '#fff',
    marginBottom: 5,
  },
  desc: {
    fontSize: 14,
    lineHeight: 19,
    color: '#fff',
    opacity: 0.76,
    marginBottom: 15,
  },
  priceHolder: {
    backgroundColor: '#FFB257',
    borderRadius: 2,
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginBottom: 10,
  },
  priceText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  courserCreatedAt: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    lineHeight: 16,
    color: '#fff',
  },
  card: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
  cardContent: {
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
  labelValueWrap: {
    marginBottom: 20,
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
  titleSub: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 20,
    color: color.primaryTextColor,
    paddingVertical: 15,
  },
  reviewerName: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: '#000',
  },
  reviewerDesignation: {
    fontSize: 11,
    lineHeight: 16,
    color: '#7B7D7E',
  },
  reviewContent: {
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
  goal: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  goalText: {
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#FBFEFF',
    borderWidth: 1,
    borderColor: '#D9E8EF',
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 2,
    marginRight: 5,
  },
  tagText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 17,
    color: color.primaryTextColor,
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
});

export default CurriculamDetails;
