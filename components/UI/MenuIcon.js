import React from 'react';
import { Icon } from 'expo';

import Colors from '../../constants/Colors';

export default class MenuIcon extends React.Component {
    render() {
        if (this.props.type === "Ionicons") {
            return (
                <Icon.Ionicons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "MaterialIcons") {
            return (
                <Icon.MaterialIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "MaterialCommunityIcons") {
            return (
                <Icon.MaterialCommunityIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "FontAwesome") {
            return (
                <Icon.FontAwesome
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type === "Octicons") {
            return (
                <Icon.FontAwesome
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        }
    }
}