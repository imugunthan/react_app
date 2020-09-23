import React, {useState} from 'react';
import TextBox from './TextBox';
import ProgressBar from './ProgressBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import courseImage from '../../assets/images/sample-course-image.jpg';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CourseCard = ({
  screen,
  course,
  cardData,
  navigation,
  progressWidth,
  progressVisible,
}) => {
  return screen == 'type1' ? (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Course Details', {
            courseId: course.id,
          });
        }}>
        <View style={style.imageContainer}>
          <Image
            source={course.image_url ? {uri: course.image_url} : courseImage}
            style={style.courseImage}
          />
          <View style={[{...style.starWrap}, {left: 10}]}>
            <Text style={style.starText}>₹{course.amount}</Text>
          </View>
          <View style={[{...style.starWrap}, {right: 10}]}>
            <Text style={style.starText}>2</Text>
            <Icon name="star" size={10} />
          </View>
        </View>
        <View style={style.courseContent}>
          <Text style={style.type}>{course.category.description}</Text>
          <Text style={style.title}>{course.title}</Text>
          <TextBox style={style.author}>{course.author[0].name}</TextBox>
        </View>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={style.fullContainer}>
      <View style={style.fullContentWrapper}>
        <Image
          source={cardData.imageUrl ? {uri: cardData.imageUrl} : courseImage}
          style={style.fullContainerImage}
        />
        <View style={style.titleHolder}>
          <Text style={style.title}>{cardData.title}</Text>
        </View>
      </View>
      {progressVisible ? (
        <ProgressBar width={progressWidth ? `${progressWidth}%` : 0} />
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width / 2 - 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: 105,
  },
  courseContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  type: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    lineHeight: 19,
    color: '#828282',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 18,
    color: '#2D2D2E',
    marginBottom: 6,
  },
  author: {
    fontSize: 11,
    lineHeight: 13,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 6,
  },
  starWrap: {
    position: 'absolute',
    top: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#FFB257',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 13,
    color: '#000000',
    marginRight: 2,
  },
  fullContainer: {
    width: Dimensions.get('window').width - 20,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#D9E8EF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fullContentWrapper: {
    flexDirection: 'row',
  },
  fullContainerImage: {
    width: 135,
    height: 85,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  titleHolder: {
    flexBasis: '55%',
    marginLeft: 15,
  },
});

export default CourseCard;
