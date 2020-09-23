import {View} from 'react-native';
import React, {useState} from 'react';
import Events from './Events';
import Header from '../../components/Header';
import General from './General';
import Announcements from './Announcements';

const Notifications = ({navigation}) => {
  let titleArray = ['General', 'Events', 'Announcements'];
  const [activeSection, setActiveSection] = useState(titleArray[0]);
  const updateTitle = (title) => {
    setActiveSection(title);
  };
  return (
    <View>
      <Header
        titleArray={titleArray}
        updateTitle={updateTitle}
        filterEnable={false}
        searchEnable={false}
        navigation={navigation}
        screen="FeedsWrapper"
      />
      {activeSection == 'General' ? (
        <General navigation= { navigation }  />
      ) : activeSection == 'Events' ? (
        <Events />
      ) : activeSection == 'Announcements' ? (
        <Announcements />
      ) : null}
    </View>
  );
};

export default Notifications;
