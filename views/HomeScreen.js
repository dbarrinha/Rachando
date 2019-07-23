import React, { Component } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Divider, Card, TextInput, TouchableRipple, Chip, Button, Title } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
import TextInputMask from 'react-native-text-input-mask';
import Slider from 'react-native-simple-slider'
import AsyncStorage from '@react-native-community/async-storage';
import NumberFormat from 'react-number-format';
//DB
import Users from '../dao/Users'

const { height, width } = Dimensions.get('window');
export default class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      listaSuges: [],
      listaMesa: ["0000"],
      itemAux: '',
      visible: false,
      visibleDetails: false,
      nome: '',
      preco: 0,
      nomeSuges: "",
      idSuges: 0,
      sugestaoDialog: false
    }
  }

  componentDidMount = async () => {
    this.getSugestoes()
  }

  getSugestoes = async () => {
    try {
      const value = await AsyncStorage.getItem('sugestoes')
      console.log(value)
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
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 6, backgroundColor: 'white', borderRadius: 8 }}>
        <TouchableRipple onPress={() => console.log("detalhes")}>
          <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'flex-start', margin: 10 }}>
              <Text style={{ fontSize: 25 }}>{item.item}</Text>
              <Text style={{ color: '#474747' }}>0000</Text>
              <Text style={{ color: '#474747' }}>0000</Text>
            </View>
            <Button onPress={() => console.log("teste")} style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: width * 0.2 }}>
              <Icon style={{ fontSize: 40 }} color="#000000" name={Platform.OS === 'ios' ? "ios-add" : "md-add"} />
            </Button>
          </Card.Content>
        </TouchableRipple>
        <Divider />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Danilo barrinha</Text></Chip>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Giberson</Text></Chip>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Renato</Text></Chip>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Fulano</Text></Chip>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Cicrano</Text></Chip>
          <Chip style={{ margin: 5 }}><Text style={{ fontSize: 12 }}>Beltrano</Text></Chip>
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

  addItemMesa = (item) => {
    let lista = this.state.listaMesa
    lista.push(item)
    this.setState({
      listaMesa: lista,
      visible: false,
      nome: "",
      preco: 0
    })
  }

  clearDilaog = () => {
    this.setState({
      visible: false,
      nome: "",
      preco: 0
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <View >
          <ScrollView style={{ backgroundColor: '#f3f0fa', height: height * 0.19, flexDirection: 'row' }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.listaSuges}
              renderItem={item => this._renderSugestoes(item)}>
            </FlatList>
            <View style={{ marginHorizontal: 10, marginVertical: 10, elevation: 8, backgroundColor: 'white', borderRadius: 10 }}>
              <TouchableRipple onPress={() => this.setState({ visible: true })} style={{ width: width * 0.35, height: height * 0.15 }} >
                <Card.Content style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40, fontFamily: 'LibelSuitRg-Regular', color: '#383838' }}>+</Text>
                  <Text>Nova Opção</Text>
                </Card.Content>
              </TouchableRipple>
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
        <Dialog
          visible={this.state.visible}
          width={0.9}
          height={0.4}
          onHardwareBackPress={() => { this.setState({ visible: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <DialogContent style={{ flex: 1, justifyContent: 'space-around' }}>
            <Text style={{ marginHorizontal: 10, fontSize: 25 }} ></Text>
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
              label='Preço'
              selectionColor='#f3f0fa'
              underlineColor='#f3f0fa'
              value={this.state.preco + ""}
              render={props =>
                <TextInputMask
                  {...props}
                  onChangeText={(formatted, extracted) => {
                    console.log(formatted)
                    console.log(extracted)
                    this.setState({ preco: +extracted })
                  }}
                  mask="$[999990].[99]"
                />
              }
            />
            <Slider
              sliderWidth={width * 0.8}
              value={+this.state.preco}
              onValueChange={preco => this.setState({ preco: +preco })}
              disabledHoverEffect={false}
              step={0.1}
              maximumValue={30}
            />
          </DialogContent>
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ visible: false, nome: "", preco: 0 }) }}
            />
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />}
              onPress={() => { this.addItemMesa(this.state.nome) }}
            />
          </DialogFooter>
        </Dialog>
        <Dialog
          visible={this.state.sugestaoDialog}
          width={0.9}
          height={0.4}
          onHardwareBackPress={() => { this.setState({ sugestaoDialog: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <DialogContent style={{ flex: 1, justifyContent: 'space-around' }}>
            <Text style={{ marginHorizontal: 10, fontSize: 25 }} ></Text>
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
      </View>
    );
  }


}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white'
  },
}); 
