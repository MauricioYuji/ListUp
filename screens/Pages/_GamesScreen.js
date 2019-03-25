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
import { getData, setData } from '../../components/services/baseService';
import { getGames } from '../../components/services/Service';
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
            listend: false,
            page: 0,
            games: null,
            gamesfiltered: null,
            filterObj: { consoles: [], genres: [], search: "" }
        };
    }
    componentDidMount() {
        var _self = this;

        getGames(this.state.page).then((games) => {
            games = games.map(item => {
                //console.log("item: ", item);
                return {
                    image: item.file,
                    name: item.name,
                    key: item.key,
                    consoles: item.consoles,
                    genres: item.genres
                };
            });
            //console.log("games:", games);

            _self.setState({ page: 0, games: games },
                () => {
                    _self.filterObj();
                }
            );

        });
        DeviceEventEmitter.addListener('getFilter', (data) => {
            //console.log("data: ", data);
            //console.log("CLEAN");
            this.refs.list.clear();

            _self.setState({ filterObj: data },
                () => {
                    _self.filterObj();
                }
            );
        });
    }
    filterObj() {
        var _self = this;
        var obj = this.state.games;
        var filterobj = this.state.filterObj;
        var result = null;
        if (filterobj.consoles.length == 0 && filterobj.genres.length == 0 && filterobj.search == "") {
            result = obj;
        } else {
            var re = new RegExp(filterobj.search, 'g');
            result = obj.filter(p => p.consoles.some(r => filterobj.consoles.includes(r.key)) || p.genres.some(r => filterobj.genres.includes(r.key)) || (p.name.match(re) != null && filterobj.search != ""));
        }

        //var result = obj.filter(p => p.consoles.some(r => filterobj.consoles.includes(r.key)) || p.genres.some(r => filterobj.genres.includes(r.key)));
        //var result = obj.filter(p => p.consoles.some(r => filterobj.consoles.includes(r.key)));
        //console.log("result: ", result);

        _self.setState({ gamesfiltered: result, page: 0 },
            () => {
                _self.startLoad();
            }
        );
    }
    _onRefresh(event) {
        var _self = this;
        //console.log("CLEAN");
        //this.refs.list.clear();
        //_self.setState({ isRefreshing: false, page: 0, listend: false },
        //    () => {
        //        //_self.filterObj();
        //    }
        //);
        _self.setState({ isRefreshing: false },
            () => {
                //_self.filterObj();
            }
        );
    }
    startLoad() {
        var _self = this;
        this.setState({ loading: true });

        _self.load(false);
    }

    load(flag) {

        if (!flag) {
            const _self = this;

            const registerPerPage = 10;
            var returnarray = _self.state.gamesfiltered.slice(_self.state.page * registerPerPage, _self.state.page * registerPerPage + registerPerPage);

            if (returnarray.length > 0) {
                //_self.setState({ loading: true });
                if (_self.state.withHeight) {
                    //console.log("render height: ", returnarray);
                    _self.refs.list.addItemsWithHeight(returnarray);
                } else {
                    //console.log("render: ", returnarray);
                    _self.refs.list.addItems(returnarray);
                }
                //console.log("page: ", _self.state.page);
                _self.setState({ page: _self.state.page + 1 });
            } else {
                _self.setState({ listend: true });
            }

            setTimeout(function () {
                _self.setState({ loading: false });
            }, 1000);
        }
    }

    onScrollEnd(event) {
        if (!this.state.listend) {
            const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
            const height = Math.floor(event.nativeEvent.contentSize.height);
            if (scrollHeight >= height) {
                this.setState({ loading: true });
            }
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

    checkLoading(event) {
        const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        const height = Math.floor(event.nativeEvent.contentSize.height);
        //console.log("scrollHeight: ", scrollHeight);
        //console.log("height: ", height);
        if (scrollHeight >= height / 2) {
            //console.log("LOAD");
            this.load(this.state.loading);
        }
    }
    handleScroll = () => {
        DeviceEventEmitter.emit('hideFilter', true);
    }
    showGame = (key) => {
        console.log("key: ", key);
        NavigationService.navigate('GameDetail', { key: key });
    }
    renderThumb = (item) => {
        if (item != null)
            return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        else
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
    }
    render() {
        return <View style={styles.container}>
            <Masonry
                onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                onScroll={this.checkLoading.bind(this)}
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
                />)}
                renderItem={(item) => (
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.showGame(item.key)} key={item.name}>
                        <View key={item.key} style={styles.card}>
                            {this.renderThumb(item.image)}
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardText}>{item.name}</Text>
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