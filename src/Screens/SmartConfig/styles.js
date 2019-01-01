import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'orange',
        fontSize: 40,
        marginBottom: 15,
        fontWeight: "500"
    },
    txtIpt: {
        width: 200,
        height: 30,
        borderRadius: 5,
        borderColor: '#000',
        borderWidth: 0.5,
        padding: 5
    },
    ssidTxtIpt: {},
    passwordTxtIpt: {
        marginTop: 10
    },
    btn: {
        width: 200,
        height: 30,
        borderRadius: 5,
        backgroundColor: 'orange',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_title: {
        color: '#fff',
    }
})
