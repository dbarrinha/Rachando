import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { Divider, Card, TextInput, TouchableRipple, Chip, Button, FAB } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
import MultiSelect from 'react-native-multiple-select';
import Slider from 'react-native-simple-slider'
import AsyncStorage from '@react-native-community/async-storage';
import { TextInputMask } from 'react-native-masked-text'
//DB
import { db } from '../dao/database';
const numeral = require('numeral');
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
      itemAux: '',
      visible: false,
      visibleDetails: false,
      nome: '',
      preco: 1,
      idEdita: 0,
      nomeSuges: "",
      idSuges: 0,
      sugestaoDialog: false,
      slider: 0,
      mesa: {},
      userAux: [],
      usuarios: [],
      idUpdate: null,
      idDelete: null,
      idDeleteUserconsumo: null
    }
  }

  componentDidMount = async () => {

    const { navigation } = this.props;
    let mesa = navigation.dangerouslyGetParent().dangerouslyGetParent().getParam('mesa')
    await AsyncStorage.setItem('mesaativa', JSON.stringify(mesa))
    this.setState({
      mesa
    })
    this.getSugestoes()
    this.getConsumo()
    this.getUsers()
  }


  clearDados = () => {
    this.setState({
      userAux: [],
      idUpdate: null,
      idDelete: null,
      idDeleteUserconsumo: null,
      nome: '',
      preco: 1,
      idEdita: 0,
      nomeSuges: "",
      idSuges: 0,
    })
  }

  iniciaUpdate = (item) => {

  }

  deleteConsumo = () => {
    let { idDelete } = this.state
    if (!idDelete) return;
    db.transaction(async tx => {
      await tx.executeSql('delete FROM consumo where id=' + idDelete, [], async (tx, results) => {
        if (results.rowsAffected > 0) {
          this.getConsumo()
          this.setState({ idDelete: null,dialogConfirm: false })
          console.warn('conusmo deletado');
        } else {
          console.warn('delete Failed');
        }
        
      });
    });
  }

  deleteUserConsumo = () => {
    let { idDeleteUserconsumo } = this.state
    if (!idDeleteUserconsumo) return;
    db.transaction(async tx => {
      await tx.executeSql('delete FROM usuarioconsumo where id=' + idDeleteUserconsumo, [], async (tx, results) => {

      });
    });
  }

  componentWillMount = async () => {
    const didBlurSubscription = this.props.navigation.addListener(
      'willFocus',
      async payload => {

        this.getAlertas()

      }
    );
  }

  getUsers = () => {
    let temp = []
    db.transaction(async tx => {
      await tx.executeSql('SELECT * FROM user', [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          usuarios: temp
        })
      });
    });
  }

  getConsumo = () => {
    var temp = [];
    db.transaction(async tx => {
      await tx.executeSql('SELECT * FROM consumo', [], async (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          let consumo = results.rows.item(i)
          let userAux = []
          await tx.executeSql(
            'SELECT u.* FROM usuarioconsumo uc  ' +
            ' inner join user u on u.id = uc.id_usuario ' +
            ' where uc.id_consumo = ' + consumo.id
            , [], (tx, results) => {
              for (let i = 0; i < results.rows.length; ++i) {
                let usuario = results.rows.item(i)
                userAux.push(usuario);
              }
              consumo["users"] = userAux
            });
          temp.push(consumo);
        }
        this.setState({
          listaMesa: temp,
        })
      });


    });
  }

  getSugestoes = async () => {
    try {
      const value = await AsyncStorage.getItem('sugestoes')
      if (value !== null) {
        this.setState({ listaSuges: JSON.parse(value) })
      }
    } catch (e) {
    }
  }

  editaSugestao = async (nome, id) => {
    let { listaSuges } = this.state
    let lista = []
    for (let i = 0; i < listaSuges.length; i++) {
      if (listaSuges[i].id == id) {
        lista.push({ id, nome })
      } else {
        lista.push(listaSuges[i])
      }

    }
    this.setState({ listaSuges: lista })
    await AsyncStorage.setItem('sugestoes', JSON.stringify(lista))
  }


  _renderSugestoes = (item) => {
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 8, backgroundColor: 'white', borderRadius: 10 }}>
        <TouchableRipple onLongPress={() => this.setState({ sugestaoDialog: true, nomeSuges: item.item.nome, idSuges: item.item.id })} onPress={() => this.setState({ visible: true, nome: item.item.nome })} style={{ width: width * 0.45, height: height * 0.15 }} >
          <Card.Content style={{ flexDirection: 'column', justifyContent: 'space-around', margin: 10 }}>
            <Text style={{ fontSize: 25 }}>{item.item.nome}</Text>
            <Text>Nova Opção</Text>
          </Card.Content>
        </TouchableRipple>
      </View>
    );
  }

  _renderMesa = (item) => {
    let consumo = item.item
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 6, backgroundColor: 'white', borderRadius: 8 }}>
        <TouchableRipple onPress={() => console.log("detalhes")}>
          <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableRipple style={{ right: ((width * 0.43) / 2), position: 'absolute', width: 40, height: 40, alignItems: 'center' }} onPress={() => { this.setState({ dialogConfirm: true, idDelete: consumo.id }) }}>
              <Icon size={20} style={{ padding: 5 }} color="black" name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />
            </TouchableRipple>
            <View style={{ alignItems: 'flex-start', margin: 10 }}>
              <Text style={{ fontSize: 25 }}>{consumo.nome}</Text>
              <Text style={{ color: '#474747' }}>{consumo.preco}</Text>
              <Text style={{ color: '#474747' }}>{consumo.quantidade}</Text>
              <Text style={{ color: '#474747' }}>{consumo.quantidade * consumo.preco}</Text>
            </View>
            <Button onPress={() => console.log("teste")} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: width * 0.2 }}>
              <Icon style={{ fontSize: 40 }} color="#000000" name={Platform.OS === 'ios' ? "ios-add" : "md-add"} />
            </Button>
          </Card.Content>
        </TouchableRipple>
        <Divider />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <FlatList

            numColumns={3}
            renderItem={(user) => {
              return <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>{user.item.nome}</Text></Chip>
            }}
            ListEmptyComponent={() => <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>...</Text></Chip>}
            data={consumo.users}
          />
        </View>
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





  addItemMesa = async (nome, preco) => {
    const usuarios = this.state.userAux
    //testa se o nome e preço foram passados
    db.transaction(async (tx) => {
      tx.executeSql(
        'INSERT INTO consumo VALUES (?,?,?,?,?)',
        [null, this.state.mesa.id, 1, preco, nome],
        (tx, results) => {
          let idConsumo = results.insertId
          console.log(results)
          if (results.rowsAffected > 0) {
            for (let i = 0; i < usuarios.length; i++) {
              tx.executeSql(
                'INSERT INTO usuarioconsumo VALUES (?,?,?)',
                [null, idConsumo, usuarios[i]],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                  } else {
                  }
                }
              );
            }
            this.setState({
              visible: false,
              nome: "",
              preco: 1,
              userAux: []
            })
            this.getConsumo()
          } else {
            console.warn('Registration Failed');
          }
        }
      );
    });
    this.setState({
      visible: false,
      nome: "",
      preco: 1,
    })
  }

  clearDilaog = () => {
    this.setState({
      visible: false,
      nome: "",
      preco: 0,
      slider: 0
    })
  }

  onSelectedItemsChange = userAux => {
    this.setState({ userAux });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <StatusBar backgroundColor="#f3f0fa" barStyle="dark-content" />
        <View
          style={{
            marginHorizontal: width * 0.02,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>

          <TouchableRipple onPress={() => this.props.navigation.navigate('Mesas')} style={{ padding: 10, flexDirection: 'column', justifyContent: 'center' }}>
            <Icon size={30} color="#424040" name={Platform.OS === 'ios' ? "ios-arrow-dropleft" : "md-arrow-round-back"} />
          </TouchableRipple>
          <Text
            style={{
              color: '#424040',
              fontSize: 23,
              fontWeight: 'bold',
              textShadowOffset: { width: 100, height: 100 },
              alignSelf: 'center',
              marginRight: 10
            }}>
            {this.state.mesa.nome}
          </Text>
        </View>
        <View >
          <ScrollView style={{ backgroundColor: '#f3f0fa', height: height * 0.19, flexDirection: 'row' }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FlatList
              ref={ref => this.flatlist = ref}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.listaSuges}
              renderItem={item => this._renderSugestoes(item)}>
            </FlatList>
            <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 8, backgroundColor: 'white', borderRadius: 10 }}>
              <TouchableRipple style={{ width: width * 0.35, height: height * 0.15 }} >
                <Card.Content style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontFamily: 'LibelSuitRg-Regular', color: '#383838' }}>+</Text>
                  <Text>Nova Opção</Text>
                </Card.Content>
              </TouchableRipple>
            </View>
          </ScrollView>
        </View>

        <Divider />

        <Text style={{ marginHorizontal: 10, color: '#474747' }}>Itens da Mesa</Text>
        <FlatList
          data={this.state.listaMesa}
          renderItem={item => this._renderMesa(item)}
          ListEmptyComponent={this._renderMesaVazia()}
        />
        <Dialog
          visible={this.state.visible}
          width={0.9}
          height={0.5}
          onHardwareBackPress={() => { this.setState({ visible: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <DialogContent style={{ flex: 1, justifyContent: 'space-evenly' }}>
            <Text
              style={{
                color: '#424040',
                fontSize: 25,
                fontWeight: 'bold',
                marginRight: 10
              }}>
              Novo Consumo
            </Text>
            <TextInput
              style={styles.input}
              label='Nome'
              selectionColor='#f3f0fa'
              underlineColor='#f3f0fa'
              value={this.state.nome}
              onChangeText={text => this.setState({ nome: text })}
            />

            <TextInput
              style={styles.input}
              selectionColor='#f3f0fa'
              underlineColor='#f3f0fa'
              keyboardType="numeric"
              render={props =>
                <TextInputMask
                  {...props}
                  type={'money'}
                  ref={(ref) => this.moneyField = ref}
                  options={{
                    precision: 2,
                    separator: '.',
                    delimiter: ',',
                    unit: 'R$',
                    suffixUnit: ''
                  }}
                  value={this.state.preco}
                  onChangeText={text => {
                    this.setState({
                      preco: numeral(text).value(),
                      slider: numeral(text).value()
                    })
                  }}
                />
              }
            />


            <Slider
              sliderWidth={width * 0.8}
              value={this.state.preco > 30 ? 30 : this.state.preco}
              onValueChange={preco => this.setState({ preco: numeral(preco).value(), slider: numeral(preco).value() })}
              step={0.5}
              maximumValue={30}
            />
            <MultiSelect
              hideTags
              items={this.state.usuarios}
              uniqueKey="id"
              ref={(component) => { this.multiSelect = component }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.userAux}
              selectText="Selecione os Usuários"
              searchInputPlaceholderText="Procurar Usuários..."
              onChangeInput={(text) => console.log(text)}
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="nome"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Confirma"
            />
          </DialogContent>
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ visible: false, nome: "", preco: 0, userAux: [] }) }}
            />
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => {
                this.addItemMesa(this.state.nome, this.state.preco)
              }}
            />
          </DialogFooter>
        </Dialog>
        <Dialog
          visible={this.state.sugestaoDialog}
          width={0.8}
          height={0.3}
          onHardwareBackPress={() => { this.setState({ sugestaoDialog: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <DialogContent style={{ flex: 1, justifyContent: 'space-around' }}>
            <Text style={{ marginHorizontal: 10, fontSize: 25 }} >Edita Sugestão</Text>
            <TextInput
              style={styles.input}
              label='Nome'
              selectionColor='#f3f0fa'
              underlineColor='#f3f0fa'
              value={this.state.nomeSuges}
              onChangeText={text => this.setState({ nomeSuges: text })}
            />

          </DialogContent>
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ sugestaoDialog: false, nomeSuges: "", idSuges: 0 }) }}
            />
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => {
                this.editaSugestao(this.state.nomeSuges, this.state.idSuges)
                this.setState({ sugestaoDialog: false, nomeSuges: "", idSuges: 0 })
              }}
            />
          </DialogFooter>
        </Dialog>
        <FAB
          style={styles.fab}
          icon="add"
          color="#fff"
          label="Novo Consumo"
          onPress={() => this.setState({ visible: true })}
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


