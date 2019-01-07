import { NavigationActions, DrawerActions, StackActions } from 'react-navigation'

let _container; // eslint-disable-line

function setContainer(container) {
    _container = container
}

function reset(routeName, params = {}) {
    _container.dispatch(NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({
                type: 'Navigation/NAVIGATE',
                routeName,
                params,
            }),
        ],
    }))
}

function resetAll(routeName) {
    _container.dispatch(StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({
                routeName: routeName,
            }),
        ],
    }))
}

function navigate(routeName, params = {}, key = null) {
    // store.dispatch({
    //   type: SET_ACTIVE_SCREEN,
    //   payload: { screen: routeName },
    // })

    _container.dispatch(NavigationActions.navigate({
        type: 'Navigation/NAVIGATE',
        // Add key for prevent multiple tap on same screen
        key: key || routeName,
        routeName,
        params,
    }))
}

function getCurrentRoute() {
    if (!_container || !_container.state.nav) {
        return null
    }
w
    return _container.state.nav.routes[_container.state.nav.index] || null
}

function back() {
    return _container.dispatch(NavigationActions.back())
}

function openDrawer() {
    return _container.dispatch(DrawerActions.openDrawer())
}

function closeDrawer() {
    return _container.dispatch(DrawerActions.closeDrawer())
}

function getParam(param, defaultValue = null) {
    return _container.getParam(param, defaultValue)
}

const navigator = {
    setContainer,
    navigate,
    reset,
    back,
    goBack: back,
    getCurrentRoute,
    openDrawer,
    closeDrawer,
    getParam,
    resetAll,
}

export default navigator
