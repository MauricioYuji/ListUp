import React, { Component } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    TouchableHighlight,
    Platform,
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import TabBarIcon from './TabBarIcon';

const window = Dimensions.get('window');



export default class DragGame extends React.Component {


    constructor(props) {
        super(props);

        this._active = new Animated.Value(0);

        this._style = {
            ...Platform.select({
                ios: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1],
                        }),
                    }],
                    shadowRadius: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 10],
                    }),
                },

                android: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.07],
                        }),
                    }],
                    elevation: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 6],
                    }),
                },
            })
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
            Animated.timing(this._active, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(nextProps.active),
            }).start();
        }
    }
    deleteItens() {
        this.props.callback(this.props.data.key);
    }
    render() {
        const { pos, data, active } = this.props;
        return (
            <Animated.View style={[
                styles.row,
                this._style,
            ]}>
                <View style={styles.pos}>
                    <Text style={styles.posNumber}>{parseInt(pos) + 1}</Text>
                </View>
                <View style={styles.thumb}>
                    <Image source={{ uri: data.image.url }} style={styles.image} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.text}>{data.name}</Text>
                </View>
                <View style={styles.del}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.deleteItens()} style={styles.sideIcon}>
                        <TabBarIcon
                            name={'trash-can-outline'}
                            type={'MaterialCommunityIcons'}
                            style={styles.delIcon}
                        />
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: "#222222",
        height: 80,
        flex: 1,
        marginTop: 7,
        marginBottom: 12,
        borderRadius: 4,


        ...Platform.select({
            ios: {
                width: window.width - 30 * 2,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOpacity: 1,
                shadowOffset: { height: 2, width: 2 },
                shadowRadius: 2,
            },

            android: {
                width: window.width - 30 * 2,
                elevation: 0,
                marginHorizontal: 30,
            },
        })
    },
    pos: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: 40,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        backgroundColor: '#006CD8',
    },
    posNumber: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    content: {
        flex: 1,
        padding: 10
    },
    thumb: {
        width: 50,
    },
    del: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        width: 30,
        backgroundColor: '#F00'
    },
    delIcon: {
        color: '#FFF',
        fontSize: 20
    },
    image: {
        width: 50,
        height: 80,
        marginRight: 30,
    },

    text: {
        fontSize: 24,
        color: '#FFF',
    },
});