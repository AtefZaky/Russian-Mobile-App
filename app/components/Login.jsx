import React from 'react';
import LoginImage from '../../assets/images/LoginImage.png';
import styles from '../Styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const MedLogin = () => {
  return (
    <View style={styles.Formcontainer}>
      {/* Right Section: Form */}
      <View style={styles.formSection}>
        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Form Login</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="user" size={20} color="#888" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={20} color="#888" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#888"
              secureTextEntry
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Left Section: Image */}
      <View style={styles.imageSection}>
        <Image
          source={LoginImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};



export default MedLogin;
