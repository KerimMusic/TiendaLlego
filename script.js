// script.js
let origenPedido = 'simple';

/* ============ Datos del pedido para WhatsApp ============ */
let resumenCajaTexto = '1 caja de Fresas con Chantilly';
let resumenIngredientesTexto = 'Ninguno';

/* Números de WhatsApp (se elige uno al azar en cada pedido) */
const NUMEROS_WHATSAPP = ['524621824592', '524626022906'];

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 🎲 ORDEN ALEATORIO DE LOS PRODUCTOS
  // ============================================================
  const galeria = document.getElementById('pantalla-inicio');

  function mezclarProductos() {
    if (!galeria) return [];
    const paneles = Array.from(galeria.querySelectorAll('.panel.clickable'));
    for (let i = paneles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paneles[i], paneles[j]] = [paneles[j], paneles[i]];
    }
    paneles.forEach(p => galeria.appendChild(p));
    return paneles;
  }

  const panelesOrdenados = mezclarProductos();

  // ============ Animación de entrada ============
  panelesOrdenados.forEach((panel, i) => {
    panel.style.opacity = 0;
    panel.style.transform = 'translateY(12px)';
    setTimeout(() => {
      panel.style.transition = 'opacity .6s ease, transform .6s ease';
      panel.style.opacity = 1;
      panel.style.transform = 'translateY(0)';
    }, 100 * i);
  });

  // ============ EFECTO TÁCTIL PROFESIONAL ============
  function crearRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tamaño = Math.max(rect.width, rect.height) * 2;

    btn.style.setProperty('--rx', `${x}px`);
    btn.style.setProperty('--ry', `${y}px`);
    btn.style.setProperty('--rd', `${tamaño}px`);

    btn.classList.remove('rippling');
    void btn.offsetWidth;
    btn.classList.add('rippling');

    if (navigator.vibrate) navigator.vibrate(8);
  }

  function activarFeedbackBotones() {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.feedbackActivo) return;
      btn.dataset.feedbackActivo = 'true';

      btn.addEventListener('pointerdown', crearRipple);
      btn.addEventListener('pointerdown', () => btn.classList.add('is-pressed'));
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
        btn.addEventListener(evt, () => btn.classList.remove('is-pressed'));
      });
    });
  }

  function activarFeedbackPaneles() {
    document.querySelectorAll('.panel.clickable').forEach(panel => {
      if (panel.dataset.feedbackActivo) return;
      panel.dataset.feedbackActivo = 'true';

      panel.addEventListener('pointerdown', () => panel.classList.add('is-pressed'));
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
        panel.addEventListener(evt, () => panel.classList.remove('is-pressed'));
      });
    });
  }

  activarFeedbackBotones();
  activarFeedbackPaneles();

  // ============ Referencias a pantallas ============
  const pantallaInicio  = document.getElementById('pantalla-inicio');
  const pantallaPedido  = document.getElementById('pantalla-pedido');
  const pantallaCombo   = document.getElementById('pantalla-combo');
  const pantallaResumen = document.getElementById('pantalla-resumen');

  // ============================================================
  // BOTÓN "CONSULTAR SI HAY PRODUCTO"  →  WhatsApp
  // ============================================================
  document.querySelectorAll('.btn-overlay').forEach(btn => {
    btn.addEventListener('click', (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      const panel = btn.closest('.panel');
      const nombre      = panel?.dataset.producto     || 'Producto';
      const descripcion = panel?.dataset.descripcion  || '';
      const precio      = panel?.dataset.precio       || '';
      const promo       = panel?.dataset.promo        || '';

      const lineas = [
        '¡Hola! 🍓 Quisiera saber si todavía tienen producto disponible:',
        '',
        `📦 Producto: ${nombre}`
      ];
      if (descripcion) lineas.push(`🍓 Descripción: ${descripcion}`);
      if (precio)      lineas.push(`💰 Precio: ${precio}`);
      if (promo)       lineas.push(`🎁 Promoción: ${promo}`);
      lineas.push('', '¿Aún hay disponibilidad? ¡Gracias! ✨');

      const mensaje = lineas.join('\n');
      const numero = NUMEROS_WHATSAPP[Math.floor(Math.random() * NUMEROS_WHATSAPP.length)];
      const urlWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
      window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
    });
  });

  // ============ Ingredientes simple ============
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

  // ============================================================
  // NAVEGACIÓN DE PANELES
  // ============================================================
  document.querySelectorAll('.panel.clickable').forEach(panel => {
    panel.addEventListener('click', (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      const link = (panel.dataset.link || '').trim();

      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer');
        return;
      }

      pantallaInicio.style.display  = 'none';
      pantallaPedido.style.display  = 'flex';
      pantallaCombo.style.display   = 'none';
      pantallaResumen.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ============ Ver pedido simple ============
  const btnVerPedido = document.getElementById('btn-ver-pedido');
  if (btnVerPedido) {
    btnVerPedido.addEventListener('click', () => {
      const resumenIngredientes = document.getElementById('resumen-ingredientes');

      resumenCajaTexto = '1 caja de Fresas con Chantilly';
      resumenIngredientesTexto = ingredientesSeleccionados.length
        ? ingredientesSeleccionados.join(', ')
        : 'Ninguno';

      resumenIngredientes.textContent = resumenIngredientesTexto;
      document.getElementById('resumen-caja').textContent = resumenCajaTexto;

      origenPedido = 'simple';
      pantallaPedido.style.display = 'none';
      pantallaResumen.style.display = 'flex';
    });
  }

  // ============ Botón Combo ============
  const btnCombo = document.getElementById('btn-combo');
  if (btnCombo) {
    btnCombo.addEventListener('click', () => {
      pantallaPedido.style.display = 'none';
      pantallaCombo.style.display = 'flex';
      pantallaResumen.style.display = 'none';
    });
  }

  // ============================================================
  // COMBO DINÁMICO
  // ============================================================
  let comboPiezas = 3;
  const comboLista = document.querySelector('.combo-lista');
  const btnMas = document.getElementById('btn-mas');

  function calcularPrecioCombo(n) {
    const grupos = Math.floor(n / 3);
    const restantes = n % 3;
    return grupos * 100 + restantes * 35;
  }

  function actualizarTotalCombo() {
    const texto = document.getElementById('combo-total-texto');
    if (!texto) return;
    const precio = calcularPrecioCombo(comboPiezas);
    texto.textContent = `${comboPiezas} ${comboPiezas === 1 ? 'pieza' : 'piezas'} · $${precio} MXN`;
  }

  function crearCajaCombo(numero) {
    const div = document.createElement('div');
    div.className = 'combo-item';
    div.innerHTML = `
      <div class="combo-cabecera">
        <span class="combo-numero">${numero}</span>
        <div class="combo-img">
          <svg viewBox="0 0 100 124"><use href="#icono-milk"/></svg>
        </div>
      </div>
      <button class="btn-desplegable" data-caja="${numero}" type="button">
        <span class="btn-desplegable-texto">Elige tus ingredientes 🍓</span>
        <span class="flecha">▼</span>
      </button>
      <div class="combo-opciones" id="opciones-caja-${numero}">
        <label class="opcion-ing"><input type="checkbox" value="Ralladura de coco."> Ralladura de coco.</label>
        <label class="opcion-ing"><input type="checkbox" value="Chispas Chocolate."> Chispas Chocolate.</label>
        <label class="opcion-ing"><input type="checkbox" value="Chispas Alegría."> Chispas Alegría.</label>
      </div>
    `;
    return div;
  }

  function activarListenersCaja(item) {
    const btn = item.querySelector('.btn-desplegable');
    btn.addEventListener('click', () => {
      item.classList.toggle('abierto');
    });

    item.querySelectorAll('.combo-opciones input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const marcados = item.querySelectorAll('input[type="checkbox"]:checked').length;
        const btnTexto = item.querySelector('.btn-desplegable-texto');
        if (marcados > 0) {
          btnTexto.textContent = `Ingredientes elegidos (${marcados}) 🍓`;
        } else {
          btnTexto.textContent = 'Elige tus ingredientes 🍓';
        }
      });
    });
  }

  if (comboLista) {
    comboLista.querySelectorAll('.combo-item').forEach(activarListenersCaja);
  }

  if (btnMas && comboLista) {
    btnMas.addEventListener('click', () => {
      comboPiezas++;
      const nuevaCaja = crearCajaCombo(comboPiezas);
      comboLista.appendChild(nuevaCaja);
      activarListenersCaja(nuevaCaja);
      activarFeedbackBotones();
      actualizarTotalCombo();
    });
  }

  actualizarTotalCombo();

  // ============ Ver pedido del combo ============
  const btnVerPedidoCombo = document.getElementById('btn-ver-pedido-combo');
  if (btnVerPedidoCombo) {
    btnVerPedidoCombo.addEventListener('click', () => {
      const items = document.querySelectorAll('.combo-item');
      const total = items.length;
      const precio = calcularPrecioCombo(total);

      resumenCajaTexto = `${total} cajas de Fresas con Chantilly - Combo $${precio} MXN`;
      const lineasIngredientes = [];
      items.forEach((item, idx) => {
        const checks = item.querySelectorAll('input[type="checkbox"]:checked');
        const ings = Array.from(checks).map(c => c.value);
        lineasIngredientes.push(`Caja ${idx + 1}: ${ings.length ? ings.join(', ') : 'Ninguno'}`);
      });

      resumenIngredientesTexto = lineasIngredientes.join('\n');

      document.getElementById('resumen-caja').textContent = resumenCajaTexto;
      document.getElementById('resumen-ingredientes').innerHTML = lineasIngredientes.join('<br>');

      origenPedido = 'combo';
      pantallaCombo.style.display = 'none';
      pantallaResumen.style.display = 'flex';
    });
  }

  // ============ Opciones de pago y envío ============
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
    if (valor === 'Envío a domicilio') {
      inputDireccion.disabled = false;
      inputDireccion.placeholder = 'Dirección de envío';
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

  // ============ Hacer pedido (WhatsApp) ============
  const btnHacerPedido = document.getElementById('btn-hacer-pedido');
  const msgError = document.getElementById('msg-error');

  if (btnHacerPedido) {
    btnHacerPedido.addEventListener('click', () => {
      const nombre = document.getElementById('input-nombre').value.trim();
      const direccion = inputDireccion.value.trim();

      if (!nombre) {
        msgError.textContent = 'Por favor ingresa tu nombre.';
        return;
      }
      if (envioSeleccionado === 'Envío a domicilio' && !direccion) {
        msgError.textContent = 'Por favor ingresa la dirección de envío.';
        return;
      }

      msgError.textContent = '';

      const mensaje = [
        '🍓 *NUEVO PEDIDO - Fresas con Chantilly* 🍓',
        '',
        `👤 *Nombre:* ${nombre}`,
        `📦 *Pedido:* ${resumenCajaTexto}`,
        '🍫 *Ingredientes:*',
        resumenIngredientesTexto,
        `💳 *Pago:* ${pagoSeleccionado}`,
        `🛵 *Envío:* ${envioSeleccionado}${envioSeleccionado === 'Envío a domicilio' ? ' - ' + direccion : ''}`,
        '',
        '¡Gracias por tu pedido! ✨'
      ].join('\n');

      const numeroElegido = NUMEROS_WHATSAPP[Math.floor(Math.random() * NUMEROS_WHATSAPP.length)];
      const urlWhatsApp = `https://wa.me/${numeroElegido}?text=${encodeURIComponent(mensaje)}`;

      window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');

      const modal = document.getElementById('modal-confirmacion');
      const detalle = document.getElementById('modal-detalle');

      detalle.innerHTML = `
        <strong>Nombre:</strong> ${nombre}<br>
        <strong>Pedido:</strong> ${resumenCajaTexto}<br>
        <strong>Ingredientes:</strong><br>${resumenIngredientesTexto.replace(/\n/g, '<br>')}<br>
        <strong>Pago:</strong> ${pagoSeleccionado}<br>
        <strong>Envío:</strong> ${envioSeleccionado}${envioSeleccionado === 'Envío a domicilio' ? ' - ' + direccion : ''}
        <br><br>
        <span style="color:#aaa;font-size:13px;">Se abrió WhatsApp para enviar tu pedido.</span><br>
        <a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer" style="color:#ff2a2a;font-size:13px;">
          ¿No se abrió? Toca aquí para enviarlo
        </a>
      `;

      modal.style.display = 'flex';
    });
  }

  // ============ Reiniciar flujo ============
  function reiniciarApp() {
    comboPiezas = 3;
    if (comboLista) {
      const items = comboLista.querySelectorAll('.combo-item');
      items.forEach((item, idx) => {
        if (idx >= 3) item.remove();
      });
      comboLista.querySelectorAll('.combo-item').forEach(item => {
        item.classList.remove('abierto');
        item.querySelectorAll('input[type="checkbox"]').forEach(chk => chk.checked = false);
        const btnTexto = item.querySelector('.btn-desplegable-texto');
        if (btnTexto) btnTexto.textContent = 'Elige tus ingredientes 🍓';
      });
    }
    actualizarTotalCombo();

    ingredientesSeleccionados.length = 0;
    document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.textContent = 'Agregar';
    });

    const inputNombre = document.getElementById('input-nombre');
    if (inputNombre) inputNombre.value = '';
    if (inputDireccion) {
      inputDireccion.value = '';
      inputDireccion.disabled = true;
      inputDireccion.placeholder = 'No requiere dirección (Recoger)';
    }

    pagoSeleccionado = 'Al entregar';
    envioSeleccionado = 'Recoger';
    if (grupoPago) {
      grupoPago.querySelectorAll('.btn-opcion').forEach(b => {
        b.classList.toggle('activo', b.dataset.valor === 'Al entregar');
      });
    }
    if (grupoEnvio) {
      grupoEnvio.querySelectorAll('.btn-opcion').forEach(b => {
        b.classList.toggle('activo', b.dataset.valor === 'Recoger');
      });
    }

    resumenCajaTexto = '1 caja de Fresas con Chantilly';
    resumenIngredientesTexto = 'Ninguno';
    origenPedido = 'simple';

    const resumenCaja = document.getElementById('resumen-caja');
    const resumenIng = document.getElementById('resumen-ingredientes');
    if (resumenCaja) resumenCaja.textContent = '1 caja de Fresas con Chantilly';
    if (resumenIng) resumenIng.textContent = 'Ninguno';

    if (msgError) msgError.textContent = '';
  }

  window.cerrarModal = function () {
    document.getElementById('modal-confirmacion').style.display = 'none';
    reiniciarApp();
    pantallaResumen.style.display = 'none';
    pantallaPedido.style.display = 'none';
    pantallaCombo.style.display = 'none';
    pantallaInicio.style.display = 'flex';

    const paneles = mezclarProductos();
    paneles.forEach((p, i) => {
      p.style.opacity = 0;
      p.style.transform = 'translateY(12px)';
      setTimeout(() => {
        p.style.opacity = 1;
        p.style.transform = 'translateY(0)';
      }, 80 * i);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

// ============ Navegación global ============
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
