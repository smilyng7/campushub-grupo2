import TarjetaLaboratorio from './TarjetaLaboratorio';

export default function ListaLaboratorios({ laboratorios }) {
  if (laboratorios.length === 0) {
    return (
      <div className="alert alert-info">
        No se encontraron laboratorios con esos filtros.
      </div>
    );
  }

  return (
    <div className="row g-3">
      {laboratorios.map((laboratorio) => (
        <div className="col-md-6 col-lg-4" key={laboratorio.id}>
          <TarjetaLaboratorio lab={laboratorio} />
        </div>
      ))}
    </div>
  );
}
