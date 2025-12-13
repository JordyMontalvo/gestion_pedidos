// Servicio para búsqueda avanzada de pedidos

export const buscarPedidos = (pedidos, criterios) => {
  let resultados = [...pedidos];

  // Búsqueda por texto (cliente, ID, observaciones)
  if (criterios.texto && criterios.texto.trim() !== '') {
    const texto = criterios.texto.toLowerCase();
    resultados = resultados.filter(pedido => {
      const clienteMatch = pedido.clienteNombre?.toLowerCase().includes(texto);
      const idMatch = pedido.id?.toString().includes(texto);
      const observacionesMatch = pedido.observaciones?.toLowerCase().includes(texto);
      
      // Buscar en items del pedido
      const itemsMatch = pedido.items?.some(item => 
        item.nombre?.toLowerCase().includes(texto)
      );
      
      return clienteMatch || idMatch || observacionesMatch || itemsMatch;
    });
  }

  // Filtro por estado
  if (criterios.estado && criterios.estado !== 'todos') {
    resultados = resultados.filter(pedido => pedido.estado === criterios.estado);
  }

  // Filtro por rango de fechas
  if (criterios.fechaDesde) {
    resultados = resultados.filter(pedido => {
      const fechaPedido = new Date(pedido.fecha);
      return fechaPedido >= new Date(criterios.fechaDesde);
    });
  }

  if (criterios.fechaHasta) {
    resultados = resultados.filter(pedido => {
      const fechaPedido = new Date(pedido.fecha);
      const hasta = new Date(criterios.fechaHasta);
      hasta.setHours(23, 59, 59, 999); // Incluir todo el día
      return fechaPedido <= hasta;
    });
  }

  // Filtro por rango de monto
  if (criterios.montoMin) {
    resultados = resultados.filter(pedido => pedido.total >= criterios.montoMin);
  }

  if (criterios.montoMax) {
    resultados = resultados.filter(pedido => pedido.total <= criterios.montoMax);
  }

  // Filtro por mesa/local
  if (criterios.mesa && criterios.mesa !== 'todos') {
    resultados = resultados.filter(pedido => pedido.mesa === criterios.mesa);
  }

  // Ordenamiento
  if (criterios.ordenarPor) {
    resultados.sort((a, b) => {
      switch (criterios.ordenarPor) {
        case 'fecha_asc':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'fecha_desc':
          return new Date(b.fecha) - new Date(a.fecha);
        case 'monto_asc':
          return a.total - b.total;
        case 'monto_desc':
          return b.total - a.total;
        case 'cliente':
          return (a.clienteNombre || '').localeCompare(b.clienteNombre || '');
        default:
          return 0;
      }
    });
  }

  return resultados;
};

// Obtener estadísticas de búsqueda
export const obtenerEstadisticasBusqueda = (pedidos) => {
  const total = pedidos.length;
  const totalMonto = pedidos.reduce((sum, p) => sum + (p.total || 0), 0);
  const porEstado = {};
  
  pedidos.forEach(pedido => {
    porEstado[pedido.estado] = (porEstado[pedido.estado] || 0) + 1;
  });

  return {
    total,
    totalMonto,
    promedioMonto: total > 0 ? totalMonto / total : 0,
    porEstado,
  };
};


