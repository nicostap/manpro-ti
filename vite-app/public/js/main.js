AOS.init();
const signInButton = document.getElementById("signIn");
const signUpButton = document.getElementById("signUp");
const uploadButton = document.getElementById("upload");
const historyButton = document.getElementById("history");
const extraBar = document.getElementById("extra-bar");
const signOutButton = document.getElementById("signOut");
const getStartedButton = document.getElementById("getStarted");

async function checkUserAuthentication() {
  try {
    const response = await fetch(
      `http://${import.meta.env.VITE_BACKEND_URL}/user`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        uploadButton.style.display = "block";
        extraBar.style.display = "block";
        historyButton.style.display = "block";
        signOutButton.style.display = "block";
        signInButton.style.display = "none";
        signUpButton.style.display = "none";
        getStartedButton.setAttribute(
          "href",
          `http://${import.meta.env.VITE_FRONTEND_URL}/upload/`
        );
        return;
      } else {
        getStartedButton.setAttribute(
          "href",
          `http://${import.meta.env.VITE_FRONTEND_URL}/signup/`
        );
      }
    }
  } catch (error) {
    getStartedButton.setAttribute(
      "href",
      `http://${import.meta.env.VITE_FRONTEND_URL}/signup/`
    );
  }
}
checkUserAuthentication();