// Definición de colores de la marca para usar en gráficos
const MARCA_VERDE = '#22c55e';
const MARCA_VERDE_OSCURO = '#16a34a';
const TEXTO_PRIMARIO = '#f9fafb';
const TEXTO_SECUNDARIO = '#9ca3af';
const ROJO_ALERTA = '#f43f5e';
const AMARILLO_ALERTA = '#f59e0b';

fetch('data.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        // Llenar KPIs
        document.getElementById('kpi-ventas').textContent = `${datos.configuracion.moneda} ${datos.kpis.ventas_totales}`;
        document.getElementById('kpi-pedidos').textContent = datos.kpis.pedidos_finalizados;
        document.getElementById('kpi-tasa').textContent = `${datos.kpis.tasa_entregas_exitosas}%`;
        document.getElementById('kpi-ticket').textContent = `${datos.configuracion.moneda} ${datos.kpis.promedio_valor_pedido}`;

        // Inicializar Gráficos
        configurarChartJsDefaults();
        crearGráficoTendencia(datos.tendencia_pedidos);
        crearGráficoRentabilidad(datos.rentabilidad_categoria);
        crearGráficoDesempeño(datos.desempeño_repartidores);
    })
    .catch(error => console.error("Error cargando el JSON:", error));

function configurarChartJsDefaults() {
    Chart.defaults.color = TEXTO_SECUNDARIO;
    Chart.defaults.font.family = "'Inter', sans-serif";
}

function crearGráficoTendencia(datos) {
    const ctx = document.getElementById('tendenciaPedidosLineal').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datos.map(i => i.hora),
            datasets: [{
                label: 'Pedidos',
                data: datos.map(i => i.pedidos),
                borderColor: MARCA_VERDE,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: MARCA_VERDE,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(156, 163, 175, 0.2)' },
                    ticks: { color: TEXTO_SECUNDARIO }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: TEXTO_SECUNDARIO }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function crearGráficoRentabilidad(datos) {
    const ctx = document.getElementById('rentabilidadCategoriasDonut').getContext('2d');
    const colores = [MARCA_VERDE, '#4ade80', '#86efac', '#bbf7d0']; // Diferentes tonos de verde
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: datos.map(i => i.categoria),
            datasets: [{
                data: datos.map(i => i.margen_C$),
                backgroundColor: colores,
                borderColor: '#1f2937', // Color del panel para separar segmentos
                borderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right',
                    labels: {
                        color: TEXTO_SECUNDARIO,
                        boxWidth: 20,
                        padding: 20
                    }
                }
            }
        }
    });
}

function crearGráficoDesempeño(datos) {
    const ctx = document.getElementById('desempeñoRepartidoresBarras').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.map(i => i.repartidor),
            datasets: [{
                label: 'Entregas Totales',
                data: datos.map(i => i.entregas),
                backgroundColor: MARCA_VERDE,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(156, 163, 175, 0.2)' },
                    ticks: { color: TEXTO_SECUNDARIO }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: TEXTO_SECUNDARIO }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}