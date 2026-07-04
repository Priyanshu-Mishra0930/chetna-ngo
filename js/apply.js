const API_URL = "http://127.0.0.1:5000";
const messageBox = document.getElementById("apply-message");

document.getElementById("apply-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;

  const college = document.getElementById("college").value;

  const course = document.getElementById("course").value;

  const year = document.getElementById("year").value;

  const email = document.getElementById("email").value;

  const phone = document.getElementById("phone").value;

  const why_join = document.getElementById("why_join").value;

  try {
    const response = await fetch(
      `${API_URL}/apply`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          college,
          course,
          year,
          email,
          phone,
          why_join,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      messageBox.className = "apply-message success";
      messageBox.textContent = "Application submitted successfully!";
      setTimeout(() => {
        messageBox.className = "apply-message";
        messageBox.textContent = "";
      }, 5000);

      document.getElementById("apply-form").reset();
    } else {
      messageBox.className = "apply-message error";
      messageBox.textContent = data.message;
      setTimeout(() => {
        messageBox.className = "apply-message";
        messageBox.textContent = "";
      }, 5000);
    }
  } catch (error) {
    console.error(error);

    messageBox.className = "apply-message error";
    messageBox.textContent =
      "Unable to connect to the server. Please try again later.";
    setTimeout(() => {
      messageBox.className = "apply-message";
      messageBox.textContent = "";
    }, 5000);
  }
});
