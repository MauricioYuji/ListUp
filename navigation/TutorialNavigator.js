import React from 'react';
import { Platform, Easing, Animated } from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator, } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import TutorialGamesScreen from '../screens/Tutorial/TutorialGamesScreen';
import TutorialListsScreen from '../screens/Tutorial/TutorialListsScreen';
import TutorialFeedScreen from '../screens/Tutorial/TutorialFeedScreen';
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
const TutorialStack = createStackNavigator({
    TutorialGames: TutorialGamesScreen,
    TutorialLists: TutorialListsScreen,
    TutorialFeed: TutorialFeedScreen
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Tutorial: TutorialStack,
}));


