import React from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

export default class MenuIcon extends React.Component {
    render() {
        if (this.props.type === "Ionicons") {
            return (
                <Ionicons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "MaterialIcons") {
            return (
                <MaterialIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "MaterialCommunityIcons") {
            return (
                <MaterialCommunityIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "FontAwesome") {
            return (
                <FontAwesome
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "Octicons") {
            return (
                <FontAwesome
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        }
    }
}