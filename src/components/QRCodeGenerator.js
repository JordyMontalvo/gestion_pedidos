// Componente para generar QR Code del menú
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const QRCodeGenerator = ({ url, size = 200 }) => {
  const qrRef = React.useRef();

  const saveQRCode = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para guardar la imagen');
        return;
      }

      qrRef.current?.toDataURL((data) => {
        const fileUri = FileSystem.cacheDirectory + `qrcode_${Date.now()}.png`;
        FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        }).then(() => {
          MediaLibrary.saveToLibraryAsync(fileUri).then(() => {
            alert('QR Code guardado en la galería');
          });
        });
      });
    } catch (error) {
      console.error('Error al guardar QR Code:', error);
      alert('Error al guardar el QR Code');
    }
  };

  const shareQRCode = async () => {
    try {
      qrRef.current?.toDataURL(async (data) => {
        const fileUri = FileSystem.cacheDirectory + `qrcode_${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        await Share.share({
          url: fileUri,
          type: 'image/png',
        });
      });
    } catch (error) {
      console.error('Error al compartir QR Code:', error);
    }
  };

  if (!url) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay URL para generar el QR Code</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode
          value={url}
          size={size}
          backgroundColor="white"
          color="black"
          getRef={(ref) => (qrRef.current = ref)}
        />
      </View>
      
      <Text style={styles.urlText}>{url}</Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={saveQRCode}>
          <Ionicons name="download-outline" size={20} color="#FF6B00" />
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={shareQRCode}>
          <Ionicons name="share-outline" size={20} color="#FF6B00" />
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
  },
  urlText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
  },
});

export default QRCodeGenerator;

