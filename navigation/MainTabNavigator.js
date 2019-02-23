import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/UI/TabBarIcon';
import { Menu } from '../components/UI/Menu';
import HomeScreen from '../screens/Pages/HomeScreen';
import LinksScreen from '../screens/Pages/LinksScreen';
import SettingsScreen from '../screens/Pages/SettingsScreen';
import { MultiBarToggle } from 'react-native-multibar';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'list-alt'}
            type={'FontAwesome'}
        />
    ),
};

const LinksStack = createStackNavigator({
    Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarLabel: 'Games',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'gamepad'}
            type={'FontAwesome'}
        />
    ),
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'user'}
            type={'FontAwesome'}
        />
    ),
};
const TestStack = createStackNavigator({
    Test: LinksScreen,
});

TestStack.navigationOptions = {
    tabBarLabel: 'Grupos',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'users'}
            type={'FontAwesome'}
        />
    ),
};

const addingStack = {
    screen: () => null, // Empty screen
    navigationOptions: () => ({
        tabBarIcon: <Menu /> // Plus button component
    })
};



export default createBottomTabNavigator({
    HomeStack,
    LinksStack,
    addingStack,
    SettingsStack,
    TestStack
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
                backgroundColor: '#111111'
            },
        }
    });

//export default createMaterialTopTabNavigator({
//    HomeStack,
//    LinksStack,
//    SettingsStack
//}, {
//        tabBarPosition: 'bottom',
//        swipeEnabled: true,
//        animationEnabled: true,
//        tabBarOptions: {
//            showLabel: false,
//            activeTintColor: '#FFFFFF',
//            labelStyle: {
//                fontSize: 32,
//            },
//            style: {
//                backgroundColor: 'blue',
//            },
//        }
//    });
