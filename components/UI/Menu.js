import React, { Component } from 'react';
import { Animated, TouchableHighlight, View, Image, StyleSheet, ScrollView, Text, DeviceEventEmitter } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome';
import Layout from '../../constants/Layout';
import TabBarIcon from '../../components/UI/TabBarIcon';
import NavigationService from '../../components/services/NavigationService';
import * as firebase from 'firebase';

const SIZE = 60;
class Menu extends Component {
    mode = new Animated.Value(0);
    delayied = new Animated.Value(0);
    invertedmode = new Animated.Value(1);
    toggleView = () => {
        Animated.parallel([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 300
            }),
            Animated.timing(this.invertedmode, {
                toValue: this.invertedmode._value === 0 ? 1 : 0,
                duration: 300
            })
        ]).start(() => {
            // callback
        });

    };

    componentDidMount() {
        DeviceEventEmitter.addListener('hideFilter', (data) => {
            if (this.mode._value !== 0) {
                this.toggleView();
            }

        });
    }
    changePage(page, id) {
        if (id !== undefined) {
            NavigationService.navigate(page, { Id: id });
        } else {
            NavigationService.navigate(page);
        }

        this.toggleView();

    }
    logoff() {
        //NavigationService.navigate('Profile', { Id: '1' });
        //DeviceEventEmitter.emit('showMenu', { show: this.state.showMenu });
        firebase.auth().signOut().then(function () {
            // Sign-out successful.

        }, function (error) {
            // An error happened.
        });
    }
    render() {
        const radius = this.mode.interpolate({
            inputRange: [0, 0.9, 1],
            outputRange: [600, 600, 0]
        });
        const width = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [50, Layout.window.width]
        });
        const height = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [50, SIZE * 5]
        });
        const menuPos = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0]
        });
        const opacity = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const invertedopacity = this.invertedmode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '135deg']
        });
        return (
            <View style={{
                alignItems: 'center',
                overflow: 'visible'
            }}
            >

                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="transparent"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE,
                        height: SIZE,
                        marginBottom: 10,
                        marginLeft: SIZE / 6,
                        marginRight: SIZE / 6,
                        borderRadius: SIZE / 2,
                        backgroundColor: '#006CD8',
                        zIndex: 1000
                    }}
                >
                    <View style={styles.menuBox}>
                        <Animated.View style={[styles.menuIcon, {
                            opacity: invertedopacity,
                            transform: [
                                { rotate: rotation }
                            ]
                        }]}>
                            <Image source={require('../../assets/images/listup-icon.png')} resizeMode="cover" style={styles.icon} />
                        </Animated.View>
                        <Animated.View style={{
                            opacity,
                            transform: [
                                { rotate: rotation }
                            ]
                        }}>
                            <Icon name="plus" size={30} color="#F8F8F8" />
                        </Animated.View>
                    </View>
                </TouchableHighlight>
                <Animated.View style={{
                    position: 'absolute',
                    width,
                    height,
                    borderRadius: radius,
                    bottom: menuPos,
                    backgroundColor: '#006CD8',
                    //opacity,
                    overflow: 'hidden',
                    zIndex: 100
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                        underlayColor="transparent"
                    >

                        <Animated.View style={[{
                            opacity
                        }]}>
                            <View style={styles.menuContent}>

                                <ScrollView style={styles.menuGrid} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Test')}>
                                        <View>
                                            <TabBarIcon
                                                size={26}
                                                name={'gamepad-variant'}
                                                type={'MaterialCommunityIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>My Games</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Test')}>
                                        <View>
                                            <TabBarIcon
                                                size={26}
                                                name={'format-list-bulleted-type'}
                                                type={'MaterialCommunityIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Fav List</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Profile')}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'playlist-add'}
                                                type={'MaterialIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Criar lista</Text>
                                        </View>
                                    </TouchableHighlight>

                                </ScrollView>
                                <ScrollView style={styles.menuGrid} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Tutorial')}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'dice-5'}
                                                type={'MaterialCommunityIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Random Game</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Tutorial')}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'star'}
                                                type={'FontAwesome'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Game Reviews</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Tutorial')}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'cards-outline'}
                                                type={'MaterialCommunityIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Game Match</Text>
                                        </View>
                                    </TouchableHighlight>

                                </ScrollView>

                                <ScrollView style={styles.menuGrid} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Tutorial')}>
                                        <View>
                                            <TabBarIcon
                                                size={26}
                                                name={'book'}
                                                type={'Octicons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Tutorial</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Configuracoes')}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'gear'}
                                                type={'FontAwesome'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Configurações</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.logoff()}>
                                        <View style={styles.menuItem}>
                                            <TabBarIcon
                                                size={26}
                                                name={'logout'}
                                                type={'MaterialCommunityIcons'}
                                                style={styles.menuItemIcon}
                                            />
                                            <Text style={styles.menuLabel}>Logout</Text>
                                        </View>
                                    </TouchableHighlight>

                                </ScrollView>
                            </View>
                        </Animated.View>
                    </TouchableHighlight>
                </Animated.View>
            </View>
        );
    }
}
export { Menu };

const styles = StyleSheet.create({
    menuIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    menuContent: {
        paddingBottom: SIZE,
        zIndex: 100,
    },
    menuGrid: {
        width: Layout.window.width,
        height: SIZE + 20,
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    menuBox: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        zIndex: 1000,
        backgroundColor: '#006CD8'
    },
    menuItem: {
        width: Layout.window.width / 4 - 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemIcon: {
        fontSize: 30,
        alignSelf: 'center',
        color: '#FFF',
        marginBottom: 10
    },
    menuLabel: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold'
    }
});