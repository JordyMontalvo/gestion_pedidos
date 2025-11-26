# Solución: Error "Failed to download remote update"

Este error ocurre cuando Expo Go no puede conectarse al servidor de desarrollo. Sigue estos pasos en orden:

## 🔧 Soluciones Rápidas

### 1. **Verificar que el servidor esté corriendo**
Asegúrate de que el servidor de desarrollo esté activo:
```bash
npm start
```
Deberías ver un código QR en la terminal.

### 2. **Usar el modo Túnel (RECOMENDADO si están en redes diferentes)**

En la terminal donde está corriendo `npm start`:
- Presiona `t` para habilitar el modo túnel
- Espera a que se inicie (puede tardar unos segundos)
- Escanea el nuevo código QR que aparece

El modo túnel funciona incluso si tu teléfono y computadora están en redes WiFi diferentes.

### 3. **Verificar conexión a Internet**
- Tu computadora debe tener conexión a Internet
- Tu dispositivo Android debe tener conexión a Internet (WiFi o datos móviles)
- Ambos deben poder acceder a Internet

### 4. **Limpiar caché de Expo Go**

**En tu dispositivo Android:**
1. Abre la aplicación **Configuración** (Settings)
2. Ve a **Aplicaciones** > **Expo Go**
3. Toca **Almacenamiento**
4. Toca **Borrar caché**
5. Toca **Borrar datos** (opcional, pero recomendado)
6. Vuelve a abrir Expo Go e intenta de nuevo

### 5. **Reiniciar el servidor de desarrollo**

En la terminal:
1. Presiona `Ctrl + C` para detener el servidor
2. Limpia el caché:
   ```bash
   npx expo start -c
   ```
   El flag `-c` limpia el caché de Metro Bundler

### 6. **Verificar que estén en la misma red WiFi (si NO usas túnel)**

Si estás usando LAN (no túnel):
- Tu computadora y tu dispositivo Android deben estar en la **misma red WiFi**
- Algunas redes corporativas o públicas bloquean la comunicación entre dispositivos
- Si estás en una red pública/hotel, usa el modo túnel

### 7. **Verificar el firewall**

**En macOS:**
1. Abre **Preferencias del Sistema** > **Seguridad y Privacidad** > **Firewall**
2. Si el firewall está activado, asegúrate de permitir Node.js o Terminal
3. O temporalmente desactiva el firewall para probar

### 8. **Verificar la IP en Expo Go**

Si usas LAN:
1. En la terminal de `npm start`, deberías ver una dirección IP (ej: `exp://192.168.1.5:8081`)
2. En Expo Go, en lugar de escanear el QR, puedes:
   - Tocar "Enter URL manually"
   - Ingresar la URL que aparece en la terminal (ej: `exp://192.168.1.5:8081`)

### 9. **Reinstalar Expo Go**

Si nada funciona:
1. Desinstala Expo Go de tu dispositivo
2. Reinicia tu dispositivo Android
3. Vuelve a instalar Expo Go desde Google Play Store
4. Intenta de nuevo

### 10. **Usar USB (si tienes Android SDK configurado)**

Si tienes Android SDK configurado:
1. Conecta tu dispositivo por USB
2. Habilita "Depuración USB" en el modo desarrollador
3. En la terminal, presiona `a` para abrir en Android
4. Esto evita problemas de red

## ✅ Checklist de Verificación

Antes de pedir ayuda, verifica:

- [ ] El servidor `npm start` está corriendo
- [ ] Puedes ver el código QR en la terminal/navegador
- [ ] Tu dispositivo tiene conexión a Internet
- [ ] Tu computadora tiene conexión a Internet
- [ ] Has probado el modo túnel (presionar `t`)
- [ ] Has limpiado el caché de Expo Go
- [ ] Has reiniciado el servidor con `npx expo start -c`
- [ ] Estás usando la última versión de Expo Go

## 🆘 Si nada funciona

1. **Prueba en otro dispositivo Android** para descartar problemas del dispositivo
2. **Prueba usando el navegador web** primero:
   ```bash
   npm run web
   ```
   Esto verifica que la aplicación funciona correctamente
3. **Verifica los logs** en la terminal para ver errores específicos
4. **Crea un proyecto nuevo de prueba**:
   ```bash
   npx create-expo-app test-app
   cd test-app
   npm start
   ```
   Si esto funciona, el problema puede ser específico del proyecto

## 💡 Tip Final

**Para evitar este problema en el futuro:**
- Siempre usa el modo **túnel** cuando no estés seguro de la red
- El modo túnel es más lento pero más confiable
- El modo LAN es más rápido pero requiere la misma red WiFi

