import React from 'react'
import {View, Image, Text, TouchableOpacity, FlatList, Dimensions} from 'react-native'
import navigator from 'navigators/CustomNavigator'
import styles from './styles'
import {allRoom, deviceElements, allDevices} from "../../constants/devices";

const {width, height} = Dimensions.get("window")
export default class RoomDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: props.navigation.getParam('roomId')
        }
    }

    _renderDevice = (item) => {
        const device = allDevices[item.id]
        return (
            <React.Fragment>
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        navigator.navigate("DeviceDetail", {
                            deviceId: device.id
                        })
                    }}
                >
                    <Image style={styles.image} source={device.image}/>
                    <Text style={styles.itemName}>{device.name}</Text>
                    {/*{*/}
                    {/*allDevicesStatusOff.indexOf(deviceStatus[data.id]) >= 0*/}
                    {/*|| data.id === "switch" && deviceStatus[data.id] === -1*/}
                    {/*? <View style={styles.inactiveDevice}/>*/}
                    {/*: null*/}
                    {/*}*/}
                </TouchableOpacity>
            </React.Fragment>
        )
    }

    render() {
        const room = allRoom[this.state.roomId];
        if (!room) return null;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.arrowLeftBtn}
                                  onPress={() => this.props.navigation.pop()}>
                    <Image
                        style={styles.arrowLeftImg}
                        source={require('assets/icons/arrow_left.png')}
                        resizeMode='contain'/>
                </TouchableOpacity>
                <View style={styles.roomAvatarWrapper}>
                    <Image style={styles.roomAvatar}
                           source={room.image}
                           resizeMode='contain'/>
                </View>
                <Text style={styles.roomName}>{room.name}</Text>
                <FlatList
                    extraData={this.props}
                    renderItem={({item, index}) => this._renderDevice(item)}
                    data={deviceElements[this.state.roomId]}
                    keyExtractor={(item, index) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        padding: 20,
                        marginTop: 15
                    }}
                />
            </View>
        )
    }
}
