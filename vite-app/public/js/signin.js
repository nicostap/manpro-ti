// signin.js

import { checkUserAuthentication } from "./auth.js"; // Sesuaikan path jika perlu
checkUserAuthentication();

async function onSubmit() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { email, password };

  try {
    const res = await fetch(
      `http://${import.meta.env.VITE_BACKEND_URL}/user/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    if (res.ok) {
      const user = await res.json();
      Swal.fire({
        title: "Success!",
        text: "Log in successful",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = `http://${import.meta.env.VITE_FRONTEND_URL}`;
      });
    } else {
      const errorData = await res.json();
      Swal.fire({
        title: "Error!",
        text: errorData.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Login failed",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit();
  });
});