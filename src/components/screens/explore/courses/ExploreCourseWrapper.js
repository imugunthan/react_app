import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import { apiData } from '../../../../static/Static';
import { FlatList } from 'react-native-gesture-handler';
import { getData } from '../../../services/AsyncStorage';
import CourseCard from '../../../components/CourseCard';
import CookieManager from '@react-native-community/cookies';
import axiosInstance from '../../../services/AxiosInterceptor';

const ExploreCourseWrapper = ({
  navigation,
  selectedCategory,
  selectedTrainer,
}) => {
  const itemsPerPage = 20;
  const [headers, setHeaders] = useState({});
  const [maxPages, setMaxPages] = useState(1);
  const [courseList, setCourseList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setMaxPages(1);
    setCurrentPage(1);
    getInitialRenderData();
  }, [navigation, selectedCategory, selectedTrainer]);

  const getInitialRenderData = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      setHeaders({
        current_user: current_user,
        org_id: organization_id,
        tenant: tenant,
        type: 2,
      });
      CookieManager.clearAll()
        .then((data) => {
          axiosInstance
            .get(`${apiData.apiUrl}/course/search`, {
              headers: {
                current_user: current_user,
                org_id: organization_id,
                tenant: tenant,
                type: 2,
              },
              params: {
                q: '',
                category_list: selectedCategory || '',
                trainer_list: selectedTrainer || '',
                status: 'published',
                page_no: 1,
                per_page: itemsPerPage,
              },
            })
            .then((data) => {
              console.log(data)
              setIsLoading(false);
              setCourseList(data.data.courses);
              setMaxPages(data.data.no_of_pages);
            })
            .catch((error) => {
              console.log(error);
            });
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
        .get(`${apiData.apiUrl}/course/search`, {
          headers: headers,
          params: {
            q: '',
            category_list: selectedCategory || '',
            trainer_list: selectedTrainer || '',
            status: 'published',
            page_no: currentPage + 1,
            per_page: itemsPerPage,
          },
        })
        .then((data) => {
          setCourseList(courseList.concat(data.data.courses));
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <Loader /> : null}
      <FlatList
        data={courseList}
        keyExtractor={(item, index) => index + item.id}
        renderItem={({ item }) => (
          <CourseCard screen={'type1'} course={item} navigation={navigation} />
        )}
        numColumns={2}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ExploreCourseWrapper;
