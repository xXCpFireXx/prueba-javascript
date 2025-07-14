// =================== SERVICIOS PARA API (json-server) ===================

// URL base para la colección de eventos
const BASE_URL_EVENT = "http://localhost:3000/event";

// URL base para los usuarios del sistema (usado en el login)
const BASE_URL_SYSTEM = "http://localhost:3000/user";

const BASE_URL_ENROLLMENTS = "http://localhost:3000/enrollments";
// =================== FUNCIONES CRUD ===================

// GET: Obtener todos los eventos registrados en la "base de datos"
export const getEvents = async () => {
  try {
    const res = await fetch(BASE_URL_EVENT); // Realiza la solicitud GET
    return await res.json(); // Convierte la respuesta en formato JSON
  } catch (error) {
    console.error("Error getting events:", error);
    return []; // Retorna arreglo vacío si ocurre error
  }
};

// POST: Agregar un nuevo evento a la base de datos
export const addEvent = async (event) => {
  try {
    const res = await fetch(BASE_URL_EVENT, {
      method: "POST", // Método HTTP para crear recurso
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event), // Convierte el objeto usuario a JSON
    });
    return await res.json(); // Retorna la respuesta procesada
  } catch (error) {
    console.error("Error adding event:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};

// PUT: Actualizar un evento existente según su ID
export const updateEvent = async (id, updatedEvent) => {
  try {
    const res = await fetch(`${BASE_URL_EVENT}/${id}`, {
      method: "PUT", // Método para reemplazar por completo el recurso
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// DELETE: Eliminar un evento específico por su ID
export const deleteEvent = async (id) => {
  try {
    const res = await fetch(`${BASE_URL_EVENT}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete event");
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};


// =================== USUARIOS DEL SISTEMA (Login y Register) ===================

// GET: Obtener todos los usuarios del sistema que tienen acceso (usado para validación de login)
export const getUsersSystem = async () => {
  try {
    const res = await fetch(BASE_URL_SYSTEM); // Consulta GET
    return await res.json(); // Devuelve arreglo de usuarios con sus credenciales
  } catch (error) {
    console.error("Error getting system's users:", error);
    return []; // En caso de error, retorna arreglo vacío
  }
};

// POST: Agregar un nuevo usuario a la base de datos
export const registerUser = async (user) => {
  try {
    const res = await fetch(BASE_URL_SYSTEM, {
      method: "POST", // Método HTTP para crear recurso
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user), // Convierte el objeto usuario a JSON
    });
    return await res.json(); // Retorna la respuesta procesada
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};

/* ENROLLMENTS */
export const getEnrollments = async () => {
  try {
    const res = await fetch(BASE_URL_ENROLLMENTS); // Realiza la solicitud GET
    return await res.json(); // Convierte la respuesta en formato JSON
  } catch (error) {
    console.error("Error getting events:", error);
    return []; // Retorna arreglo vacío si ocurre error
  }
};

export const postEnrollment = async (event) => {
  try {
    const res = await fetch(BASE_URL_ENROLLMENTS, {
      method: "POST", // Método HTTP para crear recurso
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event), // Convierte el objeto usuario a JSON
    });
    return await res.json(); // Retorna la respuesta procesada
  } catch (error) {
    console.error("Error registering event:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};