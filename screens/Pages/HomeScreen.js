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
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';

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
        companies: null
    };
    componentWillMount() {
    }
    componentDidMount() {
        //var teste = Service.test();

        //getUserInfo("asd")
        //    .then((res) => {
        //        console.log("res: ", res);
        //        if (res.message === 'Not Found') {
        //            this.setState({
        //                error: 'User not found'
        //            });
        //        }
        //        else {
        //            this.props.navigator.push({
        //                title: res.name || 'No Title',
        //                passProps: { userInfo: res }
        //            });
        //            this.setState({
        //                error: false,
        //                username: ''
        //            })
        //        }
        //    });


        var user = firebase.auth().currentUser;
        this.setState({ user: user });
        getData('userGames/' + user.uid)
            .then((res) => {
                //console.log("res: ", res);
                this.setState({ usergames: res });
            });


        getData('Companies')
            .then((res) => {
                //console.log("res: ", res);
                this.setState({ companies: res });
            });


        // console.log("this.state: ", this.state);
        //   console.log("LIST: ");
        var _self = this;

        //firebase.database().ref('/Companies').on('value', function (snapshot) {
        //    console.log(snapshot.val());
        //});
    }
    renderCompanies() {
        console.log("this.state.usergames: ", this.state.usergames);
        if (this.state.companies == null)
            return;

        let table = [];

        let obj = this.state.companies;
        //let obj = Object.values(this.state.companies.val());
        //console.log("this.state.companies: ", this.state.companies);
        //console.log("obj: ", obj);
        var index = 0;
        // Outer loop to create parent
        let entries = null;
        if (obj !== null) {
            entries = Object.entries(obj);
            //console.log(entries);
        }

        for (var key in obj) {
            //console.log("key: ", key);
            //console.log("obj: ", obj[key]);
            


            if (index % 2 === 0) {
                table.push(
                    <View style={styles.grid}>
                        <View style={styles.card}>
                            <GetImage data={obj[key].img} resizeMode={'contain'} style={styles.cardImage}/>
                            <Text style={styles.cardText}>0</Text>
                        </View>
                        <View style={styles.card}>
                            <GetImage data={obj[entries[index + 1][0]].img} resizeMode={'contain'} style={styles.cardImage} />
                            <Text style={styles.cardText}>0</Text>
                        </View>
                    </View>
                );
            }

            //<View style={styles.card}>{`Column ${this.state.usergames[i + 1]}`}</View>
            index++;
        }
        return table;
    }
    render() {
        let randgame = null;
        let nintendogames = null;
        let pcgames = null;
        let psgames = null;
        let xboxgames = null;
        return (
            <View style={styles.container}>
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.backgroundBanner} />
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}
                    style={styles.backgroundBanner} />
                <View style={styles.content}>
                    <View style={styles.banner}>
                        <View style={styles.bannerCard}>
                            <Text style={styles.bannerTitle}>Call of Duty Black OPS IIII</Text>
                        </View>
                    </View>
                    {this.renderCompanies()}
                    <View style={styles.slidegroup}>
                        <Text style={styles.title}>YOUR GAMES</Text>
                        <ScrollView style={styles.gameslide} horizontal={true}>

                            <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile')}>
                                <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            </TouchableHighlight>
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                            <Image resizeMode="contain" source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/teste-925f4.appspot.com/o/thumbs%2Fs-l1600.jpg?alt=media&token=3955711d-ed54-4969-b226-969eba063c90' }} style={styles.thumb} />
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
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
        tintColor: 'red'
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
});
