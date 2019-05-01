import React from 'react';
import * as firebase from 'firebase';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo';

import NavigationService from '../../components/services/NavigationService';
import Layout from '../../constants/Layout';
import { setData } from '../../components/services/baseService';
import { structureGames } from '../../components/services/Service';
import LoadingScreen from '../Loading/LoadingScreen';
import TabBarIcon from '../../components/UI/TabBarIcon';
import AddGameButton from '../../components/UI/AddGameButton';

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
        loaded: false,
        modalVisible: false,
        modalVisibleAddGame: false,
        mounted: false,
        consolesActive: []
    };
    componentWillMount() {

        const { navigation } = this.props;
        const key = navigation.getParam('key', 'NO-ID');
        this.setState({ key: key });


    }
    componentDidMount() {


        var _self = this;


        firebase.database().ref('/Games/' + this.state.key).on('value', function (snapshot) {
            var obj = {};
            obj[snapshot.key] = snapshot.val();
            structureGames(obj).then(r => {

                var game = null;
                for (var item in r) {
                    var game = r[item];
                }
                _self.setState({ loaded: true, game: game, mounted: true });
                return true;
            }).catch(err => console.log('There was an error:' + err));
        });
    }
    componentWillUnmount() {
        this.setState({ mounted: false });
    }



    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    setModalVisibleAddGame(visible) {
        this.setState({ modalVisibleAddGame: visible });
    }
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
                <TouchableHighlight underlayColor="transparent" key={objarray[j].name} style={[styles.filterButton]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 5, height: objarray[j].height / 5, tintColor: '#FFFFFF' }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    listPlatformsAdd = () => {
        let obj = [];
        let objarray = this.state.game.consoles;
        let filteractive = this.state.consolesActive;


        for (let j = 0; j < objarray.length; j++) {
            var styleclass = null;
            var imgcolor = '';
            if (filteractive.includes(objarray[j].key)) {
                styleclass = styles.filterButtonActive;
                imgcolor = '#FFFFFF';
            } else {
                styleclass = styles.filterButton;
                imgcolor = '#BBBBBB';
            }
            obj.push(
                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.ActiveConsole(objarray[j].key, false)} key={objarray[j].name} style={[styleclass]}>
                    <View>
                        <Image source={{ uri: objarray[j].img }} resizeMode={'contain'} style={[styles.filterButtonImg, { width: objarray[j].width / 5, height: objarray[j].height / 5, tintColor: imgcolor }]} />
                    </View>
                </TouchableHighlight>);
        }
        return obj;
    }
    addGame = () => {
        this.setState({ modalVisible: false, modalVisibleAddGame: true });
    }
    addToList = (list) => {

        this.setState({ modalVisible: false });
    }
    closeModal = () => {
        this.setState({ modalVisible: false, modalVisibleAddGame: false });
    }

    arrayRemove(arr, value) {
        return arr.filter(function (el) {
            return !value.includes(el);
        });
    }
    ActiveConsole(key) {
        var _self = this;
        var list = this.state.consolesActive;
        if (list.includes(key))
            list = this.arrayRemove(list, [key]);
        else
            list.push(key);


        _self.setState({ consolesActive: list },
            () => {
            }
        );

    }

    SalvarItem = () => {
        var _self = this;

        var user = firebase.auth().currentUser;
        setData('userGames/' + user.uid + '/' + this.state.game.key, this.state.consolesActive)
            .then((resp) => {
            });

    }
    headernav() {
        if (this.state.modalVisible || this.state.modalVisibleAddGame) {
            return null;
        } else {
            let obj = [];
            obj.push(<TouchableHighlight key={"back"} underlayColor="transparent" onPress={() => NavigationService.goback()} style={styles.backIcon}>
                <TabBarIcon
                    name={'ios-arrow-back'}
                    type={'Ionicons'}
                    style={styles.backButton}
                />
            </TouchableHighlight>);
            obj.push(

                <TouchableHighlight key={"add"} underlayColor="transparent" onPress={() => this.setModalVisible(!this.state.modalVisible)} style={styles.addIcon}>
                    <TabBarIcon
                        name={'folder-plus'}
                        type={'MaterialCommunityIcons'}
                        style={styles.addButton}
                    />
                </TouchableHighlight>);
            return obj;
        }

    }
    render() {
        const listscount = 3;
        let loaded = this.state.loaded;
        let game = this.state.game;
        if (loaded && game != null) {
            return (
                <View style={styles.container}>
                    <ScrollView>
                        <Image source={{ uri: game.image.url }} resizeMode={'cover'} style={[styles.backgroundBanner]} />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                            useAngle
                            angle={180}
                            style={styles.backgroundOverlay}
                        />
                        <View style={styles.gameInfo}>
                            <Text style={styles.name}>{game.name}</Text>
                            <View style={styles.menuContent} horizontal={true}>
                                {this.listGenres()}
                            </View>
                            <View style={styles.menuContent} horizontal={true}>
                                {this.listPlatforms()}
                            </View>
                            <Text style={styles.description}>{game.description}</Text>
                        </View>
                        {this.headernav()}

                    </ScrollView>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.mounted && this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({ modalVisible: false });
                        }}>
                        <View style={styles.addBox}>
                            <ScrollView style={styles.menuList}>
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
                                    useAngle
                                    angle={180}
                                    style={styles.backgroundOverlayModal}
                                />
                                <TouchableHighlight>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.listBox}>
                                            <Text style={styles.menuTitle}>-ADICIONAR GAMES-</Text>

                                            <TouchableHighlight underlayColor="transparent" style={styles.addItem} onPress={() => this.addGame()}>
                                                <Text style={styles.addItemText}>Meus jogos</Text>
                                            </TouchableHighlight>
                                            <AddGameButton list={"games"} game={game} label={"Meus jogos"} callback={this.addToList.bind(this)} />
                                            <AddGameButton list={"wishlist"} game={game} label={"Lista de desejo"} callback={this.addToList.bind(this)} />
                                            <Text style={styles.menuTitle}>-ADICIONAR A LISTAS-</Text>
                                            <AddGameButton list={"d93idsds23d2"} game={game} label={"Games competitivos"} callback={this.addToList.bind(this)} />
                                            <AddGameButton list={"gsd9340mif34"} game={game} label={"Games with friends"} callback={this.addToList.bind(this)} />
                                            <AddGameButton list={"09v439mf20if"} game={game} label={"Jogos a finalizar"} callback={this.addToList.bind(this)} />
                                            <AddGameButton list={"3487vns9edsf"} game={game} label={"Nem comecei a jogar"} callback={this.addToList.bind(this)} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableHighlight>
                            </ScrollView>
                            <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeModal()}>
                                <TabBarIcon
                                    name={'close'}
                                    type={'MaterialIcons'}
                                    style={styles.closeBoxIcon}
                                />
                            </TouchableHighlight>
                        </View>
                    </Modal>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.mounted && this.state.modalVisibleAddGame}
                        onRequestClose={() => {
                            this.setState({ modalVisible: false, modalVisibleAddGame: false });
                        }}>
                        <View style={styles.addBox}>
                            <ScrollView style={styles.menuList}>
                                <LinearGradient
                                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
                                    useAngle
                                    angle={180}
                                    style={styles.backgroundOverlayModal}
                                />
                                <TouchableHighlight>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.listBox}>

                                            <View style={styles.selectBox}>
                                                <Text style={styles.addItemText}>Selecione os consoles</Text>

                                                <View style={styles.consolesList} horizontal={true}>
                                                    {this.listPlatformsAdd()}
                                                </View>

                                                <TouchableHighlight underlayColor="transparent" onPress={(a) => this.SalvarItem()}>
                                                    <View style={styles.addGameButton}>
                                                        <Text style={styles.addGameButtonText}>ADICIONAR</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableHighlight>
                            </ScrollView>
                            <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeModal()}>
                                <TabBarIcon
                                    name={'close'}
                                    type={'MaterialIcons'}
                                    style={styles.closeBoxIcon}
                                />
                            </TouchableHighlight>
                        </View>
                    </Modal>

                </View>
            );
        } else {
            return (<LoadingScreen />);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 40,
        zIndex: 1000
    },
    menuTitle: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Light',
        fontSize: 30,
        paddingHorizontal: 50,
        marginTop: 50,
    },
    addItem: {
        marginVertical: 10,
        alignItems: 'center',
    },
    addItemText: {
        color: '#FFF',
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 24,
        paddingHorizontal: 50
    },
    addBox: {
        //width: Dimensions.get('window').width,
        //height: Dimensions.get('window').height,
        //backgroundColor: 'rgba(0,0,0,0.9)',
    },
    menuList: {
        //width: Dimensions.get('window').width,
        //paddingTop: Dimensions.get('window').height / 3,
        //paddingBottom: 300,
        //height: Dimensions.get('window').height / 3,
        //overflow: 'hidden',
    },
    listBox: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        marginTop: Dimensions.get('window').height / 3,
        minHeight: Dimensions.get('window').height / 3 * 2 - 30
        //paddingBottom: 100
    },
    closeBox: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    closeBoxIcon: {
        color: '#FFF',
        fontSize: 50
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
    description: {
        color: '#FFF',
        fontSize: 16,
        paddingBottom: 50,
        fontFamily: 'SourceSansPro-Regular'
    },
    genreText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'SourceSansPro-Black'
    },
    backgroundOverlayModal: {
        height: Dimensions.get('window').height / 3,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
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
    consolesList: {
        width: Dimensions.get('window').width - 40,
        textAlign: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 15
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

    addGameButton: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        height: 50
    },
    addGameButtonText: {
        color: '#FFF',
        alignSelf: "center",
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: 24,
        marginVertical: 10,
        height: 50
    },

    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    filterButtonActive: {
        backgroundColor: '#006CD8',
        borderRadius: 4,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
});
