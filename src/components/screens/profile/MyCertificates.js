import React from 'react';
import Body from '../../components/Body';
import color from '../../../assets/styles/color';
import {View, Text, StyleSheet} from 'react-native';

const MyCertificates = ({navigation, route}) => {
  const {certificates} = route.params;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <View>
      <Body>
        <Text style={style.title}>Certificates ({certificates.length})</Text>
        {certificates.length == 0 ? (
          <Text>There are no Certificates</Text>
        ) : (
          certificates.map((cert, index) => {
            return (
              <View style={style.card} key={index + cert.certificate.name}>
                <View style={style.cardInfo}>
                  <Text style={style.title}>Title of Graduation</Text>
                  <Text style={style.type}>{cert.certificate.name}</Text>
                </View>
                {/* <Text style={style.view}>View</Text> */}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  type: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: color.primaryTextColor,
    opacity: 0.7,
  },
  view: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryBrandColor,
    textTransform: 'uppercase',
  },
});

export default MyCertificates;
