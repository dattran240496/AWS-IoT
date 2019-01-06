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
        height: 250,
        marginTop: 15
    },
    mode_wrapper: {
        marginTop: 30,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    },
    mode_left_content: {
        flex: 1
    },
    mode_right_content: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center'
    }
})
