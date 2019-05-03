import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    Platform,
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import TabBarIcon from '../../components/UI/TabBarIcon';
import DragGame from '../../components/UI/DragGame';



export default class EditGames extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        list: this.props.list.games,
        listgames: this.props.list.games
    };
    saveGameEdit = () => {
        this.props.saveGameEdit(this.state.listgames);
    }
    onchangePos(pos) {
        var list = Object.assign([], this.props.list.games);
        var newlist = [];
        for (let i = 0; i < pos.length; i++) {
            newlist.push(list[pos[i]]);
        }

        this.setState({ listgames: newlist },
            () => {
            }
        );
    }
    deleteItemFromList = (id) => {
        var list = Object.assign([], this.props.list.games);
        var r = list.filter(p => p.key == id);
        var index = list.indexOf(r[0]);

        list.splice(index, 1);

        var _self = this;

        this.setState({ list: list, listgames: list },
            () => {
            }
        );
    }
    _renderRow = ({ key, index, data, active }) => {
        return <DragGame data={data} pos={index} active={active} callback={this.deleteItemFromList.bind(this)} />;
    }
    render() {
        return (
            <View>
                <SortableList
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    onChangeOrder={this.onchangePos.bind(this)}
                    data={this.state.list}
                    renderRow={this._renderRow} />

                <TouchableHighlight underlayColor="transparent" style={styles.saveButton} onPress={() => this.saveGameEdit()}>
                    <TabBarIcon
                        name={'save'}
                        type={'MaterialIcons'}
                        style={styles.saveBoxIcon}
                    />
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    list: {
        marginTop: 80,
        flex: 1,
    },

    contentContainer: {
        width: Dimensions.get('window').width,

        ...Platform.select({
            ios: {
                paddingHorizontal: 30,
            },

            android: {
                paddingHorizontal: 0,
            }
        })
    },
    saveButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    saveBoxIcon: {
        color: '#FFF',
        fontSize: 50
    },
});