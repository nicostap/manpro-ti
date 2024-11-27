const Swal = window.Swal;
import { checkUserAuthentication} from "./auth.js";
checkUserAuthentication();

async function onSubmit() {
  // var response = grecaptcha.getResponse();
  // if (response.length === 0) {
  //     alert('Please complete the reCAPTCHA');
  //     return;
  // }

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    email,
    username,
    password,
  };

  try {
    const res = await fetch(
      `http://${import.meta.env.VITE_BACKEND_URL}/user`,
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
      Swal.fire({
        title: "Success!",
        text: "Account created successfuly",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = `http://${
          import.meta.env.VITE_FRONTEND_URL
        }/signin/`;
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
      text: "Sign up failed",
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