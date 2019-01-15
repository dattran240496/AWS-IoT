import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import PropTypes from 'prop-types'
import styles from "./styles";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import LinearGradient from "react-native-linear-gradient";

export default class Button extends React.Component {

    static propTypes = {
        buttonStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Object)]),
        title: PropTypes.string,
        onPress: PropTypes.func,
        colors: PropTypes.array,
        titleStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Object)]),
    };

    static defaultProps = {
        buttonStyle: {},
        title: '',
        onPress: () => {
        },
        colors: ['#A569BD', '#8E44AD', '#6C3483'],
        titleStyle: {}
    };

    render() {
        return (
            <TouchableOpacity
                {...this.props}
                onPress={() => this.props.onPress()}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={this.props.colors ? this.props.colors : Button.defaultProps.colors}
                    style={[styles.container, this.props.buttonStyle]}
                >
                    <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
                </LinearGradient>
            </TouchableOpacity>

        )
    }
}
