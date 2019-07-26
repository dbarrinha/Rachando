import React, { Component } from 'react';
import Dialog,
{
  DialogFooter,
  DialogButton,
  DialogContent,
  ScaleAnimation
} from 'react-native-popup-dialog';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar
} from 'react-native';
import {
  FlatList
} from 'react-native-gesture-handler';
import {
  TouchableRipple,
  FAB,
  TextInput,
  Chip,
  Searchbar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { db } from '../dao/database';
import ConfirmDialog from '../components/ConfirmDialog'
const { height, width } = Dimensions.get('window');
const _ = require("lodash")
export default class MesasScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogNovaMesa: false,
      nomeNovo: "",
      descricaoNovo: "",
      idEdita: "",
      lista: [],
      listaFiltrada: [],
      dialogConfirm: false,
      textosearch: "",
      //lista: [{ nome: "teste", descricao: "0000000" }, { nome: "teste2", descricao: "0000000" }, { nome: "teste3", descricao: "0000000" }]
    }
    this.moment = require('moment');
  }

  componentDidMount = () => {
    this.getMesas()
  }

  getMesas = () => {
    var temp = [];
    db.transaction(async tx => {
      await tx.executeSql('SELECT * FROM mesa', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          lista: temp,
          listaFiltrada: temp,
        })
      });
    });
  }

  deleteMesa = () => {
    let id = this.state.idEdita
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  mesa where id=?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            this.getMesas()
            this.setState({ idEdita: "" })
            console.warn('teste deletado');
          } else {
            console.warn('delete Failed');
          }
        }
      );
    });
  }

  createMesa = async () => {
    let { nomeNovo, descricaoNovo } = this.state
    let data = this.moment(new Date).format("DD-MM-YYYY")
    await db.transaction(async (tx) => {
      await tx.executeSql(
        'INSERT INTO mesa VALUES (?,?,?,?,?)',
        [null, nomeNovo, descricaoNovo, 0, data],
        (tx, results) => {
          let iduser = results.insertId
          if (results.rowsAffected > 0) {
            console.warn("teste salvo")
            this.setState({
              dialogNovaMesa: false,
              nomeNovo: "",
              descricaoNovo: ""
            })
            this.getMesas()
          } else {
            console.warn('Registration Failed');
          }
        }
      );
    });
  }

  getDias = (data) => {
    let data1 = this.moment(new Date, "DD-MM-YYYY")
    let data2 = this.moment(data, "DD-MM-YYYY")
    var diff = data1.diff(data2, 'days');
    if (diff == 0) {
      return "Hoje"
    } else if (diff == 1) {
      return "1 dia atrás";
    } else {
      return diff + " dias atrás";
    }
  }

  renderMesa = (item) => {
    let mesa = item.item
    return (
      <TouchableRipple
        onPress={() => {
          this.props.navigation.navigate('App', {
            mesa
          })
        }}
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 10,
          elevation: 6,
          height: height * 0.2,
          backgroundColor: '#fff'
        }}>
        <View style={{ padding: 10 }}>
          <Chip style={{ backgroundColor: '#dddae3', elevation: 8, width: width * 0.3, flexDirection: 'row', justifyContent: 'center' }}>
            {this.getDias(mesa.data)}
          </Chip>
          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{mesa.nome}</Text>
            <Text style={{ color: '#424040' }}>{mesa.descricao}</Text>
            <Text style={{ color: '#424040' }}>{mesa.data}</Text>
          </View>
          <TouchableRipple onPress={() => this.setState({ dialogConfirm: true, idEdita: mesa.id })} style={{ right: ((width) * 0.02), top: 10, position: 'absolute', width: 40, height: 40, alignItems: 'center' }} >
            <Icon size={20} style={{ padding: 5 }} color="black" name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />
          </TouchableRipple>
        </View>
      </TouchableRipple>
    )
  }

  filtraMesas = () => {
    let lista = _.filter(this.state.lista, (o) => {
      return (
        _.lowerCase(o.nome).includes(_.lowerCase(this.state.textosearch))
        ||
        _.lowerCase(o.descricao).includes(_.lowerCase(this.state.textosearch))
      )
    });
    this.setState({ listaFiltrada: lista })
  }

  _renderMesaVazia = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          marginBottom: 20,
          bottom: 0,
          alignSelf: 'center', marginTop: width * 0.5, elevation: 10, flexDirection: 'column'
        }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#424040' }}>Crie uma Mesa!</Text>
          <Icon color='#424040' size={50} name={Platform.OS === 'ios' ? "ios-arrow-round-down" : "md-arrow-round-down"} />
        </View>
      </View>
    );
  }

  render() {
    console.log("render")
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
          <Text
            style={{
              color: '#424040',
              fontSize: 35,
              fontWeight: 'bold',
              textShadowOffset: { width: 100, height: 100 }
            }}>
            Mesas
          </Text>
          <TouchableRipple style={{ padding: 10, flexDirection: 'column', justifyContent: 'center' }}>
            <Icon size={25} color="black" name={Platform.OS === 'ios' ? "ios-funnel" : "md-funnel"} />
          </TouchableRipple>
        </View>
        <Searchbar
          placeholder="Pesquisar Mesas"
          style={{ borderRadius: 15, marginHorizontal: width * 0.02 }}
          onChangeText={query => {
            this.setState({ textosearch: query }, () => {
              this.filtraMesas()
            });
          }}
          value={this.state.textosearch}
        />
        <FlatList
          style={{ marginVertical: 10 }}
          data={this.state.listaFiltrada}
          keyExtractor={(item, index) => item.id + ""}
          renderItem={item => this.renderMesa(item)}
        />
        <Dialog
          visible={this.state.dialogNovaMesa}
          width={0.9}
          height={0.45}
          onHardwareBackPress={() => { this.setState({ dialogNovaMesa: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <DialogContent style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Text
              style={{
                color: '#424040',
                fontSize: 25,
                fontWeight: 'bold',
                marginRight: 10
              }}>
              Nova Mesa
            </Text>
            <View style={{ flexDirection: 'column' }}>
              <TextInput
                style={{ backgroundColor: "#fff" }}
                label='Nome'
                autoCapitalize="words"
                value={this.state.nomeNovo}
                onChangeText={text => this.setState({ nomeNovo: text })}
                maxLength={15}
              >

              </TextInput>
              <Text style={{ fontSize: 15, alignSelf: 'flex-end', color: '#424040', marginHorizontal: 5 }}>{this.state.nomeNovo.length + "/15"}</Text>
            </View>
            <TextInput
              style={{ backgroundColor: "#fff" }} f
              label='Descrição'
              value={this.state.descricaoNovo}
              onChangeText={text => this.setState({ descricaoNovo: text })}
            />
          </DialogContent>
          <DialogFooter >
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ dialogNovaMesa: false, nomeNovo: "", descricaoNovo: "" }) }}
            />
            <DialogButton
              text={<Icon size={30} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => {
                this.createMesa()
              }}
            />
          </DialogFooter>

        </Dialog>
        <ConfirmDialog
          visible={this.state.dialogConfirm}
          texto="Deseja Excluir esta Mesa?"
          cancel={() => this.setState({ dialogConfirm: false })}
          confirma={() => {
            this.setState({ dialogConfirm: false })
            this.deleteMesa()
          }}
        />
        <FAB
          style={styles.fab}
          icon="add"
          color="#fff"
          label="Nova Mesa"
          onPress={() => this.setState({ dialogNovaMesa: true })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white'
  },
  fab: {
    flex: 0,
    position: 'absolute',
    marginBottom: 20,
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: "#2f95dc",
  },
}); 