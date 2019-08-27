import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Switch, TouchableRipple, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { FlatList } from 'react-native-gesture-handler';
import Share from 'react-native-share'
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
      total: 0,
      isGorjeta: false,
      mesa: ""
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    let dados = navigation.getParam('dados')
    let mesa = navigation.getParam('mesa')
    console.log(dados)
    this.setState({ consumos: dados, mesa }, () => {
      this.geraConta()
    })
  }

  geraConta = () => {
    let { consumos } = this.state
    let total = 0
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
          itens.push({ nome: consumos[i].nome, value: valorDividido, quantidade: consumos[i].quantidade, unidade: consumos[i].preço })
          let aux = { nome: user.nome, total: user.total + valorDividido, itens: itens }
          total += valorDividido
          usuarios.push(aux)
        } else {
          let aux = { nome: users[j].nome, total: valorDividido, itens: [{ nome: consumos[i].nome, value: valorDividido, quantidade: consumos[i].quantidade, unidade: consumos[i].preço }] }
          total += valorDividido
          usuarios.push(aux)
        }
      }
    }
    this.setState({
      conta: usuarios,
      total
    })
  }

  formataValor = (value) => {
    var arredondado = parseFloat(value.toFixed(2));
    return arredondado
  }

  renderConsumo = (item, index) => {
    let consumo = item
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ width: width * 0.3 }}>{consumo.nome.toUpperCase()}</Text>
        <Text style={{ width: width * 0.3 }}>Qtd:{consumo.quantidade}</Text>
        <Text style={{ width: width * 0.3 }}>V.U.:{consumo.unidade}</Text>
        <Text style={{ width: width * 0.3 }}>R${this.formataValor(consumo.value)}</Text>
        <Divider style={{ color: "black" }} />
      </View>
    )
  }

  goShare = () => {
    let { conta, total, mesa } = this.state
    let msg = ""
    msg += "Rolê " + mesa + "\n\n"
    for (let i = 0; i < conta.length; i++) {
      msg += "" + conta[i].nome + "\n"
      for (let j = 0; j < conta.itens.length; j++) {
        msg += "" + conta.itens[i].nome + " total: R$" + this.formataValor(conta.itens[i].value) + "\n"
      }
      msg += "Total: R$" +  (this.state.isGorjeta ? this.formataValor(conta[i].total * 1.1):this.formataValor(conta[i].total))+" "+(this.state.isGorjeta ? "(+10%)":"") + "\n\n"
    }
    msg += "Total da Conta R$" + (this.state.isGorjeta ? this.formataValor(total * 1.1):this.formataValor(total))+" "+(this.state.isGorjeta ? "(+10%)":"") + "\n\n"
    const shareOptions = {
      title: 'Rachando App',
      message: msg,
      url: ''
    };

    Share.open(shareOptions)
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });

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
        }}>Total: R${this.state.isGorjeta ? this.formataValor(usuario.total * 1.1) : this.formataValor(usuario.total)}{this.state.isGorjeta ? "(+10%)" : ""}</Text>
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
          <TouchableRipple onPress={() => { this.goShare() }} style={{ padding: 10, flexDirection: 'column', justifyContent: 'center' }}>
            <Icon size={30} color="#424040" name={Platform.OS === 'ios' ? "ios-share" : "md-share"} />
          </TouchableRipple>
        </View>
        <View
          style={{
            marginVertical: 10,
            marginHorizontal: width * 0.02,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text style={{
            color: '#424040',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowOffset: { width: 100, height: 100 }
          }}>10%</Text>
          <Switch
            value={this.state.isGorjeta}
            onValueChange={() => { this.setState({ isGorjeta: !this.state.isGorjeta }); }
            }
          ></Switch>
        </View>
        <FlatList
          data={this.state.conta}
          renderItem={(item) => this.renderConta(item)}
        />
        <Text
          style={{
            color: '#424040',
            fontSize: 25,
            fontWeight: 'bold',
            textShadowOffset: { width: 100, height: 100 }
          }}>
          Total da Conta: R${this.state.isGorjeta ? this.formataValor(this.state.total * 1.1) : this.formataValor(this.state.total)}
          {this.state.isGorjeta ? "(+10%)" : ""}
        </Text>
      </View>
    );
  }
}
