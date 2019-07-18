import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RNCamera, FaceDetector } from 'react-native-camera';
import Camera from '../components/Camera'


class UserScreen extends Component {
  render() {
    return (
      <View style={{flex : 1}}>
        <Camera />
      </View>
    );
  }

 
}

export default UserScreen;