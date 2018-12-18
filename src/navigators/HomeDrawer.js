import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from 'react-navigation'
import SideMenu from '../components/SideMenu'
import TabBarNavigator from './TabBarNavigator'

const width = Dimensions.get('window').width

export default createDrawerNavigator({
  HomeStack: { screen: TabBarNavigator },
}, {
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  contentComponent: props => <SideMenu {...props} />,
  drawerWidth: width * 5 / 6,
  drawerBackgroundColor: 'transparent',
})
