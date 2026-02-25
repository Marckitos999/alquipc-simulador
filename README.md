# ALQUIPC · Simulador de facturación

Aplicativo web en HTML, CSS y JavaScript que reemplaza el ejecutable con errores (`pruebas1.exe`) y permite calcular la facturación del servicio de alquiler de portátiles de ALQUIPC sin necesidad de imprimir recibos.

## Reglas de negocio implementadas

- **Tarifa base:** $35.000 COP por equipo y por día.
- **Cantidad mínima:** 2 equipos por solicitud.
- **Modalidades:**
  - Dentro de la ciudad (sin ajuste).
  - Fuera de la ciudad: recargo logístico del 5%.
  - Dentro del establecimiento: descuento del 5%.
- **Días adicionales:** mantienen el descuento del 2% por día, pero ahora se limita al 10% del subtotal para evitar pérdidas y cumplir con la mejora solicitada.
- **Id-cliente:** se genera automáticamente para cada cotización, lo que facilita el seguimiento por correo.
- **Salida digital:** sólo muestra el resumen listo para enviar por e-mail, en línea con la política de reciclaje de papel.

## Cómo usar el simulador

1. Abre `A.html` en tu navegador o despliega el sitio (por ejemplo en GitHub Pages).
2. Completa los datos del cliente, la cantidad de equipos y los días requeridos.
3. Elige la modalidad (ciudad, foránea o dentro del local) y registra observaciones internas si las hay.
4. Presiona **Calcular propuesta** para ver el Id-cliente generado, los descuentos y el total a facturar.
5. Copia el resumen resultante y envíalo al cliente por correo.
6. Usa el botón **Limpiar** para reiniciar el proceso.

## Calidad según la norma McCall

- **Corrección y fiabilidad:** Validaciones estrictas de rangos, cálculos deterministas y mensajes inmediatos.
- **Usabilidad:** Interfaz accesible, explicación contextual y resumen listo para copiar.
- **Mantenibilidad:** Código separado por responsabilidades (HTML semántico, CSS modular y JavaScript dedicado).
- **Eficiencia:** Todo se procesa en el navegador, sin dependencias externas.

