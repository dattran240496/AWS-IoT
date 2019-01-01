import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        width: width / 2,
        // height: width / 2,
        //justifyContent: "center",
        alignItems: "center",
        paddingTop: 15
    },
    controlDevice: {
        justifyContent: "center",
        alignItems: "center",
        // padding: 15,
        // width: width / 2,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain"
    },
    inactiveDevice: {
        backgroundColor: "#e1e1e1",
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
        backgroundColor: '#5A3A91',
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
    }
})
