import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../context/PedidosContext';
import {
  obtenerEstadisticas,
} from '../services/firestoreService';
import { testFirebaseConnection } from '../utils/testFirebase';

const AdminScreen = () => {
  const { productos, pedidos, recargarPedidos } = usePedidos();
  const [estadisticas, setEstadisticas] = useState(null);
  const [tabActiva, setTabActiva] = useState('estadisticas'); // estadisticas, productos, pedidos, baseDatos
  const [cargando, setCargando] = useState(false);
  const [conexionTest, setConexionTest] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
    verificarConexion();
  }, [pedidos]);

  const verificarConexion = async () => {
    const resultado = await testFirebaseConnection();
    setConexionTest(resultado);
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportarDatos = async () => {
    try {
      setCargando(true);
      const productosDB = await obtenerProductos();
      const pedidosDB = await obtenerPedidos();

      const datos = {
        fechaExportacion: new Date().toISOString(),
        productos: productosDB,
        pedidos: pedidosDB,
        estadisticas: estadisticas,
      };

      const datosJSON = JSON.stringify(datos, null, 2);

      await Share.share({
        message: `Datos de Pedidos Pollería\n\n${datosJSON}`,
        title: 'Exportar Datos',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar los datos');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const renderEstadisticas = () => (
    <ScrollView style={styles.contenido}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Estadísticas Generales</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{estadisticas?.totalPedidos?.count || 0}</Text>
            <Text style={styles.statLabel}>Total Pedidos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>S/ {estadisticas?.totalVentas?.total?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Total Ventas</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Estados de Pedidos</Text>
        
        <View style={styles.estadoRow}>
          <View style={[styles.estadoBadge, { backgroundColor: '#ff9800' }]}>
            <Text style={styles.estadoValue}>{estadisticas?.pedidosPendientes?.count || 0}</Text>
            <Text style={styles.estadoLabel}>Pendientes</Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: '#2196f3' }]}>
            <Text style={styles.estadoValue}>{estadisticas?.pedidosEnPreparacion?.count || 0}</Text>
            <Text style={styles.estadoLabel}>En Preparación</Text>
          </View>
          <View style={[styles.estadoBadge, { backgroundColor: '#4caf50' }]}>
            <Text style={styles.estadoValue}>{estadisticas?.pedidosListos?.count || 0}</Text>
            <Text style={styles.estadoLabel}>Listos</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Productos:</Text>
          <Text style={styles.infoValue}>{productos.length}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportarDatos} disabled={cargando}>
        <Ionicons name="download-outline" size={20} color="#fff" />
        <Text style={styles.exportButtonText}>
          {cargando ? 'Exportando...' : 'Exportar Datos'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderProductos = () => (
    <View style={styles.contenido}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productoItem}>
            <View style={styles.productoHeader}>
              <Text style={styles.productoEmoji}>{item.imagen || '🍕'}</Text>
              <View style={styles.productoInfo}>
                <Text style={styles.productoNombre}>{item.nombre}</Text>
                <Text style={styles.productoCategoria}>{item.categoria}</Text>
              </View>
              <Text style={styles.productoPrecio}>S/ {item.precio.toFixed(2)}</Text>
            </View>
            <View style={styles.productoFooter}>
              <View style={[styles.disponibleBadge, item.disponible ? styles.disponible : styles.noDisponible]}>
                <Text style={styles.disponibleText}>
                  {item.disponible ? '✓ Disponible' : '✗ No Disponible'}
                </Text>
              </View>
              {item.descripcion && (
                <Text style={styles.productoDescripcion}>{item.descripcion}</Text>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderPedidos = () => (
    <View style={styles.contenido}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pedidoItem}>
            <View style={styles.pedidoHeader}>
              <View>
                <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
                <Text style={styles.pedidoFecha}>{formatearFecha(item.fecha)}</Text>
                {item.clienteNombre && (
                  <Text style={styles.pedidoCliente}>👤 {item.clienteNombre}</Text>
                )}
              </View>
              <View style={[styles.estadoBadgeSmall, { backgroundColor: getEstadoColor(item.estado) }]}>
                <Text style={styles.estadoTextSmall}>{item.estado}</Text>
              </View>
            </View>
            <View style={styles.pedidoInfo}>
              <Text style={styles.pedidoItems}>{item.items.length} productos</Text>
              <Text style={styles.pedidoTotal}>S/ {item.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const renderBaseDatos = () => (
    <ScrollView style={styles.contenido}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗄️ Información de Base de Datos</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>pedidos_polleria.db</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>SQLite</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tablas:</Text>
          <Text style={styles.infoValue}>3 (productos, pedidos, pedido_items)</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Tabla: productos</Text>
        <Text style={styles.tableInfo}>- {productos.length} registros</Text>
        <Text style={styles.tableInfo}>- Campos: id, nombre, precio, categoria, imagen, descripcion, disponible</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Tabla: pedidos</Text>
        <Text style={styles.tableInfo}>- {pedidos.length} registros</Text>
        <Text style={styles.tableInfo}>- Campos: id, fecha, clienteNombre, observaciones, estado, total</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Tabla: pedido_items</Text>
        <Text style={styles.tableInfo}>- Relación entre pedidos y productos</Text>
        <Text style={styles.tableInfo}>- Campos: id, pedidoId, productoId, cantidad, precio, nombre</Text>
      </View>
    </ScrollView>
  );

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#ff9800',
      en_preparacion: '#2196f3',
      listo: '#4caf50',
      entregado: '#9e9e9e',
    };
    return colores[estado] || '#666';
  };

  const tabs = [
    { id: 'estadisticas', nombre: 'Estadísticas', icon: 'stats-chart' },
    { id: 'productos', nombre: 'Productos', icon: 'cube' },
    { id: 'pedidos', nombre: 'Pedidos', icon: 'receipt' },
    { id: 'baseDatos', nombre: 'Base Datos', icon: 'server' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>⚙️ Administración</Text>
          {conexionTest && (
            <View style={styles.conexionStatus}>
              <Ionicons 
                name={conexionTest.success ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={conexionTest.success ? "#4caf50" : "#ff3b30"} 
              />
              <Text style={[
                styles.conexionText,
                { color: conexionTest.success ? "#4caf50" : "#ff3b30" }
              ]}>
                {conexionTest.success ? "Conectado a Firestore" : "Error de conexión"}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => {
            cargarEstadisticas();
            verificarConexion();
          }} 
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tabActiva === tab.id && styles.tabActiva]}
            onPress={() => setTabActiva(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={tabActiva === tab.id ? '#FF6B00' : '#999'}
            />
            <Text
              style={[
                styles.tabText,
                tabActiva === tab.id && styles.tabTextActiva,
              ]}
            >
              {tab.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tabActiva === 'estadisticas' && renderEstadisticas()}
      {tabActiva === 'productos' && renderProductos()}
      {tabActiva === 'pedidos' && renderPedidos()}
      {tabActiva === 'baseDatos' && renderBaseDatos()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  conexionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  conexionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabActiva: {
    backgroundColor: '#fff3e0',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActiva: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  estadoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  estadoBadge: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  estadoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  estadoLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  estadoBadgeSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  estadoTextSmall: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tableInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
    marginLeft: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 12,
    margin: 15,
    gap: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  productoItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productoEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  productoCategoria: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  productoPrecio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  productoFooter: {
    marginTop: 10,
  },
  disponibleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  disponible: {
    backgroundColor: '#e8f5e9',
  },
  noDisponible: {
    backgroundColor: '#ffebee',
  },
  disponibleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  productoDescripcion: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  pedidoItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pedidoFecha: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pedidoCliente: {
    fontSize: 13,
    color: '#FF6B00',
    marginTop: 4,
  },
  pedidoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  pedidoItems: {
    fontSize: 14,
    color: '#666',
  },
  pedidoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
});

export default AdminScreen;

