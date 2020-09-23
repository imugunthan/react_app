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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterButton from '../../../components/FooterButton';
import axiosInstance from '../../../services/AxiosInterceptor';
import {razorpayPaymentGateway} from '../components/razorpayPaymentGateway';
import courseImage from '../../../../assets/images/sample-course-image.jpg';
import profilePicture from '../../../../assets/images/default-profile-picture.png';

const CourseDetails = ({navigation, route}) => {
  const {courseId} = route.params;
  const [userId, setUserId] = useState('');
  const [courseInfo, setCourseInfo] = useState('');
  const [authorInfo, setAuthorInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trainerInfo, setTrainerInfo] = useState('');
  const [isEnrollNow, setIsEnrollNow] = useState(true);
  const [disableEnrollNowButton, setDisableEnrollNowButton] = useState(false);
  const [
    disableContinueLearningButton,
    setDisableContinueLearningButton,
  ] = useState(false);

  const getCourseDetails = async () => {
    try {
      const current_user = await getData('user_id');
      setUserId(current_user);
      axiosInstance
        .get(`${apiData.apiUrl}/course/${courseId}`)
        .then((data) => {
          data.data.students.forEach((student) => {
            student.user_id == current_user
              ? setIsEnrollNow(false)
              : setIsEnrollNow(true);
          });
          if (data.data.is_live_course) {
            disableContinueLearning(data);
            disableEnrollNow(data);
          }
          setCourseInfo(data.data);
          axiosInstance
            .post(
              `${apiData.apiUrl}/course/trainer/enrolled-list/${courseId}`,
              {
                is_trainer: true,
              },
            )
            .then((data) => {
              setTrainerInfo(data.data.collaborator_objs);
              axiosInstance
                .post(
                  `${apiData.apiUrl}/course/trainer/enrolled-list/${courseId}`,
                  {
                    is_trainer: false,
                  },
                )
                .then((data) => {
                  setAuthorInfo(data.data.collaborator_objs);
                  setIsLoading(false);
                });
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        })
        .catch((er) => console.log(er));
    } catch (error) {
      console.log(error);
    }
  };

  const disableContinueLearning = (data) => {
    const enrollMentStart = Moment(data.data.enrollment_start).format(
      'YYYY-MM-DD',
    );
    const enrollMentEnd = Moment(data.data.enrollment_end).format('YYYY-MM-DD');
    if (
      Moment(enrollMentStart).isSameOrBefore(
        Moment(new Date()).format('YYYY-MM-DD'),
      ) &&
      Moment(enrollMentEnd).isSameOrAfter(
        Moment(new Date()).format('YYYY-MM-DD'),
      )
    ) {
      setDisableEnrollNowButton(false);
    } else {
      setDisableEnrollNowButton(true);
    }
  };

  const disableEnrollNow = (data) => {
    const courseStart = Moment(data.data.course_start).format('YYYY-MM-DD');
    const courseEnd = Moment(data.data.course_start).format('YYYY-MM-DD');
    if (
      Moment(courseStart).isSameOrBefore(
        Moment(new Date()).format('YYYY-MM-DD'),
      ) &&
      Moment(courseEnd).isSameOrAfter(Moment(new Date()).format('YYYY-MM-DD'))
    ) {
      setDisableContinueLearningButton(false);
    } else {
      setDisableContinueLearningButton(true);
    }
  };

  const enrollCourse = () => {
    if (courseInfo.course_pricing_plan[0].amount != 0) {
      axiosInstance
        .post(`${apiData.apiUrl}/razorpay/order/create`, {
          amount: courseInfo.course_pricing_plan[0].amount,
          // amount: 1200,
          currency: 'INR',
          receipt: '11111',
          payment_capture: 1,
        })
        .then((data) => razorpayPaymentHandler(data.data))
        .catch((er) => console.log(er));
    } else {
      axiosInstance
        .post(`${apiData.apiUrl}/course/student/add/${courseId}`, {
          is_group: false,
          ids: userId,
        })
        .then((data) => {
          setIsEnrollNow(false);
        })
        .catch((er) => console.log(er));
    }
  };

  const unenrollCourse = () => {
    axiosInstance
      .post(`${apiData.apiUrl}/course/student/remove/${courseId}`, {
        is_group: false,
        ids: userId,
      })
      .then((data) => {
        console.log(data);
        setIsEnrollNow(true);
      })
      .catch((er) => console.log(er));
  };

  const razorpayPaymentHandler = async (data) => {
    const requiredDetails = {
      curriculumId: '',
      detail: courseInfo,
      courseId: courseId,
      paymentPrice: courseInfo.course_pricing_plan[0].amount,
      currency: courseInfo.organization.currency,
      discountDetail: {
        id: '',
      },
      user: userId,
    };
    const paymentOutput = await razorpayPaymentGateway(data, requiredDetails);
    axiosInstance
      .post(`${apiData.apiUrl}/transaction/create`, {
        order_id: paymentOutput.options.order_id,
        discount_id: '',
        user_id: userId,
        amount: courseInfo.course_pricing_plan[0].amount.toString(),
        course_id: courseId,
        curriculum_id: '',
        payment_id: paymentOutput.data.razorpay_payment_id,
        response: JSON.stringify(paymentOutput.data),
        gateway: 'Razorpay',
      })
      .then((data) => {
        setIsEnrollNow(false);
      })
      .catch((er) => console.log(er));
  };

  React.useEffect(() => {
    setIsLoading(true);
    getCourseDetails();
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <Loader />
      ) : !isLoading && courseInfo != '' && authorInfo != '' ? (
        <View style={{flex: 1}}>
          <ScrollView>
            <View>
              <ImageBackground
                source={
                  courseInfo.meta_data.image_url
                    ? {
                        uri: courseInfo.meta_data.image_url,
                      }
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
                    {courseInfo.category.description}
                  </Text>
                  <Text style={style.title}>{courseInfo.title}</Text>
                  <TextBox style={style.desc}>{courseInfo.sub_title}</TextBox>
                  <View style={{flexDirection: 'row'}}>
                    <View style={style.priceHolder}>
                      <Text style={style.priceText}>
                        ₹{courseInfo.course_pricing_plan[0].amount}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <View style={style.starRating}>
                      <Icon name="star" size={16} color="#FFB257" />
                      <Icon name="star" size={16} color="#FFB257" />
                      <Icon name="star" size={16} color="#FFB257" />
                      <Icon name="star" size={16} color="#FFB257" />
                      <Icon name="star-border" size={16} color="#fff" />
                    </View>
                    <Text style={style.ratingText}>4.4</Text>
                    <Text
                      style={[{...style.ratingText}, {borderRightWidth: 0}]}>
                      636 Ratings
                    </Text>
                  </View>
                  <Text style={style.courserCreatedAt}>
                    By {courseInfo.author.name} , Created on{' '}
                    {Moment(courseInfo.author.created_at).format('DD MMM YYYY')}
                  </Text>
                  <Text style={style.courserCreatedAt}>
                    Last updated on{' '}
                    {Moment(courseInfo.author.last_login_dt).format(
                      'DD MMM YYYY',
                    )}
                  </Text>
                </LinearGradient>
              </ImageBackground>
              <Body>
                <View style={style.card}>
                  <Text style={style.cardTitle}>Overview</Text>
                  <TextBox style={style.cardContent}>
                    {courseInfo.description}
                  </TextBox>
                </View>
                <View style={style.card}>
                  <Text style={style.cardTitle}>Schedule</Text>
                  <View style={style.labelValueWrap}>
                    <TextBox style={style.label}>Course</TextBox>
                    <TextBox style={style.value}>
                      {courseInfo.course_start
                        ? Moment(courseInfo.course_start).format('DD MMM YYYY')
                        : '--'}{' '}
                      -{' '}
                      {courseInfo.course_end
                        ? Moment(courseInfo.course_end).format('DD MMM YYYY')
                        : '--'}
                    </TextBox>
                  </View>
                  <View style={style.labelValueWrap}>
                    <TextBox style={style.label}>Enrollment</TextBox>
                    <TextBox style={style.value}>
                      {courseInfo.course_start
                        ? Moment(courseInfo.enrollment_start).format(
                            'DD MMM YYYY',
                          )
                        : '--'}{' '}
                      -{' '}
                      {courseInfo.course_end
                        ? Moment(courseInfo.enrollment_end).format(
                            'DD MMM YYYY',
                          )
                        : '--'}
                    </TextBox>
                  </View>
                </View>
                <View>
                  <Text style={style.titleSub}>Content</Text>
                  {courseInfo.sections.map((card, index) => {
                    if (index <= 2) {
                      return (
                        <TouchableWithoutFeedback
                          // onPress={() =>
                          //   navigation.navigate('Lecture View', {
                          //     courseId: card.course_id,
                          //   })
                          // }
                          key={index + card.title}>
                          <View style={style.lectureCard}>
                            <Text style={style.lectureTitle}>{card.title}</Text>
                            <Icon
                              name="keyboard-arrow-right"
                              size={24}
                              color={color.primaryTextColor}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    }
                  })}
                </View>
                {courseInfo.sections.length > 3 ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Course Progress', {
                        courseId: courseInfo.id,
                      });
                    }}>
                    <View style={style.loadMore}>
                      <Text style={style.loadMoreText}>Load More</Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                <View>
                  <Text style={style.titleSub}>Review</Text>
                  <View
                    style={[
                      {...style.card},
                      {paddingHorizontal: 0, paddingVertical: 0},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                      }}>
                      <View
                        style={[
                          {...style.starRating},
                          {borderRightColor: color.primaryTextColor},
                        ]}>
                        <Icon name="star" size={16} color="#FFB257" />
                        <Icon name="star" size={16} color="#FFB257" />
                        <Icon name="star" size={16} color="#FFB257" />
                        <Icon name="star" size={16} color="#FFB257" />
                        <Icon name="star-border" size={16} color="#000" />
                      </View>
                      <Text
                        style={[
                          {...style.ratingText},
                          {
                            color: color.primaryTextColor,
                            borderRightColor: color.primaryTextColor,
                          },
                        ]}>
                        4.4
                      </Text>
                      <Text
                        style={[
                          {...style.ratingText},
                          {borderRightWidth: 0, color: color.primaryTextColor},
                        ]}>
                        636 Ratings
                      </Text>
                    </View>
                    <View style={{padding: 15, paddingBottom: 30}}>
                      <View
                        style={{
                          padding: 15,
                          backgroundColor: '#FBF6F6',
                          borderWidth: 1,
                          borderColor: '#dadada',
                        }}>
                        <View style={{flexDirection: 'row', marginBottom: 15}}>
                          <Image
                            source={profilePicture}
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
                              Praskovya Dubinina
                            </Text>
                            <TextBox style={style.reviewerDesignation}>
                              UI/UX Designer
                            </TextBox>
                          </View>
                          <View
                            style={[
                              {...style.starRating},
                              {borderRightWidth: 0, paddingRight: 0},
                            ]}>
                            <Icon name="star" size={16} color="#FFB257" />
                            <Icon name="star" size={16} color="#FFB257" />
                            <Icon name="star" size={16} color="#FFB257" />
                            <Icon name="star" size={16} color="#FFB257" />
                            <Icon name="star-border" size={16} color="#000" />
                          </View>
                        </View>
                        <TextBox style={style.reviewContent}>
                          I'm Andrew, a full-stack developer living in beautiful
                          Philadelphia!
                        </TextBox>
                        <TextBox style={style.reviewContent}>
                          I launched my first Udemy course in 2014 and had a
                          blast teaching and helping others. Since then, I've
                          launched 3 courses with over 110,000 students and over
                          18,000 5-star reviews
                        </TextBox>
                        <View style={style.loadMore}>
                          <Text style={style.loadMoreText}>Load More</Text>
                        </View>
                      </View>
                      <View></View>
                    </View>
                  </View>
                </View>
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
                              {trainer.user.details.Headline}
                            </TextBox>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
                <View style={style.card}>
                  <Text style={[{...style.titleSub}, {paddingTop: 5}]}>
                    Author's Bio
                  </Text>
                  {authorInfo.map((author, index) => {
                    return (
                      <View key={index + author.user.name}>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
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
                              {author.user.details.Headline}
                            </TextBox>
                          </View>
                        </View>
                        <TextBox style={style.reviewContent}>
                          {author.user.details.Bio}
                        </TextBox>
                      </View>
                    );
                  })}
                </View>
              </Body>
            </View>
            {/* <TouchableHighlight
              onPress={() => {
                var options = {
                  description: 'Subscribing a Course',
                  image: 'https://i.imgur.com/3g7nmJC.png',
                  currency: 'INR',
                  key: 'rzp_test_qIRhLO49tFfH9A',
                  amount: courseInfo.amount,
                  external: {
                    wallets: ['paytm'],
                  },
                  name: 'Course',
                  prefill: {
                    email: 'akshay@razorpay.com',
                    contact: '8955806560',
                    name: 'Akshay Bhalotia',
                  },
                  theme: {color: color.primaryBrandColor},
                };
                RazorpayCheckout.open(options)
                  .then((data) => {
                    // handle success
                    alert(`Success: ${data.razorpay_payment_id}`);
                  })
                  .catch((error) => {
                    // handle failure
                    alert(`Error: ${error.code} | ${error.description}`);
                  });
              }}>
              <Text>Razorpay payment</Text>
            </TouchableHighlight> */}
          </ScrollView>
          {isEnrollNow ? (
            <TouchableOpacity
              onPress={() => {
                enrollCourse();
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
                // disabled={disableContinueLearningButton}
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
                // disabled={disableContinueLearningButton}
                onPress={() => unenrollCourse()}>
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
  courseBackground: {
    width: '100%',
  },
  courseTop: {
    paddingTop: 45,
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
  starRating: {
    flexDirection: 'row',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  ratingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#fff',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#fff',
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
  lectureCard: {
    borderLeftColor: color.primaryBrandColor,
    borderLeftWidth: 5,
    padding: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  lectureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: color.primaryTextColor,
  },
  loadMore: {
    backgroundColor: '#fff',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#dadada',
    padding: 12,
    marginVertical: 10,
  },
  loadMoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    lineHeight: 17,
    color: color.primaryTextColor,
    textAlign: 'center',
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

export default CourseDetails;
