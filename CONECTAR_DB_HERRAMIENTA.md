# 🔌 Conectar Base de Datos con Herramienta Externa

## 📋 Pasos para Conectar

### Paso 1: Obtener la Base de Datos

Primero necesitas copiar la base de datos desde tu dispositivo Android a tu computadora:

```bash
# Conectar dispositivo
adb devices

# Copiar la base de datos
adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./
```

Esto copiará el archivo `pedidos_polleria.db` a tu directorio actual.

---

### Paso 2: Configurar la Conexión en la Herramienta

En la ventana de conexión que estás viendo:

1. **Name**: Ingresa un nombre descriptivo
   - Ejemplo: `Pedidos Pollería`

2. **Group**: (Opcional) Puedes dejarlo vacío o crear un grupo

3. **Server Type**: Selecciona **SQLite** ✅ (ya lo tienes seleccionado)

4. **Database Path**: 
   - Haz clic en el botón de archivo (📄) al lado del campo
   - Navega hasta donde copiaste el archivo: `pedidos_polleria.db`
   - O escribe la ruta completa:
     ```
     /Users/jordymontalvo/Documents/gestion-pedidos-movil/pedidos_polleria.db
     ```
     (Ajusta la ruta según donde copiaste el archivo)

5. **Features**: Puedes dejar "Trigger" y "Sequence" sin marcar (son opcionales)

6. **Clic en "Connect"** o **"Save"** para guardar la conexión

---

## 🔄 Actualizar la Base de Datos

Cada vez que quieras ver los datos más recientes:

1. **Copiar nuevamente** la base de datos desde el dispositivo:
   ```bash
   adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./
   ```

2. **Refrescar** la conexión en tu herramienta (F5 o botón de refresh)

---

## 📊 Tablas que Verás

Una vez conectado, deberías ver estas tablas:

- **productos** - Catálogo de productos
- **pedidos** - Pedidos realizados
- **pedido_items** - Items de cada pedido

---

## 💡 Consejo

Puedes crear un script para automatizar la copia:

```bash
#!/bin/bash
# copiar_db.sh
adb pull /data/data/com.polleria.gestionpedidos/databases/pedidos_polleria.db ./
echo "Base de datos copiada exitosamente"
```

Luego ejecutar: `chmod +x copiar_db.sh && ./copiar_db.sh`

---

## ⚠️ Nota Importante

- La base de datos se actualiza en tiempo real en el dispositivo
- Para ver cambios recientes, necesitas copiar el archivo nuevamente
- No modifiques la base de datos directamente desde la herramienta si la app está corriendo (puede causar conflictos)

