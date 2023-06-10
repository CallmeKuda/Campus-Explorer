import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from 'expo-location';
import { GOOGLE_API_KEY } from "./environments";

const Create = () => {
  const mapRef = useRef(null);
  const [pin, setPin] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const handlePlaceSelect = (data, details) => {
    console.log(data, details);
    if (details && details.geometry && details.geometry.location) {
      setRegion({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.005
      });
      setPin({
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng
      });
      fetchRouteCoordinates({
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng
      });
    }
  };

  const fetchRouteCoordinates = async (destinationLocation) => {
    if (!pin || !pin.latitude || !pin.longitude) {
      console.error('Pin location is not available');
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${destinationLocation.lat},${destinationLocation.lng}&key=${GOOGLE_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];
        if (route && route.overview_polyline && route.overview_polyline.points) {
          const points = route.overview_polyline.points;
          decodePolyline(points, (decodedCoordinates) => {
            setRouteCoordinates(decodedCoordinates);
            mapRef.current.fitToCoordinates(decodedCoordinates, {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          });
        } else {
          console.error("Invalid route data:", route);
        }
      } else {
        console.error("No routes found in the response:", data);
      }
    } catch (error) {
      console.error("Error fetching route coordinates:", error);
    }
  };

  const decodePolyline = (polyline, callback) => {
    // Decoding logic remains the same
    // ...
  };

  useEffect(() => {
    const fetchInitialRouteCoordinates = async () => {
      // Initial location fetching logic remains the same
      // ...
    };

    fetchInitialRouteCoordinates();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          styles={{ textInput: styles.input }}
          placeholder="Search..."
          onPress={handlePlaceSelect}
          query={{
            key: GOOGLE_API_KEY,
            language: "en"
          }}
        />
      </View>

      {region && (
        <MapView style={styles.map} initialRegion={region} provider={PROVIDER_GOOGLE} ref={mapRef}>
          {pin && (
            <Marker
              coordinate={pin}
              pinColor="red"
              draggable={true}
              onDragEnd={e => {
                setPin({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                });
                setRegion({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                });
                fetchRouteCoordinates({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude
                });
              }}
            />
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={2}
              strokeColor="red"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
    backgroundColor: "#f2f2eb",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  map: {
    flex: 1
  }
});

export default Create;
