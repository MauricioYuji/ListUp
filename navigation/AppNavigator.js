import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, Easing, Animated } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import UserNavigator from './UserNavigator';
import AuthNavigator from './AuthNavigator';
import TutorialScreen from '../screens/Tutorial/TutorialTemplate';
import FeedScreen from '../screens/Pages/FeedScreen';
import GamesScreen from '../screens/Pages/GamesScreen';
import GroupsScreen from '../screens/Pages/GroupsScreen';
import ProfileScreen from '../screens/Pages/ProfileScreen';
const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            })

            return { transform: [{ translateX }] }
        },
    }
}
export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    App: MainTabNavigator,
    User: UserNavigator,
    Auth: AuthNavigator,
    Tutorial: TutorialScreen,
    Group: GroupsScreen
}));


const TutorialStack = createStackNavigator({
    Tutorial: TutorialScreen
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });