import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Divider, Text, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default class UsersScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      listaSuges: [],
      listaMesa: [],
      pan: new Animated.ValueXY()
    }
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => {
        console.log("teste")
        return true;
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 10
        }).start();
      }
    });
  }


  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#e3e1e8' }}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle]}
        >
          <Card>
            <Card.Content>
              <Title>Teste</Title>
            </Card.Content>
          </Card>
        </Animated.View>
      </View>
    );
  }
}

let CIRCLE_RADIUS = 50;
let styles = StyleSheet.create({
  circle: {
    backgroundColor: "skyblue",
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS,
  }
});