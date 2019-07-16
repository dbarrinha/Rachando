import React, { Component } from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  PanResponder,
  View,
  Text
} from "react-native";
import { Card } from 'react-native-paper';
const { height, width } = Dimensions.get('window');

export default class CardHeader extends Component {
  constructor(props) {
    super(props)

    this.pan = new Animated.ValueXY(); // for animating the card's X and Y position
    this.scaleValue = new Animated.Value(0); // for scaling the card while the user drags it
    this.opacityValue = new Animated.Value(2);

    this.cardScale = this.scaleValue.interpolate({
      inputRange: [0, 0.5, 1], // animate to 0.5 while user is dragging, then to 1 or 0 once they let go
      outputRange: [1, 0.5, 1]
    });

    this.cardOpacity = this.opacityValue.interpolate({
      inputRange: [0, 1, 2], // default value is 2, so we'll animate backwards
      outputRange: [0, 0.5, 1]
    });
  }

  componentWillMount = () => {
    // add the following:
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {

      },
      onPanResponderMove: (e, gesture) => {
        Animated.parallel([

          Animated.timing(this.opacityValue, {
            toValue: 2,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: true
          }),
          Animated.spring(this.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true
          })
        ]).start();
        Animated.event([null, { dx: this.pan.x, dy: this.pan.y }])(e, gesture);
        /*if (isDropArea(gesture)) {
          targetDropArea(true);
        } else {
          targetDropArea(false);
        }*/
      },
      onPanResponderRelease: (e, gesture) => {
        Animated.parallel([

          Animated.timing(this.opacityValue, {
            toValue: 2,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: true
          }),
          Animated.spring(this.pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true
          })
        ]).start();
      }
    });
  }
  render() {
    const {
      item,
      cardAction
    } = this.props;

    let [translateX, translateY] = [this.pan.x, this.pan.y];

    let transformStyle = {
      ...styles.card,
      //opacity: item.isVisible ? this.cardOpacity : 0,
      opacity: this.cardOpacity,
      transform: [{ translateX }, { translateY }, { scale: this.cardScale }]
    };

    return (
      <Animated.View style={transformStyle} {...this.panResponder.panHandlers}>
          <View style={{ width: width * 0.45, height: height * 0.15 }}>
            <Card.Content style={{ justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 25 }}>teste</Text>
              <Text>Nova Opção</Text>
            </Card.Content>
          </View>
      </Animated.View>
    );
  }
}

const styles = {
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 4
  }
};