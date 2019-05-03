import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text
} from 'react-native';



export default class ConfirmDelete extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
    };
    confirmdeleteItens = () => {
        this.props.confirmdeleteItens();
    }
    closeModal = () => {
        this.props.closeModal();
    }
    render() {
        return (
            <View>
                <Text style={styles.addItemText}>DESEJA EXCLUIR?</Text>
                <View style={styles.buttonBox}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.confirmdeleteItens()}>
                        <View style={[styles.addItem, styles.dangerButton]}>
                            <Text style={[styles.addItemText]}>Deletar</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.closeModal()}>
                        <View style={styles.addItem}>
                            <Text style={styles.addItemText}>Cancelar</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    addItemText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    buttonBox: {
        flexDirection: 'row'
    },
    addItem: {
        flex: 1,
        backgroundColor: '#006CD8',
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        minHeight: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    addItemText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'SourceSansPro-SemiBold'
    },
    dangerButton: {
        backgroundColor: '#F00'
    },
});