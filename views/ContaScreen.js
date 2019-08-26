import React, { Component } from 'react';

import { View } from 'react-native';
const _ = require("lodash")
export default class ContaScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      consumos: [],
      conta: []
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    let dados = navigation.getParam('dados')
    console.log(dados)
    this.setState({ consumos: dados },()=>{
      this.preparaDados()
    })
  }

  preparaDados = () => {
    let { consumos } = this.state
    let usuarios = []
    for (let i = 0; i < consumos.length; i++) {
      let users = consumos[i].users
      let valorDividido = (consumos[i].preço * consumos[i].quantidade) / users.length;
      for (let j = 0; j < users.length; j++) {
        let usuariosAtual = _.remove(usuarios, function(o) { return o.nome === users[j].nome })
        if(usuariosAtual.length > 0 ){
          let user = usuariosAtual[0]
          let itens = []
          user.itens.map(item=>{
            itens.push(item)
          })
          itens.push({nome:consumos[i].nome, value: valorDividido})
          let aux = {nome: user.nome, total: user.total + valorDividido, itens: itens}
          usuarios.push(aux)
        }else{
          let aux = {nome: users[j].nome, total: valorDividido, itens: [{nome:consumos[i].nome, value: valorDividido}]}
          usuarios.push(aux)
        }
      }
    }
    this.setState({
      conta: usuarios
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>


      </View>
    );
  }
}
