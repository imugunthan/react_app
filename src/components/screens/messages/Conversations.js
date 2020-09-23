import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import _ from "lodash";

import Loader from '../../components/Loader';
import TextBox from '../../components/TextBox';
import image from '../../../assets/images/default-profile-picture.png';
import color from '../../../assets/styles/color';
import { getData } from '../../services/AsyncStorage';
import { apiData } from '../../../static/Static';
import axiosInstance from '../../services/AxiosInterceptor';

const Conversations = ({ navigation }) => {
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const isVisible = useIsFocused();
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.dangerouslyGetParent().setOptions({ tabBarVisible: true });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isVisible) {
      getInitialRenderData()
    }
  }, [isVisible]);

  const getInitialRenderData = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      setUserId(current_user);
      axiosInstance
        .post(`${apiData.apiUrl}/message/list`,
          {
            user_id: current_user,
          },
          {
            headers: {
              current_user: current_user,
              org_id: organization_id,
              tenant: tenant,
              type: 2,
            },
          }
        )
        .then((data) => {
          setIsLoading(false);
          setRooms(data.data.rooms);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {isLoading && <Loader />}
      <ScrollView style={{ paddingTop: 15 }}>
        {_.sortBy(rooms, ['message.created_at']).reverse().map(room => {
          return (
            <TouchableOpacity
              key={room.id}
              onPress={() =>
                navigation.navigate('Conversation Detail', {
                  headerTitle: room.room.user_details.filter(details => details.id !== userId)[0].name,
                  room_id: room.room.id,
                })
              }>
              <View style={style.conversationCard}>
                <View style={style.avatarHolder}>
                  <Image source={image} style={style.avatar} />
                  <View style={style.onlineInfo}></View>
                </View>
                <View style={style.conversationInfo}>
                  <Text style={style.name}>{room.room.user_details.filter(details => details.id !== userId)[0].name}</Text>
                  <TextBox style={style.text}>
                    {room.message.text}
                  </TextBox>
                </View>
                <TextBox style={style.date}>
                  {moment(moment.utc(room.message.created_at).toDate()).isSame(moment(), 'day') ?
                    moment(moment.utc(room.message.created_at).toDate()).local().format("LT") :
                    moment(moment.utc(room.message.created_at).toDate()).local().format("l")
                  }
                </TextBox>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  conversationCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  avatarHolder: {
    position: 'relative',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  onlineInfo: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#7AD45B',
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    lineHeight: 18,
    color: color.primaryTextColor,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    lineHeight: 15,
    color: '#697C8A',
  },
  date: {
    fontSize: 12,
    lineHeight: 15,
    color: '#697C8A',
  },
});

export default Conversations;
