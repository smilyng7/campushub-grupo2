/**
 * estadisticas.js
 * Funciones de análisis y utilidades con ES6+
 * (map, filter, reduce, Map, Set, operador spread y closures).
 */

/**
 * 1. Reservas agrupadas por estado utilizando Array.prototype.reduce.
 * Devuelve un objeto con las cantidades por cada estado.
 */
export const reservasPorEstado = (reservas = []) => {
    return reservas.reduce(
        (acumulador, reserva) => {
            const estado = reserva.estado ?? 'pendiente';
            acumulador[estado] = (acumulador[estado] ?? 0) + 1;
            return acumulador;
        },
        { pendiente: 0, aprobada: 0, rechazada: 0 } // Valor inicial: objeto contador
    );
};

/**
 * 2. Ocupación por laboratorio utilizando Map.
 * Mapea cada laboratorioId con el número de reservas asociadas.
 */
export const ocupacionPorLaboratorio = (reservas = []) => {
    const mapaOcupacion = new Map();

    for (const reserva of reservas) {
        const labId = reserva.laboratorioId;
        if (labId !== undefined && labId !== null) {
            const actual = mapaOcupacion.get(labId) ?? 0;
            mapaOcupacion.set(labId, actual + 1);
        }
    }

    return mapaOcupacion;
};

/**
 * 3. Sedes únicas utilizando Set.
 */
export const sedesUnicas = (laboratorios = []) => {
    const conjuntoSedes = new Set(laboratorios.map((lab) => lab.sede).filter(Boolean));
    return [...conjuntoSedes];
};

/**
 * 4. Ranking de laboratorios más reservados con sort() y spread [...].
 * El spread operator evita mutar el arreglo original.
 */
export const rankingLaboratoriosMasReservados = (laboratorios = [], reservas = []) => {
    const mapaConteos = ocupacionPorLaboratorio(reservas);

    return [...laboratorios]
        .map((lab) => ({
            ...lab,
            totalReservas: mapaConteos.get(lab.id) ?? 0,
        }))
        .sort((a, b) => b.totalReservas - a.totalReservas);
};

/**
 * 5. Generador de correlativos consecutivos utilizando Closure y .padStart().
 */
export const crearGeneradorCodigo = (prefijo = 'RES', valorInicial = 1) => {
    let contador = valorInicial; // Variable retenida en el closure

    return function siguienteCodigo() {
        const correlativo = String(contador).padStart(4, '0');
        contador += 1;
        return `${prefijo}-${correlativo}`;
    };
};