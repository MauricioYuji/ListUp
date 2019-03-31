import React from 'react';
import { Icon } from 'expo';
import {
    Text
} from 'react-native';

import Colors from '../../constants/Colors';

export default class MenuIcon extends React.Component {
    render() {
        if (this.props.type == "Ionicons") {
            return (
                //<Text>{this.props.name}</Text>
                <Icon.Ionicons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type == "MaterialIcons") {
            return (
                //<Text>{this.props.name}</Text>
                <Icon.MaterialIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type == "MaterialCommunityIcons") {
            return (
                //<Text>{this.props.name}</Text>
                <Icon.MaterialCommunityIcons
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type == "FontAwesome") {
            return (
                //<Text>{this.props.name}</Text>
                <Icon.FontAwesome
                    name={this.props.name}
                    size={26}
                    style={[{ marginBottom: -3 }, this.props.style]}
                    color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
            );
        } else if (this.props.type == "Octicons") {
            return (
                //<Text>{this.props.name}</Text>
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