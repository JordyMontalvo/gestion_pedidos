# ⚡ Guía Rápida: Generar APK para Producción

## 🚀 Pasos Rápidos

### 1. Iniciar sesión en Expo
```bash
eas login
```
(Si no tienes cuenta, créala en https://expo.dev/signup)

### 2. Generar el APK
```bash
npm run build:android
```

O manualmente:
```bash
eas build --platform android --profile production
```

### 3. Esperar (10-20 minutos)
El build se ejecuta en la nube de Expo.

### 4. Descargar el APK
- Revisa la terminal para el link
- O ve a: https://expo.dev/accounts/[tu-usuario]/builds
- Descarga el archivo `.apk`

### 5. Distribuir
- Envía el APK por email, WhatsApp, Drive, etc.
- Los usuarios lo instalan en sus dispositivos Android

---

## 📱 Instalar el APK

1. Transfiere el APK al dispositivo Android
2. Abre el archivo
3. Si aparece "Instalar desde fuentes desconocidas":
   - Configuración → Seguridad → Activar "Fuentes desconocidas"
4. Toca "Instalar"

---

## ✅ Listo!

El APK está listo para ser instalado en cualquier dispositivo Android 5.0 o superior.

---

Para más detalles, ver `BUILD_PRODUCCION.md`


