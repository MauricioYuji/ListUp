import React from 'react';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MultiBar, MultiBarToggle } from 'react-native-multibar';
import TabBarIcon from '../../components/UI/TabBarIcon';
import { Menu } from '../../components/UI/Menu';

import { Bookmarks, Likes, Private, Profile, Settings } from "../components";
import { Routes } from "./Routes";

const TabsNavigator = createBottomTabNavigator({
    [Routes.TabsBookmarks]: {
        screen: Bookmarks,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon
                    focused={tintColor}
                    name={'list-alt'}
                    type={'FontAwesome'}
                />
            )
        })
    },
    [Routes.TabsLikes]: {
        screen: Likes,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon
                    focused={tintColor}
                    name={'gamepad'}
                    type={'FontAwesome'}
                />
            )
        })
    },
    MultiBar: {
        screen: () => null,
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: () => (
                <Menu />
            )
        }),
        params: {
            navigationDisabled: true
        }
    },
    [Routes.TabsPrivate]: {
        screen: Private,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon
                    focused={tintColor}
                    name={'user'}
                    type={'FontAwesome'}
                    color={tintColor}
                />
            )
        })
    },
    [Routes.TabsProfile]: {
        screen: Profile,
        navigationOptions: () => ({
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon
                    focused={'#FFF'}
                    name={'users'}
                    type={'FontAwesome'}
                />
            )
        })
    }
}, {
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
            tabStyle: { 
            }

        },

        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000' },
    });

const BaseNavigatorContainer = createAppContainer(createStackNavigator({
    [Routes.Tabs]: TabsNavigator,
    [Routes.OtherScreen]: Settings
}, {
        headerMode: 'none',
        cardStyle: { backgroundColor: '#00000000', width: '100%' },
    }));

export { BaseNavigatorContainer as BaseNavigator };