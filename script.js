let origenPedido = 'simple';

document.addEventListener('DOMContentLoaded', () => {
  // Animación de entrada para los paneles de la galería
  const panelesData = [
    { titulo: 'Fresas Con Chantilly', alt: 'Paisaje 1' },
    { titulo: 'Visuteria', alt: 'Paisaje 2' }
  ];

  document.querySelectorAll('.panel').forEach((panel, i) => {
    const data = panelesData[i];
    if (!data) return;
    const p = panel.querySelector('p');
    if (p) p.textContent = data.titulo;
    const img = panel.querySelector('img');
    if (img) img.alt = data.alt;
    panel.style.opacity = 0;
    panel.style.transform = 'translateY(12px)';
    setTimeout(() => {
      panel.style.transition = 'opacity .6s ease, transform .6s ease';
      panel.style.opacity = 1;
      panel.style.transform = 'translateY(0)';
    }, 100 * i);
  });

  // Referencias a pantallas
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const pantallaPedido = document.getElementById('pantalla-pedido');
  const pantallaCombo = document.getElementById('pantalla-combo');
  const pantallaResumen = document.getElementById('pantalla-resumen');
  const panelFresas = document.getElementById('panel-fresas');

  // ---- Botón consultar disponibilidad ----
  const btnConsultar = document.querySelector('.btn-overlay');
  if (btnConsultar) {
    btnConsultar.addEventListener('click', (evento) => {
      evento.stopPropagation();
      window.open('https://t.me/Soporte95', '_blank');
    });
  }

  // ---- Ingredientes simple ----
  const ingredientesSeleccionados = [];
  const botonesAgregar = document.querySelectorAll('.btn-agregar');

  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemRow = btn.closest('.item-row');
      const nombre = itemRow.querySelector('.item-text').textContent.trim();
      const index = ingredientesSeleccionados.indexOf(nombre);
      if (index === -1) {
        ingredientesSeleccionados.push(nombre);
        btn.textContent = 'Quitar';
      } else {
        ingredientesSeleccionados.splice(index, 1);
        btn.textContent = 'Agregar';
      }
    });
  });

  // ---- Navegación ----
  if (panelFresas) {
    panelFresas.addEventListener('click', () => {
      pantallaInicio.style.display = 'none';
      pantallaPedido.style.display = 'flex';
      pantallaCombo.style.display = 'none';
      pantallaResumen.style.display = 'none';
    });
  }

  // ---- Ver pedido simple ----
  const btnVerPedido = document.getElementById('btn-ver-pedido');
  if (btnVerPedido) {
    btnVerPedido.addEventListener('click', () => {
      const resumenIngredientes = document.getElementById('resumen-ingredientes');
      if (ingredientesSeleccionados.length === 0) {
        resumenIngredientes.textContent = 'Ninguno';
      } else {
        resumenIngredientes.textContent = ingredientesSeleccionados.join(', ');
      }
      document.getElementById('resumen-caja').textContent = '1 caja de Fresas con Chantilly';
      origenPedido = 'simple';
      pantallaPedido.style.display = 'none';
      pantallaResumen.style.display = 'flex';
    });
  }

  // ---- Botón Combo ----
  const btnCombo = document.getElementById('btn-combo');
  if (btnCombo) {
    btnCombo.addEventListener('click', () => {
      pantallaPedido.style.display = 'none';
      pantallaCombo.style.display = 'flex';
      pantallaResumen.style.display = 'none';
    });
  }

  // ---- Dropdowns del combo ----
  document.querySelectorAll('.btn-desplegable').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.combo-item');
      item.classList.toggle('abierto');
    });
  });

  // ---- Checkboxes del combo: actualizar texto ----
  document.querySelectorAll('.combo-opciones input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const item = e.target.closest('.combo-item');
      const marcados = item.querySelectorAll('input[type="checkbox"]:checked').length;
      const btnTexto = item.querySelector('.btn-desplegable-texto');
      if (marcados > 0) {
        btnTexto.textContent = `Ingredientes elegidos (${marcados}) 🍓`;
      } else {
        btnTexto.textContent = 'Elige tus ingredientes 🍓';
      }
    });
  });

  // ---- Ver pedido del combo ----
  const btnVerPedidoCombo = document.getElementById('btn-ver-pedido-combo');
  if (btnVerPedidoCombo) {
    btnVerPedidoCombo.addEventListener('click', () => {
      let resumenCaja = '3 cajas de Fresas con Chantilly - Combo $100 MXN';
      let lineasIngredientes = [];
      for (let i = 1; i <= 3; i++) {
        const item = document.querySelector(`.combo-item:nth-child(${i})`);
        const checks = item.querySelectorAll('input[type="checkbox"]:checked');
        const ings = Array.from(checks).map(c => c.value);
        lineasIngredientes.push(`Caja ${i}: ${ings.length ? ings.join(', ') : 'Ninguno'}`);
      }
      document.getElementById('resumen-caja').textContent = resumenCaja;
      document.getElementById('resumen-ingredientes').innerHTML = lineasIngredientes.join('<br>');
      origenPedido = 'combo';
      pantallaCombo.style.display = 'none';
      pantallaResumen.style.display = 'flex';
    });
  }

  // ---- Opciones de pago y envío ----
  const grupoPago = document.getElementById('grupo-pago');
  const grupoEnvio = document.getElementById('grupo-envio');
  const inputDireccion = document.getElementById('input-direccion');
  let pagoSeleccionado = 'Al entregar';
  let envioSeleccionado = 'Recoger';

  function configurarGrupo(grupo, callback) {
    if (!grupo) return;
    grupo.querySelectorAll('.btn-opcion').forEach(btn => {
      btn.addEventListener('click', () => {
        grupo.querySelectorAll('.btn-opcion').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        callback(btn.dataset.valor);
      });
    });
  }

  configurarGrupo(grupoPago, (valor) => { pagoSeleccionado = valor; });
  configurarGrupo(grupoEnvio, (valor) => {
    envioSeleccionado = valor;
    if (valor === 'Envio a domicilio') {
      inputDireccion.disabled = false;
      inputDireccion.placeholder = 'Direccion de envio';
    } else {
      inputDireccion.disabled = true;
      inputDireccion.value = '';
      inputDireccion.placeholder = 'No requiere dirección (Recoger)';
    }
  });

  if (inputDireccion) {
    inputDireccion.disabled = true;
    inputDireccion.placeholder = 'No requiere dirección (Recoger)';
  }

  // ---- Hacer pedido (Enviar a WhatsApp) ----
  const btnHacerPedido = document.getElementById('btn-hacer-pedido');
  const msgError = document.getElementById('msg-error');

  // Números de WhatsApp que recibirán el pedido
  const NUMEROS_WHATSAPP = ['524621824592', '524626022906'];

  if (btnHacerPedido) {
    btnHacerPedido.addEventListener('click', () => {
      const nombre = document.getElementById('input-nombre').value.trim();
      const direccion = inputDireccion.value.trim();

      // Validaciones
      if (!nombre) {
        msgError.textContent = 'Por favor ingresa tu nombre.';
        return;
      }
      if (envioSeleccionado === 'Envio a domicilio' && !direccion) {
        msgError.textContent = 'Por favor ingresa la dirección de envío.';
        return;
      }

      msgError.textContent = '';

      // Construir el mensaje
      let cajaTexto, ingredientesTexto;
      if (origenPedido === 'combo') {
        cajaTexto = '3 cajas de Fresas con Chantilly - Combo $100 MXN';
        ingredientesTexto = document.getElementById('resumen-ingredientes').innerHTML.replace(/<br\s*\/?>/gi, '\n');
      } else {
        cajaTexto = '1 caja de Fresas con Chantilly';
        ingredientesTexto = ingredientesSeleccionados.length ? ingredientesSeleccionados.join(', ') : 'Ninguno';
      }

      const mensaje = `¡Hola! Quiero hacer un pedido:
*Nombre:* ${nombre}
*Caja:* ${cajaTexto}
*Ingredientes:*
${ingredientesTexto}
*Pago:* ${pagoSeleccionado}
*Envío:* ${envioSeleccionado}${envioSeleccionado === 'Envio a domicilio' ? ' - ' + direccion : ''}`;

      const mensajeCodificado = encodeURIComponent(mensaje);

      // Abrir WhatsApp para cada número
      NUMEROS_WHATSAPP.forEach((numero, index) => {
        const url = `https://wa.me/${numero}?text=${mensajeCodificado}`;
        window.open(url, `whatsapp-pedido-${index}`);
      });

      // Opcional: mostrar mensaje de confirmación
      // alert('Pedido enviado a WhatsApp. Por favor presiona ENVIAR en cada chat.');
    });
  }
});

// ---- Funciones globales de navegación ----
function volverAlInicio() {
  document.getElementById('pantalla-pedido').style.display = 'none';
  document.getElementById('pantalla-combo').style.display = 'none';
  document.getElementById('pantalla-resumen').style.display = 'none';
  document.getElementById('pantalla-inicio').style.display = 'flex';
}

function volverAlPedido() {
  if (origenPedido === 'combo') {
    document.getElementById('pantalla-resumen').style.display = 'none';
    document.getElementById('pantalla-combo').style.display = 'flex';
  } else {
    document.getElementById('pantalla-resumen').style.display = 'none';
    document.getElementById('pantalla-pedido').style.display = 'flex';
  }
}

function volverAlPedidoSimple() {
  document.getElementById('pantalla-combo').style.display = 'none';
  document.getElementById('pantalla-pedido').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-confirmacion').style.display = 'none';
}