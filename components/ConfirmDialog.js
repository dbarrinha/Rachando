import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import { View } from 'react-native';
import { Title, Text } from 'react-native-paper'
import Dialog, { DialogFooter, DialogButton, DialogContent, ScaleAnimation } from 'react-native-popup-dialog';

export default class ConfirmDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <Dialog
                visible={this.props.visible}
                width={0.7}
                height={0.3}
                dialogAnimation={new ScaleAnimation()}>
                <View style={{ flex: 1 , padding: 20}}>
                    <Title style={{fontSize: 25}}>Confirmar Ação?</Title>
                    <Text style={{fontSize: 20}}>{this.props.texto}</Text>
                </View>
                <DialogFooter>
                    <DialogButton
                        text={<Icon size={30} name={Platform.OS === 'ios' ? "ios-close" : "md-close"} > </Icon>}
                        onPress={() => {
                            this.props.cancel()
                        }}
                    />
                    <DialogButton
                        text={<Icon size={30} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"}></Icon>}
                        onPress={() => {
                            this.props.confirma()
                        }}
                    />
                </DialogFooter>
            </Dialog>
        );
    }
}
