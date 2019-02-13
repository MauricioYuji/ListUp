import React from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AddConsolesScreen from '../screens/Tutorial/AddConsolesScreen';
import AddGamesScreen from '../screens/Tutorial/AddGamesScreen';

const TutorialStack = createStackNavigator({
    AddConsoles: AddConsolesScreen,
    AddGames: AddGamesScreen
});

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Tutorial: TutorialStack,
}));


