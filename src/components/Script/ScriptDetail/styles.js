import {StyleSheet, Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 25
    },
    btnClose: {
        position: 'absolute',
        top: 25,
        left: 20,
        zIndex: 1
    },
    imgClose: {
        width: 25,
        height: 25,
    },
    scriptItem: {
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        width: width - 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    name: {
        textAlign: 'left',
        flex: 1
    },
    switch: {
        //width: 30,
        //height: 30
    }
})
