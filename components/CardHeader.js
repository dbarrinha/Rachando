import React, { Component } from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  View,
  Text
} from "react-native";
import { Card } from 'react-native-paper';
const { height, width } = Dimensions.get('window');
const CardHeader = ({
  item,
  cardAction
}) => {
  let scaleValue = new Animated.Value(0);

  const cardScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.2]
  });

  let transformStyle = { ...styles.card, transform: [{ scale: cardScale }] };

  return (
    <TouchableWithoutFeedback
      
      onLongPress={() => {
        scaleValue.setValue(0);
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true
        }).start();
        cardAction();
      }}

      onPressOut={() => {
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true
        }).start();
      }}>

      <Animated.View style={transformStyle}>
        <View style={{ width: width * 0.45, height: height * 0.15 }}>
          <Card.Content style={{ justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 25}}>{item.item}</Text>
            <Text>Nova Opção</Text>
          </Card.Content>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  card: {
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 6,
    backgroundColor: 'white',
    borderRadius: 4
  }
};

export default CardHeader;
