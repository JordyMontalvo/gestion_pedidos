// Servicio para exportar reportes a PDF/CSV
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Exportar a CSV
export const exportarPedidosCSV = async (pedidos, nombreArchivo = 'pedidos') => {
  try {
    // Encabezados
    let csv = 'ID,Fecha,Cliente,Estado,Total,Observaciones\n';

    // Datos
    pedidos.forEach(pedido => {
      const fecha = new Date(pedido.fecha).toLocaleString('es-PE');
      const cliente = pedido.clienteNombre || 'Sin cliente';
      const estado = pedido.estado;
      const total = pedido.total.toFixed(2);
      const observaciones = (pedido.observaciones || '').replace(/,/g, ';');

      csv += `${pedido.id},${fecha},"${cliente}",${estado},${total},"${observaciones}"\n`;
    });

    // Guardar archivo
    const fileUri = FileSystem.documentDirectory + `${nombreArchivo}_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartir archivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Compartir no disponible');
    }

    return fileUri;
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
};

// Exportar productos a CSV
export const exportarProductosCSV = async (productos, nombreArchivo = 'productos') => {
  try {
    let csv = 'ID,Nombre,Precio,Categoría,Stock,Disponible,Descripción\n';

    productos.forEach(producto => {
      const descripcion = (producto.descripcion || '').replace(/,/g, ';');
      const stock = producto.stock !== undefined ? producto.stock : 'N/A';
      const disponible = producto.disponible ? 'Sí' : 'No';

      csv += `${producto.id},"${producto.nombre}",${producto.precio},${producto.categoria},${stock},${disponible},"${descripcion}"\n`;
    });

    const fileUri = FileSystem.documentDirectory + `${nombreArchivo}_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }

    return fileUri;
  } catch (error) {
    console.error('Error al exportar productos CSV:', error);
    throw error;
  }
};

// Generar reporte de ventas (texto simple)
export const generarReporteVentas = (pedidos, fechaDesde, fechaHasta) => {
  const pedidosFiltrados = pedidos.filter(p => {
    const fecha = new Date(p.fecha);
    return fecha >= new Date(fechaDesde) && fecha <= new Date(fechaHasta);
  });

  const total = pedidosFiltrados.reduce((sum, p) => sum + (p.total || 0), 0);
  const totalPedidos = pedidosFiltrados.length;
  
  const porEstado = {};
  pedidosFiltrados.forEach(p => {
    porEstado[p.estado] = (porEstado[p.estado] || 0) + 1;
  });

  return {
    fechaDesde,
    fechaHasta,
    totalPedidos,
    totalVentas: total,
    promedioPedido: totalPedidos > 0 ? total / totalPedidos : 0,
    porEstado,
    pedidos: pedidosFiltrados,
  };
};

// Exportar reporte de ventas a texto
export const exportarReporteVentasTXT = async (reporte, nombreArchivo = 'reporte_ventas') => {
  try {
    let texto = `REPORTE DE VENTAS\n`;
    texto += `========================\n\n`;
    texto += `Período: ${new Date(reporte.fechaDesde).toLocaleDateString('es-PE')} - ${new Date(reporte.fechaHasta).toLocaleDateString('es-PE')}\n\n`;
    texto += `Total de Pedidos: ${reporte.totalPedidos}\n`;
    texto += `Total de Ventas: S/ ${reporte.totalVentas.toFixed(2)}\n`;
    texto += `Promedio por Pedido: S/ ${reporte.promedioPedido.toFixed(2)}\n\n`;
    texto += `Pedidos por Estado:\n`;
    
    Object.entries(reporte.porEstado).forEach(([estado, cantidad]) => {
      texto += `  - ${estado}: ${cantidad}\n`;
    });

    const fileUri = FileSystem.documentDirectory + `${nombreArchivo}_${Date.now()}.txt`;
    await FileSystem.writeAsStringAsync(fileUri, texto, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }

    return fileUri;
  } catch (error) {
    console.error('Error al exportar reporte:', error);
    throw error;
  }
};


