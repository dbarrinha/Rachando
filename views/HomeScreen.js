import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Animated
} from 'react-native';
import { Divider, Text, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

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
        <Card style={{ width: width * 0.45, height: height * 0.15 }}>
          <Card.Title
            title={item.item}
            subtitle="Card Subtitle"
          />
        </Card>
      </View>
    );
  }

  _renderMesa = (item) => {
    return (
      <View style={{ margin: 10, elevation: 0 }}>
        <Card>
          <Card.Title
            style={{ fontFamily: 'LibelSuitRg-Regular' }}
            title="Card Title"
            subtitle="Card Subtitle"
          />
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <View style={{ backgroundColor: '#f3f0fa', height: height * 0.19, flexDirection: 'row' }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{ margin: 5 }}
              horizontal={true}
              data={["Cerveja", "Suco", "Filé com fritas"]}
              renderItem={item => this._renderSugestoes(item)}
            ></FlatList>
            <View style={{ marginRight: 5, marginTop: 5, elevation: 0 }}>
              <Card style={{ width: width * 0.35, height: height * 0.15 }}>
                <Card.Content style={{ alignItems: 'center' }}>
                  <Text style={{fontSize: 40}}>+</Text>
                  <Text style={{ fontFamily: 'LibelSuitRg-Regular' }}>Nova Opção</Text>
                </Card.Content>
              </Card>
            </View>
          </ScrollView>
        </View>
        <Divider />
        <FlatList
          style={{ paddingTop: 10 }}
          data={this.state.listaMesa}
          renderItem={item => this._renderMesa(item)}
        />
      </View>
    );
  }
}

