import React from 'react'
import {View, TouchableOpacity, Dimensions, Text} from 'react-native'
import navigator from '../../navigators/CustomNavigator'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import styles from './styles'
import PropTypes from 'prop-types'
export default class Header extends React.Component {
    static propTypes = {
        title: PropTypes.string,
    }

    static defaultProps = {
        title: ''
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<TouchableOpacity*/}
                    {/*style={{*/}
                        {/*marginLeft: 15*/}
                    {/*}}*/}
                    {/*onPress={() => {*/}
                        {/*navigator.openDrawer()*/}
                    {/*}}>*/}
                    {/*<Icon name={"align-justify"} color={"#000"} size={14}/>*/}
                {/*</TouchableOpacity>*/}
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
            </View>
        )
    }
}

