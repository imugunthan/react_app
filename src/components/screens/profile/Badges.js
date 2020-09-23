import React from 'react';
import Body from '../../components/Body';
import color from '../../../assets/styles/color';
import {View, Text, StyleSheet, Image} from 'react-native';
import badge from '../../../assets/images/badge.png';
import badgeRibbon from '../../../assets/images/badge-ribbon.png';

const Badges = ({navigation, route}) => {
  const {badges} = route.params;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View>
      <Body>
        <Text style={style.title}>Badges ({badges.length})</Text>
        <Text style={style.titleSub}>CURRICULUM</Text>
        {badges.length == 0 ? (
          <Text>There are no badges</Text>
        ) : (
          badges.map((badge, index) => {
            return (
              <View style={style.card} key={index}>
                <Text style={style.cardTitle}>
                  Advanced Javascript Programing & Lessons
                </Text>
                <Text style={style.date}>23 Aug 2019</Text>
                <View style={style.badgeCard}>
                  <Image source={badge} style={style.badgeImage} />
                  <View style={style.cardInfo}>
                    <Text style={style.badgeTitle}>Title of Graduation</Text>
                    <Text style={style.type}>
                      Advanced Javascript & Management
                    </Text>
                  </View>
                  <Image source={badgeRibbon} style={style.ribbon} />
                </View>
              </View>
            );
          })
        )}
      </Body>
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: '#000',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    paddingRight: 20,
    borderRadius: 4,
    marginBottom: 7,
  },
  cardInfo: {
    flexGrow: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
  titleSub: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 15,
    color: color.primaryTextColor,
    opacity: 0.6,
    marginBottom: 15,
  },
  badgeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 5,
  },
  type: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 16,
    color: color.primaryTextColor,
    opacity: 0.7,
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    lineHeight: 15,
    color: color.primaryTextColor,
    marginBottom: 7,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: color.primaryTextColor,
    opacity: 0.7,
    marginBottom: 10,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ABB3B9',
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: 'relative',
  },
  badgeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginRight: 15,
  },
  ribbon: {
    width: 14,
    height: 33,
    position: 'absolute',
    top: -7,
    right: 10,
  },
});

export default Badges;
