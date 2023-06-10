import { View, Text, Platform } from 'react-native'
import React from 'react'
import {
    Feather,
    FontAwesome,
    FontAwesome5,
} from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import { Feed, Create, Profile } from '../screens'
import { LinearGradient } from 'expo-linear-gradient'

const Tab = createBottomTabNavigator()

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 80, // Increased height for bigger icons
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
}

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Feather
                                name="home"
                                size={30} // Increased size for bigger icon
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Create"
                component={Create}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <LinearGradient
                                colors={['#F68464', '#EEA849']}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: Platform.OS == 'ios' ? 70 : 80, // Increased width for bigger icon
                                    height: Platform.OS == 'ios' ? 70 : 80, // Increased height for bigger icon
                                    top: Platform.OS == 'ios' ? -15 : -25, // Adjusted position for bigger icon
                                    borderRadius: 32, // Increased border radius for bigger icon
                                    borderColor: '#fff',
                                    borderWidth: 4,
                                }}
                            >
                            <Feather
  name="map-pin"
  size={30} // Increased size for bigger icon
  color={COLORS.white}
/>
                            </LinearGradient>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome
                                name="user-circle"
                                size={30} // Increased size for bigger icon
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
