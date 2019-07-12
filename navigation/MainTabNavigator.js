import React from 'react';
import { Platform, Easing, Animated } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { MultiBar } from './MultiBar';
import MenuIcon from '../components/UI/MenuIcon';
import { Menu } from '../components/UI/Menu';

import FeedScreen from '../screens/Pages/FeedScreen';
import GamesScreen from '../screens/Pages/GamesScreen';
import GroupsScreen from '../screens/Pages/GroupsScreen';
import GameDetailScreen from '../screens/Pages/GameDetailScreen';
import ListScreen from '../screens/Pages/ListScreen';
import ListsScreen from '../screens/Pages/ListsScreen';
import ProfileScreen from '../screens/Pages/ProfileScreen';
import TestScreen from '../screens/Pages/TestScreen';

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true
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
const config = {
    //Platform.select({
    //    web: { headerMode: 'screen' },
    //    default: {},
    //}),
    headerMode: 'none',
    cardStyle: { backgroundColor: '#00000000' },
    transitionConfig: transitionConfig,
};

const FeedStack = createStackNavigator(
    {
        Feed: FeedScreen
    },
    config
);

FeedStack.navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => (
        <MenuIcon
            focused={focused}
            name={'list-alt'}
            type={'FontAwesome'}
        />
    ),
};

FeedStack.path = '';

const GamesStack = createStackNavigator(
    {
        Games: GamesScreen,
        GameDetail: GameDetailScreen,
        Lists: ListsScreen,
        List: ListScreen,
        Test: TestScreen
    },
    config
);

GamesStack.navigationOptions = {
    tabBarLabel: 'Games',
    tabBarIcon: ({ focused }) => (
        <MenuIcon
            focused={focused}
            name={'gamepad'}
            type={'FontAwesome'}
        />
    ),
};

GamesStack.path = '';
const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen
    },
    config
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused }) => (
        <MenuIcon
            focused={focused}
            name={'user'}
            type={'FontAwesome'}
        />
    ),
};

ProfileStack.path = '';
const GroupsStack = createStackNavigator(
    {
        Grupos: GroupsScreen
    },
    config
);

GroupsStack.navigationOptions = {
    tabBarLabel: 'Grupos',
    tabBarIcon: ({ focused }) => (
        <MenuIcon
            focused={focused}
            name={'users'}
            type={'FontAwesome'}
        />
    ),
};

GroupsStack.path = '';

const MenuStack = {
    screen: () => null, // Empty screen
    navigationOptions: () => ({
        tabBarIcon: <Menu /> // Plus button component
    }),
    params: {
        navigationDisabled: true
    }
};
const tabNavigator = createBottomTabNavigator({
    FeedStack,
    GamesStack,
    MenuStack,
    ProfileStack,
    GroupsStack
},
    {
        tabBarComponent: MultiBar,
        tabBarOptions: {
            showLabel: false,
            activeTintColor: '#FFFFFF',
            labelStyle: {
                fontSize: 32,
            },
            style: {
                backgroundColor: '#333',
                width: '100%'
            },
        },
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

tabNavigator.path = '';

export default tabNavigator;
