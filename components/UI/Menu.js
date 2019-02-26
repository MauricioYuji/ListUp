import React, { Component } from 'react';
import { Animated, TouchableHighlight, View, Image, StyleSheet, ScrollView, Text } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome';
import Layout from '../../constants/Layout';
import TabBarIcon from '../../components/UI/TabBarIcon';
import NavigationService from '../../components/services/NavigationService';
import * as firebase from 'firebase';

const SIZE = 60;
class Menu extends Component {
    mode = new Animated.Value(0);
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

    changePage(page, id) {
        if (id !== undefined) {
            NavigationService.navigate(page, { Id: id });
        } else {
            NavigationService.navigate(page);
        }


        this.setState({
            visible: false,
        });

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
        const menuPos = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-120, 50]
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
                    width: Layout.window.width,
                    height: SIZE * 2,
                    bottom: menuPos,
                    backgroundColor: '#48A2F8',
                    opacity,
                    zIndex: 10000
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                    >

                        <ScrollView style={styles.menuContent} horizontal={true}>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Profile')}>
                                <View>
                                    <TabBarIcon
                                        name={'user-o'}
                                        type={'FontAwesome'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Perfil</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} underlayColor="transparent" onPress={() => this.logoff()}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'logout'}
                                        type={'MaterialCommunityIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Logout</Text>
                                </View>
                            </TouchableHighlight>

                        </ScrollView>
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
        width: Layout.window.width,
        height: SIZE * 2,
        zIndex: 100,
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
        backgroundColor: '#48A2F8'
    },
    menuItem: {
        width: Layout.window.width / 4 - 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemIcon: {
        fontSize: 30,
        color: '#FFF',
        marginBottom: 10
    },
    menuLabel: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: 'SourceSansPro-Bold'
    }
});