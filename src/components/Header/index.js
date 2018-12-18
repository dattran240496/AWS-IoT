import React from 'react'
import {View, TouchableOpacity, Dimensions, Text} from 'react-native'
import navigator from '../../navigators/CustomNavigator'
import Icon from 'react-native-vector-icons/dist/FontAwesome';
const {width, height} = Dimensions.get("window")

export default class Header extends React.Component {
    render() {
        return (
            <View style={{
                width: width,
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: "#e1e1e1",
                marginTop: 20
            }}>
                <TouchableOpacity
                    style={{
                        marginLeft: 15
                    }}
                    onPress={() => {
                        navigator.openDrawer()
                    }}>
                    <Icon name={"align-justify"} color={"#000"} size={14}/>
                </TouchableOpacity>
                <Text>

                </Text>
            </View>
        )
    }
}

