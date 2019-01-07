import React from 'react'
import {View, TouchableOpacity, Dimensions, Text, Image} from 'react-native'
import navigator from '../../navigators/CustomNavigator'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import styles from './styles'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'
const {width, height} = Dimensions.get('window')

export default class Header extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        onClick: PropTypes.func,
    }

    static defaultProps = {
        title: '',
        onClick: () => {}
    }

    render() {
        console.log('zzz this.props', this.props)
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

                <TouchableOpacity onPress={() => {
                    this.props.onClick()
                }}>
                    <Image source={require('assets/icons/3-dot.png')} style={styles.image} resizeMode={'contain'}/>
                </TouchableOpacity>

            </View>
        )
    }
}

