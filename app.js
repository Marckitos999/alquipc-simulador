const BASE_DAILY_RATE = 35000;
const ADDITIONAL_DAY_DISCOUNT = 0.02; // 2 % por cada día adicional
const MAX_ADDITIONAL_DISCOUNT = 0.1; // Límite del 10 % para proteger la rentabilidad
const LOCATION_RULES = {
    ciudad: {
        label: "Dentro de la ciudad",
        adjustment: 0,
        badge: "SIN RECARGO"
    },
    foranea: {
        label: "Fuera de la ciudad",
        adjustment: 0.05,
        badge: "+5 % logística"
    },
    local: {
        label: "Dentro del establecimiento",
        adjustment: -0.05,
        badge: "-5 % onsite"
    }
};

const currency = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP"
});

const form = document.querySelector("#quote-form");
const summaryOutput = document.querySelector("#summary-output");
const messageBox = document.querySelector("#form-messages");
const resetButton = document.querySelector("#reset-form");

const defaultSummary = `
    <p>Completa el formulario para generar el Id-cliente, los descuentos aplicados y el valor final a facturar.</p>
`;

const defaultMessage = "Aún no hay cálculos registrados.";

if (summaryOutput && !summaryOutput.innerHTML.trim()) {
    summaryOutput.innerHTML = defaultSummary;
}
if (messageBox) {
    messageBox.textContent = defaultMessage;
}

function formatCurrency(value) {
    return currency.format(Math.round(value));
}

function createClientId(name) {
    const trimmed = name.trim();
    const initials = trimmed
        .split(/\s+/)
        .slice(0, 2)
        .map((chunk) => chunk[0] || "X")
        .join("")
        .toUpperCase();
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 90 + 10);
    return `ALQ-${initials || "CL"}-${timestamp}${random}`;
}

function getNumericValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function collectValues(formData) {
    return {
        clientName: formData.get("clientName")?.toString().trim() || "",
        clientEmail: formData.get("clientEmail")?.toString().trim() || "",
        equipment: getNumericValue(formData.get("equipment")),
        initialDays: getNumericValue(formData.get("initialDays")),
        extraDays: getNumericValue(formData.get("extraDays")),
        location: formData.get("location")?.toString() || "ciudad",
        notes: formData.get("notes")?.toString().trim() || ""
    };
}

function validate(values) {
    const errors = [];

    if (!values.clientName) {
        errors.push("Ingresa el nombre del cliente.");
    }
    if (!values.clientEmail) {
        errors.push("Ingresa un correo válido.");
    }
    if (values.equipment < 2) {
        errors.push("El número de equipos debe ser mínimo 2.");
    }
    if (values.initialDays < 1) {
        errors.push("Ingresa al menos 1 día inicial.");
    }
    if (values.extraDays < 0) {
        errors.push("Los días adicionales no pueden ser negativos.");
    }
    if (values.equipment > 500) {
        errors.push("Por seguridad solo se permiten hasta 500 equipos por solicitud.");
    }
    if (values.initialDays > 120) {
        errors.push("La solicitud inicial no puede superar 120 días continuos.");
    }
    if (values.extraDays > 120) {
        errors.push("Los días adicionales no pueden ser mayores a 120.");
    }
    if (!LOCATION_RULES[values.location]) {
        errors.push("Selecciona una modalidad válida.");
    }

    return errors;
}

function calculateTotals(values) {
    const baseCost = BASE_DAILY_RATE * values.equipment * values.initialDays;
    const extraCost = BASE_DAILY_RATE * values.equipment * values.extraDays;
    const discountRate = Math.min(values.extraDays * ADDITIONAL_DAY_DISCOUNT, MAX_ADDITIONAL_DISCOUNT);
    const discountValue = extraCost * discountRate;
    const subtotal = baseCost + extraCost - discountValue;
    const locationRule = LOCATION_RULES[values.location];
    const locationAdjustment = subtotal * locationRule.adjustment;
    const total = subtotal + locationAdjustment;

    return {
        baseCost,
        extraCost,
        discountRate,
        discountValue,
        subtotal,
        locationAdjustment,
        total,
        locationRule
    };
}

function renderErrors(errors) {
    if (!messageBox) {
        return;
    }
    if (!errors.length) {
        messageBox.textContent = "Cotización generada correctamente.";
        messageBox.style.color = "var(--primary)";
        return;
    }
    const list = errors.map((err) => `• ${err}`).join(" \n");
    messageBox.textContent = list;
    messageBox.style.color = "var(--accent)";
}

function renderSummary(values, totals, clientId) {
    if (!summaryOutput) {
        return;
    }

    const extraDaysInfo = values.extraDays
        ? `${values.extraDays} día(s) con ${Math.round(totals.discountRate * 100)}% de descuento controlado`
        : "Sin días adicionales";

    summaryOutput.innerHTML = `
        <p class="summary__id">${clientId}</p>
        <div class="summary__meta">
            <span class="badge">${values.equipment} equipos</span>
            <span class="badge">${values.initialDays} día(s) iniciales</span>
            <span class="badge">${extraDaysInfo}</span>
            <span class="badge">${totals.locationRule.badge}</span>
        </div>
        <ul class="summary__list">
            <li class="summary__row"><span>Cliente</span><strong>${values.clientName}</strong></li>
            <li class="summary__row"><span>Correo</span><strong>${values.clientEmail}</strong></li>
            <li class="summary__row"><span>Modalidad</span><strong>${totals.locationRule.label}</strong></li>
            <li class="summary__row"><span>Notas internas</span><strong>${values.notes || "Sin observaciones"}</strong></li>
        </ul>
        <div class="summary__totals">
            <p><span>Subtotal días iniciales</span><strong>${formatCurrency(totals.baseCost)}</strong></p>
            <p><span>Costo días adicionales</span><strong>${formatCurrency(totals.extraCost)}</strong></p>
            <p><span>Descuento controlado</span><strong>-${formatCurrency(totals.discountValue)}</strong></p>
            <p><span>Ajuste por modalidad</span><strong>${totals.locationAdjustment >= 0 ? "+" : ""}${formatCurrency(totals.locationAdjustment)}</strong></p>
        </div>
        <p class="summary__total">Total a facturar: ${formatCurrency(totals.total)}</p>
        <p class="summary__note">Incluye la mejora solicitada: el descuento por días adicionales se limita al 10 % del subtotal para garantizar la sostenibilidad.</p>
    `;
}

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = collectValues(formData);
    const errors = validate(values);

    renderErrors(errors);

    if (errors.length) {
        summaryOutput.innerHTML = defaultSummary;
        return;
    }

    const totals = calculateTotals(values);
    const clientId = createClientId(values.clientName);
    renderSummary(values, totals, clientId);
}

function handleReset() {
    form.reset();
    summaryOutput.innerHTML = defaultSummary;
    if (messageBox) {
        messageBox.textContent = defaultMessage;
        messageBox.style.color = "var(--muted)";
    }
}

if (form) {
    form.addEventListener("submit", handleSubmit);
}

if (resetButton) {
    resetButton.addEventListener("click", handleReset);
}
***