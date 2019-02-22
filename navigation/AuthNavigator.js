import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
    ResetPassword: ResetPasswordScreen
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
    });

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Auth: AuthStack,
},

));


