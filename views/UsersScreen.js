import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Camera from '../components/Camera'
import CardSwiper from '../components/CardSwiper'
import { Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
const { height, width } = Dimensions.get('window');

class UserScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      camvisible: false,
      dialogNovoUsuario: false
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f3f0fa' }}>
        <Button width={200} height={30} style={{ alignSelf: 'center' }} onPress={() => this.setState({ dialogNovoUsuario: true })}>
          <Text>Abrir Dialog</Text>
        </Button>
        <Dialog
          visible={this.state.dialogNovoUsuario}
          width={0.9}
          height={0.4}
          onHardwareBackPress={() => { this.setState({ visible: false }) }}
          dialogAnimation={new ScaleAnimation()}>
          <CardSwiper height={height / 3.75} index={1} key={1} />
          <DialogFooter>
            <DialogButton
              text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} />}
              onPress={() => { this.setState({ dialogNovoUsuario: false }) }}
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

export default UserScreen;