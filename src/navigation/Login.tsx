import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../commonPages/login/Login';
import VerifyCode from '../commonPages/login/VerifyCode';
import ChooseSex from '../commonPages/login/ChooseSex';

const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          title: '登录',
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTransparent: true,
        }}
        name="VerifyCode"
        component={VerifyCode}
      />
      <Stack.Screen
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerBackVisible: true,
          headerTransparent: true,
        }}
        name="ChooseSex"
        component={ChooseSex}
      />
    </Stack.Navigator>
  );
};

export default LoginStack;
