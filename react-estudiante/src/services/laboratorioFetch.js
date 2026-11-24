
const API_URL = "http://localhost:3000";

// Obtener todos los laboratorios
export async function obtenerLaboratorios() {
  try {
    const response = await fetch(`${API_URL}/laboratorios`);

    if (!response.ok) {
      throw new Error(
        `Error al obtener laboratorios: ${response.status}`
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error en Fetch:", error);
    throw error;
  }
}

// Obtener un laboratorio por su ID
export async function obtenerLaboratorioPorId(id) {
  try {
    const response = await fetch(
      `${API_URL}/laboratorios/${id}`
    );

    if (!response.ok) {
      throw new Error(
        `Error al obtener el laboratorio: ${response.status}`
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error en Fetch:", error);
    throw error;
  }
}
