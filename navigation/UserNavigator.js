import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import ProfileScreen from '../screens/ProfileScreen';
import EditScreen from '../screens/EditScreen';

const UserStack = createStackNavigator({
    Profile: ProfileScreen,
    Edit: EditScreen
});

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    User: UserStack,
}));


