import React from 'react';
import TextBox from './TextBox';
import ProgressBar from './ProgressBar';
import courseImage from '../../assets/images/sample-course-image.jpg';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CurriculamCard = ({
  curriculam,
  navigation,
  progressWidth,
  progressVisible,
}) => {
  return (
    <View style={style.curriculamCard}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Curriculam Details', {
            curriculamId: curriculam.id,
          })
        }>
        <View style={style.curriculamInfoHolder}>
          <View style={style.imageContainer}>
            <Image
              source={
                curriculam.cover_picture_url
                  ? {uri: curriculam.cover_picture_url}
                  : courseImage
              }
              style={style.curriculamImage}
            />
          </View>
          <View style={style.infoContainer}>
            <View style={style.infoTop}>
              <Text style={style.type}>{curriculam.category.description}</Text>
              <Text style={style.title}>{curriculam.title}</Text>
              <TextBox style={style.author}>Courses</TextBox>
            </View>
            <View style={style.infoBottom}>
              <View style={style.detailsContainer}>
                <TextBox style={style.detailsTitle}>Courses</TextBox>
                <TextBox style={style.detailsValue}>
                  {curriculam.course_count}
                </TextBox>
              </View>
              <View style={style.detailsContainer}>
                <TextBox style={style.detailsTitle}>Hours</TextBox>
                <TextBox style={style.detailsValue}>23</TextBox>
              </View>
            </View>
          </View>
        </View>
        {progressVisible ? (
          <ProgressBar width={progressWidth ? `${progressWidth}%` : 0} />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  curriculamCard: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 20,
    borderRadius: 4,
    marginHorizontal: 10,
    marginVertical: 5,
    width: Dimensions.get('window').width - 20,
  },
  curriculamInfoHolder: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 105,
    height: 70,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 12,
  },
  curriculamImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flexBasis: '50%',
    flexGrow: 1,
  },
  infoTop: {
    maxWidth: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(150, 163, 169, 0.58)',
  },
  type: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    lineHeight: 12,
    color: '#828282',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: '#000',
    marginBottom: 5,
    maxWidth: '100%',
  },
  author: {
    fontSize: 10,
    lineHeight: 12,
    color: '#000',
    opacity: 0.6,
    marginBottom: 15,
  },
  infoBottom: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  detailsContainer: {
    marginRight: 20,
  },
  detailsTitle: {
    fontSize: 10,
    lineHeight: 12,
    color: '#000',
    opacity: 0.6,
    marginBottom: 5,
  },
  detailsValue: {
    fontSize: 15,
    lineHeight: 18,
    color: '#4768FD',
  },
});

export default CurriculamCard;
