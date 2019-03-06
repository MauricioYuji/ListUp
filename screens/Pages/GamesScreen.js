import React from 'react';
import * as firebase from 'firebase';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,
    Dimensions,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import Layout from '../../constants/Layout';
import { getData, setData } from '../../components/services/Service';
import { getGames } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import LoadingScreen from '../Loading/LoadingScreen';
import { parse } from 'qs';
import Masonry from 'react-native-masonry-layout';
const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;



export default class GameScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            withHeight: false,
            loading: false
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        this.setState({ loading: true });


        var _self = this;


        getGames().then((games) => {
            this.setState({ loading: false });
            games = games.map(item => {
                console.log("item: ", item);
                return {
                    image: item.file.url,
                    text: item.name,
                    key: item.key,
                    height: columnWidth / item.file.file.width * item.file.file.height
                };

            });
            console.log("games:", games);
            if (this.state.withHeight) {
                this.refs.list.addItemsWithHeight(games);
            } else {
                this.refs.list.addItems(games);
            }

        });

    }

    onScrollEnd(event) {
        const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        const height = Math.floor(event.nativeEvent.contentSize.height);
        if (scrollHeight >= height) {
            this.load();
        }
    }

    render() {
        return <View style={{ flex: 1 }}>
            <Masonry onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                style={{ flex: 1, borderWidth: 1, borderColor: "red" }}
                columns={2} ref="list"
                containerStyle={{ padding: 5 }}
                refreshControl={<RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    tintColor="#ff0000"
                    title="Loading..."
                    titleColor="#00ff00"
                    colors={['#ff0000', '#00ff00', '#0000ff']}
                    progressBackgroundColor="#ffff00"
                />}
                renderItem={item => <View
                    style={{
                        margin: 5,
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#dedede"
                    }}>
                    <Image source={{ uri: item.image }} style={{ height: item.height }} />
                    <Text style={{ padding: 5, color: "#444" }}>{item.text}</Text>
                </View>} />

            {this.state.loading && <View style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.3)"
            }}>
                <Text style={{
                    backgroundColor: "#fff",
                    paddingVertical: 20,
                    paddingHorizontal: 30,
                    borderRadius: 10
                }}>CARREGANDO</Text>
            </View>}
        </View>
    }
}
