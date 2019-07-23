import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, ImageBackground, ScrollView, View, CameraRoll, PermissionsAndroid } from "react-native";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/Ionicons";

export default Camera = (props) => {
    const [imageUri, setImageUri] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [flash, setFlash] = useState(false);
    const [position, setPosition] = useState(false);

    takePicture = async () => {
        try {
            if (this.camera) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    forceUpOrientation: true,
                    fixOrientation: true
                };
                const { base64, uri } = await this.camera.takePictureAsync(options);

                setImageUri(uri);
                setImageBase64(base64);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    changeFlash = async () => {
        setFlash(!flash)
    }

    changePosition = async () => {
        setPosition(!position)
    }

    submitPicture = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
            )
            console.log(granted["android.permission.WRITE_EXTERNAL_STORAGE"])
            if (granted["android.permission.WRITE_EXTERNAL_STORAGE"] == "granted") {
                console.log("Foto salva.");
                await CameraRoll.saveToCameraRoll(imageUri);
                props.takepic(imageBase64)
            } else {
                console.log("Permissao de camera negada.");
            }
        } catch (err) {
            console.warn(err);
        }

        setImageUri(null);
    }

    console.log(position)
    return (
        imageUri ?
            <ImageBackground style={styles.preview} source={{ uri: imageUri }}>
                <ScrollView></ScrollView>
                <View style={styles.buttonsPreview}>
                    <Icon name={Platform.OS === 'ios' ? "ios-close" : "md-close"} size={25} color="#fff" onPress={() => setImageUri(null)} />
                    <Icon size={25} color="#fff" onPress={() => submitPicture()} name={!Platform.OS === 'ios' ? "ios-checkmark" : "md-checkmark"} />
                </View>
            </ImageBackground>
            :
            <RNCamera
                ref={camera => { this.camera = camera; }}
                style={styles.camera}
                type={position? RNCamera.Constants.Type.back:RNCamera.Constants.Type.front}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={flash? RNCamera.Constants.FlashMode.off:RNCamera.Constants.FlashMode.on}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity onPress={changePosition} style={styles.capture}>
                        <Icon name={Platform.OS === 'ios' ? "ios-reverse-camera" : "md-reverse-camera"} size={35} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Icon name={Platform.OS === 'ios' ? "ios-camera" : "md-camera"} size={45} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={changeFlash} style={styles.capture}>
                        {flash ?
                            <Icon name={Platform.OS === 'ios' ? "ios-flash" : "md-flash"} size={35} color="#fff" />
                            :
                            <Icon name={Platform.OS === 'ios' ? "ios-flash-off" : "md-flash-off"} size={35} color="#fff" />
                        }
                    </TouchableOpacity>
                </View>
            </RNCamera>
    )
}
const styles = StyleSheet.create({
    camera: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    button: {
        alignSelf: "center",
        backgroundColor: "blue",
        color: "#fff"
    },
    preview: {
        width: "100%",
        height: "100%",
        flex: 1
    },
    buttonsPreview: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 30
    },
    capture: {
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});