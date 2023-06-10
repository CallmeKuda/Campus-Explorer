import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from 'react-native';
import { firebase } from '../firebase/config';

const Feed = () => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImageURLs, setUploadedImageURLs] = useState([]);

  useEffect(() => {
    // Fetch user information
    const fetchUser = async () => {
      try {
        const user = await firebase.auth().currentUser;
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Fetch images and comments
    const fetchImagesAndComments = async () => {
      try {
        const imagesRef = firebase.firestore().collection('images');
        const imagesSnapshot = await imagesRef.get();
        const imagesData = imagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setImages(imagesData);

        const commentsRef = firebase.firestore().collection('comments');
        const commentsSnapshot = await commentsRef.get();
        const commentsData = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(commentsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImagesAndComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      Alert.alert('Please enter a comment');
      return;
    }

    try {
      const commentsRef = firebase.firestore().collection('comments');
      await commentsRef.add({
        userId: user.uid,
        comment: commentText,
      });

      setCommentText('');
      Alert.alert('Comment added successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {user && (
        
        <View style={styles.userContainer}><
          Text style={styles.userInfoText}>HELLO👋 </Text>
          <Text style={styles.userInfoText}> {user.firstName} {user.lastName}</Text>
          <Text style={styles.userInfoText}>WELCOME TO CAMPUS EXPLORER🌍</Text>
          
        </View>
      )}

      {/* Render the list of images */}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.imagesList}
      />

      <View style={styles.commentsContainer}>
        {/* Render the list of comments */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          style={styles.commentsList}
        />

        {/* Scrollable view for uploaded images */}
        <ScrollView contentContainerStyle={styles.uploadedImagesContainer}>
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

        {/* Input area for adding comments */}
        <KeyboardAvoidingView behavior="padding" style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
            <Text style={styles.commentButtonText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
    marginBottom: 120,
  },
  userContainer: {
    marginBottom: 10,
    backgroundColor: '#3498DB',
    borderRadius: 20,
    height:120,
  },
  userInfoText: {
    
    fontSize: 20,
    marginLeft: 30,
    marginTop:10,
  },
  imagesList: {
    flex: 20,
    marginBottom: 20,
  },
  imageContainer: {
    flex:1,
   
  },
  image: {
    width: '100%',
    height: 300, 
    borderRadius: 10,
  },
  caption: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  commentsContainer: {
    flex: 80,
  
  },
  commentsList: {
    flex: 1,
    marginBottom: 10,
  },
  commentContainer: {

    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 18,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    padding: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 16,
  },
  commentButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
  commentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadedImagesContainer: {
    marginBottom: 10,
    backgroundColor: '#000000',
  },
  uploadedImagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  uploadedImageContainer: {
    width: 90, 
    height: 90, 
    marginRight: 10,
    marginBottom: 100,
   
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35, 
  },
});

export default Feed;
