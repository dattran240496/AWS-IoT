import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '500'
    },
    statusWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 20
    },
    room_device: {
        fontSize: 16,
        fontWeight: '500'
    },
    image: {
        height: 150,
        marginTop: 15
    }
})
