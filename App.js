import React from 'react'
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-community/async-storage';
///VIEWS
import home from './views/HomeScreen'
import users from './views/UsersScreen'
import mesas from './views/MesasScreen'
import ContaScreen from './views/ContaScreen'

///DB
import { initDB } from './dao/InitDB'


class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    initDB()
    try {
      const value = await AsyncStorage.getItem('sugestoes')
      if (value === null) {
        await AsyncStorage.setItem('sugestoes', JSON.stringify([{ id: 1, nome: "Cerveja" }, { id: 2, nome: "Batata Frita" }, { id: 3, nome: "Suco" }]))
      }
    } catch (e) {
    }
    const mesa_ativa = await AsyncStorage.getItem('mesaativa')
    if (mesa_ativa === null) {
      this.props.navigation.navigate('Mesas');
    } else {
      this.props.navigation.navigate('App', {
        mesa: JSON.parse(mesa_ativa)
      })
    }

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

const HomeStack = createStackNavigator({
  Home: home,
  Conta: ContaScreen
});
HomeStack.navigationOptions = {
  tabBarLabel: "Mesa",
  tabBarIcon: ({ focused }) => (
    <Icon
      style={{ marginBottom: -3, elevation: 10 }}
      name={
        Platform.OS === 'ios'
          ? `ios-beer`
          : 'md-beer'
      } size={focused ? 25 : 18} color={"#2f95dc"} />
  ),
};

const UserStack = createStackNavigator({
  User: users,
});
UserStack.navigationOptions = {
  tabBarLabel: 'Usuários',
  tabBarIcon: ({ focused }) => (
    <Icon
      style={{ marginBottom: -3 }}
      name={
        Platform.OS === 'ios'
          ? `ios-contacts`
          : 'md-contacts'
      } size={focused ? 25 : 18} color={"#2f95dc"} />
  ),
};

const TabNavigator = createMaterialBottomTabNavigator({
  HomeStack,
  UserStack,
}, {
    activeColor: '#3e2465',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#f3f0fa' },
  });



const AppNavigation = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Mesas: mesas,
    App: TabNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default AppNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  }
})



