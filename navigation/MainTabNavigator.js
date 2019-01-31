import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'dashboard'}
            type={'MaterialIcons'}
        />
    ),
};

const LinksStack = createStackNavigator({
    Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarLabel: 'Links',
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
    tabBarLabel: 'Settings',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'md-stats'}
            type={'Ionicons'}
        />
    ),
};



export default createBottomTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack
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

