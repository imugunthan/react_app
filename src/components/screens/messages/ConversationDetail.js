import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import io from 'socket.io-client';
import moment from "moment";
window.navigator.userAgent = 'react-native';

import TextBox from '../../components/TextBox';
import color from '../../../assets/styles/color';
import { getData } from '../../services/AsyncStorage';
import { apiData } from '../../../static/Static';
import axiosInstance from '../../services/AxiosInterceptor';

const ConversationsDetail = ({ navigation, route }) => {
  let socket;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null)
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      navigation.setOptions({ title: route.params.headerTitle });
      navigation.dangerouslyGetParent().setOptions({ tabBarVisible: false });
    });
    getInitialRenderData();
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    initiateSocket();
    //updateMessages();
    return () => {
      disconnectSocket();
    }
  }, [route.params.room_id])

  const initiateSocket = async () => {
    console.log(`connecting socket`)
    const socketId = await getData('socket_id');
    socket = io(`${apiData.socketURL}`, {
      transports: ['websocket'],
      transportOptions: {
        websocket: {
          extraHeaders: {
            "user_socket_id": socketId
          }
        }
      }
    });
    socket.on('chat', data => {
      setMessages(prev => [...prev, ...[data.data]]);
    })
  }

  const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    socket.disconnect();
  }

  const getInitialRenderData = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      setUserId(current_user);
      axiosInstance
        .post(`${apiData.apiUrl}/message/detail`,
          {
            room_id: route.params.room_id,
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
          setMessages(data.data.message_list);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      const tenant = await getData('tenant');
      const current_user = await getData('user_id');
      const organization_id = await getData('organization_id');
      axiosInstance
        .post(`${apiData.apiUrl}/message/send`,
          {
            room_id: route.params.room_id,
            sender_user: current_user,
            text: messageText,
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
          //setMessages(data.data.message_list);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          flex: 1,
        }}>
        {
          messages.map(message => {
            return (
              <View key={message.id} style={message.sender_user.id === userId ? style.bubbleRight : style.bubbleLeft}>
                <View
                  style={message.sender_user.id === userId ? [{ ...style.bubble }, { backgroundColor: '#E6F7FF' }] : style.bubble}>
                  <TextBox
                    style={style.messageText}>
                    {message.text}
                  </TextBox>
                </View>
                <Text
                  style={style.date}>
                  {message.sender_user.name} , {moment(moment.utc(message.created_at).toDate()).isSame(moment(), 'day') ?
                    moment(moment.utc(message.created_at).toDate()).local().format("LT") :
                    moment(moment.utc(message.created_at).toDate()).local().format("l")}
                </Text>
              </View>
            )
          })
        }
      </ScrollView>
      <View style={style.replySection}>
        <TextInput
          placeholder="Write your reply"
          style={style.replyTextBox}
          onChangeText={(text) => setMessageText(text)}
          value={messageText}
        />
        <TouchableOpacity
          style={style.sendButton}
          disabled={messageText === ""}
          onPress={() => {
            sendMessage();
            setMessageText("");
          }}
        >
          <Text style={style.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  bubbleLeft: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bubbleRight: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingRight: 40,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderColor: '#dadada',
    borderWidth: 1,
    marginBottom: 6,
  },
  date: {
    fontFamily: 'Inter-Medium',
    fontSize: 9,
    lineHeight: 12,
    color: '#828282',
    marginHorizontal: 8,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
  },
  replySection: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    borderRadius: 2,
    backgroundColor: color.primaryBrandColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    fontSize: 14,
    lineHeight: 17,
  },
  replyTextBox: {
    flex: 1,
    marginRight: 15,
  },
});

export default ConversationsDetail;
