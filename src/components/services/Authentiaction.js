import AsyncStorage from '@react-native-community/async-storage';
import {setData, removeData, getData} from './AsyncStorage';

export const USER_KEY = 'auth-demo-key';

export const onLogin = (data) => {
  setData('user_id', data.user.id);
  setData('permission_settings', data.permission_settings);
  setData('socket_id', data.user.socket_id);
  setData('organization_id', data.organization.id);
  setData('username', data.user.username);
  setData('image', data.user.image_url);
  setData('feature_setting', data.feature_settings);
  setData('auth_token', data.user.api_token);
  setData('access_token', data.access_token);
  setData('email', data.user.email);
};

export const onLogout = () => {
  removeData('user_id');
  removeData('permission_settings');
  removeData('socket_id');
  removeData('organization_id');
  removeData('username');
  removeData('image');
  removeData('feature_setting');
  removeData('auth_token');
  removeData('access_token');
  removeData('email');
  removeData('tenant');
};

export const LoginState = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('access_token')
      .then((res) => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
