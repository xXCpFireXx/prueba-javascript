// =================== FUNCIONES UTILITARIAS ===================
// Este archivo contiene funciones reutilizables que apoyan tareas comunes


// Capitaliza la primera letra de una palabra y convierte el resto en minúscula
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Muestra una notificación tipo "toast" usando la librería Toastify
// Recibe el texto, el color de fondo y la duración (opcional) en milisegundos
export const notification = (text, color, duration = 3000) => {
  Toastify({
    text,
    duration,
    close: true,
    gravity: "top", // Posición superior
    position: "center", // Centrado horizontal
    stopOnFocus: true, // Detiene temporizador si el usuario pasa el mouse
    style: {
      borderRadius: "8px",
      padding: "15px",
      background: color,
    },
  }).showToast();
};


// Convierte una fecha desde formato ISO ("2025-07-06") a un formato amigable ("06-Jul-2025")
export const formatDate = (inputDate) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const [year, month, day] = inputDate.split("-");
  const monthAbbr = months[parseInt(month, 10) - 1];

  return `${day}-${monthAbbr}-${year}`; // Ejemplo: 06-Jul-2025
};


// Convierte una fecha desde el formato personalizado ("06-Jul-2025")
// al formato requerido por el input tipo date: "2025-07-06"
export const formatDateForInput = (dateStr) => {
  const [day, monthAbbr, year] = dateStr.split("-");

  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  const month = months[monthAbbr];
  const paddedDay = day.padStart(2, "0"); // Asegura dos dígitos en el día

  return `${year}-${month}-${paddedDay}`; // Ejemplo: 2025-07-06
};
