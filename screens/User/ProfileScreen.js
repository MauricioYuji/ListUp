import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Image, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import { Fade } from '../../components/animations/Fade';

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        Id: null,
        visible: false
    };
    componentWillMount() {
        const { navigation } = this.props;
        const Id = navigation.getParam('Id', 0);
        this.setState({ Id: Id });
    }
    test() {

        this.setState({
            visible: !this.state.visible,
        });
    }
    render() {
        const visible = this.state.visible;
        return (
            <ScrollView style={styles.gameslide} horizontal={false}>
                <Fade visible={visible}>
                    <Text style={styles.text}>Profile {this.state.Id}</Text>
                </Fade>

                <TouchableHighlight onPress={() => this.test()}>
                    <View style={styles.btn}>
                        <Text style={styles.text}>BOTAO</Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    gameslide: {
        flex: 1,
        marginTop: 60,
    },
    text: {
        color: '#FFF',
        margin: 40
    },
    btn: {
        backgroundColor: '#F00'
    }
});
