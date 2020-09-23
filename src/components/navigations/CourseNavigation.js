import React from 'react';
import {Text} from 'react-native';
import {navOptions} from './navOptions';
import Feeds from '../screens/Feeds/Feeds';
import Search from '../screens/explore/Search';
import Filter from '../screens/explore/Filter';
import Explore from '../screens/explore/Explore';
import Exam from '../screens/explore/courses/Exam';
import {createStackNavigator} from '@react-navigation/stack';
import ExamPreview from '../screens/explore/courses/ExamPreview';
import LectureView from '../screens/explore/courses/LectureView';
import CourseDetails from '../screens/explore/courses/CourseDetails';
import CourseProgress from '../screens/explore/courses/CourseProgress';
import CurriculamDetails from '../screens/explore/curriculam/CurriculamDetails';
import ExamResult from '../screens/explore/courses/ExamResult';

export const CourseNavigation = ({navigation, route}) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName={route.params.defaultRouteName}
      screenOptions={navOptions(true)}>
      <Stack.Screen
        name="Explore"
        component={Explore}
        options={{headerShown: false}}
        initialParams={{
          selectedCategory: [],
          selectedTrainer: [],
        }}
      />
      <Stack.Screen
        name="Feeds"
        component={Feeds}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Exam" component={Exam} />
      <Stack.Screen name="Lecture View" component={LectureView} />
      <Stack.Screen name="Exam Preview" component={ExamPreview} />
      <Stack.Screen name="Exam Result" component={ExamResult} />
      <Stack.Screen name="Course Details" component={CourseDetails} />
      <Stack.Screen name="Course Progress" component={CourseProgress} />
      <Stack.Screen name="Curriculam Details" component={CurriculamDetails} />
    </Stack.Navigator>
  );
};
