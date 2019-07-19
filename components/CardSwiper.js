import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';


const DEVICE_WIDTH = Dimensions.get('window').width;
const CARD_GUTTER_VERTICAL = 13;
const CARD_GUTTER_HORIZONTAL = 12;
const CARD_WIDTH = (DEVICE_WIDTH * 0.9);
const SCROLL_INTERVAL = CARD_WIDTH + CARD_GUTTER_HORIZONTAL;

export default class CardSwiper extends React.Component {
    
    scrollValue = new Animated.Value(0)
    onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: this.scrollValue } } }],
        { useNativeDriver: true }
    )

    elevate = () => {
        return {
            zIndex: this.scrollValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2],
                extrapolate: 'clamp'
            })
        };
    }

    fadeIn = () => {
        const FULL_OPACITY = 1;

        return {
            opacity: this.scrollValue.interpolate({
                inputRange: [
                    0,
                    SCROLL_INTERVAL,
                ],
                outputRange: [0, FULL_OPACITY],
                extrapolate: 'clamp'
            })
        };
    }

    verticallyAlignComment = () => {
        const ACTIVE_POSITION = -this.props.index * (this.props.height + CARD_GUTTER_VERTICAL)

        return {
            transform: [{
                translateY: this.scrollValue.interpolate({
                    inputRange: [
                        0,
                        SCROLL_INTERVAL,
                    ],
                    outputRange: [0, ACTIVE_POSITION],
                    extrapolate: 'clamp'
                }),
            }],
        };
    }

    render() {
        return (
            <Animated.View style={[styles.container, {height: this.props.height}]}>

                {/* This is our overlay component that fades in to cover up the other inactive posts */}
                <Animated.View style={[styles.overlay, this.fadeIn()]} pointerEvents="none" />

                <Animated.ScrollView
                  horizontal
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.contentContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={SCROLL_INTERVAL}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  onScroll={this.onScroll}>

                    {/* This is our main title card */}
                    <View style={[styles.card, {marginRight: 0}]}>
                        
                        <Text onPress={()=> this.scroll.scrollToEnd()} style={styles.text}>inicial</Text>
                        
                    </View>

                    {/* And this is our one and only comment */}
                    <Animated.View style={[styles.card, { backgroundColor: 'red'}]}>
                        <Text style={styles.text}>comentario</Text>
                    </Animated.View>

                </Animated.ScrollView>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContainer: {
        overflow: 'visible'
    },

    contentContainer: {
        backgroundColor: 'yellow',
    },

    overlay: {
        opacity: 0,
        backgroundColor: '#fff',
        position: 'absolute',
        width: DEVICE_WIDTH,
        height: 99999,
        top: -99999/2,
        left: 0,
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: '#eee',
        overflow: 'hidden',
        flex: 0
    },

    image: {
        resizeMode: 'cover',
        backgroundColor: '#ddd'
    },

    text: {
        marginVertical: 12,
        marginHorizontal: 16,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600'
    }
});