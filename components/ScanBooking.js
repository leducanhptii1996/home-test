import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const ScanBooking = ({ navigation }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [url, setUrl] = useState(null);

  // Handle QR code scanning
  const handleBarCodeScanned = ({ data }) => {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      setUrl(data);
    } else {
      Alert.alert(
        'Invalid QR Code',
      );
    }
  };
  if (!permission) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      {url ? (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Ionicons
              name="chevron-back-outline"
              size={28}
              color="blue"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Book a Room</Text>
          </View>
          <WebView
            source={{
              uri: url,
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}>
            <Text style={styles.text}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          onBarcodeScanned={handleBarCodeScanned}>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  camera: {
    flex: 1
  },
  button: {
    backgroundColor: '#507add',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 46,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'center',
  },
});

export default ScanBooking;
