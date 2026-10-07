document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. GESTIÓN DE MODALES (Contacto y Carrito)
    // ==========================================
    const modalContacto = document.getElementById('modal-contacto');
    const modalCarrito = document.getElementById('modal-carrito');

    const btnAbrirContacto = document.getElementById('abrir-contacto-modal');
    const btnCerrarContacto = document.getElementById('cerrar-contacto');

    const btnAbrirCarrito = document.getElementById('btn-carrito');
    const btnCerrarCarrito = document.getElementById('cerrar-carrito');

    function abrirModal(modal) {
        if (modal) {
            modal.classList.add('activo');
        }
    }

    function cerrarModal(modal) {
        if (modal) {
            modal.classList.remove('activo');
        }
    }

    // Eventos Modal Contacto
    if (btnAbrirContacto) {
        btnAbrirContacto.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(modalContacto);
        });
    }

    if (btnCerrarContacto) {
        btnCerrarContacto.addEventListener('click', () => {
            cerrarModal(modalContacto);
        });
    }

    // Eventos Modal Carrito
    if (btnAbrirCarrito) {
        btnAbrirCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(modalCarrito);
        });
    }

    if (btnCerrarCarrito) {
        btnCerrarCarrito.addEventListener('click', () => {
            cerrarModal(modalCarrito);
        });
    }

    // Cerrar modales haciendo clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modalContacto) cerrarModal(modalContacto);
        if (e.target === modalCarrito) cerrarModal(modalCarrito);
    });

    // ==========================================
    // 2. SISTEMA DE CARRITO Y AGREGADO DE PRODUCTOS
    // ==========================================
    const listaCarrito = document.getElementById('lista-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const btnEnviarWhatsapp = document.getElementById('enviar-whatsapp');
    const botonesSumar = document.querySelectorAll('.btn-sumar');

    let productosElegidos = [];

    botonesSumar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const nombreProducto = btn.getAttribute('data-nombre');

            if (!nombreProducto) return;

            // Buscar la tarjeta contenedora y la imagen principal del producto
            const card = btn.closest('.product-card');
            const imgElement = card ? card.querySelector('.main-image-link img') : null;
            const imagenProducto = imgElement ? imgElement.src : '';

            const index = productosElegidos.findIndex(item => item.nombre === nombreProducto);

            if (index === -1) {
                // Agregar producto con nombre e imagen
                productosElegidos.push({
                    nombre: nombreProducto,
                    imagen: imagenProducto
                });
            } else {
                // Quitar producto si vuelve a presionar el botón
                productosElegidos.splice(index, 1);
            }

            actualizarInterfaz();
        });
    });

    function actualizarInterfaz() {
        // 1. Actualizar contador
        if (contadorCarrito) {
            contadorCarrito.textContent = productosElegidos.length;
        }

        // 2. Actualizar estado visual de todos los botones de productos
        botonesSumar.forEach(btn => {
            const nombre = btn.getAttribute('data-nombre');
            const icon = btn.querySelector('i');
            const spanText = btn.querySelector('span');

            const existe = productosElegidos.some(item => item.nombre === nombre);

            if (existe) {
                btn.classList.add('agregado');
                if (icon) icon.className = 'fas fa-check';
                if (spanText) spanText.textContent = 'Agregado a la consulta';
            } else {
                btn.classList.remove('agregado');
                if (icon) icon.className = 'fas fa-heart';
                if (spanText) spanText.textContent = 'Agregar a consulta';
            }
        });

        // 3. Rellenar lista dentro del modal
        if (listaCarrito) {
            listaCarrito.innerHTML = '';

            if (productosElegidos.length === 0) {
                listaCarrito.innerHTML = `<li class="carrito-item" style="justify-content: center; color: var(--text-muted);">No has agregado productos a tu consulta.</li>`;
                if (btnEnviarWhatsapp) btnEnviarWhatsapp.classList.add('disabled');
            } else {
                if (btnEnviarWhatsapp) btnEnviarWhatsapp.classList.remove('disabled');

                productosElegidos.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.className = 'carrito-item';
                    li.innerHTML = `
                        <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-img">
                        <span class="carrito-item-titulo">${item.nombre}</span>
                        <button class="btn-eliminar" data-index="${index}" title="Eliminar producto">&times;</button>
                    `;
                    listaCarrito.appendChild(li);
                });

                // Eventos para botones de eliminar dentro del modal
                const botonesEliminar = listaCarrito.querySelectorAll('.btn-eliminar');
                botonesEliminar.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.target.getAttribute('data-index'));
                        productosElegidos.splice(idx, 1);
                        actualizarInterfaz();
                    });
                });
            }
        }
    }

    // Envío del mensaje consolidado a WhatsApp
    if (btnEnviarWhatsapp) {
        btnEnviarWhatsapp.addEventListener('click', (e) => {
            e.preventDefault();
            if (productosElegidos.length === 0) return;

            const listaFormateada = productosElegidos.map(prod => `• ${prod.nombre}`).join('\n');
            const mensaje = `Hola Sombrillas J.M.G, vengo de la web y quiero solicitar presupuesto por los siguientes productos:\n\n${listaFormateada}`;
            
            // Verifica que el número de teléfono sea el correcto
            const url = `https://wa.me/5491125763258?text=${encodeURIComponent(mensaje)}`;
            
            window.open(url, '_blank');
        });
    }

    // Inicializar estado del carrito
    actualizarInterfaz();


    // ==========================================
    // 3. GALERÍA DE MINIATURAS EN TARJETAS (Cambia al pasar el mouse)
    // ==========================================
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const mainImg = card.querySelector('.main-image-link img');
        const thumbs = card.querySelectorAll('.thumb');

        thumbs.forEach(thumb => {
            // Cambiado 'click' por 'mouseenter' para que cambie solo al pasar el cursor
            thumb.addEventListener('mouseenter', () => {
                thumbs.forEach(t => t.classList.remove('active-thumb'));
                thumb.classList.add('active-thumb');

                if (mainImg) {
                    mainImg.src = thumb.src;
                }
            });
        });
    });

});