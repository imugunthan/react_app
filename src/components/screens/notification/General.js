import React, {useState} from 'react';
import TextBox from '../../components/TextBox';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableHighlight} from 'react-native';
import image from '../../../assets/images/default-profile-picture.png';
import CheckBox from 'react-native-check-box';
//import {RadioButton} from 'react-native-paper';
import {RadioButton} from 'react-native-btr';

import axiosInstance from '../../services/AxiosInterceptor';
import {getData} from '../../services/AsyncStorage';
import {apiData} from '../../../static/Static';
import moment from 'moment';
import color from '../../../assets/styles/color';


const General = ({navigation}) => {

  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [polls,setPolls] = useState([])
  const [pollsQuestion, sePollsQuestion] =useState([])
  const [isSelected, setSelection] = useState(false);
  const [checked, setChecked] = useState('first');



  //const navigation = useNavigation();

  React.useEffect(() => {    
    getNotifications();
  }, [navigation]);

  const getNotifications = async () => {
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');
    try {
      await axiosInstance
        .post(
          `${apiData.apiUrl}/notification/list`,
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
          },
        )
        .then((data) => {
          setData(data.data.notifications);
        });
    } catch (error) {
      console.log('error', error);
    }
  };
  const updateDate = (dateTime) => {
    var stillUtc = moment.utc(dateTime).toDate();
    var local = moment(stillUtc).local().format('lll');
    return local;
  };

  const openPollsModal = (props) => {
    console.log('props',props)
    if (props.popups != null && props.link !=null){
      if (!props.link.includes('course')){
          getPollInfor(props.link);
      }      
    }  
    else{
      var setId = props.link != null? props.link.replace('/course/',''):'';
      console.log(setId)
      if (setId != ''){
        navigation.navigate('Course Details', {
          courseId: setId,
        });
      }
     
    }  
  }
  const getPollInfor = async(currItem)=>{
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');
    try {
      await axiosInstance
        .get(
          `${apiData.apiUrl}/polls/${currItem}`,
          {
            headers: {
              current_user: current_user,
              org_id: organization_id,
              tenant: tenant,
              type: 2,
            },
          },
        )
        .then((data) => {
          updatePolls(data.data)
          setPolls(data.data);
          setModalVisible(true);
          

        });
    } catch (error) {
      console.log('error', error);
    }

  }
  const updatePolls =(props)=>{
    console.log('polls.polls_questions', props.polls_questions)
    sePollsQuestion(props.polls_questions.map((q) => {
      q.payload = {};
      // q.options.forEach((e) => 
      // (q.payload[e] = false));
      q.options.forEach((e)=>{
        q.payload[e]= false;
      })
      q.error = false;
      return q;
    }))
  }

 

  const checkBoxChange = (i, check, item,lists,ind)=>{
    const newList = [...lists]
    newList[ind].payload[item] = !check.payload[item];
    newList[ind].error =false;
    console.log('updated polls.polls_questions', lists)
    sePollsQuestion(newList) 
  }

  const radioButtonchanges =(quesInd,check,currData,list,index)=>{
    debugger;
    // console.log('currData', currData);
    const newRadioBtnLists =[...list]
    newRadioBtnLists[index].error = false;
    newRadioBtnLists[index].options.forEach((e) => {
      console.log('eeeee', e);
      newRadioBtnLists[index].payload[e] = false;
    });
     newRadioBtnLists[index].payload[currData] = true;
    // console.log('bio', list);
    // console.log('dldlfl', list[index].payload);

    setChecked(currData);
    sePollsQuestion(newRadioBtnLists);
    console.log('radio button', newRadioBtnLists);
  }
  const subMitPolls = async(lists) => {
    const organization_id = await getData('organization_id');
    const current_user = await getData('user_id');
    const tenant = await getData('tenant');

    console.log('submit polls',lists);
    lists = lists.map((q) => {
      q.answer = JSON.stringify(prepareAnswer(q.payload, q.options));
      q.error = !q.answer.includes('true')
      return q;
    })
    const invalidPollIndex = lists.findIndex((poll) => {
      return poll.error
    });
    if (invalidPollIndex<0){
      const paylaod = { answers: [] };
      paylaod.answers = lists.map((q) => ({
        user_id: current_user,
        polls_question_id: q.id,
        answer: JSON.stringify(prepareAnswer(q.payload, q.options))
      }));
      const answers = paylaod.answers;
      try {
        await axiosInstance
          .post(
            `${apiData.apiUrl}/polls/answer`,
            {
              answers
            },
            {
              headers: {
                current_user: current_user,
                org_id: organization_id,
                tenant: tenant,
                type: 2,
              },
            },
          )
          .then((data) => {
            console.log('polls ans',data)
            setModalVisible(false);

          });
      } catch (error) {
        console.log('error', error);
      }
    }

  }

  const prepareAnswer = (obj, keys)=>{
      const pay = {};
      keys.forEach((k) => {
        pay[k] = obj[k] ? 'true' : 'false';
      });
     return pay;
  }
  return (
    <View style={{marginTop: 15}}>
      {modalVisible ? (
        <Modal
          animationType="slide"
          presentationStyle="fullscreen"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={style.centeredView}>
            <Text style={style.modalText}>{polls.course.title}</Text>
            <View style={style.modalView}>
              <Text style={style.modalText}>
                {polls.course.title},{polls.expiry_dt} ,{polls.description}
              </Text>
              {/* <PollsLists lists={pollsQuestion} /> */}
              <View style={style.centeredView}>
                {Object.values(pollsQuestion).map((key, index) => (
                  <View style={style.centeredView} key={index}>
                    <TextBox style={style.notificationText}>
                      Q. {key.title}?
                    </TextBox>
                    <FlatList
                      data={key.options}
                      keyExtractor={({id}, index) => id}
                      renderItem={({item, i}) => (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 15,
                          }}>
                          {key.type == 'checkbox' ? (
                            <CheckBox
                              isChecked={key.payload[item]}
                              onClick={(event) => {
                                checkBoxChange(
                                  i,
                                  key,
                                  item,
                                  pollsQuestion,
                                  index,
                                );
                              }}
                              checkedCheckBoxColor={color.primaryBrandColor}
                              uncheckedCheckBoxColor={color.primaryTextColor}
                            />
                          ) : null}
                          {key.type == 'dropdown' ? (
                            <RadioButton
                              value={item}
                              borderWidth={1}
                              checked={key.payload[item]}
                              color="#4768fd"
                              disabled={false}
                              flexDirection="column"
                              size={8}
                              onPress={() =>
                                radioButtonchanges(
                                  i,
                                  key,
                                  item,
                                  pollsQuestion,
                                  index,
                                )
                              }
                            />
                          ) : null}
                          <TextBox style={{marginLeft: 10}}>{item}</TextBox>
                        </View>
                      )}
                    />
                    {/* <TextBox style={style.notificationText}>{key.error ? '' : 'Please answer the question'}?</TextBox> */}
                  </View>
                ))}
              </View>
              <TouchableHighlight
                style={{...style.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={style.textStyle}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{...style.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  subMitPolls(pollsQuestion);
                }}>
                <Text style={style.textStyle}>Submit</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      ) : null}
      <FlatList
        data={data}
        keyExtractor={({id}, index) => id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={style.notificationCard}
            key={item.id}
            onPress={() => openPollsModal(item)}>
            <Image source={image} style={style.notificationImage} />
            <View style={style.notificationContent}>
              <TextBox style={style.notificationText}>{item.Message}</TextBox>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextBox style={style.notificationDate}>{item.title}</TextBox>
                <TextBox style={style.notificationDate}>
                  {updateDate(item.created_at)}
                </TextBox>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
    // <View style={{marginTop: 15}}>
    //   <View style={style.notificationCard}>
    //     <Image source={image} style={style.notificationImage} />
    //     <View style={style.notificationContent}>
    //       <TextBox style={style.notificationText}>
    //         Congratulations! You have successfully completed a course.
    //       </TextBox>
    //     </View>
    //     <TextBox style={style.notificationDate}>12:15 AM</TextBox>
    //   </View>
    //   <View style={style.notificationCard}>
    //     <Image source={image} style={style.notificationImage} />
    //     <View style={style.notificationContent}>
    //       <TextBox style={style.notificationText}>
    //         Congratulations! You have successfully completed a course.
    //       </TextBox>
    //       <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
    //         <TextBox style={style.notificationDate}>By Jio Zua</TextBox>
    //         <TextBox style={style.notificationDate}>12:15 AM</TextBox>
    //       </View>
    //     </View>
    //   </View>
    // </View>
  );
};

const style = StyleSheet.create({
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
  },
  notificationImage: {
    width: 33,
    height: 33,
    borderRadius: 33 / 2,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 15,
  },
  notificationDate: {
    alignSelf: 'flex-end',
    fontSize: 12,
    lineHeight: 15,
    color: '#697C8A',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#293239',
    marginBottom: 5,
  },
  container: {
    padding: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2AC062',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowRadius: 25,
  },
  closeButton: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3974',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: '100%',
    height: 350,
  },
  text: {
    fontSize: 24,
    marginBottom: 30,
    padding: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});

export default General;
