import React from 'react'
import { View, ActivityIndicator, StatusBar,StyleSheet} from 'react-native'

export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    _bootstrapAsync = async () => {
        this.props.navigation.navigate('App');
    };
  
    render() {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    inputBox: {
      width: 300,
    },
    inputBoxPass: {
      width: 270,
    },
    BoxPass: {
      width: 300,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconInput: {
      width: 30,
    },
    button: {
      width: 300,
      borderRadius: 2,
      marginVertical: 10,
      paddingVertical: 10,
      elevation: 3
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#ffffff',
      textAlign: 'center'
    },
    logoText: {
      marginVertical: 15,
      fontSize: 18,
      color: '#666'
    }
  })