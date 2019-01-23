import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';

const LoginStack = createStackNavigator({
    Login: LoginScreen,
});

