import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        margin: 0, // This is the important style you need to set
        alignItems: undefined,
        justifyContent: undefined,
        padding: 20
    },
    modal_close: {
        width: 25,
        height: 25,
    },
    modal_content: {
        flex: 1
    },
    item: {
        width: width / 2 - 50,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        margin: 5,
        zIndex: 0,
        marginTop: 10
    },

    image: {
        width: 20,
        height: 20,
        resizeMode: "contain"
    },
    itemName: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '500'
    },
    itemDevicesCount: {
        marginTop: 5,
        color: '#7F8C8D',
        fontSize: 11
    },
    device: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    roomName: {
        marginTop: 20,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '500',
        color: '#7F8C8D',
    },
    closeBtn: {
        position: 'absolute',
        top: 0,
        right: -5,
        // height: 24,
        // width: 24,
        zIndex: 1,
        // borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deviceItem: {
        height: 120,
        width: width / 2 - 45,
    },
    closeImg: {
        width: 15,
        height: 15
    },
    controlBtn: {
        width: (width - 20 ) / 2 - 5,
        height: 40
    }
})
