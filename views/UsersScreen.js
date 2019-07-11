import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export default class UsersScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#e3e1e8'}}>
        <Text>Users</Text>
      </View>
    );
  }
}
