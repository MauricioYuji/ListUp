import React, { Component } from 'react';
import { Animated, TouchableHighlight, View, Image, StyleSheet, ScrollView, Text } from "react-native";
import Icon from '@expo/vector-icons/FontAwesome';
import Layout from '../../constants/Layout';
import TabBarIcon from '../../components/UI/TabBarIcon';
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
    render() {
        const menuPos = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [-120, 40]
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
                position: 'absolute',
                alignItems: 'center',
            }}>
                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="#2882D8"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE,
                        height: SIZE,
                        marginTop: -SIZE / 2,
                        marginLeft: SIZE / 6,
                        marginRight: SIZE / 6,
                        borderRadius: SIZE / 2,
                        backgroundColor: '#48A2F8',
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
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                        }}
                    >

                        <ScrollView style={styles.menuContent} horizontal={true}>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Profile', this.state.user.uid)}>
                                <View>
                                    <TabBarIcon
                                        name={'user-o'}
                                        type={'FontAwesome'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Perfil</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.changePage('Edit')}>
                                <View style={styles.menuItem}>
                                    <TabBarIcon
                                        name={'settings'}
                                        type={'MaterialIcons'}
                                        style={styles.menuItemIcon}
                                    />
                                    <Text style={styles.menuLabel}>Editar</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.menuItem} onPress={() => this.logoff()}>
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
        bottom: 0
    },
    menuContent: {
        width: Layout.window.width,
        height: SIZE*2,
        zIndex: 10000000000,
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