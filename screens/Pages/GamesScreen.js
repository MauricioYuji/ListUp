import React from 'react';
import * as firebase from 'firebase';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';

import NavigationService from '../../components/services/NavigationService';
import { getData } from '../../components/services/baseService';
import { structureGames } from '../../components/services/Service';
import Header from '../../screens/Shared/Header';
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
            page: 0,
            games: null,
            gamesfiltered: [],
            filterObj: { consoles: [], genres: [], search: "" }
        };

        DeviceEventEmitter.emit('reloading', true);
    }
    componentDidMount() {
        var _self = this;
        this.loadData();
        DeviceEventEmitter.addListener('getFilter', (data) => {

            _self.setState({ filterObj: data, page: 0, gamesfiltered: [] },
                () => {
                    _self.filterObj();
                }
            );
        });
    }
    loadData = () => {
        var _self = this;




        firebase.database().ref('/Games/').on('value', function (snapshot) {


            structureGames(snapshot.val()).then(games => {
                _self.setState({ page: 0, games: games },
                    () => {
                        _self.filterObj();
                    }
                );
                return true;
            }).catch(err => console.log('There was an error:' + err));
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

        var returnarray = _self.state.gamesfiltered.concat(resultsliced);
        if (resultsliced.length > 0) {
            DeviceEventEmitter.emit('reloading', false);
            _self.setState({ gamesfiltered: returnarray, page: _self.state.page + 1 },
                () => {
                    process = false;
                }
            );
        } else {
            process = true;
        }
    }
    _onRefresh(event) {
        var _self = this;
        process = false;
        DeviceEventEmitter.emit('reloading', true);
        _self.setState({ isRefreshing: false, gamesfiltered: [] },
            () => {
                _self.loadData();
            }
        );
    }

    onScrollEnd(event) {
    }
    renderConsoles = (item, key) => {
        let content = [];
        for (let i = 0; i < item.length; i++) {
            content.push(<Image key={i} source={{ uri: item[i].img }} resizeMode={'contain'} style={styles.logo} />);
        }
        return content;
    }
    checkLoading = async (event) => {
        DeviceEventEmitter.emit('hideFilter', true);
        var _self = this;
        const scrollHeight = Math.floor(event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height);
        const height = Math.floor(event.nativeEvent.contentSize.height);
        if (scrollHeight >= height / 2) {

            if (!process) {
                process = true;
                _self.filterObj();

            }
        }
    }
    showGame = (key) => {
        NavigationService.navigate('GameDetail', { key: key });
    }
    renderThumb = (item) => {
        if (item.key == "" || item.file == null)
            return (<Image source={require('../../assets/images/console-icon.png')} resizeMode={'center'} style={{ width: '100%', height: columnWidth }} />);
        else {
            return (<Image source={{ uri: item.url }} style={{ height: columnWidth / item.file.width * item.file.height }} />);
        }
    }
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

            <Header style={styles.header} type={"search"} />
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 60
    },
    header: {
        zIndex: 100,
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
    }
});