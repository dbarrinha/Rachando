import React, { Component } from 'react';
import { View } from 'react-native';


export default class CardCustom extends Component {
    render() {
        return (
            <View style={{ marginHorizontal: 5, marginVertical: 10, elevation: 6, backgroundColor: 'white', borderRadius: 4 }}>
                <View style={{ width: width * 0.45, height: height * 0.15 }}>
                    <Card.Content style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 40, fontFamily: 'LibelSuitRg-Regular' }}>+</Text>
                        <Text>Nova Opção</Text>
                    </Card.Content>
                </View>
            </View>);
    }
}
