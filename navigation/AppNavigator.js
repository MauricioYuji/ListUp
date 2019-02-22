import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import UserNavigator from './UserNavigator';
import TutorialScreen from '../screens/Tutorial/Tutorial';

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    App: MainTabNavigator,
    User: UserNavigator,
    Tutorial: TutorialScreen
}));