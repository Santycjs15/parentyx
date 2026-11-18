/* =========================
   PARENTYX - CARTILLAS PSICOEDUCATIVAS
   Lista de cartillas (productos.html) y detalle de una cartilla (cartilla.html).
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    const lista = document.querySelector("[data-cartillas-lista]");
    const detalle = document.querySelector("[data-cartilla-detalle]");

    if (lista) mostrarLista(lista);
    if (detalle) mostrarDetalle(detalle);
});

function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;
    return elemento;
}

function crearImagen(cartilla, clase) {
    const imagen = crear("img", clase);
    imagen.src = encodeURI(cartilla.imagen);
    imagen.alt = `Portada de la cartilla ${cartilla.numero}: ${cartilla.indice}`;
    return imagen;
}

function mostrarLista(lista) {
    CARTILLAS.forEach((cartilla) => {
        const tarjeta = crear("a", "product-row cartilla-row");
        tarjeta.href = `cartilla.html?id=${encodeURIComponent(cartilla.id)}`;
        tarjeta.style.setProperty("--cartilla-color", cartilla.color);

        const media = crear("div", "product-row-media");
        const imagen = crearImagen(cartilla, "product-row-image");
        imagen.loading = "lazy";
        media.append(imagen);

        const cuerpo = crear("div", "product-row-body");
        const temas = crear("ul", "cartilla-temas");
        cartilla.temas.forEach((tema) => temas.append(crear("li", "", tema)));

        cuerpo.append(
            crear("span", "cartilla-numero", cartilla.numero),
            crear("h3", "", cartilla.indice),
            crear("p", "", cartilla.descripcion),
            temas,
            crear("span", "cartilla-ver", "Ver cartilla →")
        );

        tarjeta.append(media, cuerpo);
        lista.append(tarjeta);
    });
}

function mostrarDetalle(detalle) {
    const id = new URLSearchParams(window.location.search).get("id");
    const cartilla = CARTILLAS.find((item) => item.id === id);

    if (!cartilla) {
        window.location.replace("productos.html");
        return;
    }

    document.title = `${cartilla.indice} | PARENTYX`;
    document.querySelector("[data-cartilla-titulo]").textContent = cartilla.indice;
    document.querySelector("[data-cartilla-descripcion]").textContent = cartilla.descripcion;

    detalle.style.setProperty("--cartilla-color", cartilla.color);
    detalle.append(crearImagen(cartilla, "cartilla-imagen-grande"));
}
