/**
 * validadores.js
 * Funciones de validación con expresiones regulares y mensajes de error
 * formateados mediante template literals para el sistema.
 */

// 1. Expresión regular para correo institucional UTP (@utp.edu.pe)
export const esCorreoUTP = (correo) => /^[a-z0-9._%+-]+@utp\.edu\.pe$/i.test(correo ?? '');

// 2. Expresión regular para código de alumno (U seguido de exactamente 8 dígitos)
export const esCodigoAlumno = (codigo) => /^U\d{8}$/.test(codigo ?? '');

// 3. Expresión regular para formato de hora 24h (HH:mm de 00:00 a 23:59)
export const esHora = (hora) => /^([01]\d|2[0-3]):[0-5]\d$/.test(hora ?? '');

// 4. Expresión regular para formato de fecha (AAAA-MM-DD)
export const esFecha = (fecha) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(fecha ?? '');

// 5. Validación de capacidad de laboratorio (rango obligatorio: 1 a 60)
export const esCapacidadValida = (capacidad) => {
    const num = Number(capacidad);
    return Number.isInteger(num) && num >= 1 && num <= 60;
};

// --- Mensajes de error construidos con template literals ---

export const mensajeErrorCorreo = (correo) =>
    `El correo "${correo}" es inválido. Debe pertenecer al dominio institucional (@utp.edu.pe).`;

export const mensajeErrorCodigo = (codigo) =>
    `El código "${codigo}" no cumple con el formato requerido. Debe iniciar con 'U' seguido de 8 dígitos (ej. U20231234).`;

export const mensajeErrorHora = (hora) =>
    `La hora "${hora}" no es válida. Debe tener formato HH:mm de 24 horas (ej. 08:30 o 14:00).`;

export const mensajeErrorFecha = (fecha) =>
    `La fecha "${fecha}" es inválida. Debe respetar el formato AAAA-MM-DD (ej. 2026-11-20).`;

export const mensajeErrorCapacidad = (capacidad) =>
    `La capacidad ingresada (${capacidad}) está fuera de rango. Debe ser un número entero entre 1 y 60 personas.`;

export const mensajeErrorHorarioInvalido = (horaInicio, horaFin) =>
    `El intervalo de reserva es inconsistente: horaFin (${horaFin}) debe ser estrictamente posterior a horaInicio (${horaInicio}).`;

/**
 * Validador integral de usuario que devuelve resultado y errores
 */
export const validarUsuario = (usuario = {}) => {
    const errores = [];
    if (!esCorreoUTP(usuario.correo)) {
        errores.push(mensajeErrorCorreo(usuario.correo));
    }
    if (!esCodigoAlumno(usuario.codigo)) {
        errores.push(mensajeErrorCodigo(usuario.codigo));
    }
    return {
        esValido: errores.length === 0,
        errores,
    };
};