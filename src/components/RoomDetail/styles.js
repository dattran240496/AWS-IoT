import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30
    },
    roomAvatarWrapper: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#F5F4FA',
      justifyContent: 'center',
      alignItems: 'center'
    },
    roomAvatar: {
        width: 50,
        height: 50,
    },
    roomName: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10
    },
    arrowLeftBtn: {
        position: 'absolute',
        left: 20,
        top: 40
    },
    arrowLeftImg: {
        width: 30,
        height: 30,
    },
    item: {
        width: width / 2 - 35,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        margin: 5
    },
    controlDevice: {
        justifyContent: "center",
        alignItems: "center",
        // width: width / 2 - 10,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: "contain"
    },
    itemName: {
        marginTop: 15,
        fontSize: 12,
        fontWeight: '500'
    },
    itemDevicesCount: {
        marginTop: 5,
        color: '#7F8C8D',
        fontSize: 11
    },
})
