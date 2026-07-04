const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const messageBox = document.getElementById("login-message");

      messageBox.textContent = data.message;

      messageBox.className = "login-message error";

      return;
    }

    if (data.role === "intern") {
      const messageBox = document.getElementById("login-message");
      messageBox.textContent = "Login successful. Redirecting...";

      messageBox.className = "login-message success";
      localStorage.setItem("user_id", data.user.id);
      window.location.href = "intern_dash.html";
    } else if (data.role === "admin" || data.role === "super_admin") {
      const messageBox = document.getElementById("login-message");
      messageBox.textContent = "Login successful. Redirecting...";

      messageBox.className = "login-message success";
      window.location.href = "admin.html";
    }
  } catch (error) {
    const messageBox = document.getElementById("login-message");

    messageBox.textContent = "Server Error";

    messageBox.className = "login-message error";
  }
});
