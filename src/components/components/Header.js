import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InsetShadow from 'react-native-inset-shadow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Header = ({
  navigation,
  titleArray,
  updateTitle,
  filterEnable,
  screen,
  searchEnable,
}) => {
  const [activeStateHandler, setActiveStateHandler] = useState(titleArray[0]);
  const activeColor = (active) => {
    if (active == 'active') {
      return {
        color: '#F2F2F2',
        backgroundColor: '#4768FD',
      };
    } else {
      return {
        color: '#2D2D2E',
      };
    }
  };
  const activeTab = (active) => {
    if (active == 'active') {
      return {
        color: '#fff',
      };
    } else {
      return {
        color: '#000',
      };
    }
  };
  return (
    <View style={style.headerContainer}>
      <TouchableOpacity
        disabled={!filterEnable}
        onPress={() =>
          navigation.navigate('Filter', {
            screen: screen,
          })
        }>
        <Icon
          name="filter-list"
          size={24}
          color="#2D2D2E"
          style={{opacity: filterEnable ? 1 : 0}}
        />
      </TouchableOpacity>
      <View
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          flexDirection: 'row',
        }}>
        <InsetShadow elevation={8} shadowOpacity={0.2}>
          <View style={style.tabWrap}>
            {titleArray.map((title, index) => (
              <View
                key={index + title}
                style={[
                  activeColor(activeStateHandler === title ? 'active' : ''),
                  style.tab,
                ]}>
                <Text
                  style={[
                    activeTab(activeStateHandler == title ? 'active' : ''),
                    style.tabText,
                  ]}
                  onPress={() => {
                    updateTitle(title);
                    setActiveStateHandler(title);
                  }}>
                  {title}
                </Text>
              </View>
            ))}
          </View>
        </InsetShadow>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Search', {
            screen: screen,
            tab: activeStateHandler,
          })
        }
        disabled={!searchEnable}>
        <Icon
          name="search"
          size={24}
          color="#2D2D2E"
          style={{opacity: searchEnable ? 1 : 0}}
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
  tabWrap: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 23,
  },
  tabText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    lineHeight: 16,
  },
});

export default Header;
