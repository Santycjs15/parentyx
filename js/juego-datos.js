/* =========================
   PARENTYX - DATOS DEL JUEGO DE DECISIONES
   Edita aquí todos los textos, imágenes y caminos del juego.
   No es necesario tocar js/juego.js para cambiar el contenido.
   ========================= */

const JUEGO_DATOS = {
    titulo: "PARENTYX Experigame",
    introduccion: "Cada decisión cuenta. Descubre cómo tus reacciones acompañan las emociones de tu hijo.",

    textos: {
        comenzar: "Comenzar",
        queHaces: "¿Qué haces?",
        volverAJugar: "Volver a jugar",
        tituloFinal: "Tu recorrido",
        tituloRastro: "Recorrido de decisiones"
    },

    // Carpeta donde se buscan las imágenes.
    carpetaImagenes: "images/juego/",
    altPendiente: "Descripción pendiente",

    // Situación con la que empieza el juego.
    inicio: "1",

    /*
       Cada situación tiene:
       - imagen: nombre del archivo en la carpeta de imágenes.
       - texto: texto de la situación.
       - opciones: una por columna. El número de opciones define el número de columnas.
         · posicion: "izquierda", "centro" o "derecha" (define el color y el giro).
         · siguiente: id de otra situación, o bien
         · final: id de una retroalimentación final.
    */
    situaciones: {
        "1": {
            imagen: "situacion-1.png",
            texto: "Estás en un centro comercial acompañado de tu hijo y este hace una pataleta en público y comienza a llorar porque quiere que le compres un juguete. ¿Cuál es tu reacción?",
            opciones: [
                { posicion: "izquierda", imagen: "opcion-1A.png", texto: "Le dices que deje de llorar y que no vas a comprarlo.", siguiente: "A2" },
                { posicion: "centro", imagen: "opcion-1B.png", texto: "Le dices que es válido que esté molesto, pero ahora no lo vas a comprar.", siguiente: "B2" },
                { posicion: "derecha", imagen: "opcion-1C.png", texto: "Le compras el juguete para que deje de llorar.", siguiente: "C2" }
            ]
        },
        "A2": {
            imagen: "situacion-A2.png",
            texto: "Debido a esa respuesta, tu hijo empezó a llorar más fuerte, perdió el control y empezó a lanzar objetos. ¿Cuál es tu siguiente reacción?",
            opciones: [
                { posicion: "izquierda", imagen: "opcion-A2-A.png", texto: "Lo cargas y lo sacas del centro comercial.", siguiente: "A3" },
                { posicion: "derecha", imagen: "opcion-A2-B.png", texto: "Lo ignoras.", siguiente: "A3" }
            ]
        },
        "A3": {
            imagen: "situacion-A3.png",
            texto: "El niño empezó a llorar más fuerte buscando tu atención. ¿Qué haces?",
            opciones: [
                { posicion: "izquierda", imagen: "opcion-A3-A.png", texto: "Le pegas.", final: "A-pegar" },
                { posicion: "derecha", imagen: "opcion-A3-B.png", texto: "Hablas con él.", final: "A-hablar" }
            ]
        },
        "B2": {
            imagen: "situacion-B2.png",
            texto: "Tu hijo sigue molesto y llorando en público. ¿Qué haces?",
            opciones: [
                { posicion: "izquierda", imagen: "opcion-B2-A.png", texto: "Le das un momento para tranquilizarse y después hablas con él.", final: "B-momento" },
                { posicion: "derecha", imagen: "opcion-B2-B.png", texto: "Le dices que deje de comportarse así porque están en público.", final: "B-publico" }
            ]
        },
        "C2": {
            imagen: "situacion-C2.png",
            texto: "Después de comprarle el juguete, tu hijo se calma. Más adelante ve otro juguete y vuelve a pedirte que se lo compres.",
            opciones: [
                { posicion: "izquierda", imagen: "opcion-C2-A.png", texto: "Le dices que después se lo compras.", final: "C" },
                { posicion: "derecha", imagen: "opcion-C2-B.png", texto: "Le compras el nuevo juguete.", final: "C" }
            ]
        }
    },

    finales: {
        "A-pegar": "Pegar no enseña a manejar las emociones. En la crianza positiva puedes poner límites con firmeza, pero también con respeto y diálogo.",
        "A-hablar": "La crianza positiva no consiste en ceder siempre ante los requerimientos del niño, sino en validar la emoción sin dejar de poner el límite ante la situación. Por ello, hablar puede ser una buena opción.",
        "B-momento": "Dar momentos al niño para experimentar emociones difíciles y luego calmarse le ayuda a reconocer y manejar lo que siente. Así, después puedes hablar con él y explicar el límite con más tranquilidad.",
        "B-publico": "En lugar de pedirle que deje de sentir la emoción, como padres o cuidadores es necesario ayudarle a manejar, expresar y calmar esa emoción.",
        "C": "Ceder ante cada situación le enseña al niño que insistir es la manera de conseguir todo lo que quiere. Por eso, mantener límites respetuosos también es una forma de enseñar y cuidar."
    }
};
