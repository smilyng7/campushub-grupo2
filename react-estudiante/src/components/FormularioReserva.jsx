import { useEffect, useRef, useState } from 'react';
import { esFecha, esHora } from '../../../core-js/validadores.js';
import { Reserva } from '../../../core-js/modelos.js';

const vacio = { laboratorioId: '', fecha: '', horaInicio: '', horaFin: '', motivo: '' };
const campos = [
  ['laboratorioId', 'Laboratorio', 'select'],
  ['fecha', 'Fecha', 'date'],
  ['horaInicio', 'Hora de inicio', 'time'],
  ['horaFin', 'Hora de fin', 'time'],
  ['motivo', 'Motivo', 'textarea'],
];

function validar(datos, laboratorio, reservas) {
  const errores = {};
  if (!laboratorio) errores.laboratorioId = 'Selecciona un laboratorio disponible.';
  if (!esFecha(datos.fecha)) errores.fecha = 'Ingresa una fecha válida.';
  if (!esHora(datos.horaInicio)) errores.horaInicio = 'Ingresa la hora de inicio.';
  if (!esHora(datos.horaFin)) errores.horaFin = 'Ingresa la hora de fin.';
  if (!datos.motivo.trim()) errores.motivo = 'Escribe el motivo de la reserva.';

  if (!errores.horaInicio && !errores.horaFin) {
    const nueva = new Reserva({ ...datos, laboratorioId: laboratorio?.id });
    if (!nueva.esHorarioValido()) {
      errores.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
    } else if (laboratorio && !errores.fecha && reservas.some(
      existente => existente.estado !== 'rechazada' && nueva.seCruzaCon(existente)
    )) {
      errores.horaInicio = 'Este laboratorio ya tiene una reserva en ese horario.';
    }
  }
  return errores;
}

export default function FormularioReserva({
  laboratorioInicial = '', laboratorios, reservas, usuarioId, onGuardar,
}) {
  const [datos, setDatos] = useState({ ...vacio, laboratorioId: laboratorioInicial });
  const [revisado, setRevisado] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const envioEnCurso = useRef(false);
  const primero = useRef(null);
  const laboratorio = laboratorios.find(lab => String(lab.id) === datos.laboratorioId);
  const errores = revisado ? validar(datos, laboratorio, reservas) : {};

  useEffect(() => { if (!enviando) primero.current?.focus(); }, [enviando]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos(actuales => ({ ...actuales, [name]: value }));
    setGuardado(false);
  }

  async function guardar(evento) {
    evento.preventDefault();
    if (envioEnCurso.current) return;
    setGuardado(false);
    setErrorEnvio('');
    setRevisado(true);
    if (Object.keys(validar(datos, laboratorio, reservas)).length) return;
    envioEnCurso.current = true;
    setEnviando(true);
    try {
      await onGuardar({ ...datos, laboratorioId: laboratorio.id, usuarioId, motivo: datos.motivo.trim() });
      setDatos(vacio);
      setRevisado(false);
      setGuardado(true);
    } catch (fallo) {
      setErrorEnvio(fallo.message || 'No se pudo guardar la reserva.');
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <form className="card card-body my-3" onSubmit={guardar} noValidate>
      {campos.map(([nombre, etiqueta, tipo]) => {
        const error = errores[nombre];
        const control = {
          id: nombre, name: nombre, value: datos[nombre], onChange: cambiar, required: true, disabled: enviando,
          className: (tipo === 'select' ? 'form-select' : 'form-control') + (error ? ' is-invalid' : ''),
          'aria-invalid': Boolean(error), 'aria-describedby': error ? nombre + '-error' : undefined,
        };
        return (
          <div className="mb-3" key={nombre}>
            <label className="form-label" htmlFor={nombre}>{etiqueta}</label>
            {tipo === 'select' ? (
              <select {...control} ref={primero}>
                <option value="">Selecciona un laboratorio</option>
                {laboratorios.map(lab => <option key={lab.id} value={lab.id}>{lab.nombre} · {lab.sede}</option>)}
              </select>
            ) : tipo === 'textarea' ? (
              <textarea {...control} rows={2} />
            ) : (
              <input {...control} type={tipo} />
            )}
            {error && <div id={nombre + '-error'} className="invalid-feedback">{error}</div>}
          </div>
        );
      })}
      {errorEnvio && <p className="alert alert-danger" role="alert">{errorEnvio}</p>}
      <button disabled={enviando} className="btn btn-primary align-self-start">
        {enviando ? 'Guardando...' : 'Guardar reserva'}
      </button>
      {guardado && <p className="text-success mt-3 mb-0" role="status">Reserva registrada.</p>}
    </form>
  );
}
