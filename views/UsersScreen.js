import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, PanResponder } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';




class UserScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      lista: [],
      listasug: ["teste1", "teste2"]
    }
    this.panelY = 0;
    this.scrollY = 0;
    this.mainPosition = new Animated.ValueXY();
    this.mainPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null, { dx: this.mainPosition.x, dy: this.mainPosition.y }
      ]),
      onPanResponderGrant: (event, gesture) => {
        this.mainPosition.setOffset({
          x: this.mainPosition.x._value,
          y: this.mainPosition.y._value
        });
        this.mainPosition.setValue({ x: 0, y: 0 });
      },
      onPanResponderRelease: (e, gesture) => {
        this.mainPosition.flattenOffset();
        if (gesture.dy < -150) {
          const y = gesture.dy + this.panelY + this.scrollY;
          //this.addCard(y)
          let lista = this.state.lista
          lista.push("teste")
          this.setState({ lista })
          console.log(this.state.lista.length)
        }
        this.mainPosition.setValue({ x: 0, y: 0 });
      }
    });
  }



  addCard = (y) => {
    const { cards } = this.state;
    const newStack = [...cards];
    const style = { ...styles.dropCard };
    style.top = y;

    const card = (
      <View
        key={y}
        style={style}>
        <Text>Sample</Text>
      </View>
    )

    newStack.push(card);
    this.setState({ cards: newStack })
  }

  handleScroll = (event) => {
    this.scrollY = event.nativeEvent.contentOffset.y
  }

  handleOnLayout = (event) => {
    let { y } = event.nativeEvent.layout
    this.panelY = y + 25
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.lista}
          renderItem={item => <Text>teste</Text>}
        />
        <View style={styles.panel}
        >
          
          <View style={{ flexDirection: 'row' }}>

            {this.state.listasug.map(item => {
              return <Animated.View
                {...this.mainPanResponder.panHandlers}
                style={{ ...styles.panelCard, ...this.mainPosition.getLayout() }}>
                <Text>Sample</Text>
              </Animated.View>
            })

            }
          </View>
        </View>
      </View>
    )
  }
}


const styles = {
  cardContainer: {
    minHeight: 1000,
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  panel: {
    position: 'absolute',
    backgroundColor: '#bdbdbd',
    flex: 1,
    maxHeight: 200,
    height: 200,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  panelCard: {
    backgroundColor: '#fff',
    elevation: 2,
    height: 150,
    maxHeight: 150,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropCard: {
    backgroundColor: '#fff',
    height: 150,
    maxHeight: 150,
    elevation: 2,
    borderRadius: 10,
    position: 'absolute',
    left: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default UserScreen;