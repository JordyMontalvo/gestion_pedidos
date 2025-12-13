# 👀 Cómo Ver la Base de Datos SQLite

## 📍 Ubicación de la Base de Datos

### En Android:
```
/data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db
```

---

## 🔧 Métodos para Ver la Base de Datos

### Método 1: Usando ADB (Android Debug Bridge) - Recomendado

#### Requisitos:
- Dispositivo Android conectado por USB o emulador
- ADB instalado (viene con Android Studio)

#### Pasos:

1. **Conectar el dispositivo:**
   ```bash
   adb devices
   ```
   Deberías ver tu dispositivo listado.

2. **Acceder al shell del dispositivo:**
   ```bash
   adb shell
   ```

3. **Navegar a la carpeta de la app:**
   ```bash
   cd /data/data/com.polleria.gestionpedidos/databases
   ```

4. **Ver el archivo de la base de datos:**
   ```bash
   ls -la
   ```
   Deberías ver `pedidos_polleria.db`

5. **Copiar la base de datos a tu computadora:**
   ```bash
   # Salir del shell primero (escribe: exit)
   exit
   
   # Copiar el archivo
   adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./
   ```

6. **Abrir con un visor SQLite:**
   - **DB Browser for SQLite** (gratis): https://sqlitebrowser.org/
   - **SQLiteStudio** (gratis): https://sqlitestudio.pl/
   - **VS Code** con extensión SQLite Viewer

---

### Método 2: Usando Expo Dev Tools (Solo lectura)

Si estás usando Expo Go, puedes agregar código temporal para ver los datos:

```javascript
// Agregar temporalmente en PedidosContext.js
useEffect(() => {
  const verDatos = async () => {
    const db = await SQLite.openDatabaseAsync('pedidos_polleria.db');
    const productos = await db.getAllAsync('SELECT * FROM productos');
    const pedidos = await db.getAllAsync('SELECT * FROM pedidos');
    console.log('Productos:', productos);
    console.log('Pedidos:', pedidos);
  };
  verDatos();
}, []);
```

Luego revisa los logs en la consola de Expo.

---

### Método 3: Crear una Pantalla de Debug (Recomendado para desarrollo)

Puedo crear una pantalla de administración donde puedas ver y gestionar la base de datos directamente desde la app.

---

### Método 4: Usar un Explorador de Archivos Root

Si tu dispositivo está rooteado, puedes usar:
- **Root Explorer**
- **ES File Explorer** (con permisos root)
- **Solid Explorer**

Y navegar a: `/data/data/com.polleria.gestionpedidos/databases/`

---

## 🛠️ Herramientas Recomendadas para Ver SQLite

### 1. **DB Browser for SQLite** (Gratis)
- Descarga: https://sqlitebrowser.org/
- Funciones: Ver tablas, ejecutar queries, editar datos
- Compatible: Windows, Mac, Linux

### 2. **SQLiteStudio** (Gratis)
- Descarga: https://sqlitestudio.pl/
- Funciones: Interfaz más avanzada, múltiples bases de datos

### 3. **VS Code Extension**
- Extensión: "SQLite Viewer" o "SQLite"
- Funciones: Ver y editar directamente en VS Code

### 4. **DBeaver** (Gratis)
- Descarga: https://dbeaver.io/
- Funciones: Herramienta completa de bases de datos

---

## 📋 Comandos Útiles de ADB

```bash
# Ver todos los dispositivos conectados
adb devices

# Acceder al shell
adb shell

# Copiar base de datos a tu computadora
adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./pedidos_polleria.db

# Copiar base de datos desde tu computadora al dispositivo
adb push ./pedidos_polleria.db /data/data/com.polleria.gestionpedidos/databases/

# Ver logs de la aplicación
adb logcat | grep -i "pedidos\|sqlite\|database"

# Ejecutar comando SQL directamente (requiere sqlite3 en el dispositivo)
adb shell
sqlite3 /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db
.tables
SELECT * FROM productos;
```

---

## 🔍 Ver Datos con SQLite3 (si está disponible)

Si tu dispositivo tiene `sqlite3` instalado:

```bash
adb shell
sqlite3 /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db

# Comandos SQLite útiles:
.tables                    # Ver todas las tablas
.schema productos          # Ver estructura de la tabla productos
.schema pedidos           # Ver estructura de la tabla pedidos
SELECT * FROM productos;   # Ver todos los productos
SELECT * FROM pedidos;     # Ver todos los pedidos
SELECT * FROM pedido_items; # Ver todos los items
.headers on               # Mostrar encabezados de columnas
.mode column              # Modo columna para mejor visualización
.quit                    # Salir
```

---

## 💡 Solución Rápida: Script de Copia

Puedo crear un script que automáticamente copie la base de datos a tu computadora. ¿Te gustaría que lo cree?

---

## ⚠️ Notas Importantes

1. **Permisos**: Necesitas permisos de root o usar ADB para acceder a `/data/data/`
2. **Emulador**: Es más fácil en emulador que en dispositivo físico
3. **Backup**: Siempre haz backup antes de modificar la base de datos
4. **Producción**: En producción, considera agregar una pantalla de administración

---

## 🚀 Opción: Pantalla de Debug en la App

Puedo crear una pantalla de administración dentro de la app donde puedas:
- Ver todas las tablas
- Ver los datos en formato legible
- Ejecutar queries simples
- Ver estadísticas

¿Te gustaría que implemente esto?


