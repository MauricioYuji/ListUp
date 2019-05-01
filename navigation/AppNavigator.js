import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, Easing, Animated } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import TutorialScreen from '../screens/Tutorial/TutorialTemplate';
import GroupsScreen from '../screens/Pages/GroupsScreen';

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;

            const thisSceneIndex = scene.index;
            const width = layout.initWidth;

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0]
            });

            return { transform: [{ translateX }] };
        }
    };
};
export default createAppContainer(createSwitchNavigator({
    App: MainTabNavigator,
    Auth: AuthNavigator,
    Tutorial: TutorialScreen,
    Group: GroupsScreen
}));
