import React, { Component } from 'react';
import { View, Switch, Text, Picker, StyleSheet, Modal, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Camera from '../components/Camera'
import CardSwiper from '../components/CardSwiper'
import { Avatar, Searchbar, FAB, TouchableRipple, IconButton, TextInput, RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
const { height, width } = Dimensions.get('window');
import Users from '../dao/Users'

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
      textoSearch: '',
      usuarios: [],
      usuariodetalhes: {},
      fotoAtual: null,
      nomeNovo: "",
      sexoNovo: "0"
    }
  }

  componentDidMount = async () => {
    this.getUsers()
  }

  getUsers = () => {
    Users.getAll().then(res => {
      this.setState({ usuarios: res })
    })
  }

  creteUsuario = () => {
    this.setState({
      dialogNovoUsuario: false,
    })
    Users.createUser(this.state.usuariodetalhes.id)
    this.setState({
      usuariodetalhes: {},
    }, () => {
      this.getUsers()
    })
  }

  deleteUsuario = () => {
    this.setState({
      dialogConfirm: false,
      dialogEditaUsuario: false,
    })
    Users.deleteUser(this.state.usuariodetalhes.id)
    this.setState({
      usuariodetalhes: {},
    }, () => {
      this.getUsers()
    })
  }

  renderUsuario = (item) => {
    let user = item.item
    return (
      <TouchableRipple onPress={() => {
        this.setState({ dialogEditaUsuario: true, usuariodetalhes: user })
      }} style={{ elevation: 4, backgroundColor: 'white', height: 100, width: width * 0.46, marginHorizontal: width * 0.02, marginVertical: 5, justifyContent: 'center' }}>
        <View style={{ padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <View >
            {user.sexo == 1 ?
              <Avatar.Image source={require('../resources/images/avatar_f.png')} />
              :
              <Avatar.Image source={require('../resources/images/avatar_m.png')} />
            }

          </View>

          <View style={{ marginLeft: 10, }}>
            <Text style={{ fontSize: 20 }}>{user.nome}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <Searchbar
          placeholder="Pesquisar"
          onChangeText={query => {
            this.setState({ textoSearch: query });
          }}
          value={this.state.textoSearch}
        />


        <FlatList
          numColumns={2}
          style={{ marginTop: 10, flexWrap: 'wrap' }}
          keyExtractor={(item, index) => item.id + ""}
          data={this.state.usuarios}
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
          height={0.35}
          onHardwareBackPress={() => { this.setState({ visible: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', }}>
            <View style={{ alignItems: 'center', flexDirection: 'column', margin: 5 }}>
              {this.state.fotoAtual ?
                <View>
                  <Avatar.Image size={24} source={{ uri: this.state.fotoAtual }} >
                  </Avatar.Image>
                  <IconButton
                    icon="add-a-photo"
                    color="#2f95dc"
                    size={20}
                    style={{ marginTop: -15, marginLeft: 30 }}
                    onPress={() => console.log('Pressed')}
                  />
                </View>
                :
                <Avatar.Icon style={{ backgroundColor: "#2f95dc" }} size={100} icon="add-a-photo" />
              }
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              <TextInput
                style={{ backgroundColor: "#fff" }}
                label='Nome Completo'
                selectionColor='#f3f0fa'
                underlineColor='#f3f0fa'
                value={this.state.nomeNovo}
                onChangeText={text => this.setState({ nomeNovo: text })}
              />
              <RadioButton.Group
                style={{width: "100%",backgroundColor: 'red',flexDirection: 'row', alignItems: 'center'}}
                onValueChange={value => this.setState({ sexoNovo: value })}
                value={this.state.sexoNovo}
              >
                <View style={{}}>
                  <Text>Masculino</Text>
                  <RadioButton value="0" />
                </View>
                <View>
                  <Text>Feminino</Text>
                  <RadioButton value="1" />
                </View>
              </RadioButton.Group>

            </View>
          </View>
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ dialogNovoUsuario: false, nomeNovo: "", fotoAtual: null }) }}
            />
            <DialogButton
              text={<Icon size={30} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => { this.setState({ dialogNovoUsuario: false }) }}
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
          <Camera close={() => {
            this.setState({ camvisible: false });
          }} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2f95dc"
  },
})

export default UserScreen;