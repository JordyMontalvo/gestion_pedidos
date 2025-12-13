# 🚀 Pasos para Generar el APK

## ⚡ Guía Rápida

### Paso 1: Iniciar Sesión en Expo

Abre tu terminal y ejecuta:

```bash
eas login
```

- Si no tienes cuenta, créala en: https://expo.dev/signup
- Ingresa tu email y contraseña

---

### Paso 2: Generar el APK

Una vez autenticado, ejecuta:

```bash
npm run build:android
```

O directamente:

```bash
eas build --platform android --profile production
```

---

### Paso 3: Esperar (10-20 minutos)

El build se ejecuta en la nube. Verás:
- Progreso en la terminal
- Un link para seguir el progreso en el navegador
- Notificación cuando termine

---

### Paso 4: Descargar el APK

Cuando termine:
- Verás un link en la terminal para descargar
- O ve a: https://expo.dev/accounts/[tu-usuario]/builds
- Descarga el archivo `.apk`

---

## 📱 Instalar el APK

1. **Transfiere el APK** a tu dispositivo Android
2. **Ábrelo** y si aparece "Instalar desde fuentes desconocidas":
   - Configuración → Seguridad → Activar "Fuentes desconocidas"
3. **Toca "Instalar"**
4. **¡Listo!** La app está instalada

---

## 🎯 Compartir el APK

Puedes compartir el APK por:
- ✅ Email
- ✅ WhatsApp
- ✅ Google Drive
- ✅ Cualquier método de transferencia de archivos

**Todos los usuarios que instalen el APK compartirán la misma base de datos Firestore.**

---

## ✅ Checklist antes de Build

- [ ] Firebase configurado correctamente
- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas
- [ ] App funciona en Expo Go
- [ ] Autenticado en EAS (`eas login`)

---

## 🚨 Si tienes problemas

### Error: "Not logged in"
```bash
eas login
```

### Error: "Build failed"
- Revisa los logs en: https://expo.dev
- Verifica que todas las dependencias estén instaladas
- Asegúrate de que `app.json` esté correcto

### El APK no instala
- Verifica que esté habilitada "Instalar desde fuentes desconocidas"
- Asegúrate de que el APK esté completo (no corrupto)
- Verifica que el dispositivo sea compatible (Android 5.0+)

---

## 💡 Tip

El build de **Preview** es más rápido (5-10 min) pero para pruebas.
El build de **Production** tarda más (10-20 min) pero está optimizado.

---

¡Ejecuta los comandos y tendrás tu APK listo para distribuir! 🎉


