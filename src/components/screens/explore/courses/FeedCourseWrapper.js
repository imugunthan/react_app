import {View, Text} from 'react-native';
import React, {useState} from 'react';
import Loader from '../../../components/Loader';
import {apiData} from '../../../../static/Static';
import {getData} from '../../../services/AsyncStorage';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import CookieManager from '@react-native-community/cookies';
import axiosInstance from '../../../services/AxiosInterceptor';
import CourseCard from '../../../components/CourseCard';
import Body from '../../../components/Body';

const FeedCourseWrapper = ({navigation}) => {
  const itemsPerPage = 20;
  const [headers, setHeaders] = useState({});
  const [maxPages, setMaxPages] = useState(1);
  const [courseList, setCourseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const progressBarWidthCalculation = (item) => {
    const value = item.filter((x) => x.user_id == userId);
    return value[0].completed_per;
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMaxPages(1);
      setCurrentPage(1);
      setIsLoading(true);
      getInitialRenderData();
    });
    return unsubscribe;
  }, [navigation]);

  const getInitialRenderData = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      setUserId(await getData('user_id'));
      setHeaders({
        current_user: current_user,
        org_id: organization_id,
        tenant: tenant,
        type: 2,
      });
      CookieManager.clearAll()
        .then((data) => {
          axiosInstance
            .get(`${apiData.apiUrl}/student/${current_user}/courses`, {
              headers: {
                current_user: current_user,
                org_id: organization_id,
                tenant: tenant,
                type: 2,
              },
              params: {
                page_no: 1,
                per_page: itemsPerPage,
              },
            })
            .then((data) => {
              setMaxPages(data.data.no_of_pages);
              setIsLoading(false);
              setCourseList(data.data.courses.course);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = () => {
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
      setIsLoading(true);
      axiosInstance
        .get(`${apiData.apiUrl}/student/${userId}/courses`, {
          headers: headers,
          params: {
            page_no: 1,
            per_page: itemsPerPage,
          },
        })
        .then((data) => {
          setCourseList(courseList.concat(data.data.courses.course));
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <View style={{flex: 1}}>
      {isLoading ? <Loader /> : null}
      {!isLoading && courseList.length == 0 ? (
        <Text>You have no Enrolled Courses</Text>
      ) : (
        <FlatList
          data={courseList}
          keyExtractor={(item, index) => index + item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Course Progress', {
                  courseId: item.id,
                  completedPer: progressBarWidthCalculation(item.completed_per),
                });
              }}>
              <CourseCard
                userId={userId}
                progressVisible={true}
                progressWidth={progressBarWidthCalculation(item.completed_per)}
                cardData={{
                  title: item.title,
                  courseId: item.id,
                  imageUrl: item.meta_data.image_url,
                }}
              />
            </TouchableOpacity>
          )}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default FeedCourseWrapper;
