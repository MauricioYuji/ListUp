import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
});

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Auth: AuthStack,
}));


