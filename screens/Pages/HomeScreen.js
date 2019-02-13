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
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import Layout from '../../constants/Layout';
import { getData } from '../../components/services/Service';
import { getUserGames } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import LoadingScreen from '../Loading/LoadingScreen';
import { parse } from 'qs';

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
    }

    state = {
        user: null,
        usergames: [],
        companies: null,
        randomGame: null,
        loaded: false
    };
    componentWillMount() {
    }
    componentDidMount() {

        var user = firebase.auth().currentUser;
        this.setState({ user: user });


        getData('Companies')
            .then((companies) => {
                companies = companies === undefined ? null : companies;
                //console.log("companies: ", companies);
                this.setState({ companies: companies });
                getUserGames(user.uid).then((usergames) => {
                    var game = null;
                    if (usergames.length > 0) {
                        game = usergames[Math.floor(Math.random() * usergames.length)];
                    }
                    this.setState({ usergames: usergames, randomGame: game, loaded: true });
                });
            });


    }
    componentWillUnmount() {
        this.setState({
            user: null,
            usergames: [],
            companies: null
        });
    }
    getconsolestyle(console) {
        switch (console) {
            case "Playstation":
                return styles.Playstation;
            case "Nintendo":
                return styles.Nintendo;
            case "Xbox":
                return styles.Xbox;
            case "Steam":
                return styles.Steam;
            default:
            // code block
        }
    }
    getconsolestyletext(console) {
        switch (console) {
            case "Playstation":
                return styles.PlaystationText;
            case "Nintendo":
                return styles.NintendoText;
            case "Xbox":
                return styles.XboxText;
            case "Steam":
                return styles.SteamText;
            default:
            // code block
        }
    }
    renderCompanies() {
        //console.log("this.state.usergames: ", this.state.usergames);
        //console.log("this.state.companies: ", this.state.companies);
        if (this.state.usergames === null || this.state.companies === null)
            return;

        let companies = this.state.companies;
        let content = [];

        var usergames = this.state.usergames;
        for (var i = 0; i < usergames.length; i++) {
            let c = usergames[i].companies;

            for (var j = 0; j < c.length; j++) {
                if ("games" in companies[c[j].key])
                    companies[c[j].key].games++;
                else
                    companies[c[j].key].games = 1;
                //var obj = companies.filter(p => p.key == c[j].key);
                //index = companies.findIndex(p => p.key == c[j].key);
                //console.log("obj: ", obj);
                //console.log("index: ", index);

                //if (obj.length == 0) {
                //    c[j].games = 1;
                //    companies.push(c[j]);
                //} else {
                //    companies[index].games = parseInt(obj.games) + 1;
                //}
            }
        }


        //console.log("companies: ", companies);
        let index = 0;
        let lastkey = null;
        for (var key in companies) {
            if (index % 2 !== 0) {
                content.push(
                    <View style={styles.grid} key={key}>
                        <View style={styles.card}>
                            <GetImage data={companies[lastkey].img} resizeMode={'contain'} style={[styles.cardImage, this.getconsolestyle(companies[lastkey].name)]} />
                            <Text style={[styles.cardText, this.getconsolestyletext(companies[lastkey].name)]}>{companies[lastkey].games}</Text>
                        </View>
                        <View style={styles.card}>
                            <GetImage data={companies[key].img} resizeMode={'contain'} style={[styles.cardImage, this.getconsolestyle(companies[key].name)]} />
                            <Text style={[styles.cardText, this.getconsolestyletext(companies[key].name)]}>{companies[key].games}</Text>
                        </View>
                    </View>
                );
            }
            lastkey = key;
            index++;
        }

        return content;
    }
    render() {
        let randgame = this.state.randomGame;
        let randgameImg = null;
        if (randgame !== null) {
            randgameImg = <GetImage data={randgame.img} resizeMode={'cover'} style={[styles.backgroundBanner]} />;
        }
        let usergames = this.state.usergames;
        let loaded = this.state.loaded;
        if (loaded) {
            return (
                <View style={styles.container}>
                    {randgameImg}
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}
                        style={styles.backgroundBanner} />
                    <View style={styles.content}>
                        <View style={styles.banner}>
                            <View style={styles.bannerCard}>
                                <Text style={styles.bannerTitle}>{randgame !== null ? randgame.name : ""}</Text>
                            </View>
                        </View>
                        {this.renderCompanies()}
                        <View style={styles.slidegroup}>
                            <Text style={styles.title}>YOUR GAMES</Text>
                            <ScrollView style={styles.gameslide} horizontal={true}>
                                {usergames.map((prop, key) => {
                                    //console.log('key: ', key);
                                    //console.log('prop: ', prop);
                                    return (
                                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile')} key={key}>
                                            <GetImage data={prop.img} resizeMode={'contain'} style={[styles.thumb]} />
                                        </TouchableHighlight>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            );
        } else {
            return (<LoadingScreen/>);
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111'
    },
    content: {
        flex: 1,
        marginTop: 60,
    },
    gameslide: {
        flex: 1
    },
    thumb: {
        width: 90,
        height: 140,
        margin: 5,
        flex: 1
    },
    backgroundBanner: {
        width: '100%',
        height: Layout.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
    },
    banner: {
        flex: 3,
        padding: 5,
        marginBottom: 10
    },
    bannerCard: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'

    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5,
    },
    card: {
        borderRadius: 10,
        margin: 3,
        padding: 5,
        backgroundColor: '#222',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    slidegroup: {
        flex: 3,
        padding: 10,
        marginTop: 10
    },
    textWhite: {
        fontSize: 26,
        color: '#FFF'
    },
    cardImage: {
        flex: 1,
        maxHeight: '100%',
        padding: 10,
    },
    cardText: {
        flex: 1,
        fontSize: 26,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        color: '#FFF',
        textAlign: 'right',
        padding: 10
    },
    bannerTitle: {
        fontSize: 40,
        fontFamily: 'SourceSansPro-SemiBold',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    title: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'SourceSansPro-SemiBold',
        color: '#FFF'
    },
    Playstation: {
        tintColor: '#0A8DEF',
    },
    Nintendo: {
        tintColor: '#FA1115',
    },
    Xbox: {
        tintColor: '#107810',
    },
    Steam: {
        tintColor: '#FFFFFF',
    },
    PlaystationText: {
        color: '#0A8DEF',
    },
    NintendoText: {
        color: '#FA1115',
    },
    XboxText: {
        color: '#107810',
    },
    SteamText: {
        color: '#FFFFFF',
    },
});
