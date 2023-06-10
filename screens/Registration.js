import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../firebase/config'

const Registration = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const registerUser = async (email, password, firstName, lastName) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          firebase.auth().currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: 'https://map-assignment-387610.firebaseapp.com'
          })
            .then(() => {
              alert('Verification Email Sent')
            }).catch((error) => {
              alert(error.message)
            })
            .then(() => {
              firebase.firestore().collection('users')
                .doc(firebase.auth().currentUser.uid)
                .set({
                  firstName,
                  lastName,
                  email,
                })
            })
            .catch((error) => {
              alert(error.message)
            })
        })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Registration</Text>

      {/* Input fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          onChangeText={(firstName) => setFirstName(firstName)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          onChangeText={(lastName) => setLastName(lastName)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>

      {/* Register button */}
      <TouchableOpacity onPress={() => registerUser(email, password, firstName, lastName)} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    
      {/* <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Already have an Account? Login Now</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  inputContainer: {
    marginTop: 40,
  },
  textInput: {
    width: 300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default Registration
