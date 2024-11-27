// auth.j
async function checkUserAuthentication() {
    AOS.init();
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
        window.location.href = `http://${import.meta.env.VITE_FRONTEND_URL}`;
      }
    }
  }
  export { checkUserAuthentication};