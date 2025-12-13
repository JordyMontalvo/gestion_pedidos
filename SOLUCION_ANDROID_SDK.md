# Solución: Error Android SDK

## ⚡ Solución Rápida (Recomendada) - Usar Expo Go

Esta es la forma más fácil y NO requiere configurar Android SDK:

### Pasos:

1. **Descarga Expo Go** en tu dispositivo Android:
   - Desde Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```
   
   ⚠️ **NO uses** `npm run android`, solo usa `npm start`

3. **Escanear el código QR:**
   - En la terminal verás un código QR
   - Abre Expo Go en tu dispositivo Android
   - Escanea el código QR
   - La app se cargará automáticamente

4. **O usar el túnel:**
   - Presiona `s` en la terminal para abrir en simulador
   - Presiona `a` para Android (si tienes SDK configurado)
   - Presiona `t` para habilitar el túnel (útil si no estás en la misma red WiFi)

---

## 🔧 Configurar Android SDK (Si quieres usar emulador o USB)

Si realmente necesitas usar un emulador o dispositivo conectado por USB, sigue estos pasos:

### Opción A: Instalar Android Studio (Recomendado)

1. **Descargar Android Studio:**
   - https://developer.android.com/studio
   - Instala la versión completa

2. **Configurar el SDK:**
   - Abre Android Studio
   - Ve a: `Preferences > Appearance & Behavior > System Settings > Android SDK`
   - En "SDK Platforms", instala al menos Android 11.0 (API 30) o superior
   - En "SDK Tools", asegúrate de instalar:
     - Android SDK Platform-Tools
     - Android SDK Build-Tools
     - Android Emulator

3. **Configurar variables de entorno en macOS:**

   Edita tu archivo `~/.zshrc` (o `~/.bash_profile` si usas bash):
   
   ```bash
   nano ~/.zshrc
   ```
   
   Agrega estas líneas (ajusta la ruta si instalaste Android Studio en otro lugar):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

4. **Aplicar los cambios:**
   ```bash
   source ~/.zshrc
   ```

5. **Verificar la instalación:**
   ```bash
   echo $ANDROID_HOME
   adb version
   ```

6. **Crear un emulador (opcional):**
   - Abre Android Studio
   - Ve a: `Tools > Device Manager`
   - Crea un nuevo dispositivo virtual

### Opción B: Instalar solo Command Line Tools (Más ligero)

1. **Descargar Android Command Line Tools:**
   ```bash
   cd ~/Library/Android/sdk
   mkdir -p cmdline-tools
   cd cmdline-tools
   # Descargar desde: https://developer.android.com/studio#command-tools
   # Extraer aquí como cmdline-tools/latest/
   ```

2. **Configurar variables de entorno** (igual que Opción A, paso 3-4)

3. **Instalar componentes:**
   ```bash
   sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3" "emulator"
   ```

---

## ✅ Verificar que todo funciona

Después de configurar, prueba:

```bash
# Verificar ADB
adb devices

# Iniciar proyecto
npm start

# En otra terminal, intentar Android
npm run android
```

---

## 💡 Recomendación

Para desarrollo rápido, **usa Expo Go** (`npm start` + escanear QR). Es más rápido y no requiere configuración adicional.

Solo necesitas configurar Android SDK si:
- Quieres usar un emulador específico
- Necesitas depurar con Chrome DevTools
- Vas a hacer builds de producción


