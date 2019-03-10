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
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import Layout from '../../constants/Layout';
import { getData, setData } from '../../components/services/Service';
import { getGames } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import Header from '../../screens/Shared/Header';
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
            loading: false,
            page: 0
        };
    }

    componentDidMount() {
        this.load();
        DeviceEventEmitter.addListener('getFilter', (data) => {
            console.log("data: ", data);
            //this.setState({ showMenu: data.show });
        });
    }

    load() {
        this.setState({ loading: true, page: this.state.page + 10 });


        var _self = this;


        getGames(this.state.page).then((games) => {
            this.setState({ loading: false });
            games = games.map(item => {
                //console.log("item: ", item);
                return {
                    image: item.file.url,
                    text: item.name,
                    key: item.key,
                    height: columnWidth / item.file.file.width * item.file.file.height,
                    consoles: item.consoles
                };

            });
            //console.log("games:", games);
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
    createTable = (item, key) => {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < item.length; i++) {
            table.push(<Image key={i} source={{ uri: item[i].img }} resizeMode={'contain'} style={styles.logo} />);
        }
        return table;
    }
    render() {
        return <View style={styles.container}>
            <Masonry onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                style={styles.grid}
                columns={2} ref="list"
                containerStyle={{ padding: 5 }}
                refreshControl={<RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    tintColor="#FFFFFF"
                    title="Loading..."
                    titleColor="#CCCCCC"
                    colors={['#FFFFFF', '#CCCCCC', '#EEEEEE']}
                    progressBackgroundColor="#48A2F8"
                />}
                renderItem={item => <View key={item.key}
                    style={styles.card}>
                    <Image source={{ uri: item.image }} style={{ height: item.height }} />
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardText}>{item.text}</Text>
                    </View>
                    <View style={styles.logosBox}>
                        {this.createTable(item.consoles, item.key)}
                    </View>
                </View>} />

            <Header style={styles.header} />
            {this.state.loading && <View style={styles.loadingBackground}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>}
        </View>
    }
}
const styles = {
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    header: {
        zIndex: 100,
    },
    grid: {
        flex: 1
    },
    logosBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    logo: {
        width: '20%',
        height: 20,
        margin: 4
    },
    card: {
        margin: 5,
        backgroundColor: "#222",
        borderRadius: 5,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#222"
    },
    cardHeader: {
        borderBottomWidth: 4,
        borderBottomColor: '#48A2F8',
        padding: 4
    },
    cardText: {
        padding: 5,
        color: "#FFF",
        fontSize: 20
    },
    loadingBackground: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.3)"
    }
}