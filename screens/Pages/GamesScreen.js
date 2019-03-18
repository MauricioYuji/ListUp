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
import MasonryList from '@appandflow/masonry-list';

const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;
var process = false;



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
            gamesfiltered: [],
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

            _self.setState({ page: 0, games: games, listend: false },
                () => {
                    _self.filterObj();
                }
            );

        });
        DeviceEventEmitter.addListener('getFilter', (data) => {
            //console.log("data: ", data);
            //console.log("CLEAN");
            //this.refs.list.clear();

            _self.setState({ filterObj: data, page: 0, gamesfiltered: [], listend: false },
                () => {
                    _self.filterObj();
                }
            );
        });
    }
    loadData = () => {
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
    }


    filterObj() {
        var _self = this;
        var obj = _self.state.games;
        var filterobj = _self.state.filterObj;
        var result = null;
        if (filterobj.consoles.length == 0 && filterobj.genres.length == 0 && filterobj.search == "") {
            result = obj;
        } else {
            var re = new RegExp(filterobj.search.toLowerCase(), 'g');
            result = obj.filter(p => (p.consoles.some(r => filterobj.consoles.includes(r.key)) || filterobj.consoles.length == 0) && (p.genres.some(r => filterobj.genres.includes(r.key)) || filterobj.genres.length == 0) && ((p.name.toLowerCase().match(re) != null && filterobj.search != "") || filterobj.search == ""));
        }

        const registerPerPage = 10;
        var resultsliced = result.slice(_self.state.page * registerPerPage, _self.state.page * registerPerPage + registerPerPage);

        _self.getImages(resultsliced);
        var returnarray = _self.state.gamesfiltered.concat(resultsliced);
        if (resultsliced.length > 0) {
            _self.setState({ gamesfiltered: returnarray, page: _self.state.page + 1, loading: false },
                () => {
                    //_self.startLoad();
                    process = false;
                }
            );
        } else {
            _self.setState({ listend: true },
                () => {
                    //_self.startLoad();
                    process = true;
                }
            );
        }
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
        process = false;
        _self.setState({ isRefreshing: false, gamesfiltered: [], loading: true, listend: false },
            () => {
                _self.loadData();
            }
        );
    }
    //startLoad() {
    //    var _self = this;
    //    this.setState({ loading: true });

    //    _self.load(false);
    //}

    //load(flag) {

    //    if (!flag) {
    //        const _self = this;

    //        const registerPerPage = 10;
    //        var returnarray = _self.state.gamesfiltered.slice(_self.state.page * registerPerPage, _self.state.page * registerPerPage + registerPerPage);

    //        if (returnarray.length > 0) {
    //            //_self.setState({ loading: true });
    //            if (_self.state.withHeight) {
    //                //console.log("render height: ", returnarray);
    //                _self.refs.list.addItemsWithHeight(returnarray);
    //            } else {
    //                //console.log("render: ", returnarray);
    //                _self.refs.list.addItems(returnarray);
    //            }
    //            //console.log("page: ", _self.state.page);
    //            _self.setState({ page: _self.state.page + 1 });
    //        } else {
    //            _self.setState({ listend: true });
    //        }

    //        setTimeout(function () {
    //            _self.setState({ loading: false });
    //        }, 1000);
    //    }
    //}

    onScrollEnd(event) {
        //if (!this.state.listend) {
        //    const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        //    const height = Math.floor(event.nativeEvent.contentSize.height);
        //    if (scrollHeight >= height) {
        //        this.setState({ loading: true });
        //    }
        //}
        //this.setState({ loading: true });
    }
    renderConsoles = (item, key) => {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < item.length; i++) {
            table.push(<Image key={i} source={{ uri: item[i].img }} resizeMode={'contain'} style={styles.logo} />);
        }
        return table;
    }
    getImages = async (obj) => {
        for (let i = 0; i < obj.length; i++) {
            //console.log("item: ", obj[i]);
            await getData('thumbs/' + obj[i].image.key)
                .then((img) => {
                    obj[i].image.file = img.file;
                    obj[i].image.url = img.url;
                });
        }

        this.setState({ gamesfiltered: this.state.gamesfiltered });
        //console.log("obj: ", this.state.gamesfiltered);
    }
    checkLoading = async (event) => {
        DeviceEventEmitter.emit('hideFilter', true);
        var _self = this;
        const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        const height = Math.floor(event.nativeEvent.contentSize.height);
        //console.log("scrollHeight: ", scrollHeight);
        //console.log("height: ", height);
        if (scrollHeight >= height / 2) {
            //console.log("LOAD");

            if (!process) {
                process = true;
                _self.filterObj();

                //_self.setState({ loadingContent: true },
                //    () => {
                //        _self.filterObj();
                //    }
                //);
            }
        }
    }
    handleScroll = () => {
        DeviceEventEmitter.emit('hideFilter', true);
    }
    showGame = (key) => {
        //console.log("key: ", key);
        NavigationService.navigate('GameDetail', { key: key });
    }
    renderThumb = (item) => {
        if (item.key == "" || item.file == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
        else {
            return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        }

        //if (item.file == null && item.key != "") {
        //    getData('thumbs/' + item.key)
        //        .then((img) => {
        //            console.log("GET IMAGE");
        //            item.file = img.file;
        //            item.url = img.url;

        //            return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        //        });
        //} else {
        //    return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        //}

    }

    //_refreshRequest = () => {
    //    this.setState({ isRefreshing: true });
    //    setTimeout(() => {
    //        this.setState({ isRefreshing: false });
    //    }, 1000);
    //};
    render() {
        return <View style={styles.container}>
            <MasonryList
                onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                onScrollBeginDrag={this.checkLoading.bind(this)}
                onScrollEndDrag={this.checkLoading.bind(this)}
                refreshControl={(<RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    tintColor="#FFFFFF"
                    title="Loading..."
                    titleColor="#CCCCCC"
                    colors={['#FFFFFF', '#CCCCCC', '#EEEEEE']}
                    progressBackgroundColor="#48A2F8"
                />)}
                data={this.state.gamesfiltered}
                renderItem={({ item }) =>
                    (
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.showGame(item.key)} key={item.name}>
                            <View key={item.key} style={styles.card}>
                                {this.renderThumb(item.image)}
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardText}>{item.name}</Text>
                                </View>
                                <View style={styles.logosBox}>
                                    {this.renderConsoles(item.consoles, item.key)}
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}
                getHeightForItem={({ item }) => 300}
                numColumns={2}
                keyExtractor={item => item.key}
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