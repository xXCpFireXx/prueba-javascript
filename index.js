import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getUsersSystem,
  registerUser,
  getEnrollments,
  postEnrollment,
} from "./app/js/services.js";

import {
  capitalizeFirstLetter,
  formatDate,
  formatDateForInput,
  notification,
} from "./app/js/utils.js";

/* =================== SPA PATHS =================== */
const routes = {
  "/": "../app/views/dashboard.html",
  "/dashboard/enrollments": "../app/views/enrollments.html",
  "/dashboard/events": "../app/views/events.html",
  "/dashboard/events/create": "../app/views/add-event.html",
  "/dashboard/events/edit": "../app/views/edit-event.html",
  "/register": "../app/views/register.html",
  "/login": "../app/views/login.html",
};

const isAuth = () => {
  return localStorage.getItem("Auth") === "true";
};
const isRegistering = () => {
  return localStorage.setItem("Register", "false");
};
const navigate = async (pathname) => {
  if (!isAuth() && isRegistering()) {
    pathname = "/login";
  } else if (isAuth() === false && isRegistering() === true) {
    pathname = "/register";
  }

  const route = routes[pathname] || routes["/"];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("main-content").innerHTML = html;
  history.pushState({}, "", pathname);

  const aside = document.getElementById("aside-navbar");

  if (pathname === "/login") setupLoginForm();
  if (pathname === "/register") registerUsers();

  renderUserProfile();

  if (aside) {
    if (pathname === "/register" || pathname === "/login") {
      aside.style.display = "none";
    } else {
      aside.style.display = "flex";
    }
  }

  if (pathname === "/dashboard/events") showEvents();
  if (pathname === "/dashboard/events/create") createNewEvent();
  if (pathname === "/dashboard/events/edit") editEvent();
  if (pathname === "/dashboard/enrollments") showEnrollments();
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

/* =================== EVENTS =================== */

const showEvents = async () => {
  const events = await getEvents();
  const tbody = document.getElementById("list-events");
  if (!tbody) return;

  tbody.innerHTML = "";

  events.forEach((event) => {
    const row = document.createElement("tr");
    row.dataset.eventId = event.id;

    row.innerHTML = `
      <td><img class="img-event" src="${event.img}"></td>
      <td>${event.name}</td>
      <td>${event.description}</td>
      <td>${event.capacity}</td>
      <td>${event.date}</td>
      <td class="actions-tbody">
        <a href="#"><img class="btn-edit" data-event-id="${event.id}" src="../app/img/pencil.svg"></a>
        <a href="#"><img class="btn-delete" data-event-id="${event.id}" src="../app/img/delete.svg"></a>
      </td>
      <td class="btn-enroll">
        <button class="buttons enroll" id="enroll" data-event-id="${event.id}">Enroll</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  callNewEvent();
  callEditEvent();
  callDeleteEvent();
  hideButtons();
  EnrollEvent();
};

const showEnrollments = async () => {
  const enrollments = await getEnrollments();
  const userName = localStorage.getItem("userName");
  const tbody = document.getElementById("list-enrollments");
  if (!tbody) return;

  const filtered = enrollments.filter((r) => r.user === userName);

  tbody.innerHTML = "";

  filtered.forEach((event) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img class="img-event" src="${event.img}"></td>
      <td>${event.name}</td>
      <td>${event.description}</td>
      <td>${event.capacity}</td>
      <td>${event.date}</td>
    `;
    tbody.appendChild(row);
  });
};

const addEvents = async () => {
  const name = capitalizeFirstLetter(
    document.getElementById("name").value.trim()
  );
  const description = document.getElementById("description").value.trim();
  const capacity = parseInt(document.getElementById("capacity").value);
  const dateInput = document.getElementById("date").value;
  const date = formatDate(dateInput);

  const events = await getEvents();
  const ids = events.map((u) => Number(u.id));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  const newId = maxId + 1;
  const urlImg =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUGUnK6u1qokfESNX_OaME4vM0fCnVd0v5awXT9i4GsWetdwU-uxP6ClenDt9tcyk-Ocg&usqp=CAU";
  const newEvent = {
    id: String(newId),
    name,
    description,
    capacity,
    date: date,
    img: urlImg,
  };

  try {
    await addEvent(newEvent);
    notification(
      `Event"${newEvent.name}" added successfully!`,
      "#a7c957",
      3000
    );
    navigate("/dashboard/events");
  } catch {
    notification("Error adding event", "#e12c2c", 3000);
  }
};

const editEvent = async () => {
  const eventId = localStorage.getItem("editEventId");
  if (!eventId) {
    notification("No event selected to edit", "#e12c2c", 3000);
    navigate("/dashboard/events");
    return;
  }

  try {
    const events = await getEvents();
    renderUserProfile();
    const event = events.find((u) => u.id === eventId);
    if (!event) throw new Error("event not found");

    document.getElementById("name").value = event.name;
    document.getElementById("description").value = event.description;
    document.getElementById("capacity").value = event.capacity;
    document.getElementById("date").value = formatDateForInput(event.date);

    const form = document.getElementById("formEditEvent");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedEvent = {
        id: event.id,
        name: document.getElementById("name").value.trim(),
        description: document.getElementById("description").value.trim(),
        capacity: parseInt(document.getElementById("capacity").value),
        date: formatDate(document.getElementById("date").value),
        img: event.img,
      };

      try {
        await updateEvent(eventId, updatedEvent);
        notification("Event updated successfully!", "#a7c957", 3000);
        navigate("/dashboard/events");
      } catch {
        notification("Error updating event", "#e12c2c", 3000);
      }
    });

    const cancelEdit = document.getElementById("cancel-edit");
    cancelEdit.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/dashboard/events");
    });
  } catch (error) {
    notification("Error loading event data", "#e12c2c", 3000);
    navigate("/dashboard/events");
  }

  localStorage.removeItem("editEventId");
};

const callNewEvent = () => {
  const btn = document.getElementById("add-new-event");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/dashboard/events/create");
    });
  }
};

const createNewEvent = () => {
  const form = document.getElementById("formNewEvent");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addEvents();
    navigate("/dashboard/events");
    renderUserProfile();
  });

  const cancelBtn = document.getElementById("btn-cancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigate("/dashboard/events");
    });
  }
};

const callEditEvent = () => {
  const buttons = document.querySelectorAll(".btn-edit");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.target.dataset.eventId;
      localStorage.setItem("editEventId", id);
      navigate("/dashboard/events/edit");
    });
  });
};

const callDeleteEvent = () => {
  const buttons = document.querySelectorAll(".btn-delete");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = btn.dataset.eventId;
      if (confirm("Are you sure you want to delete this event?")) {
        await deleteEvent(id);
        navigate("/dashboard/events");
      }
    });
  });
};

const EnrollEvent = () => {
  const buttons = document.querySelectorAll(".enroll");
  const userName = localStorage.getItem("userName");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const events = await getEvents();
      const id = btn.dataset.eventId;

      const filtered = events.filter((r) => r.id === id);

      const ids = events.map((u) => Number(u.id));
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const newId = maxId + 1;
      const newEnrollEvent = {
        id: String(newId),
        name: filtered.name,
        description: filtered.description,
        capacity: filtered.capacity,
        date: filtered.date,
        img: filtered.urlImg,
        user: userName,
      };
      try {
        await postEnrollment(newEnrollEvent)
        notification("Event enrolled successfully!", "#a7c957", 3000);
      } catch (error) {
        notification("Error loading event data", "#e12c2c", 3000);
      }
      
    });
  });
};

/* =================== LOGIN =================== */

const setupLoginForm = async () => {
  const usersSystem = await getUsersSystem();

  const form = document.getElementById("login-spa");
  const btnRegister = document.getElementById("register");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputUser = document.getElementById("user").value.trim();
    const inputPass = document.getElementById("password").value.trim();

    const userFound = usersSystem.find(
      (u) => u.email === inputUser && u.password === inputPass
    );

    if (userFound) {
      localStorage.setItem("Auth", "true");
      localStorage.setItem("role", userFound.role);
      localStorage.setItem("userName", userFound.name);

      navigate("/");
    } else {
      notification("Incorrect username or password", "#e12c2c", 3000);
    }
  });

  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/register");
    localStorage.setItem("Register", "true");
  });
};

const registerUsers = async () => {
  const form = document.getElementById("formNewUser");
  const btnCancel = document.getElementById("btn-cancel");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = capitalizeFirstLetter(
      document.getElementById("name").value.trim()
    );
    const email = document.getElementById("email").value.trim();
    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("password2").value;

    const users = await getUsersSystem();
    const ids = users.map((u) => Number(u.id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    const newId = maxId + 1;

    if (pass1 === pass2) {
      const newUser = {
        id: String(newId),
        email: email,
        password: pass1,
        role: "visitor",
        name: name,
      };

      try {
        await registerUser(newUser);
        notification(
          `User"${newUser.name}" added successfully!`,
          "#a7c957",
          3000
        );
        navigate("/login");
      } catch {
        notification("Error adding user", "#e12c2c", 3000);
      }
      localStorage.setItem("Register", "false");
    } else {
      notification("Password isn't the same", "#e12c2c", 3000);
    }
  });

  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.setItem("Register", "false");
    navigate("/login");
  });
};

const renderUserProfile = () => {
  const nameProfile = document.querySelector(".name-profile");
  const roleProfile = document.querySelector(".role-profile");
  const userImg = document.querySelector(".img-profile-user");

  if (nameProfile && roleProfile) {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("role");

    nameProfile.textContent = name || "";

    if (role === "admin") {
      roleProfile.textContent = "Administrator";
      userImg.src = "../app/img/admin-img.png";
    } else if (role === "visitor") {
      roleProfile.textContent = "Visitor";
      userImg.src = "../app/img/User-avatar.png";
    } else {
      roleProfile.textContent = "";
    }
  }
};

const hideButtons = () => {
  const role = localStorage.getItem("role");
  const buttonsActions = document.querySelector(".buttons-action");
  const buttonsActionsTbody = document.querySelectorAll(".actions-tbody");
  const buttonAddEvent = document.getElementById("add-new-event");
  const btnsEnroll = document.querySelectorAll(".btn-enroll");
  const liEnrollments = document.getElementById("enrollments");
  if (role === "admin") {
    buttonsActions.style.display = "block";
    buttonAddEvent.style.display = "block";
    liEnrollments.style.display = "none";
    buttonsActionsTbody.forEach((btn) => {
      btn.style.display = "block";
    });

    btnsEnroll.forEach((btnEnroll) => {
      btnEnroll.style.display = "none";
    });
  } else {
    buttonsActions.style.display = "none";
    buttonAddEvent.style.display = "none";
    buttonsActionsTbody.forEach((btn) => {
      btn.style.display = "none";
    });
  }
};

const logoutBtn = document.querySelector(".logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.setItem("Auth", "false");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  });
}

/* =================== SPA =================== */
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

window.addEventListener("DOMContentLoaded", () => {
  navigate(location.pathname);
});
