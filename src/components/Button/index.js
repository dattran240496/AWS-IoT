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
        onPress: PropTypes.func
    };

    static defaultProps = {
        buttonStyle: {},
        title: '',
        onPress: () => {
        }
    };

    render() {
        return (
            <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                colors={['#6C3483', '#8E44AD', '#BB8FCE']}
                style={[styles.container, this.props.buttonStyle]}
            >
                <TouchableOpacity
                    style={[styles.container, this.props.buttonStyle]}
                    onPress={() => this.props.onPress()}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }
}
