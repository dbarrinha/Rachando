import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import { Divider, Text, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import CardHeader from '../components/CardHeader'

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
    return (<CardHeader item={item} cardAction={()=>{}} />)
  }

  _renderMesa = (item) => {
    return (
      <View style={{ margin: 10, elevation: '10' }}>
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
              horizontal={true}
              data={["Teste1", "Teste2", "Teste3"]}
              renderItem={item => this._renderSugestoes(item)}
            ></FlatList>
            <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 6, backgroundColor:'white' , borderRadius: 4 }}>
              <View style={{ width: width * 0.35, height: height * 0.15 }}>
                <Card.Content style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontFamily: 'LibelSuitRg-Regular' }}>+</Text>
                  <Text>Nova Opção</Text>
                </Card.Content>
              </View>
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

