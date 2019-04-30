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
import { getData, setData } from '../../components/services/baseService';
import { getUserGames } from '../../components/services/Service';
import LoadingScreen from '../Loading/LoadingScreen';

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
            user: null,
            usergames: [],
            companies: null
        });
    }
    render() {
        let loaded = this.state.loaded;
        if (loaded) {
            return (
                <View style={styles.container}>
                    <Text>teste</Text>
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
