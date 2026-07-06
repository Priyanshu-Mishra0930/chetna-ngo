const API_URL = "https://chetnabackend-production.up.railway.app";
const messageBox = document.getElementById("work-message");
const userId = localStorage.getItem("user_id");
const certificateMessage = document.getElementById("certificate-message");
async function loadDashboard() {
  try {
    const response = await fetch(
      `${API_URL}/interns/${userId}`,

      {
        credentials: "include",
      },
    );

    const data = await response.json();

    const intern = data.data;

    document.getElementById("intern-name").textContent =
      `Welcome, ${intern.name} 👋`;
    document.getElementById("hours-text").textContent =
      `${intern.total_hours} / 30 Hours`;

    const progress = Math.min((intern.total_hours / 30) * 100, 100);

    document.getElementById("progress-fill").style.width = `${progress}%`;

    document.getElementById("progress-text").textContent =
      `${Math.round(progress)}% Completed`;

    document.getElementById("status-text").textContent = intern.status;

    document.getElementById("best-intern-status").textContent =
      intern.best_intern ? "Yes" : "No";
    const certificateBtn = document.querySelector(".certificate-btn");

    if (intern.certificate_approved) {
      certificateBtn.disabled = false;

      certificateBtn.textContent = "📄 Generate Certificate";
    } else {
      certificateBtn.disabled = true;

      certificateBtn.textContent = "🔒 Certificate Locked";
    }
    const bestCertificateBtn = document.querySelector(".best-certificate-btn");

    if (intern.best_intern) {
      bestCertificateBtn.disabled = false;

      bestCertificateBtn.textContent = "🏆 Best Intern Certificate";
    } else {
      bestCertificateBtn.disabled = true;

      bestCertificateBtn.textContent = "🔒 Best Intern Locked";
    }
  } catch (error) {
    console.error(error);
  }
}
async function loadLogs() {
  try {
    const response = await fetch(
      `${API_URL}/interns/${userId}/logs`,

      {
        credentials: "include",
      },
    );

    const data = await response.json();

    const container = document.getElementById("logs-container");
    if (data.logs.length === 0) {
      container.innerHTML = "<p>No logs found</p>";
    }
    container.innerHTML = "";

    data.logs.forEach((log) => {
      container.innerHTML += `

                <div class="log-item">

                    <strong>
                        ${log.date}
                    </strong>

                    <p>
                        ${log.work_done}
                    </p>

                    <span>
                        ${log.hours}
                        Hours
                    </span>

                </div>

                `;
    });
  } catch (error) {
    console.error(error);
  }
}
loadDashboard();

loadLogs();

document.querySelector(".submit-btn").addEventListener("click", async () => {
  const workDone = document.getElementById("work-description").value;

  const hours = parseInt(document.getElementById("work-hours").value);

  if (!workDone || !hours) {
    messageBox.className = "work-message error";

    messageBox.textContent = "Please fill in all fields.";

    setTimeout(() => {
      messageBox.className = "work-message";
      messageBox.textContent = "";
    }, 4000);

    return;
  }
  if (hours <= 0) {
    messageBox.className = "work-message error";

    messageBox.textContent = "Hours must be greater than 0.";

    setTimeout(() => {
      messageBox.className = "work-message";
      messageBox.textContent = "";
    }, 4000);

    return;
  }

  if (hours > 5) {
    messageBox.className = "work-message error";

    messageBox.textContent =
      "You can submit a maximum of 5 working hours per day.";

    setTimeout(() => {
      messageBox.className = "work-message";
      messageBox.textContent = "";
    }, 4000);

    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/interns/${userId}/logs`,

      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          work_done: workDone,

          hours: hours,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      messageBox.className = "work-message success";

      messageBox.textContent = "Today's work submitted successfully!";
      setTimeout(() => {
        messageBox.className = "work-message";

        messageBox.textContent = "";
      }, 4000);

      document.getElementById("work-description").value = "";

      document.getElementById("work-hours").value = "";

      loadDashboard();

      loadLogs();
    } else {
      messageBox.className = "work-message error";

      messageBox.textContent = data.message;
      setTimeout(() => {
        messageBox.className = "work-message";

        messageBox.textContent = "";
      }, 4000);
    }
  } catch (error) {
    console.error(error);
  }
});
document.querySelectorAll(".logout-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("user_id");
        window.location.href = "intern.html";
      }
    } catch (error) {
      console.error(error);
    }
  });
});
const certificateModal = document.getElementById("certificate-modal");

document.querySelector(".certificate-btn").addEventListener("click", () => {
  certificateModal.classList.add("active");
});

document
  .getElementById("cancel-certificate")
  .addEventListener("click", () => {
    certificateModal.classList.remove("active");
  });

document
  .getElementById("confirm-certificate")
  .addEventListener("click", async () => {
    certificateModal.classList.remove("active");

    try {
      const response = await fetch(
        `${API_URL}/interns/${userId}/generate-certificate`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json();

        certificateMessage.className = "certificate-message error";
        certificateMessage.textContent = data.message;

        setTimeout(() => {
          certificateMessage.className = "certificate-message";
          certificateMessage.textContent = "";
        }, 4000);

        return;
      }

      certificateMessage.className = "certificate-message success";
      certificateMessage.textContent =
        "Certificate generated successfully. Download started.";

      setTimeout(() => {
        certificateMessage.className = "certificate-message";
        certificateMessage.textContent = "";
      }, 4000);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "certificate.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);

      certificateMessage.className = "certificate-message error";
      certificateMessage.textContent = "Something went wrong.";

      setTimeout(() => {
        certificateMessage.className = "certificate-message";
        certificateMessage.textContent = "";
      }, 4000);
    }
  });
document
  .querySelector(".best-certificate-btn")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(
        `${API_URL}/interns/${userId}/generate-best-certificate`,

        {
          method: "POST",

          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json();

        certificateMessage.className = "certificate-message error";

        certificateMessage.textContent = data.message;

        setTimeout(() => {
          certificateMessage.className = "certificate-message";

          certificateMessage.textContent = "";
        }, 4000);

        return;

        return;
      }
      certificateMessage.className = "certificate-message success";

      certificateMessage.textContent =
        "Certificate generated successfully. Download started.";
      setTimeout(() => {
        certificateMessage.className = "certificate-message";

        certificateMessage.textContent = "";
      }, 4000);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = "certificate.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  });
