# 📦 Build de Producción - APK para Android

## 🎯 Objetivo

Generar un archivo APK instalable que puedas distribuir para que otros usuarios instalen la aplicación en sus dispositivos Android.

---

## 📋 Prerrequisitos

### 1. Cuenta de Expo
- Necesitas crear una cuenta gratuita en Expo
- Ve a: https://expo.dev/signup

### 2. Instalar EAS CLI
```bash
npm install -g eas-cli
```

---

## 🚀 Proceso de Build

### Paso 1: Iniciar sesión en EAS

```bash
eas login
```

Ingresa tu email y contraseña de Expo.

---

### Paso 2: Configurar el Proyecto

El archivo `eas.json` ya está configurado con los perfiles necesarios.

---

### Paso 3: Generar el APK de Producción

#### Opción A: APK para Instalación Directa (Recomendado para distribución)

```bash
eas build --platform android --profile production
```

Este comando:
- ✅ Genera un APK firmado
- ✅ Listo para instalar en dispositivos Android
- ✅ Puede tardar 10-20 minutos
- ✅ Se sube a los servidores de Expo

#### Opción B: APK de Preview (Más rápido, para pruebas)

```bash
eas build --platform android --profile preview
```

---

### Paso 4: Descargar el APK

Después de que termine el build:

1. **Ver el progreso:**
   ```bash
   eas build:list
   ```

2. **Descargar el APK:**
   - Ve a: https://expo.dev/accounts/[tu-usuario]/builds
   - O usa el link que aparece en la terminal
   - Descarga el archivo `.apk`

---

## 📱 Instalar el APK en Dispositivos Android

### En el mismo dispositivo:

1. Transfiere el APK al dispositivo (por email, USB, etc.)
2. Abre el archivo APK
3. Si aparece "Instalar desde fuentes desconocidas":
   - Ve a Configuración → Seguridad
   - Activa "Fuentes desconocidas"
4. Toca "Instalar"

### Compartir con otros usuarios:

1. **Opción 1: Compartir el APK directamente**
   - Envía el archivo por email, WhatsApp, Drive, etc.
   - Los usuarios lo descargan e instalan

2. **Opción 2: Subir a Google Play Store** (requiere cuenta de desarrollador - $25 una vez)
   - Necesitas generar un AAB (Android App Bundle)
   - Configurar cuenta de desarrollador
   - Proceso de revisión

3. **Opción 3: Generar un enlace de descarga**
   - Usa servicios como Firebase App Distribution
   - O tu propio servidor web

---

## 🔐 Firmar el APK (Automático)

EAS Build firma automáticamente el APK. Si quieres usar tu propia firma:

### Generar una clave de firma:

```bash
eas credentials
```

Sigue las instrucciones para generar una keystore.

---

## ⚙️ Configuraciones Adicionales

### Cambiar el nombre de la app:

Edita `app.json`:
```json
{
  "expo": {
    "name": "Gestión Pedidos Pollería",
    "slug": "gestion-pedidos-movil"
  }
}
```

### Cambiar el ícono:

1. Crea un ícono de 1024x1024px
2. Guárdalo como `assets/icon.png`
3. Ejecuta: `npx expo prebuild --clean`

### Cambiar la pantalla de inicio (splash):

1. Crea una imagen de 1242x2436px
2. Guárdala como `assets/splash.png`
3. Actualiza `app.json` con las rutas

---

## 📊 Perfiles de Build Disponibles

### Development
- Para desarrollo con Expo Dev Client
- Incluye herramientas de desarrollo

### Preview
- APK para pruebas
- Más rápido de generar
- No optimizado para producción

### Production
- APK optimizado para producción
- Más lento de generar
- Listo para distribución

---

## 🛠️ Comandos Útiles

```bash
# Ver builds anteriores
eas build:list

# Ver detalles de un build
eas build:view [BUILD_ID]

# Cancelar un build en progreso
eas build:cancel [BUILD_ID]

# Ver credenciales
eas credentials

# Actualizar configuración
eas build:configure
```

---

## 📝 Notas Importantes

### Límites de la cuenta gratuita:
- ✅ Builds ilimitados en la nube
- ✅ 30 días de retención de builds
- ❌ Sin distribución automática en Play Store

### Alternativa Gratuita (Build Local):

Si prefieres generar el APK localmente (sin usar EAS):

```bash
# Instalar dependencias
npm install

# Generar proyecto Android nativo
npx expo prebuild

# Build local (requiere Android Studio y SDK configurado)
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🎁 Distribución Fácil

### Usar Firebase App Distribution (Gratis):

1. Crea un proyecto en Firebase
2. Configura App Distribution
3. Sube el APK
4. Invita usuarios por email
5. Ellos reciben un link para instalar

### Usar tu propio servidor:

1. Sube el APK a tu servidor web
2. Comparte el link de descarga
3. Los usuarios descargan e instalan

---

## ✅ Checklist antes de Build

- [ ] Verificar que `app.json` tenga la información correcta
- [ ] Verificar el `package` name (com.polleria.gestionpedidos)
- [ ] Probar la app en Expo Go antes de hacer build
- [ ] Asegurarse de que todos los assets estén en `assets/`
- [ ] Revisar que no haya errores en la consola

---

## 🚨 Solución de Problemas

### Error: "Not authenticated"
```bash
eas login
```

### Error: "Build failed"
- Revisa los logs en https://expo.dev
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que el SDK de Expo esté actualizado

### El APK no instala
- Verifica que esté habilitada la instalación desde fuentes desconocidas
- Asegúrate de que el APK esté completo (no corrupto)
- Verifica que el dispositivo sea compatible (Android 5.0+)

---

## 📞 Próximos Pasos

1. **Ejecuta el build:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Espera a que termine** (10-20 minutos)

3. **Descarga el APK** desde el dashboard de Expo

4. **Distribuye** el APK a tus usuarios

---

¡Listo para generar tu APK de producción! 🎉

