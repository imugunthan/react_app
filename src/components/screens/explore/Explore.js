import { View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import ExploreCourseWrapper from './courses/ExploreCourseWrapper';
import ExploreCurriculamWrapper from './curriculam/ExploreCurriculamWrapper';

const Explore = ({ navigation, route }) => {
  const { selectedCategory, selectedTrainer } = route.params;
  const updateTitle = (title) => {
    setActiveSection(title);
  };
  const titleArray = ['Courses', 'Curriculam'];
  const [activeSection, setActiveSection] = useState(titleArray[0]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({ tabBarVisible: true });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        titleArray={titleArray}
        updateTitle={updateTitle}
        filterEnable={true}
        searchEnable={true}
        navigation={navigation}
        screen="Explore"
      />
      <View
        style={{
          flex: 1,
          display: activeSection != 'Courses' ? 'none' : 'flex',
        }}>
        <ExploreCourseWrapper
          navigation={navigation}
          selectedCategory={selectedCategory}
          selectedTrainer={selectedTrainer}
        />
      </View>
      <View
        style={{
          flex: 1,
          display: activeSection == 'Courses' ? 'none' : 'flex',
        }}>
        <ExploreCurriculamWrapper
          navigation={navigation}
          selectedCategory={selectedCategory}
          selectedTrainer={selectedTrainer}
        />
      </View>
    </View>
  );
};

export default Explore;
