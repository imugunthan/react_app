import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import CheckBox from 'react-native-check-box';
import TextBox from '../../components/TextBox';
import { apiData } from '../../../static/Static';
import color from '../../../assets/styles/color';
import { getData } from '../../services/AsyncStorage';
import FooterButton from '../../components/FooterButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from '../../services/AxiosInterceptor';
import { Text, View, StyleSheet, LayoutAnimation } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const Filter = ({navigation, route}) => {
  const [trainerList, setTrainerList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [showCategory, setShowCategory] = useState(true);
  const [showTrainer, setShowTrainer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState([]);
  const { screen } = route.params;

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    getFilterList();
    return unsubscribe;
  }, [navigation]);

  const getFilterList = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      await axiosInstance
        .get(`${apiData.apiUrl}/category/list`, {
          headers: {
            current_user: current_user,
            org_id: organization_id,
            tenant: tenant,
            type: 2,
          },
        })
        .then((data) => {
          //console.log(data.data.category_list)
          setCategoryList(prev => [...prev, ...data.data.category_list]);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
      await axiosInstance
        .post(
          `${apiData.apiUrl}/collaborators-list/list`,
          {
            role: 2,
          },
          {
            headers: {
              current_user: current_user,
              org_id: organization_id,
              tenant: tenant,
              type: 2,
            },
          },
        )
        .then((data) => {
          setTrainerList(prev => [...prev, ...data.data.users]);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
        });
    } catch (error) {}
  };

  const courseFilterHandler = (courseIndex) => {
    const newCategoryList = {
      categoryList: categoryList.categoryList,
      iscollapsed: categoryList.iscollapsed,
    };
    newCategoryList.categoryList[courseIndex].isChecked = !newCategoryList
      .categoryList[courseIndex].isChecked;
    setCategoryList(newCategoryList);
  };

  const trainerFilterHandler = (trainerIndex) => {
    const newTrainerList = {
      trainerList: trainerList.trainerList,
      iscollapsed: trainerList.iscollapsed,
    };
    newTrainerList.trainerList[trainerIndex].isChecked = !newTrainerList
      .trainerList[trainerIndex].isChecked;
    setTrainerList(newTrainerList);
  };

  const applyFilters = () => {
    navigation.navigate('Explore', {
      selectedCategory: selectedCategory.join(),
      selectedTrainer: selectedTrainer.join(),
    });
  };

  const resetFilters = () => {
    categoryList.categoryList.forEach((category) => {
      category.isChecked = false;
    });
    setCategoryList((prevState) => ({
      ...prevState,
    }));
    trainerList.trainerList.forEach((trainer) => {
      trainer.isChecked = false;
    });
    setTrainerList((prevState) => ({
      ...prevState,
    }));
  };

  return isLoading ? (
    <Loader />
  ) : (
    <View style={{flex: 1}}>
      <View style={style.headerContainer}>
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={style.filterTitle}>Filter Courses</Text>
        <TouchableOpacity
          onPress={() => {
            resetFilters();
          }}>
          <Icon name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{paddingTop: 15}}>
          <View style={style.filterCard}>
            <View style={style.filterHead}>
              <Text style={style.filterTitle}>By Category</Text>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowCategory(prev => !prev)
                }}>
                <Icon
                  name={
                    showCategory
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-right'
                  }
                  size={24}
                  color={color.primaryTextColor}
                />
              </TouchableOpacity>
            </View>
            <View style={style.filterBody}>
              {showCategory &&
                categoryList.length !== 0 &&
                categoryList.map(category => {
                  return (
                    <View
                      key={category.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <CheckBox
                        onClick={() => {selectedCategory.includes(category.title) ?
                          setSelectedCategory(prev => prev.filter(pr => pr !== category.title)) :
                          setSelectedCategory(prev => [...prev, ...[category.title]])
                        }}
                        checkedCheckBoxColor={color.primaryBrandColor}
                        uncheckedCheckBoxColor={color.primaryTextColor}
                        isChecked={selectedCategory.includes(category.title)}
                      />
                      <TextBox style={{marginLeft: 10}}>
                        {category.title}
                      </TextBox>
                    </View>
                  );
                })}
            </View>
          </View>
          <View style={style.filterCard}>
            <View style={style.filterHead}>
              <Text style={style.filterTitle}>By Trainer</Text>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setShowTrainer(prev => !prev)
                }}>
                <Icon
                  name={
                    showTrainer
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-right'
                  }
                  size={24}
                  color={color.primaryTextColor}
                />
              </TouchableOpacity>
            </View>
            <View>
              <View style={style.filterBody}>
                {showTrainer &&
                  trainerList.length !== 0 &&
                  trainerList.map(trainer => {
                    return (
                      <View
                        key={trainer.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 15,
                        }}>
                        <CheckBox
                          onClick={() => {selectedTrainer.includes(trainer.id) ?
                          setSelectedTrainer(prev => prev.filter(pr => pr !== trainer.id)) :
                          setSelectedTrainer(prev => [...prev, ...[trainer.id]])
                        }}
                          checkedCheckBoxColor={color.primaryBrandColor}
                          uncheckedCheckBoxColor={color.primaryTextColor}
                          isChecked={selectedTrainer.includes(trainer.id)}
                        />
                        <TextBox style={{marginLeft: 10}}>
                          {trainer.name}
                        </TextBox>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          applyFilters();
        }}>
        <FooterButton
          title="Apply filter"
          bgColor={color.primaryBrandColor}
          textColor={'#fff'}
        />
      </TouchableOpacity>
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
  searchInput: {
    fontSize: 14,
    lineHeight: 17,
    marginLeft: 15,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: color.primaryTextColor,
  },
  filterCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dadada',
  },
  filterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 17,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 15,
  },
  filterTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    lineHeight: 16,
    color: color.primaryTextColor,
    textTransform: 'uppercase',
  },
  filterBody: {
    // paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 25,
  },
});

export default Filter;
