import React, {useState} from 'react';
import {View} from 'react-native';
import Body from '../../components/Body';
import Header from '../../components/Header';
import {ScrollView} from 'react-native-gesture-handler';
import FeedCurriculamWrapper from '../explore/curriculam/FeedCurriculamWrapper';
import FeedCourseWrapper from '../explore/courses/FeedCourseWrapper';

const Feeds = ({navigation}) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    });
    return unsubscribe;
  }, [navigation]);
  let titleArray = ['Courses', 'Curriculam'];
  const [activeSection, setActiveSection] = useState(titleArray[0]);
  const updateTitle = (title) => {
    setActiveSection(title);
  };
  return (
    <View style={{flex: 1}}>
      <Header
        titleArray={titleArray}
        updateTitle={updateTitle}
        filterEnable={false}
        searchEnable={true}
        navigation={navigation}
        screen="Feeds"
      />
      <View
        style={{
          flex: 1,
          display: activeSection != 'Courses' ? 'none' : 'flex',
        }}>
        <FeedCourseWrapper navigation={navigation} />
      </View>
      <View
        style={{
          flex: 1,
          display: activeSection == 'Courses' ? 'none' : 'flex',
        }}>
        <FeedCurriculamWrapper navigation={navigation} />
      </View>
    </View>
  );
};

export default Feeds;
