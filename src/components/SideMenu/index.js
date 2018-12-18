import React from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {} from "../../constants/devices"
import {devices} from "../../constants/devices";
import {connect} from 'react-redux'
import {changeRoomRequest} from '../../actions/sideMenu'
import navigator from '../../navigators/CustomNavigator'
class SideMenu extends React.Component {

    constructor(props) {
        super(props);

    }

    _onSelectItem = (id) => {
        this.props.navigation.toggleDrawer();
        this.props.navigation.closeDrawer();
        this.props.onChangeRoom(id)
    };

    _renderItems = (item, index) => {
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    this._onSelectItem(item.id)
                }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList renderItem={({item, index}) => this._renderItems(item, index)}
                          data={Object.values(devices)}
                          keyExtractor={(item, index) => item.id}/>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = dispatch => ({
    onChangeRoom: params => dispatch(changeRoomRequest(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50
    },
    itemContainer: {
        flex: 1,
        height: 50,
        justifyContent: "center",
        paddingLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1'
    },
    name: {}
})
