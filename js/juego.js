/* =========================
   PARENTYX - LÓGICA DEL JUEGO DE DECISIONES
   El contenido vive en js/juego-datos.js.
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    const datos = JUEGO_DATOS;
    const escenario = document.querySelector(".juego-escenario");
    const rastro = document.querySelector(".juego-rastro-camino");
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

    const DURACION_RESALTE = 350;
    const DURACION_GIRO = 900;

    let recorrido = [];
    let ocupado = false;

    document.title = `${datos.titulo} | PARENTYX`;
    document.querySelector(".juego-rastro-titulo").textContent = datos.textos.tituloRastro;

    // ---------- Utilidades ----------

    function crearElemento(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        if (clase) elemento.className = clase;
        if (texto) elemento.textContent = texto;
        return elemento;
    }

    // Recuadro con el nombre del archivo; si la imagen existe, se muestra encima.
    function crearImagen(archivo, clase) {
        const contenedor = crearElemento("div", `juego-media ${clase || ""}`);
        const aviso = crearElemento("span", "juego-media-aviso", archivo);
        const imagen = document.createElement("img");

        imagen.alt = datos.altPendiente;
        imagen.addEventListener("load", () => contenedor.classList.add("is-cargada"));
        imagen.addEventListener("error", () => imagen.remove());
        imagen.src = datos.carpetaImagenes + archivo;

        contenedor.append(aviso, imagen);
        return contenedor;
    }

    function crearPantalla(tipo) {
        return crearElemento("section", `juego-pantalla juego-pantalla-${tipo}`);
    }

    function enfocar(pantalla) {
        const titulo = pantalla.querySelector("[data-enfoque]");
        if (titulo) titulo.focus({ preventScroll: true });
    }

    function actualizarProgreso() {
        document.body.style.setProperty("--juego-paso", recorrido.length);
    }

    // ---------- Pantallas ----------

    function pantallaInicio() {
        const pantalla = crearPantalla("inicio");
        const titulo = crearElemento("h1", "juego-titulo", datos.titulo);
        const boton = crearElemento("button", "btn btn-primary juego-boton", datos.textos.comenzar);

        titulo.tabIndex = -1;
        titulo.dataset.enfoque = "";
        boton.type = "button";
        boton.addEventListener("click", () => cambiarPantalla(pantallaSituacion(datos.inicio)));

        pantalla.append(titulo, crearElemento("p", "juego-intro", datos.introduccion), boton);
        return pantalla;
    }

    function pantallaSituacion(id) {
        const situacion = datos.situaciones[id];
        const pantalla = crearPantalla("situacion");
        const texto = crearElemento("p", "juego-situacion-texto", situacion.texto);
        const boton = crearElemento("button", "btn btn-primary juego-boton", datos.textos.queHaces);

        texto.tabIndex = -1;
        texto.dataset.enfoque = "";
        boton.type = "button";
        boton.addEventListener("click", () => cambiarPantalla(pantallaDecision(id)));

        pantalla.append(crearImagen(situacion.imagen, "juego-media-situacion"), texto, boton);
        return pantalla;
    }

    function pantallaDecision(id) {
        const situacion = datos.situaciones[id];
        const pantalla = crearPantalla("decision");
        const pregunta = crearElemento("h2", "juego-sr", datos.textos.queHaces);

        pregunta.tabIndex = -1;
        pregunta.dataset.enfoque = "";
        pantalla.style.setProperty("--juego-columnas", situacion.opciones.length);
        pantalla.append(pregunta);

        situacion.opciones.forEach((opcion) => {
            const columna = crearElemento("button", `juego-opcion juego-opcion-${opcion.posicion}`);
            columna.type = "button";
            columna.append(
                crearImagen(opcion.imagen, "juego-media-opcion"),
                crearElemento("span", "juego-opcion-texto", opcion.texto)
            );
            columna.addEventListener("click", () => elegir(opcion, columna, pantalla));
            pantalla.append(columna);
        });

        return pantalla;
    }

    function pantallaFinal(idFinal) {
        const pantalla = crearPantalla("final");
        const titulo = crearElemento("h2", "juego-titulo", datos.textos.tituloFinal);
        const boton = crearElemento("button", "btn btn-primary juego-boton", datos.textos.volverAJugar);

        titulo.tabIndex = -1;
        titulo.dataset.enfoque = "";
        boton.type = "button";
        boton.addEventListener("click", reiniciar);

        pantalla.append(
            titulo,
            crearElemento("p", "juego-final-texto", datos.finales[idFinal]),
            crearRastroFinal(),
            boton
        );
        return pantalla;
    }

    // Lista de las decisiones tomadas, con el color de cada posición.
    function crearRastroFinal() {
        const lista = crearElemento("ol", "juego-recorrido");
        recorrido.forEach((paso) => {
            const item = crearElemento("li", `juego-recorrido-paso juego-color-${paso.posicion}`);
            item.append(crearElemento("span", "juego-recorrido-punto"), crearElemento("span", "", paso.texto));
            lista.append(item);
        });
        return lista;
    }

    // ---------- Rastro superior ----------

    function agregarAlRastro(posicion) {
        const segmento = crearElemento("span", `juego-rastro-segmento juego-color-${posicion}`);
        const punto = crearElemento("span", `juego-rastro-punto juego-color-${posicion}`);
        rastro.append(segmento, punto);
        // Fuerza el estado inicial antes de animar el crecimiento.
        requestAnimationFrame(() => requestAnimationFrame(() => {
            segmento.classList.add("is-visible");
            punto.classList.add("is-visible");
        }));
    }

    function reiniciarRastro() {
        rastro.replaceChildren(crearElemento("span", "juego-rastro-punto juego-rastro-inicio is-visible"));
    }

    // ---------- Garabatos decorativos ----------

    const garabatos = document.querySelector(".juego-garabatos");

    // Inserta cada SVG en línea para que su color siga a currentColor.
    garabatos.querySelectorAll("[data-garabato]").forEach((garabato) => {
        fetch(`images/garabatos/${garabato.dataset.garabato}.svg`)
            .then((respuesta) => (respuesta.ok ? respuesta.text() : ""))
            .then((svg) => { garabato.innerHTML = svg; })
            .catch(() => {});
    });

    function actualizarGarabatos(posicion) {
        if (posicion) {
            document.body.dataset.garabatos = posicion;
        } else {
            delete document.body.dataset.garabatos;
        }

        if (!posicion || reducirMovimiento.matches) return;
        garabatos.classList.remove("is-pop");
        void garabatos.offsetWidth; // Reinicia la animación.
        garabatos.classList.add("is-pop");
    }

    // ---------- Flujo ----------

    function cambiarPantalla(nueva, posicion) {
        const actual = escenario.querySelector(".juego-pantalla:not(.is-saliendo)");
        escenario.prepend(nueva);

        if (!actual) {
            enfocar(nueva);
            return Promise.resolve();
        }

        const animacion = reducirMovimiento.matches
            ? "juego-sale-fundido"
            : `juego-sale-${posicion || "fundido"}`;

        actual.classList.add("is-saliendo", animacion);
        return new Promise((resolver) => {
            setTimeout(() => {
                actual.remove();
                enfocar(nueva);
                resolver();
            }, posicion && !reducirMovimiento.matches ? DURACION_GIRO : 450);
        });
    }

    function elegir(opcion, columna, pantalla) {
        if (ocupado) return;
        ocupado = true;

        recorrido.push({ posicion: opcion.posicion, texto: opcion.texto });
        pantalla.classList.add("is-eligiendo");
        columna.classList.add("is-elegida");

        setTimeout(() => {
            agregarAlRastro(opcion.posicion);
            actualizarProgreso();
            actualizarGarabatos(opcion.posicion);

            const siguiente = opcion.final
                ? pantallaFinal(opcion.final)
                : pantallaSituacion(opcion.siguiente);

            cambiarPantalla(siguiente, opcion.posicion).then(() => {
                ocupado = false;
            });
        }, DURACION_RESALTE);
    }

    function reiniciar() {
        if (ocupado) return;
        recorrido = [];
        actualizarProgreso();
        actualizarGarabatos(null);
        reiniciarRastro();
        cambiarPantalla(pantallaInicio());
    }

    reiniciarRastro();
    actualizarProgreso();
    cambiarPantalla(pantallaInicio());
});
