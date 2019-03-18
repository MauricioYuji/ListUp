import React from 'react';
import { Platform, Easing, Animated, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import ViewOverflow from 'react-native-view-overflow';

import { MultiBar } from './MultiBar';

import TabBarIcon from '../components/UI/TabBarIcon';
import { Menu } from '../components/UI/Menu';
import FeedScreen from '../screens/Pages/FeedScreen';
import GamesScreen from '../screens/Pages/GamesScreen';
import GroupsScreen from '../screens/Pages/GroupsScreen';
import GameDetailScreen from '../screens/Pages/GameDetailScreen';
import ProfileScreen from '../screens/Pages/ProfileScreen';
import SettingsScreen from '../screens/Pages/SettingsScreen';
import NavigationService from '../components/services/NavigationService';
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
    GameDetail: GameDetailScreen
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
    Test: SettingsScreen,
},
    {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
        transitionConfig: transitionConfig,
    });

GroupsStack.navigationOptions = {
    initialRouteName : 'Groups',
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
    }),
    params: {
        navigationDisabled: true
    }
};

export default createBottomTabNavigator({
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
