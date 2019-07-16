import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Text
} from 'react-native';
import { Divider, Avatar, Button, Card, Title, Paragraph, TouchableRipple } from 'react-native-paper';
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
      listaSuges: ["Teste1", "Teste2", "Teste3"],
      listaMesa: [],
    }
  }

  _renderSugestoes = (item) => {
    //return (<CardHeader item={item} cardAction={()=>{}} />)
    return (


      <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 8, backgroundColor: 'white', borderRadius: 10 }}>
        <TouchableRipple onPress={() => this.addItemMesa(item.item)} style={{ width: width * 0.45, height: height * 0.15 }} >
          <Card.Content style={{ justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 25 }}>{item.item}</Text>
            <Text>Nova Opção</Text>
          </Card.Content>
        </TouchableRipple>
      </View>
    );
  }

  _renderMesa = (item) => {
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 1, backgroundColor: 'white', borderRadius: 4 }}>
        <Card.Content style={{ justifyContent: 'flex-start', padding: 15 }}>
          <Text style={{ fontSize: 25 }}>{item.item}</Text>
          <Text>Nova Opção</Text>
        </Card.Content>
      </View>
    );
  }

  _renderMesaVazia = () => {
    return (
      <View style={{ marginTop: width * 0.5, elevation: 10, alignItems: 'center' }}>
        <Text>Mesa Vazia!</Text>
      </View>
    );
  }

  addItemMesa = (item) => {
    let lista = this.state.listaMesa
    lista.push(item)
    this.setState({ listaMesa: lista })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <View >
          <ScrollView style={{ backgroundColor: '#f3f0fa', height: height * 0.19, flexDirection: 'row' }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={["Teste1", "Teste2", "Teste3"]}
              renderItem={item => this._renderSugestoes(item)}
            ></FlatList>
            <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 8, backgroundColor: 'white', borderRadius: 10 }}>
              <View style={{ width: width * 0.35, height: height * 0.15 }}>
                <Card.Content style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontFamily: 'LibelSuitRg-Regular', color: '#383838' }}>+</Text>
                  <Text>Nova Opção</Text>
                </Card.Content>
              </View>
            </View>
          </ScrollView>
        </View>
          <Divider />
          <Text style={{ marginHorizontal: 10, color: '#474747' }}>Itens</Text>
          <FlatList
            data={this.state.listaMesa}
            renderItem={item => this._renderMesa(item)}
            ListEmptyComponent={this._renderMesaVazia()}
          />
      </View>
    );
  }
}

