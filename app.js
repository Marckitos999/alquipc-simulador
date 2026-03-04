// Inicializar select de Materialize CSS
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

var TARIFA_BASE = 35000;
var form = document.getElementById("quote-form");
var summaryOutput = document.getElementById("summary-output");
var messageBox = document.getElementById("form-messages");
var resetButton = document.getElementById("reset-form");

function validarNombre(nombre) {
    // Solo letras y espacios
    var x = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre);
}

function validarCorreo(correo) {
    // Correo básico, sin caracteres raros, permite un solo @
    var regex = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(correo);
}

function formatearMoneda(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function calcular() {
    // Limpiar mensajes
    messageBox.innerHTML = "";
    messageBox.style.color = "red";

    // Obtener valores
    var nombre = document.getElementById("client-name").value.trim();
    var correo = document.getElementById("client-email").value.trim();
    var equipos = parseInt(document.getElementById("equipment-count").value);
    var diasIniciales = parseInt(document.getElementById("initial-days").value);
    var diasExtra = parseInt(document.getElementById("extra-days").value) || 0;
    var modalidad = document.getElementById("location-option").value;
    var notas = document.getElementById("notes").value.trim();

    // Validaciones básicas
    var errores = [];

    if (nombre === "") {
        errores.push("Ingresa el nombre del cliente.");
    } else if (!validarNombre(nombre)) {
        errores.push("El nombre no debe contener números ni caracteres especiales.");
    }

    if (correo === "") {
        errores.push("Ingresa el correo electrónico.");
    } else if (!validarCorreo(correo)) {
        errores.push("El correo debe tener un formato válido sin caracteres especiales.");
    }

    if (isNaN(equipos) || equipos < 2) {
        errores.push("El número de equipos debe ser mínimo 2.");
    }

    if (isNaN(diasIniciales) || diasIniciales < 1) {
        errores.push("Ingresa al menos 1 día inicial.");
    }

    if (diasExtra < 0) {
        errores.push("Los días adicionales no pueden ser negativos.");
    }

    if (modalidad === "") {
        errores.push("Selecciona una modalidad válida.");
    }

    if (errores.length > 0) {
        var listaErrores = "<ul>";
        for (var i = 0; i < errores.length; i++) {
            listaErrores += "<li>" + errores[i] + "</li>";
        }
        listaErrores += "</ul>";
        messageBox.innerHTML = listaErrores;

        summaryOutput.innerHTML = "<p>Corrige los errores en el formulario.</p>";
        return;
    }

    // Cálculos
    var costoBase = TARIFA_BASE * equipos * diasIniciales;
    var costoExtra = TARIFA_BASE * equipos * diasExtra;

    // Recargo por días adicionales (2% adicional por cada día extra)
    var porcentajeRecargo = diasExtra * 0.02;
    var valorRecargo = costoExtra * porcentajeRecargo;

    // Ahora sumamos el recargo en lugar de restarlo como descuento
    var subtotal = costoBase + costoExtra + valorRecargo;

    // Ajuste por modalidad
    var porcentajeAjuste = 0;
    var nombreModalidad = "";
    if (modalidad === "ciudad") {
        porcentajeAjuste = 0;
        nombreModalidad = "Dentro de la ciudad";
    } else if (modalidad === "foranea") {
        porcentajeAjuste = 0.05;
        nombreModalidad = "Fuera de la ciudad (+5%)";
    } else if (modalidad === "local") {
        porcentajeAjuste = -0.05;
        nombreModalidad = "Dentro del establecimiento (-5%)";
    }

    var valorAjuste = subtotal * porcentajeAjuste;
    var total = subtotal + valorAjuste;

    // Mostrar resumen
    var resumenHTML = "<h6>Detalles de Cotización</h6>";
    resumenHTML += "<p><strong>Cliente:</strong> " + nombre + "</p>";
    resumenHTML += "<p><strong>Correo:</strong> " + correo + "</p>";
    resumenHTML += "<p><strong>Equipos:</strong> " + equipos + "</p>";
    resumenHTML += "<p><strong>Días iniciales:</strong> " + diasIniciales + "</p>";
    resumenHTML += "<p><strong>Días adicionales:</strong> " + diasExtra + "</p>";
    resumenHTML += "<p><strong>Modalidad:</strong> " + nombreModalidad + "</p>";
    resumenHTML += "<p><strong>Notas:</strong> " + (notas === "" ? "Ninguna" : notas) + "</p>";

    resumenHTML += "<hr>";
    resumenHTML += "<p><strong>Subtotal días iniciales:</strong> " + formatearMoneda(costoBase) + "</p>";
    resumenHTML += "<p><strong>Costo días adicionales:</strong> " + formatearMoneda(costoExtra) + "</p>";
    if (diasExtra > 0) {
        resumenHTML += "<p><strong>Recargo (días adicionales):</strong> +" + formatearMoneda(valorRecargo) + "</p>";
    }

    if (valorAjuste >= 0) {
        resumenHTML += "<p><strong>Ajuste por modalidad:</strong> +" + formatearMoneda(valorAjuste) + "</p>";
    } else {
        resumenHTML += "<p><strong>Ajuste por modalidad:</strong> " + formatearMoneda(valorAjuste) + "</p>";
    }

    resumenHTML += "<h5 class='blue-text text-darken-2'><strong>Total a facturar:</strong> " + formatearMoneda(total) + "</h5>";

    summaryOutput.innerHTML = resumenHTML;

    messageBox.style.color = "green";
    messageBox.innerHTML = "Cotización generada correctamente.";
}

// Eventos
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página recargue
    calcular();
});

resetButton.addEventListener("click", function () {
    form.reset();
    summaryOutput.innerHTML = "<p>Completa el formulario para generar el resumen y el valor final a facturar.</p>";
    messageBox.innerHTML = "";
});
