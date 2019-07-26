import React, { Component } from 'react';
import { View, Switch, Text, StatusBar , StyleSheet, Modal, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Camera from '../components/Camera'
import ConfirmDialog from '../components/ConfirmDialog'
import { Avatar, Searchbar, FAB, TouchableRipple, Snackbar, TextInput, RadioButton, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
const { height, width } = Dimensions.get('window');
import Users from '../dao/Users'
import { db } from '../dao/database';
const _ = require("lodash")
class UserScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      camvisible: false,
      dialogNovoUsuario: false,
      dialogEditaUsuario: false,
      dialogConfirm: false,
      usuarios: [],
      usuariosFiltrados: [],
      usuariodetalhes: {},
      fotoAtual: null,
      nomeNovo: "",
      sexoNovo: "0",
      idEdita: 0,
      fotoEdita: null,
      nomeEdita: "",
      sexoEdita: "0",
      snack: false,
      textosearch: "",
    }
  }

  componentDidMount = async () => {
    this.getUsers()
  }

  getUsers = () => {
    let temp = []
    db.transaction(async tx => {
      await tx.executeSql('SELECT * FROM user', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({ 
          usuarios: temp,
          usuariosFiltrados: temp
         })
      });
    });
  }

  filtraUsuarios = () =>{
    let lista = _.filter(this.state.usuarios, (o) => { 
      return _.lowerCase(o.nome).includes(_.lowerCase(this.state.textosearch))
    });
    this.setState({usuariosFiltrados: lista})
  }

  creteUsuario = () => {
    let { nomeNovo, sexoNovo, fotoAtual } = this.state
    if (!fotoAtual) fotoAtual = ""
    if (nomeNovo == "") {
      this.setState({
        snack: true,
      })
      return;
    }
    this.setState({
      dialogNovoUsuario: false,
    })
    Users.createUser(nomeNovo, +sexoNovo, fotoAtual)
    this.setState({
      usuariodetalhes: {},
      idEdita: 0,
      fotoEdita: null,
      fotoAtual: null,
      nomeNovo: "",
      sexoNovo: "0"
    }, () => {
      this.getUsers()
    })
  }
  updateUsuario = () => {
    let { nomeEdita, sexoEdita, fotoEdita, idEdita } = this.state
    if (!fotoEdita) fotoEdita = ""
    if (nomeEdita == "") {
      this.setState({
        snack: true,
      })
      return;
    }
    this.setState({
      dialogEditaUsuario: false,
    })
    Users.updateUser(nomeEdita, +sexoEdita, fotoEdita, idEdita)
    this.setState({
      usuariodetalhes: {},
      idEdita: 0,
      fotoEdita: null,
      fotoAtual: null,
      nomeEdita: "",
      sexoEdita: "0"
    }, () => {
      this.getUsers()
    })
  }

  deleteUsuario = () => {
    this.setState({
      dialogConfirm: false,
      dialogEditaUsuario: false,
    })
    console.log(this.state.idEdita)
    Users.deleteUser(this.state.idEdita)
    this.setState({
      usuariodetalhes: {},
      idEdita: 0,
      fotoEdita: null,
      nomeEdita: "",
      sexoEdita: "0"
    }, () => {
      this.getUsers()
    })
  }

  renderUsuario = (item) => {
    let user = item.item
    return (
      <TouchableRipple onPress={() => {
        this.setState({
          dialogEditaUsuario: true, fotoEdita: user.foto,
          nomeEdita: user.nome,
          sexoEdita: user.sexo + "",
          idEdita: user.id
        })
      }} style={{ elevation: 8, backgroundColor: 'white', width: width * 0.46, marginHorizontal: width * 0.02, marginVertical: 5, justifyContent: 'center', borderRadius: 6 }}>
        <View style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row-reverse' }} >
            {user.foto == "" ?
              user.sexo == 1 ?
                <Avatar.Image source={require('../resources/images/avatar_f.png')} />
                :
                <Avatar.Image source={require('../resources/images/avatar_m.png')} />

              :
              <Avatar.Image source={{ uri: `data:image/gif;base64,${user.foto}` }} />
            }
            <TouchableRipple style={{ right: ((width * 0.43) / 2), position: 'absolute', width: 40, height: 40, alignItems: 'center' }} onPress={() => { this.setState({ dialogConfirm: true, idEdita: user.id }) }}>
              <Icon size={20} style={{padding: 5}} color="black" name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />
            </TouchableRipple>
          </View>

          <View style={{ alignSelf: 'center' }}>
            <Text style={{ fontSize: 20 }}>{user.nome}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <StatusBar backgroundColor="#f3f0fa" barStyle="dark-content" />
        <Snackbar
        styty={{position: 'relative', top: 0}}
          visible={this.state.snack}
          onDismiss={() => this.setState({ snack: false })}
          action={{
            label: 'Ok',
            onPress: () => {
              this.setState({ snack: false })
            },
          }}
        >
          Faltando Informações!
        </Snackbar>
        <Text style={{color: '#424040', fontSize: 35, marginHorizontal:width * 0.02, marginVertical: 10, fontWeight: 'bold', textShadowOffset: {width: 100,height: 100} }}>Usuários</Text>
        <Searchbar
          placeholder="Pesquisar"
          style={{borderRadius: 15, marginHorizontal: width * 0.02}}
          onChangeText={query => {
            this.setState({ textosearch: query },()=>{
              this.filtraUsuarios()
            });
          }}
          value={this.state.textosearch}
        />


        <FlatList
          numColumns={2}
          style={{ marginTop: 10, flexWrap: 'wrap' }}
          keyExtractor={(item, index) => item.id + ""}
          data={this.state.usuariosFiltrados}
          renderItem={item => this.renderUsuario(item)}
        />

        <FAB
          style={styles.fab}
          icon="add"
          color="#fff"
          label="Novo"
          onPress={() => this.setState({ dialogNovoUsuario: true })}
        />

        <Dialog
          visible={this.state.dialogNovoUsuario}
          width={0.9}
          height={0.45}
          onHardwareBackPress={() => { this.setState({ dialogNovoUsuario: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', flexDirection: 'column', margin: 5 }}>
              {this.state.fotoAtual ?
                <View>
                  <TouchableRipple onPress={() => this.setState({ camvisible: true })}>
                    <Avatar.Image size={100} source={{ uri: `data:image/gif;base64,${this.state.fotoAtual}` }} />
                  </TouchableRipple>
                </View>
                :
                <TouchableRipple onPress={() => this.setState({ camvisible: true })}>
                  <Avatar.Icon style={{ backgroundColor: "#2f95dc" }} size={100} icon="add-a-photo" />
                </TouchableRipple>
              }
            </View>
            <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'space-around' }}>
              <TextInput
                style={{ backgroundColor: "#fff" }}
                label='Nome Completo'
                selectionColor='#f3f0fa'
                underlineColor='#f3f0fa'
                value={this.state.nomeNovo}
                onChangeText={text => this.setState({ nomeNovo: text })}
              />

              <RadioButton.Group
                onValueChange={value => this.setState({ sexoNovo: value })}
                value={this.state.sexoNovo}
                style={{ marginHorizontal: 10 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }}>

                  <View>
                    <Text>Masculino</Text>
                    <RadioButton value="0" />
                  </View>
                  <View>
                    <Text>Feminino</Text>
                    <RadioButton value="1" />
                  </View>
                </View>
              </RadioButton.Group>

            </View>
          </View>
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ dialogNovoUsuario: false, nomeNovo: "", sexoNovo: "0", fotoAtual: null }) }}
            />
            <DialogButton
              text={<Icon size={30} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => {
                this.creteUsuario()
              }}
            />
          </DialogFooter>
        </Dialog>

        <Dialog
          visible={this.state.dialogEditaUsuario}
          width={0.9}
          height={0.45}
          onHardwareBackPress={() => { this.setState({ dialogEditaUsuario: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', flexDirection: 'column', margin: 5 }}>
              {this.state.fotoEdita != "" ?
                <View>
                  <TouchableRipple onPress={() => this.setState({ camvisible: true })}>
                    <Avatar.Image size={100} source={{ uri: `data:image/gif;base64,${this.state.fotoEdita}` }} />
                  </TouchableRipple>
                </View>
                :
                <TouchableRipple onPress={() => this.setState({ camvisible: true })}>
                  <Avatar.Icon style={{ backgroundColor: "#2f95dc" }} size={100} icon="add-a-photo" />
                </TouchableRipple>
              }
            </View>

            <View style={{ flexDirection: 'column', alignContent: 'center', justifyContent: 'space-around' }}>
              <TextInput
                style={{ backgroundColor: "#fff" }}
                label='Nome Completo'
                selectionColor='#f3f0fa'
                underlineColor='#f3f0fa'
                value={this.state.nomeEdita}
                onChangeText={text => this.setState({ nomeEdita: text })}
              />
              <RadioButton.Group
                onValueChange={value => this.setState({ sexoEdita: value })}
                value={this.state.sexoEdita}
                style={{ marginHorizontal: 10 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }}>

                  <View>
                    <Text>Masculino</Text>
                    <RadioButton value="0" />
                  </View>
                  <View>
                    <Text>Feminino</Text>
                    <RadioButton value="1" />
                  </View>
                </View>
              </RadioButton.Group>

            </View>
          </View>
          <DialogFooter >
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ dialogEditaUsuario: false, nomeEdita: "", sexoEdita: "0", fotoEdita: null }) }}
            />
            <DialogButton
              text={<Icon size={30} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => {
                this.updateUsuario()
              }}
            />
          </DialogFooter>

        </Dialog>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.camvisible}
          presentationStyle="fullScreen"
          onDismiss={() => {
            this.setState({ camvisible: false });
          }}
        >
          <Camera
            close={() => {
              this.setState({ camvisible: false });
            }}
            takepic={(foto) => {
              this.setState({
                camvisible: false,
                fotoAtual: foto,
                fotoEdita: foto
              });

            }}
          />
        </Modal>
        <ConfirmDialog
          visible={this.state.dialogConfirm}
          texto="Deseja Excluir este usuário?"
          cancel={() => this.setState({ dialogConfirm: false })}
          confirma={() => {
            this.setState({ dialogConfirm: false })
            this.deleteUsuario()
          }
          }
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    flex: 0,
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2f95dc",
  },
})

export default UserScreen;