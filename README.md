# ALQUIPC · Simulador de facturación

Aplicativo web en **HTML, CSS y JavaScript** que reemplaza el ejecutable con errores (`pruebas1.exe`) y permite cotizar el alquiler de portátiles sin imprimir recibos, cumpliendo con la política de reciclaje de la empresa.

## Reglas de negocio implementadas

- **Tarifa base:** $35.000 COP por equipo y por día.
- **Cantidad mínima:** 2 equipos por solicitud.
- **Modalidades de alquiler:**
  - Dentro de la ciudad (sin ajuste).
  - Fuera de la ciudad: recargo logístico del 5%.
  - Dentro del establecimiento: descuento del 5%.
- **Días adicionales:** mantienen el descuento del 2% por día, limitado al 10% del subtotal para evitar pérdidas (mejora solicitada).
- **Id-cliente:** se genera automáticamente para cada cotización, soportando el seguimiento vía correo electrónico.
- **Salida digital:** resume modalidad, equipos, días, descuentos y total listo para enviarlo por e-mail.

## Requisitos previos (local)

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Opcional: servidor estático simple (Live Server, `npx serve`, etc.) para pruebas si no se usa GitHub Pages.

## Instalación y ejecución local

1. Clona o descarga este repositorio.
2. Asegúrate de que el archivo principal se llame `index.html` y que los estilos (`stylo.css`, `styloflexbox.css`, `stylo3.css`) y la lógica (`app.js`) estén en la raíz del proyecto.
3. Abre `index.html` en tu navegador preferido.
4. (Opcional) Ejecuta un servidor estático para evitar problemas de caché o rutas.

## Uso del simulador

1. Completa los datos del cliente (nombre y correo) y del servicio (equipos, días iniciales, días adicionales y modalidad).
2. Haz clic en **Calcular propuesta**; se mostrará el Id-cliente, los ajustes aplicados y el total a facturar.
3. Copia el resumen y envíalo por correo al cliente; no se imprime ningún recibo.
4. Usa **Limpiar** para reiniciar el formulario y registrar una nueva solicitud.

## Despliegue en GitHub Pages

1. Sube el contenido a un repositorio público de GitHub.
2. Ve a **Settings → Pages** y selecciona la rama `main` con la carpeta `/ (root)`.
3. Guarda los cambios y espera el despliegue.
4. Verifica el enlace generado (ejemplo: `https://TU_USUARIO.github.io/alquipc-simulador/`) y compártelo en Classroom junto con el repositorio si es necesario.

## Calidad según la norma McCall

- **Corrección y fiabilidad:** Validaciones de rangos, cálculo determinista y mensajes inmediatos.
- **Usabilidad:** Formularios accesibles, explicación contextual y resumen listo para copiar.
- **Mantenibilidad:** Separación clara entre HTML semántico, CSS modular y JavaScript.
- **Eficiencia:** Todo el procesamiento sucede en el navegador; no requiere backend.

## Próximos pasos sugeridos

1. Añadir pruebas unitarias o de integración para validar las fórmulas de negocio.
2. Registrar auditoría básica (historial de cotizaciones) si el instructor lo solicita.
3. Documentar en el cuaderno cómo se aplicaron los factores de McCall y adjuntar capturas del simulador funcionando.

