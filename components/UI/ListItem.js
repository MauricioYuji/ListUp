import React from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Image,
    DeviceEventEmitter
} from 'react-native';
import NavigationService from '../services/NavigationService';



export default class ListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        selected: false,
        selectMode: false,
    };

    componentWillMount() {
    }
    componentDidMount() {
        var _self = this;
        DeviceEventEmitter.addListener('selectMode', (data) => {
            if (data) {
                _self.setState({ selectMode: true });
            } else {
                _self.setState({ selected: false, selectMode: false });
            }
        });
    }

    itemAction() {
        var _self = this;
        if (this.state.selectMode) {
            _self.setState({ selected: !this.state.selected },
                () => {
                    _self.props.callback(_self.props.id);
                }
            );
        } else {
            NavigationService.navigate("List", { key: this.props.id });
        }
    }
    allowSelect() {
        var _self = this;
        _self.setState({ selected: !this.state.selected },
            () => {
                _self.props.callback(_self.props.id);
                DeviceEventEmitter.emit('selectMode', true);
            }
        );

    }
    renderGamesThumbs() {
        let lists = this.props.obj.games;
        var lista = lists.slice(0, 3);
        let items = [];
        
        for (let i = 0; i < lista.length; i++) {
            items.push(<Image key={i} source={{ uri: lista[i].image.url }} resizeMode={'cover'} style={styles.thumb} />);
        }
        return items;
    }
    renderGamesNames() {
        let lists = this.props.obj.games;
        var lista = lists.slice(0, 3);
        let items = "";
        for (let i = 0; i < lista.length; i++) {
            if (lista.length - 1 === i) {
                items += lista[i].name;
            } else {
                items += lista[i].name + ", ";
            }
        }
        return (<Text style={styles.nameList}>{items}</Text>);
    }
    render() {
        let itemStyle = null;
        if (this.state.selected) {
            itemStyle = styles.selected;
        }
        return (
            <TouchableHighlight onLongPress={() => this.allowSelect()} onPress={() => this.itemAction()}>
                <View style={[styles.listItem, itemStyle]}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.labelTitle}>{this.props.obj.title}</Text>
                        <Text style={styles.labelDetail}>{this.props.obj.games.length} jogos - Lista {this.props.obj.type}</Text>
                        {this.renderGamesNames()}
                    </View>
                    <View style={styles.thumbArea}>
                        {this.renderGamesThumbs()}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    listItem: {
        paddingVertical: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#222222"
    },
    selected: {
        borderLeftColor: '#006CD8',
        borderLeftWidth: 20,
        opacity: 0.5,
        marginRight: -20
    },
    itemInfo: {
        flex: 1,
        paddingHorizontal: 20,
    },
    nameList: {
        marginTop: 10,
        fontSize: 14,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold',
        textDecorationLine: 'underline'
    },
    labelTitle: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    labelDetail: {
        fontSize: 14,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    thumbArea: {
        flexDirection: 'row-reverse',
        alignItems: 'flex-start',
        flex: 1
    },
    thumb: {
        width: 60,
        height: 90,
        marginLeft: 2
    },
});