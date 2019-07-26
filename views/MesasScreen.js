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
  Chip
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { db } from '../dao/database';
import ConfirmDialog from '../components/ConfirmDialog'
const { height, width } = Dimensions.get('window');

export default class MesasScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dialogNovaMesa: false,
      nomeNovo: "",
      descricaoNovo: "",
      idEdita: "",
      lista: [],
      dialogConfirm: false
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
          lista: temp
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
            this.setState({idEdita: ""})
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
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 4,
          elevation: 6,
          height: height * 0.2,
          backgroundColor: '#fff'
        }}>
        <View style={{ padding: 10 }}>
          <Chip style={{ backgroundColor: '#dddae3', elevation: 8, width: width * 0.3, flexDirection: 'row', justifyContent: 'center' }}>
            {this.getDias(mesa.data)}
          </Chip>
          <View style={{ padding: 10 }}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>{mesa.nome}</Text>
            <Text>{mesa.descricao}</Text>
            <Text>{mesa.data}</Text>
          </View>
          <TouchableRipple onPress={() => this.setState({dialogConfirm: true, idEdita: mesa.id})} style={{ right: ((width) * 0.02), top: 10, position: 'absolute', width: 40, height: 40, alignItems: 'center'}} >
            <Icon size={20} style={{ padding: 5 }} color="black" name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />
          </TouchableRipple>
        </View>
      </TouchableRipple>
    )
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }} >
        <StatusBar backgroundColor="#f3f0fa" barStyle="dark-content" />
        <Text style={{ color: '#424040', fontSize: 35, marginHorizontal: width * 0.02, marginVertical: 10, fontWeight: 'bold', textShadowOffset: { width: 100, height: 100 } }}>Mesas</Text>
        <FlatList
          data={this.state.lista}
          keyExtractor={(item, index) => item.id + ""}
          renderItem={item => this.renderMesa(item)}
        />
        <Dialog
          visible={this.state.dialogNovaMesa}
          width={0.9}
          height={0.45}
          onHardwareBackPress={() => { this.setState({ dialogNovaMesa: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <Text style={{ alignSelf: 'center' }}>Nova Mesa</Text>
            <TextInput
              style={{ backgroundColor: "#fff" }}
              label='Nome'
              autoCapitalize="words"
              value={this.state.nomeNovo}
              onChangeText={text => this.setState({ nomeNovo: text })}
            />
            <TextInput
              style={{ backgroundColor: "#fff" }}
              label='Descrição'
              value={this.state.descricaoNovo}
              onChangeText={text => this.setState({ descricaoNovo: text })}
            />
          </View>
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
          label="Nova"
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
    marginBottom: 26,
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: "#2f95dc",
  },
}); 