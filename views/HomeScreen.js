import React, { Component } from 'react';
import {
  View,
  FlatList,
  PanResponder,
  Animated
} from 'react-native';
import { Divider, Text, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      listaSuges: [],
      listaMesa: [],
    }
  }

  

  _renderSugestoes = (item) => {
    
    return (
      <View style={{ marginHorizontal: 5, elevation: 0 }}>
        <Card>
          <Card.Content>
            <Title>{item.item}</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  _renderMesa = (item) => {
    return (
      <View style={{ margin: 10, elevation: 0 }}>
        <Card>
          <Card.Content>
            <Title>{item.item}</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <View style={{ backgroundColor: '#f3f0fa', height: 100 }}>
          <FlatList
            style={{ padding: 5 }}
            horizontal={true}
            data={["Cerveja", "Suco", "Filé com fritas", "+"]}
            renderItem={item => this._renderSugestoes(item)}
          />
        </View>
        <Divider />
        <FlatList
          style={{ paddingTop: 10 }}
          data={["Cerveja", "Suco", "Filé com fritas"]}
          renderItem={item => this._renderMesa(item)}
        />
      </View>
    );
  }
}

