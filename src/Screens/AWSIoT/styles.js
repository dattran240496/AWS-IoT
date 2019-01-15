import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        width: width / 2 - 20,
        height: width / 2 - 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
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
        fontSize: 15,
        fontWeight: '500'
    },
    itemDevicesCount: {
        marginTop: 5,
        color: '#7F8C8D',
        fontSize: 11
    },
    inactiveDevice: {
        opacity: 0.8,
        width: 120,
        height: 120,
        position: "absolute",
    },
    switch: {
        marginTop: 15
    },
    intro: {
        margin: 15,
        borderRadius: 8,
        width: width - 30,
        height: 150,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    intro_child: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    intro_right_child_border: {
        width: 2,
        height: 75,
        position: 'absolute',
        // top: 0,
        left: 0,
        backgroundColor: '#fff'
    },
    all_device_title: {
        fontSize: 17,
        color: '#fff',
        fontWeight: '500'
    },
    all_devices_val: {
        color: '#fff',
        marginTop: 5
    },
})
