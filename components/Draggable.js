import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Animated,
    Text
} from 'react-native';


export default class Draggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1)
        };
    }

    componentWillMount() {
        this._val = { x: 0, y: 0 }
        this.state.pan.addListener((value) => this._val = value);
        
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y
                })
                this.state.pan.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropArea(gesture)) {
                    Animated.timing(this.state.opacity, {
                        toValue: 0,
                        duration: 1000
                    }).start(() =>
                        this.setState({
                            showDraggable: false
                        })
                    );
                } else {
                    Animated.spring(this.state.pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5
                    }).start();
                }
            }
        });
    }

    isDropArea(gesture) {
        return gesture.moveY < 200;
    }

    render() {
        return (
            <View style={{ width: "20%", alignItems: "center" }}>
                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        }
        if (this.state.showDraggable) {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[panStyle, styles.circle, { opacity: this.state.opacity }]}
                    >
                        <Text>{this.props.texto}</Text>
                    </Animated.View>
                </View>
            );
        }
    }
}

let CIRCLE_RADIUS = 30;
let styles = StyleSheet.create({
    circle: {
        padding: 10,
        backgroundColor: "skyblue",
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2
    }
});

