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
    DeviceEventEmitter
} from 'react-native';
import { WebBrowser, Icon, Constants, LinearGradient } from 'expo';

import Layout from '../../constants/Layout';
import { getData, setData } from '../../components/services/Service';
import { getGames } from '../../components/services/UserHomeService';
import { MonoText } from '../../components/UI/StyledText';
import { GetImage } from '../../components/UI/GetImage';
import LoadingScreen from '../Loading/LoadingScreen';
import Masonry from 'react-native-masonry-layout';
const { width } = Dimensions.get("window");
const columnWidth = (width - 10) / 2 - 10;

export default class FeedScreen extends React.Component {

    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }
    

    render() {
        return <View style={{ flex: 1 }}>
            <Text>Feed</Text>
        </View>
    }
}
