# 🍗 Flujo de Trabajo - Sistema de Roles para Pollería

## 🎯 **FLUJO ACTUAL Y MEJORAS NECESARIAS**

### Flujo Típico de una Pollería:
```
1. MESERO → Toma pedido del cliente
2. COCINA → Recibe pedido y lo prepara
3. COCINA → Marca como "Listo"
4. CAJA → Cobra cuando está listo
5. MESERO → Entrega al cliente
```

---

## 👥 **ROLES NECESARIOS**

### 1. **MESERO** (Atiende mesas)
**Responsabilidades:**
- ✅ Tomar pedidos de clientes
- ✅ Asignar mesa al pedido
- ✅ Ver estado de pedidos de sus mesas
- ✅ Entregar pedidos cuando están listos

**Lo que necesita:**
- ✅ Pantalla de pedidos filtrada por mesas asignadas
- ✅ Ver estado en tiempo real
- ✅ Notificaciones cuando su pedido está listo

---

### 2. **COCINA** (Prepara pedidos)
**Responsabilidades:**
- ✅ Ver solo pedidos pendientes/en preparación
- ✅ Marcar pedidos como "En preparación"
- ✅ Marcar pedidos como "Listo"
- ✅ Ver detalles de cada pedido

**Lo que necesita:**
- ✅ Vista simplificada solo para cocina
- ✅ Ver productos ordenados por prioridad
- ✅ Notificaciones de nuevos pedidos
- ✅ Lista de pedidos pendientes prominente

---

### 3. **CAJA** (Cobra pedidos)
**Responsabilidades:**
- ✅ Ver solo pedidos listos
- ✅ Registrar método de pago
- ✅ Marcar como cobrado
- ✅ Generar ticket/comprobante

**Lo que necesita:**
- ✅ Vista de pedidos listos para cobrar
- ✅ Selección de método de pago
- ✅ Generación de ticket
- ✅ Total de ventas del día

---

### 4. **ADMIN** (Gerente/Administrador)
**Responsabilidades:**
- ✅ Ver todo
- ✅ Estadísticas y reportes
- ✅ Gestión de productos
- ✅ Configuración

**Lo que necesita:**
- ✅ Dashboard completo
- ✅ Reportes y estadísticas
- ✅ Gestión completa

---

## 🚀 **MEJORAS A IMPLEMENTAR**

### 🔥 **ALTA PRIORIDAD** (Flujo básico)

#### 1. **Sistema de Roles/Usuarios**
- Autenticación con Firebase Auth
- Roles: Mesero, Cocina, Caja, Admin
- Pantallas diferentes según rol

#### 2. **Vista de Cocina Dedicada**
- Solo pedidos pendientes/en preparación
- Lista grande y fácil de leer
- Botones grandes para cambiar estado
- Sonido cuando llega pedido nuevo

#### 3. **Vista de Caja Dedicada**
- Solo pedidos "Listos"
- Selección de método de pago
- Ticket de venta
- Total del día

#### 4. **Asignación de Mesas a Meseros**
- Cada mesero tiene mesas asignadas
- Filtrar pedidos por mesero
- Responsabilidad clara

---

### ⚡ **MEDIA PRIORIDAD** (Mejoras operativas)

#### 5. **Ticket de Cocina (Vista Impresa)**
- Formato optimizado para cocina
- Productos agrupados
- Tiempo de pedido

#### 6. **Tiempo de Preparación**
- Tiempo estimado por producto
- Tiempo transcurrido desde pedido
- Alertas de pedidos tardíos

#### 7. **Prioridad de Pedidos**
- Pedidos urgentes destacados
- Ordenar por prioridad/tiempo

#### 8. **Métodos de Pago**
- Efectivo
- Tarjeta
- Transferencia
- Yape/Plin
- Registro en el pedido

---

### 💎 **BAJA PRIORIDAD** (Nice to Have)

#### 9. **Notificaciones por Rol**
- Cocina: Solo nuevos pedidos
- Caja: Solo pedidos listos
- Mesero: Solo sus mesas

#### 10. **Historial de Tiempos**
- Tiempo promedio de preparación
- Tiempo real por pedido
- Análisis de eficiencia

#### 11. **Modo Cocina Offline**
- Seguir funcionando sin internet
- Sincronizar cuando vuelva conexión

---

## 🎯 **RECOMENDACIÓN DE IMPLEMENTACIÓN**

### Fase 1: Roles Básicos (2-3 horas)
1. Sistema de login simple
2. Roles: Mesero, Cocina, Caja
3. Pantallas según rol

### Fase 2: Vista de Cocina (1 hora)
1. Pantalla dedicada para cocina
2. Solo pedidos pendientes
3. Botones grandes

### Fase 3: Vista de Caja (1 hora)
1. Pantalla dedicada para caja
2. Métodos de pago
3. Ticket de venta

### Fase 4: Asignación de Mesas (1 hora)
1. Asignar mesas a meseros
2. Filtros por mesero

---

## 📋 **ESTRUCTURA PROPUESTA**

### Pantalla de Login
- Seleccionar rol o login con usuario

### Vista Mesero
- Menú completo
- Carrito
- Pedidos de sus mesas

### Vista Cocina
- Lista grande de pedidos pendientes
- Botones: "En Preparación" / "Listo"
- Filtro por estado

### Vista Caja
- Lista de pedidos listos
- Seleccionar método de pago
- Marcar como cobrado

### Vista Admin (opcional)
- Todo lo anterior
- Estadísticas
- Reportes

---

## 🎨 **DISEÑO SUGERIDO**

### Vista Cocina:
```
┌─────────────────────────┐
│  🍗 COCINA              │
├─────────────────────────┤
│  📋 Pedido #123        │
│  Mesa 5 | Hace 5 min   │
│  ─────────────────────  │
│  • Pollo Entero x1     │
│  • Papas x2            │
│  ─────────────────────  │
│  [En Preparación] [Listo]│
├─────────────────────────┤
│  📋 Pedido #124        │
│  ...
└─────────────────────────┘
```

### Vista Caja:
```
┌─────────────────────────┐
│  💰 CAJA                │
│  Ventas hoy: S/ 450.00  │
├─────────────────────────┤
│  📋 Pedido #123        │
│  Mesa 5 | Listo        │
│  Total: S/ 45.00       │
│  ─────────────────────  │
│  Método de pago:       │
│  ○ Efectivo ○ Tarjeta │
│  ○ Yape ○ Transferencia│
│  ─────────────────────  │
│  [Cobrado] [Ticket]    │
└─────────────────────────┘
```

---

¿Quieres que implemente el sistema de roles y las vistas de Cocina y Caja? 🚀


