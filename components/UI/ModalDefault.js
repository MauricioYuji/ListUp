import React from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Modal
} from 'react-native';
import TabBarIcon from '../../components/UI/TabBarIcon';



export default class ModalDefault extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
    };
    closeModal = () => {
        this.props.closeModal();
    }
    render() {
        return (
            <Modal
            animationType={this.props.type}
            transparent={true}
            visible={this.props.visible}
            onRequestClose={() => {
                this.setState({ modalVisible: false });
            }}>
            <View style={styles.backgroundModal}>
                {this.props.modalActive}

                <TouchableHighlight underlayColor="transparent" style={styles.closeBox} onPress={() => this.closeModal()}>
                    <TabBarIcon
                        name={'close'}
                        type={'MaterialIcons'}
                        style={styles.closeBoxIcon}
                    />
                </TouchableHighlight>
            </View>
        </Modal>
        );
    }
}
const styles = StyleSheet.create({
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
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
});