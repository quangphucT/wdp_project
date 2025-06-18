// src/utils/getTokenHeader.js
import * as SecureStore from 'expo-secure-store';

export const getTokenHeader = async () => {
  const token = await SecureStore.getItemAsync('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
