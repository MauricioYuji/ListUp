import React from 'react';
import { Platform, Easing, Animated } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/UI/TabBarIcon';
import { Menu } from '../components/UI/Menu';
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
const FeedStack = createStackNavigator({
    Feed: FeedScreen,
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

FeedStack.navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'list-alt'}
            type={'FontAwesome'}
        />
    ),
};

const GamesStack = createStackNavigator({
    Games: GamesScreen,
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

GamesStack.navigationOptions = {
    tabBarLabel: 'Games',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'gamepad'}
            type={'FontAwesome'}
        />
    ),
};

const ProfileStack = createStackNavigator({
    Profile: ProfileScreen,
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'user'}
            type={'FontAwesome'}
        />
    ),
};
const GroupsStack = createStackNavigator({
    Groups: GroupsScreen,
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

GroupsStack.navigationOptions = {
    tabBarLabel: 'Grupos',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'users'}
            type={'FontAwesome'}
        />
    ),
};

const MenuStack = {
    screen: () => null, // Empty screen
    navigationOptions: () => ({
        tabBarIcon: <Menu /> // Plus button component
    })
};


export default createBottomTabNavigator({
    FeedStack,
    GamesStack,
    MenuStack,
    ProfileStack,
    GroupsStack
}, {
        tabBarOptions: {
            showLabel: false,
            activeTintColor: '#FFFFFF',
            labelStyle: {
                fontSize: 32,
            },
            style: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 1,
                backgroundColor: '#333'
            },
        },
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });
