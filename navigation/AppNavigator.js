import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/User/ProfileScreen';
import EditScreen from '../screens/User/EditScreen';

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    App: MainTabNavigator,
    Profile: ProfileScreen,
    Edit: EditScreen
}));