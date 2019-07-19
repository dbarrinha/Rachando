import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RNCamera, FaceDetector } from 'react-native-camera';
import Camera from '../components/Camera'
import {  Button } from 'react-native-paper';


class UserScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      camvisible: false
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button onPress={() => this.setState({ camvisible: true })}>
          <Text>abrir modal</Text>
        </Button>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.camvisible}
          presentationStyle="fullScreen"
          onDismiss={() => {
            this.setState({ camvisible: false });
          }}
        >
          <Camera close={() => {
            this.setState({ camvisible: false });
          }} />
        </Modal>
      </View>
    );
  }


}

export default UserScreen;