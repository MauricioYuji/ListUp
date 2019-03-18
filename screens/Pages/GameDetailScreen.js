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
    Animated,
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import NavigationService from '../../components/services/NavigationService';
import Layout from '../../constants/Layout';
import { getData, setData } from '../../components/services/Service';
import { getGameDetail } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import LoadingScreen from '../Loading/LoadingScreen';
import TabBarIcon from '../../components/UI/TabBarIcon';
import { parse } from 'qs';

export default class GameDetailScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }

    state = {
        key: null,
        game: null,
        loaded: false
    };
    componentWillMount() {

        const { navigation } = this.props;
        const key = navigation.getParam('key', 'NO-ID');
        this.setState({ key: key });


    }
    componentDidMount() {


        var _self = this;

        getGameDetail(this.state.key).then((game) => {
            //games = games.map(item => {
            //    //console.log("item: ", item);
            //    return {
            //        image: item.file.url,
            //        name: item.name,
            //        key: item.key,
            //        height: columnWidth / item.file.file.width * item.file.file.height,
            //        consoles: item.consoles,
            //        genres: item.genres
            //    };
            //});
            console.log("game:", game);

            _self.setState({ loaded: true, game: game });

        });


        //getData('Companies')
        //    .then((companies) => {
        //        companies = companies === undefined ? null : companies;
        //        //console.log("companies: ", companies);
        //        this.setState({ companies: companies });
        //        getUserGames(user.uid).then((usergames) => {
        //            var game = null;
        //            if (usergames.length > 0) {
        //                game = usergames[Math.floor(Math.random() * usergames.length)];
        //            }
        //            this.setState({ usergames: usergames, randomGame: game, loaded: true });
        //        });
        //    });


    }
    componentWillUnmount() {
        this.setState({
        });
    }

    mode = new Animated.Value(0);

    toggleView = () => {
        Animated.parallel([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 300
            })
        ]).start(() => {
            // callback
        });

    };
    listGenres = () => {
        let obj = [];
        let objarray = this.state.game.genres;


        for (let j = 0; j < objarray.length; j++) {
            if (j == 0) {
                obj.push(
                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveGenre(objarray[j].key)} key={objarray[j].name}>
                        <Text style={[styles.genreText]}>{objarray[j].name}</Text>
                    </TouchableHighlight>);
            } else {
                obj.push(
                    <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveGenre(objarray[j].key)} key={objarray[j].name}>
                        <Text style={[styles.genreText]}> - {objarray[j].name}</Text>
                    </TouchableHighlight>);
            }

        }
        return obj;
    }
    listPlatforms = () => {
        let obj = [];
        let objarray = this.state.game.consoles;


        for (let j = 0; j < objarray.length; j++) {
            obj.push(
                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveConsole(objarray[j].key, false)} key={objarray[j].name} style={[styles.filterButton]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 5, height: objarray[j].height / 5, tintColor: '#FFFFFF' }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    render() {
        const height = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60]
        });
        const width = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Dimensions.get('window').width / 2]
        });
        let loaded = this.state.loaded;
        let game = this.state.game;
        if (loaded) {
            return (
                <ScrollView style={styles.container}>
                    <Image source={{ uri: game.file.url }} resizeMode={'cover'} style={[styles.backgroundBanner]} />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,1)']}
                        useAngle
                        angle={180}
                        style={styles.backgroundOverlay}
                    />
                    <TouchableHighlight underlayColor="transparent" onPress={() => NavigationService.goback()} style={styles.backIcon}>
                        <TabBarIcon
                            name={'ios-arrow-back'}
                            type={'Ionicons'}
                            style={styles.backButton}
                        />
                    </TouchableHighlight>

                    <TouchableHighlight underlayColor="transparent" onPress={() => this.toggleView()} style={styles.addIcon}>
                        <TabBarIcon
                            name={'folder-plus'}
                            type={'MaterialCommunityIcons'}
                            style={styles.addButton}
                        />
                    </TouchableHighlight>

                    <Animated.View style={[styles.addBox, { height, width }]}>
                        <ScrollView>
                            <TouchableHighlight underlayColor="transparent" style={styles.addItem} onPress={() => console.log("asd")}>
                                <Text style={styles.addItemText}>Adicionar a meus jogos</Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="transparent" style={styles.addItem} onPress={() => console.log("asd")}>
                                <Text style={styles.addItemText}>Adicionar a minha lista de desejo</Text>
                            </TouchableHighlight>
                        </ScrollView>
                    </Animated.View>
                    <View style={styles.gameInfo}>
                        <Text style={styles.name}>{game.name}</Text>
                        <View style={styles.menuContent} horizontal={true}>
                            {this.listGenres()}
                        </View>
                        <View style={styles.menuContent} horizontal={true}>
                            {this.listPlatforms()}
                        </View>
                    </View>
                </ScrollView>
            );
        } else {
            return (<LoadingScreen />);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addItem: {
        padding: 5,
        alignItems: 'center',
        borderBottomColor: '#FFF',
        height: 30,
        borderBottomWidth: 1
    },
    addItemText: {
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 18
    },
    addBox: {
        position: 'absolute',
        top: 60,
        right: 10,
        zIndex: 10,
        overflow: 'hidden',
        backgroundColor: '#006CD8',
        borderRadius: 10
    },
    gameInfo: {
        marginTop: Layout.window.height / 2,
        paddingHorizontal: 20
    },
    backIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10
    },
    backButton: {
        fontSize: 50
    },
    addIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10
    },
    addButton: {
        fontSize: 50
    },
    name: {
        color: '#FFF',
        fontSize: 30,
        fontFamily: 'SourceSansPro-SemiBold'
    },
    genreText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'SourceSansPro-Black'
    },
    backgroundOverlay: {
        height: (Layout.window.height / 3) * 2,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    backgroundBanner: {
        width: '100%',
        height: (Layout.window.height / 3) * 2,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    menuContent: {
        width: Dimensions.get('window').width - 20,
        alignItems: 'flex-start',
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10
    },
    filterButton: {
        backgroundColor: '#444444',
        borderRadius: 4,
        marginVertical: 5,
        marginRight: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: 30
    },
    filterButtonText: {
        color: '#BBBBBB',
    },
    filterButtonImg: {
        marginHorizontal: 5
    },
});
