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
import { getData, setData } from '../../components/services/Service';
import { getUserGames } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import LoadingScreen from '../Loading/LoadingScreen';
import { parse } from 'qs';

export default class ProfileScreen extends React.Component {

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

        this.setState({ loaded: true });


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
                    <Text style={styles.text}>Profile</Text>
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
    },
    text: {
        fontSize: 30,
        color: '#FFF'
    },
});
