import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import haversine from 'haversine';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;
const LATITUDE = -22.56529537025858;
const LONGITUDE = 17.07729620316758;

const Create = () => {
  // State variables
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] = useState(LONGITUDE);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState({});
  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  );
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    let watchID;
    const startWatching = async () => {
      try {
        if (Platform.OS === 'android') {
          // Request location permission for Android
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission denied.');
            return;
          }
        }

        // Start watching the user's location
        watchID = navigator.geolocation.watchPosition(
          position => {
            const { routeCoordinates, distanceTravelled } = this.state;
            const { latitude, longitude } = position.coords;

            const newCoordinate = {
              latitude,
              longitude,
            };

            if (Platform.OS === 'android') {
              if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
              }
            } else {
              coordinate.timing(newCoordinate).start();
            }

            setLatitude(latitude);
            setLongitude(longitude);
            setRouteCoordinates(routeCoordinates.concat([newCoordinate]));
            setDistanceTravelled(distanceTravelled + calcDistance(newCoordinate));
            setPrevLatLng(newCoordinate);
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 10,
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    startWatching();

    // Clean up by clearing the watch when the component unmounts
    return () => {
      if (watchID) {
        navigator.geolocation.clearWatch(watchID);
      }
    };
  }, []);

  const getMapRegion = () => ({
    latitude,
    longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const calcDistance = newLatLng => {
    return haversine(prevLatLng, newLatLng) || 0;
  };

  const handleDestinationSelected = (data, details) => {
    const { geometry } = details;
    const { location } = geometry;

    const newDestination = {
      latitude: location.lat,
      longitude: location.lng,
    };

    setDestination(newDestination);
    setRouteCoordinates([newDestination]);
  };

  return (
    <View style={styles.container}>
      {/* Map view */}
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} showsUserLocation loadingEnabled region={getMapRegion()}>
        {/* Polyline to show the route */}
        <Polyline coordinates={routeCoordinates} strokeWidth={10} strokeColor="red" />
        {/* Animated marker representing the user's current position */}
        <Marker.Animated coordinate={coordinate} />
        {/* Marker for the selected destination */}
        {destination && <Marker coordinate={destination} />}
      </MapView>
      {/* Google Places Autocomplete component */}
      <GooglePlacesAutocomplete
        placeholder="Enter Destination"
        onPress={handleDestinationSelected}
        fetchDetails
        query={{
          key: '', // API key for Google Places
          language: 'en',
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 50,
            width: '100%',
          },
          listView: {
            backgroundColor: '#fff',
            marginTop: 40,
          },
        }}
      />
      {/* Distance traveled display */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bubble, styles.button]}>
          <Text style={styles.bottomBarContent}>{parseFloat(distanceTravelled).toFixed(2)} km</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default Create;
