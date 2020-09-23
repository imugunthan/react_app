import AsyncStorage from '@react-native-community/async-storage';

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeData = async (key) => {
  try {
    AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
