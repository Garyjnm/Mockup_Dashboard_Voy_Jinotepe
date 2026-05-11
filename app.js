fetch('data.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        // 1. Llenar el Encabezado
        document.getElementById('titulo-empresa').textContent = `Control Operativo - ${datos.configuracion.empresa}`;

        // 2. Llenar los KPIs
        document.getElementById('kpi-ventas').textContent = `${datos.configuracion.moneda} ${datos.kpis.ventas_totales}`;
        document.getElementById('kpi-arqueo').textContent = `${datos.configuracion.moneda} ${datos.kpis.diferencia_arqueo}`;
        document.getElementById('kpi-crecimiento').textContent = `+${datos.kpis.crecimiento_porcentaje}%`;
        document.getElementById('kpi-pedidos').textContent = datos.kpis.pedidos_finalizados;

        // 3. Llenar la Tabla dinámicamente
        const tbody = document.getElementById('tabla-pedidos');
        datos.detalle_pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.repartidor}</td>
                <td>${pedido.monto}</td>
                <td>${pedido.estado}</td>
            `;
            tbody.appendChild(fila);
        });

        // 4. Dibujar el Gráfico con Chart.js
        dibujarGrafico(datos.grafico_tendencia);
    })
    .catch(error => console.error("Error cargando el JSON:", error));

// Función para inicializar el gráfico
function dibujarGrafico(datosGrafico) {
    const ctx = document.getElementById('graficoTendencia').getContext('2d');
    
    // Extraer horas para el eje X y pedidos para el eje Y
    const etiquetas = datosGrafico.map(item => item.hora);
    const valores = datosGrafico.map(item => item.pedidos);

    new Chart(ctx, {
        type: 'line', // Tipo de gráfico de línea
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Tendencia de pedidos',
                data: valores,
                borderColor: '#333',
                tension: 0.1 // Curva suave
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}