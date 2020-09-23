import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';
import { apiData } from '../../../../static/Static';
import { getData } from '../../../services/AsyncStorage';
import { FlatList } from 'react-native-gesture-handler';
import CookieManager from '@react-native-community/cookies';
import axiosInstance from '../../../services/AxiosInterceptor';
import CurriculamCard from '../../../components/CurriculamCard';

const ExploreCurriculamWrapper = ({ navigation, selectedCategory }) => {
  const itemsPerPage = 20;
  const [headers, setHeaders] = useState({});
  const [maxPages, setMaxPages] = useState(1);
  const [curriculamList, setCurriculamList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setMaxPages(1);
    setCurrentPage(1);
    getInitialRenderData();
  }, [navigation, selectedCategory]);

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
            .get(`${apiData.apiUrl}/curriculum/search`, {
              headers: {
                current_user: current_user,
                org_id: organization_id,
                tenant: tenant,
                type: 2,
              },
              params: {
                q: '',
                category_list: selectedCategory || '',
                page_no: 1,
                per_page: itemsPerPage,
              },
            })
            .then((data) => {
              setMaxPages(data.data.no_of_pages);
              setCurriculamList(data.data.curriculums);
              setIsLoading(false);
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
        .get(`${apiData.apiUrl}/curriculum/search`, {
          headers: headers,
          params: {
            q: '',
            category_list: selectedCategory || '',
            page_no: currentPage + 1,
            per_page: itemsPerPage,
          },
        })
        .then((data) => {
          setCurriculamList(curriculamList.concat(data.data.curriculums));
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <Loader /> : null}
      <FlatList
        data={curriculamList}
        keyExtractor={(item, index) => index + item.id}
        renderItem={({ item }) => (
          <CurriculamCard
            progressVisible={false}
            curriculam={item}
            navigation={navigation}
          />
        )}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ExploreCurriculamWrapper;
