import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "./firebase/config";
import { useFonts } from "expo-font";
import Login from "./screens/Login";
import Registration from "./screens/Registration";
import BottomTabNavigation from "./navigation/BottomTabNavigation";

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Subscribe to the authentication state changes
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe when component unmounts
  }, []);

  if (initializing) return null;

  if (!user) {
    // Render login and registration screens if the user is not authenticated
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    );
  }

  // Render the main app with bottom tab navigation if the user is authenticated
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function AppWrapper() {
  const [fontsLoaded] = useFonts({
    black: require("./assets/fonts/Poppins-Black.ttf"),
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    mediumItalic: require("./assets/fonts/Poppins-MediumItalic.ttf"),
    semiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    semiBoldItalic: require("./assets/fonts/Poppins-SemiBoldItalic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Render the main app wrapped inside the NavigationContainer
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}
