# 📦 Generar APK - Pasos Rápidos

## 🚀 Pasos para Generar el APK

### Paso 1: Iniciar Sesión en Expo

```bash
eas login
```

Si no tienes cuenta, créala en: https://expo.dev/signup

---

### Paso 2: Generar el APK

```bash
npm run build:android
```

O directamente:
```bash
eas build --platform android --profile production
```

---

### Paso 3: Esperar (10-20 minutos)

El build se ejecuta en la nube. Verás el progreso en la terminal.

---

### Paso 4: Descargar el APK

Cuando termine, verás un link para descargar el APK:
- Haz clic en el link
- O ve a: https://expo.dev/accounts/[tu-usuario]/builds
- Descarga el archivo `.apk`

---

## 📱 Instalar el APK

1. Transfiere el APK al dispositivo Android
2. Ábrelo y permite "Instalar desde fuentes desconocidas" si es necesario
3. Instala la app
4. ¡Listo!

---

## ✅ Listo para Distribuir

El APK está listo para:
- Compartir por email, WhatsApp, Drive, etc.
- Instalar en múltiples dispositivos
- Todos compartirán la misma base de datos Firestore

---

¡Ejecuta `eas login` y luego `npm run build:android`! 🚀

