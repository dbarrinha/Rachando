import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, ImageBackground, ScrollView, View, CameraRoll, PermissionsAndroid } from "react-native";
import { RNCamera } from "react-native-camera";
import Icon from "react-native-vector-icons/FontAwesome";

export default Camera = ( props ) => {
    const [imageUri, setImageUri] = useState(null);
    
    takePicture = async () => {
        try {
            if (this.camera) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    forceUpOrientation: true,
                    fixOrientation: true
                };
                const { uri } = await this.camera.takePictureAsync(options);
                setImageUri(uri);
            }
        } catch (err) {
            alert(err.message);
        }
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
                props.close()
            } else {
                console.log("Permissao de camera negada.");
            }
        } catch (err) {
            console.warn(err);
        }

        setImageUri(null);
    }

    return (
        
        imageUri ?
            <ImageBackground style={styles.preview} source={{ uri: imageUri }}>
                <ScrollView></ScrollView>
                <View style={styles.buttonsPreview}>
                    <Icon name="times" size={25} color="#fff" onPress={() => setImageUri(null)} />
                    <Icon name="check" size={25} color="#fff" onPress={() => submitPicture()} />
                </View>
            </ImageBackground>
            :
            <RNCamera
                ref={camera => { this.camera = camera; }}
                style={styles.camera}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
            >
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Text>PICTURE</Text>
                </TouchableOpacity>
            </RNCamera>
    )
}
const styles = StyleSheet.create({
    camera: {
        flex: 1
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
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});