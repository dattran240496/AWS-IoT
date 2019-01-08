import {StyleSheet, Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window')
export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center'
    },
    modal_close: {
        width: 25,
        height: 25,
    },
    btnAdd: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    titleAddBtn: {
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
        bottom: 4,
        left: 1,
    },
    scriptItem: {
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#e1e1e1',
        borderBottomWidth: 1,
        width: width - 40
    },
    scriptName: {
        fontSize: 15
    }
})
