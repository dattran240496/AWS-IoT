import {Dimensions, StyleSheet} from 'react-native'
const {width, height} = Dimensions.get("window")
export default StyleSheet.create({
    container: {
        width: width,
        flexDirection: "row",
        alignItems: "center",
        //backgroundColor: '#fff',
        //borderBottomWidth: 1,
        //borderBottomColor: "#e1e1e1",
        padding: 15,
        marginTop: 20,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 20,
        fontWeight: "500"
    },
    image: {
        width: 25,
        height: 25
    }
})
