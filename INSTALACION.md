# Guía de Instalación - Gestión de Pedidos Pollería

## Requisitos Previos

1. **Node.js** (versión 16 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **npm** o **yarn**
   - Viene incluido con Node.js
   - Verificar: `npm --version`

3. **Expo CLI** (se instalará globalmente)
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go** (aplicación móvil)
   - Android: Descargar desde Google Play Store
   - iOS: Descargar desde App Store

## Instalación del Proyecto

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```
   
   Esto abrirá el Metro Bundler en tu navegador y mostrará un código QR.

## Ejecutar en Android

### Opción 1: Usando Expo Go (Recomendado para desarrollo)

1. Abre la aplicación **Expo Go** en tu dispositivo Android
2. Escanea el código QR que aparece en la terminal o navegador
3. La aplicación se cargará automáticamente

### Opción 2: Usando emulador Android

1. Instala **Android Studio**
2. Configura un emulador Android
3. Ejecuta:
   ```bash
   npm run android
   ```

### Opción 3: Conectado vía USB (modo desarrollador)

1. Habilita el **Modo Desarrollador** en tu dispositivo Android
2. Activa la **Depuración USB**
3. Conecta tu dispositivo por USB
4. Ejecuta:
   ```bash
   npm run android
   ```

## Estructura del Proyecto

```
gestion-pedidos-movil/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   └── ProductoCard.js
│   ├── screens/             # Pantallas principales
│   │   ├── ProductosScreen.js
│   │   ├── CarritoScreen.js
│   │   └── PedidosScreen.js
│   ├── navigation/          # Configuración de navegación
│   │   └── MainNavigator.js
│   └── context/             # Estado global (Context API)
│       └── PedidosContext.js
├── App.js                   # Punto de entrada
├── package.json
├── app.json                 # Configuración de Expo
└── babel.config.js
```

## Comandos Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android (emulador/dispositivo)
- `npm run ios` - Ejecuta en iOS (solo Mac)
- `npm run web` - Ejecuta en navegador web

## Solución de Problemas

### Error: "Failed to resolve the Android SDK path" o "spawn adb ENOENT"

**Solución Rápida (Recomendada):**
- NO uses `npm run android`
- Usa solo `npm start` y escanea el QR con Expo Go
- Ver archivo `SOLUCION_ANDROID_SDK.md` para más detalles

**Si necesitas configurar Android SDK:**
- Ver archivo `SOLUCION_ANDROID_SDK.md` para instrucciones completas
- O instala Android Studio y configura las variables de entorno ANDROID_HOME

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error: "Port already in use"
```bash
# Cambiar el puerto en package.json o cerrar la aplicación que usa el puerto
```

### Error: "Failed to download remote update" en Expo Go

**Este es el error más común. Soluciones:**

1. **Usa el modo túnel:**
   - En la terminal donde está `npm start`, presiona `t`
   - O usa: `npm run start:tunnel`
   - Escanea el nuevo código QR

2. **Limpia el caché:**
   ```bash
   npm run start:clear
   ```

3. **Verifica conexión a Internet** en ambos dispositivos

4. **Limpia el caché de Expo Go** en tu dispositivo Android

**Para más detalles, ver archivo `SOLUCION_ERROR_RED.md`**

### Error al conectar dispositivo Android
- Asegúrate de tener habilitado el modo desarrollador
- Verifica que los drivers USB estén instalados
- Prueba con `adb devices` para verificar la conexión
- Si no tienes SDK configurado, usa Expo Go en su lugar

## Próximos Pasos

1. Personalizar productos en `src/context/PedidosContext.js`
2. Agregar imágenes reales en lugar de emojis
3. Configurar persistencia de datos (ya implementada con AsyncStorage)
4. Agregar autenticación si es necesario
5. Conectar con un backend para sincronización

## Notas

- Los datos se guardan localmente usando AsyncStorage
- Para producción, considera usar Expo Application Services (EAS) para construir el APK
- La aplicación está optimizada para tablets y dispositivos móviles Android

