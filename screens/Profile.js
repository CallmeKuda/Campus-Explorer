
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebase/config';

// Profile component
const Profile = () => {
  // State variables
  const [selectedImage, setSelectedImage] = useState(null);  
  const [uploadedImages, setUploadedImages] = useState([]); 
  const [uploadedImageURLs, setUploadedImageURLs] = useState([]); 
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0); 
  const [zoomedModalVisible, setZoomedModalVisible] = useState(false); // Indicates whether the zoomed image modal is visible

  useEffect(() => {
    // Fetching images from Firebase storage
    const fetchImages = async () => {
      try {
        const storageRef = firebase.storage().ref(); 
        const imageRefs = await storageRef.listAll(); // Get a list of all image references

        const urls = await Promise.all(
          imageRefs.items.map(async (item) => {
            const url = await item.getDownloadURL(); // Get the download URL for each image
            return url;
          })
        );

        setUploadedImages(urls); 
        setUploadedImageURLs(urls); 
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);

  const pickImage = async () => {
    // Request permission to access the device's camera roll
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access the camera roll is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true, 
      aspect: [4, 3], 
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Update the selectedImage state with the URI of the selected image
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Please select an image first');
      return;
    }

    const response = await fetch(selectedImage); 
    const blob = await response.blob();
    const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1); // Extract the filename from the URI
    const ref = firebase.storage().ref().child(filename); 
    await ref.put(blob); // Upload the image to Firebase storage

    Alert.alert('Photo uploaded successfully!');
    setSelectedImage(null);
    setUploadedImages([...uploadedImages, selectedImage]); 
    setUploadedImageURLs([...uploadedImageURLs, selectedImage]); 
  };

  const deleteImage = async (index) => {
    const imageRef = firebase.storage().refFromURL(uploadedImageURLs[index]); // Create a reference to the image URL

    try {
      await imageRef.delete(); // Delete the image from Firebase storage
      const updatedImages = [...uploadedImageURLs]; 
      updatedImages.splice(index, 1); 
      setUploadedImageURLs(updatedImages); 
      setUploadedImages(updatedImages); 
      Alert.alert('Image deleted successfully!');
    } catch (error) {
      console.log(error);
      Alert.alert('Failed to delete image. Please try again.');
    }
  };

  const openZoomedModal = (index) => {
    setZoomedImageIndex(index); // Set the index of the zoomed image
    setZoomedModalVisible(true); // Show the zoomed image modal
  };

  const closeZoomedModal = () => {
    setZoomedModalVisible(false); // Hide the zoomed image modal
  };

  const signOut = () => {
    firebase.auth().signOut(); // Sign out the user
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.uploadedImagesContainer}>
        <Text style={styles.uploadedImagesTitle}>Uploaded Images:</Text>
        <View style={styles.row}>
          {uploadedImages.map((imageUrl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openZoomedModal(index)}
              style={styles.uploadedImageContainer}
            >
              <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Zoomed Image Modal */}
      <Modal visible={zoomedModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={closeZoomedModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: uploadedImageURLs[zoomedImageIndex] }}
                style={styles.zoomedImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteImage(zoomedImageIndex)}
              >
                <Text style={styles.buttonText}>Delete Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginTop: 160,
  },
  signOutButton: {
    position: 'absolute',
    bottom: 800,
    right: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1,
  },
  selectButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadedImagesContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  uploadedImagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  uploadedImageContainer: {
    margin: 10,
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  zoomedImage: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 70,
  },
});

export default Profile;
