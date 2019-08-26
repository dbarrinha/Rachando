import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Switch, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { FlatList } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');
const _ = require("lodash")
export default class ContaScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      consumos: [],
      conta: [],
      isGorjeta: false
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    let dados = navigation.getParam('dados')
    console.log(dados)
    this.setState({ consumos: dados }, () => {
      this.geraConta()
    })
  }

  geraConta = () => {
    let { consumos } = this.state
    let usuarios = []
    for (let i = 0; i < consumos.length; i++) {
      let users = consumos[i].users
      let valorDividido = (consumos[i].preço * consumos[i].quantidade) / users.length;
      for (let j = 0; j < users.length; j++) {
        let usuariosAtual = _.remove(usuarios, function (o) { return o.nome === users[j].nome })
        if (usuariosAtual.length > 0) {
          let user = usuariosAtual[0]
          let itens = []
          user.itens.map(item => {
            itens.push(item)
          })
          itens.push({ nome: consumos[i].nome, value: valorDividido, quantidade: consumos[i].quantidade })
          let aux = { nome: user.nome, total: user.total + valorDividido, itens: itens }
          usuarios.push(aux)
        } else {
          let aux = { nome: users[j].nome, total: valorDividido, itens: [{ nome: consumos[i].nome, value: valorDividido, quantidade: consumos[i].quantidade }] }
          usuarios.push(aux)
        }
      }
    }
    this.setState({
      conta: usuarios
    })
  }

  renderConsumo = (item, index) => {
    let consumo = item
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Text>{consumo.nome.toUpperCase()}</Text>
        <Text>{consumo.quantidade}</Text>
        <Text>R${this.state.isGorjeta ? (consumo.value * 1.1) : consumo.value}{this.state.isGorjeta ?"(+10%)":""}</Text>
      </View>
    )
  }

  renderConta = (item) => {
    let usuario = item.item
    return (
      <View style={{
        marginVertical: 10,
        marginHorizontal: width * 0.02
      }}>
        <Text
          style={{
            color: '#424040',
            fontSize: 25,
            fontWeight: 'bold',
            textShadowOffset: { width: 100, height: 100 }
          }}>
          {usuario.nome.toUpperCase()}

        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Text>Consumo</Text>
          <Text>Qtd:</Text>
          <Text>Preço</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          {usuario.itens.map((item, index) => {
            return this.renderConsumo(item, index)
          })
          }
        </View>
        <Text style={{
          color: '#424040',
          fontSize: 18,
          fontWeight: 'bold',
          textShadowOffset: { width: 100, height: 100 }
        }}>Total: R${this.state.isGorjeta ? (usuario.total * 1.1) : usuario.total}{this.state.isGorjeta ?"(+10%)":""}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }} >
        <StatusBar backgroundColor="#f3f0fa" barStyle="dark-content" />
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: width * 0.02,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <TouchableRipple onPress={() => this.props.navigation.navigate('Home')} style={{ padding: 10, flexDirection: 'column', justifyContent: 'center' }}>
            <Icon size={30} color="#424040" name={Platform.OS === 'ios' ? "ios-arrow-dropleft" : "md-arrow-round-back"} />
          </TouchableRipple>
          <Text
            style={{
              color: '#424040',
              fontSize: 35,
              fontWeight: 'bold',
              textShadowOffset: { width: 100, height: 100 }
            }}>
            Conta Parcial
        </Text>
          <Switch
            value={this.state.isGorjeta}
            onValueChange={() => { this.setState({ isGorjeta: !this.state.isGorjeta }); }
            }
          />
        </View>
        <FlatList
          data={this.state.conta}
          renderItem={(item) => this.renderConta(item)}
        />
      </View>
    );
  }
}
