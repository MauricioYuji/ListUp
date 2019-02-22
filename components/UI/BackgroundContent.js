import React from 'react';
import { Image, Text, View, interpolate, Dimensions, StyleSheet } from 'react-native';
import Layout from '../../constants/Layout';

export class BackgroundContent extends React.Component {
    constructor(props) {
        super(props);
    };

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { style, children, ...rest } = this.props;
        
        return (
            <View style={styles.containerStyle} {...rest}>
                <Image source={require('../../assets/images/background.png')} resizeMode={'cover'} style={[styles.backgroundBanner]} />
                {children}
            </View>
        );
        
    }
}

const styles = StyleSheet.create({
    backgroundBanner: {
        width: '100%',
        height: Layout.window.height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    containerStyle: {
        flex: 1,
        backgroundColor: '#000',
        position: 'relative'
    }
});