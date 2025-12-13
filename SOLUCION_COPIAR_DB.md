# 🔧 Solución: Error al Copiar Base de Datos

## ❌ Error: "no devices/emulators found"

Este error significa que no hay dispositivos Android conectados o el emulador no está corriendo.

---

## ✅ Soluciones

### Opción 1: Conectar un Dispositivo Físico

1. **Habilita el Modo Desarrollador:**
   - Ve a Configuración → Acerca del teléfono
   - Toca 7 veces en "Número de compilación"
   - Aparecerá "Eres un desarrollador"

2. **Habilita Depuración USB:**
   - Ve a Configuración → Opciones de desarrollador
   - Activa "Depuración USB"

3. **Conecta por USB:**
   - Conecta tu dispositivo Android a la computadora
   - Acepta el diálogo de "Permitir depuración USB" en el teléfono

4. **Verifica la conexión:**
   ```bash
   adb devices
   ```
   Deberías ver tu dispositivo listado.

5. **Ejecuta el script:**
   ```bash
   ./copiar_db.sh
   ```

---

### Opción 2: Usar un Emulador Android

1. **Abre Android Studio**

2. **Inicia un emulador:**
   - Ve a Tools → Device Manager
   - Inicia un dispositivo virtual

3. **Verifica la conexión:**
   ```bash
   adb devices
   ```
   Deberías ver el emulador listado.

4. **Ejecuta el script:**
   ```bash
   ./copiar_db.sh
   ```

---

### Opción 3: Si Estás Usando Expo Go

Si estás usando **Expo Go**, la base de datos puede estar en una ubicación diferente o puede que no sea accesible directamente.

**Alternativas:**

1. **Ver datos desde la app:**
   - Puedo crear una pantalla de debug dentro de la app
   - Verás los datos directamente en la aplicación

2. **Usar logs:**
   - Agregar código temporal para imprimir datos en la consola
   - Ver los logs en Expo Dev Tools

3. **Exportar datos:**
   - Crear una función de exportación dentro de la app
   - Exportar a JSON o CSV

---

### Opción 4: Script Mejorado con Mejor Manejo de Errores

Puedo mejorar el script para que:
- Detecte automáticamente si hay dispositivos
- Muestre instrucciones más claras
- Ofrezca alternativas si no hay dispositivos

---

## 🔍 Verificar Estado Actual

Ejecuta estos comandos para diagnosticar:

```bash
# Ver dispositivos conectados
adb devices

# Ver información del dispositivo (si está conectado)
adb shell getprop ro.product.model

# Ver si la app está instalada
adb shell pm list packages | grep polleria
```

---

## 💡 Recomendación

**Si estás usando Expo Go para desarrollo:**

La forma más fácil es crear una **pantalla de administración** dentro de la app donde puedas:
- Ver todos los datos de la base de datos
- Exportar datos a JSON
- Ver estadísticas
- Gestionar productos y pedidos

¿Te gustaría que cree esta pantalla de administración?

---

## 🚀 Próximos Pasos

1. **Conecta un dispositivo o emulador**
2. **Ejecuta la app al menos una vez** (para crear la base de datos)
3. **Ejecuta el script nuevamente:**
   ```bash
   ./copiar_db.sh
   ```

Si prefieres, puedo crear una pantalla de debug dentro de la app para ver los datos sin necesidad de ADB.


