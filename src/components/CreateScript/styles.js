import {Dimensions, StyleSheet} from 'react-native'

const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        // margin: 0, // This is the important style you need to set
        // alignItems: undefined,
        // justifyContent: undefined,
        padding: 20,
        paddingBottom: 0,
        flex: 1
    },
    modal_close: {
        width: 25,
        height: 25,
    },
    modal_content: {
        flex: 1,
    },
    item: {
        width: width / 2 - 50,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
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
        marginLeft: 15,
        fontSize: 15,
        fontWeight: '500',
    },
    itemImage: {
        width: 40,
        height: 40
    },
    itemDevicesCount: {
        marginTop: 5,
        color: '#7F8C8D',
        fontSize: 11
    },
    device: {
        // fdeviceItemlexWrap: 'wrap',
        // flexDirection: 'row'
    },
    roomName: {
        marginTop: 20,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '500',
        color: '#7F8C8D',
    },
    checkBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#e1e1e1'
    },
    iconCheck: {
        width: 35,
        height: 35,
    },
    deviceItem: {
        height: 50,
        width: width - 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    closeImg: {
        width: 15,
        height: 15
    },
    controlBtnWrapper: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    controlBtn: {
        width: (width - 20) / 2 - 5,
        height: 40
    },
    scriptName: {
        height: 40,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        width: width - 40,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        padding: 5
    }
})
