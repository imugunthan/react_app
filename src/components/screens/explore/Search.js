import React, {useState} from 'react';
import Loader from '../../components/Loader';
import {apiData} from '../../../static/Static';
import {getData} from '../../services/AsyncStorage';
import CourseCard from '../../components/CourseCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../../services/AxiosInterceptor';
import CookieManager from '@react-native-community/cookies';
import CurriculamCard from '../../components/CurriculamCard';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

const Search = ({navigation, route}) => {
  const itemsPerPage = 20;
  const {screen, tab} = route.params;
  const [userId, setUserId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchData, setSearchData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const progressBarWidthCalculation = (item) => {
    const value = item.filter((x) => x.user_id == userId);
    return value[0].completed_per;
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);

  const searchQuery = async (searchKey) => {
    try {
      setIsLoading(true);
      const organization_id = await getData('organization_id');
      const current_user = await getData('user_id');
      const tenant = await getData('tenant');
      setUserId(await getData('user_id'));
      if (tab == 'Courses' && screen == 'Explore') {
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
                  q: searchKey,
                  status: 'published',
                  page_no: 1,
                  per_page: itemsPerPage,
                },
              })
              .then((data) => {
                setSearchData(data.data.courses);
                setIsLoading(false);
              })
              .catch((er) => {
                setIsLoading(false);
                console.log(er);
              });
          })
          .catch((er) => console.log(key));
      } else if (tab == 'Curriculam' && screen == 'Explore') {
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
                  q: searchKey,
                  category_list: '',
                  page_no: 1,
                  per_page: itemsPerPage,
                },
              })
              .then((data) => {
                setSearchData(data.data.curriculums);
                setIsLoading(false);
              })
              .catch((er) => {
                setIsLoading(false);
                console.log(er);
              });
          })
          .catch((er) => console.log(key));
      } else if (tab == 'Courses' && screen == 'Feeds') {
        CookieManager.clearAll()
          .then((data) => {
            axiosInstance
              .get(`${apiData.apiUrl}/student/${current_user}/course/search`, {
                headers: {
                  current_user: current_user,
                  org_id: organization_id,
                  tenant: tenant,
                  type: 2,
                },
                params: {
                  q: searchKey,
                  page_no: 1,
                  per_page: itemsPerPage,
                },
              })
              .then((data) => {
                setSearchData(data.data.courses);
                setIsLoading(false);
                console.log('working', data.data.courses);
              })
              .catch((er) => {
                setIsLoading(false);
                console.log(er);
              });
          })
          .catch((er) => console.log(key));
      } else if (tab == 'Curriculam' && screen == 'Feeds') {
        CookieManager.clearAll()
          .then((data) => {
            axiosInstance
              .get(
                `${apiData.apiUrl}/student/${current_user}/curriculum/search`,
                {
                  headers: {
                    current_user: current_user,
                    org_id: organization_id,
                    tenant: tenant,
                    type: 2,
                  },
                  params: {
                    q: searchKey,
                    page_no: 1,
                    per_page: itemsPerPage,
                  },
                },
              )
              .then((data) => {
                setIsLoading(false);
                setSearchData(data.data.curriculums.curriculums);
              })
              .catch((er) => {
                setIsLoading(false);
                console.log(er);
              });
          })
          .catch((er) => console.log(key));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={style.headerContainer}>
        <View style={style.subContainer}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Type Here to search"
            placeholderTextColor={'rgba(45, 45, 46, 0.6)'}
            style={style.searchInput}
            onChangeText={(text) => {
              setSearchText(text);
              searchQuery(text);
            }}
            value={searchText}
          />
        </View>
        <TouchableOpacity
          style={[{...style.closeIcon}, {opacity: searchText == '' ? 0 : 1}]}
          onPress={() => navigation.pop()}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {isLoading ? <Loader /> : null}
      {!isLoading && tab == 'Courses' && screen == 'Explore' ? (
        <FlatList
          data={searchData}
          keyExtractor={(item, index) => {
            index + item.id;
          }}
          renderItem={({item}) => (
            <CourseCard
              screen={'type1'}
              course={item}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      ) : !isLoading && tab == 'Curriculam' && screen == 'Explore' ? (
        <FlatList
          data={searchData}
          keyExtractor={(item, index) => {
            index + item.id;
          }}
          renderItem={({item}) => (
            <CurriculamCard
              progressVisible={false}
              curriculam={item}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : !isLoading && tab == 'Courses' && screen == 'Feeds' ? (
        <FlatList
          data={searchData}
          keyExtractor={(item, index) => {
            index + item.id;
          }}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Course Progress', {
                  courseId: item.id,
                });
              }}>
              <CourseCard
                userId={userId}
                progressVisible={true}
                progressWidth={progressBarWidthCalculation(
                  item.meta_data.completed_per,
                )}
                cardData={{
                  title: item.title,
                  courseId: item.id,
                  imageUrl: item.meta_data.image_url,
                }}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : !isLoading && tab == 'Curriculam' && screen == 'Feeds' ? (
        <FlatList
          data={searchData}
          keyExtractor={(item, index) => {
            index + item.id;
          }}
          renderItem={({item}) => (
            <CurriculamCard
              progressVisible={true}
              curriculam={item}
              navigation={navigation}
              progressWidth={0}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8.5,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    backgroundColor: 'white',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 14,
    lineHeight: 17,
    marginLeft: 15,
  },
  closeIcon: {},
});

export default Search;
