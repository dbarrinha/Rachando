import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';

const { height, width } = Dimensions.get('window');

export default class MesasScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  renderMesa = (item) => {
    return (
      <TouchableRipple
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 4,
          elevation: 6,
          height: height * 0.15,
          backgroundColor: '#fff'
        }}>
        <View style={{ padding: 10 }}>

          <Text>{item.item.nome}</Text>
        </View>
      </TouchableRipple>
    )
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }} >
        <FlatList
          data={[{ nome: "teste", descricao: "0000000" }, { nome: "teste2", descricao: "0000000" }, { nome: "teste3", descricao: "0000000" }]}
          renderItem={item => this.renderMesa(item)}
        />
      </View>
    );
  }
}
