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

import NavigationService from '../../components/services/NavigationService';
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
            loading: true,
            page: 0,
            games: null,
            filterObj: null
        };
    }
    componentDidMount() {
        var _self = this;
        _self.startLoad();
        DeviceEventEmitter.addListener('getFilter', (data) => {
            //console.log("data: ", data);

            _self.setState({ filterObj: data },
                () => {
                    _self.filterObj();
                }
            );
        });
    }
    filterObj() {
        var obj = this.state.games;
        var filterobj = this.state.filterObj;
        console.log("obj: ", obj);
        console.log("filterobj:", filterobj);
        var result = obj.filter(p => {
            console.log("p.consoles: ", p.consoles.key);
            console.log("filterobj.consoles: ", filterobj.consoles);
            p.consoles.some(r => filterobj.consoles.includes(r.key));
        });
        console.log("result: ", result);
        console.log("=====================");

        //const found = result.every(r => list.includes(r));
    }
    _onRefresh(event) {
        this.setState({ isRefreshing: false });

        this.startLoad();

    }
    startLoad() {
        this.setState({ loading: true });
        this.refs.list.clear();
        getGames(this.state.page).then((games) => {
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
            console.log("games:", games);
            this.setState({ page: 0, games: games });
            this.load(false);
        });
    }

    load(flag) {
        if (!flag) {
            const _self = this;

            const registerPerPage = 6;
            var returnarray = _self.state.games.slice(_self.state.page * registerPerPage, _self.state.page * registerPerPage + registerPerPage);

            if (returnarray.length > 0) {
                _self.setState({ loading: true });
                if (_self.state.withHeight) {
                    _self.refs.list.addItemsWithHeight(returnarray);
                } else {
                    _self.refs.list.addItems(returnarray);
                }
                _self.setState({ page: _self.state.page + 1 });
            } else {
                console.log("ACABOU");
            }

            setTimeout(function () {
                _self.setState({ loading: false });
            }, 1000);
        }
    }

    onScrollEnd(event) {
        const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        const height = Math.floor(event.nativeEvent.contentSize.height);
        if (scrollHeight >= height) {
            this.load(this.state.loading);
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
    handleScroll = () => {
        DeviceEventEmitter.emit('hideFilter', true);
    }
    showGame = (key) => {
        console.log("key: ", key);
        NavigationService.navigate('Profile', { key: key });
    }
    render() {
        return <View style={styles.container}>
            <Masonry onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                onScrollBeginDrag={this.handleScroll}
                style={styles.grid}
                columns={2} ref="list"
                containerStyle={{ padding: 5 }}
                refreshControl={(<RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    tintColor="#FFFFFF"
                    title="Loading..."
                    titleColor="#CCCCCC"
                    colors={['#FFFFFF', '#CCCCCC', '#EEEEEE']}
                    progressBackgroundColor="#48A2F8"
                    pagingEnabled={true}
                />)}
                renderItem={(item) => (
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.showGame(item.key)} key={item.name}>
                        <View key={item.key} style={styles.card}>
                            <Image source={{ uri: item.image }} style={{ height: item.height }} />
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardText}>{item.text}</Text>
                            </View>
                            <View style={styles.logosBox}>
                                {this.createTable(item.consoles, item.key)}
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />

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