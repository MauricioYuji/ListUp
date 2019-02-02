import React from 'react';
import { Animated, Text, View, interpolate, Dimensions } from 'react-native';

export class Grow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
        };
    };

    componentWillMount() {
        this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setState({ visible: true });
        }
        Animated.timing(this._visibility, {
            toValue: nextProps.visible ? 1 : 0,
            duration: 300,
        }).start(() => {
            this.setState({ visible: nextProps.visible });
        });
    }

    render() {
        const { visible, style, children, ...rest } = this.props;

        const containerStyle = {
            //width: this._visibility.interpolate({
            //    inputRange: [0, 1],
            //    outputRange: [40, Dimensions.get('window').width],
            //}),
            //height: this._visibility.interpolate({
            //    inputRange: [0, 1],
            //    outputRange: [40, Dimensions.get('window').width / 2],
            //}),
            //borderRadius: this._visibility.interpolate({
            //    inputRange: [0, 1],
            //    outputRange: [40, 0],
            //}),
            opacity: this._visibility.interpolate({
                inputRange: [0, 0.1, 1],
                outputRange: [0, 1, 1],
            }),
            transform: [
                {
                    scaleX: this._visibility.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    })
                },
                {
                    scaleY: this._visibility.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    })
                },
                //{
                //    translateX: this._visibility.interpolate({
                //        inputRange: [0, 1],
                //        outputRange: [Dimensions.get('window').height, 0],
                //    })
                //},
            ],
        };

        const combinedStyle = [containerStyle, style];
        return (
            <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest}>
                {children}
            </Animated.View>
        );
    }
}