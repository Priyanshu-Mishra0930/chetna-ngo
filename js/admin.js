const API_URL = "http://127.0.0.1:5000";
const confirmModal = document.getElementById("confirm-modal");

const confirmTitle = document.getElementById("confirm-title");

const confirmMessage = document.getElementById("confirm-message");

const confirmButton = document.getElementById("confirm-action-btn");

const cancelButton = document.getElementById("cancel-action-btn");

let confirmCallback = null;
function showConfirmModal({
  title,

  message,

  confirmText,

  confirmClass,

  onConfirm,
}) {
  confirmTitle.textContent = title;

  confirmMessage.textContent = message;

  confirmButton.textContent = confirmText;

  confirmButton.className = `confirm-btn ${confirmClass}`;

  confirmCallback = onConfirm;

  confirmModal.classList.add("active");
}

confirmButton.addEventListener("click", async () => {
  confirmModal.classList.remove("active");

  if (confirmCallback) {
    await confirmCallback();
  }
});
cancelButton.addEventListener("click", () => {
  confirmModal.classList.remove("active");
});
confirmModal.addEventListener("click", (e) => {
  if (e.target === confirmModal) {
    confirmModal.classList.remove("active");
  }
});
let allInterns = [];
let allApplications = [];

async function loadDashboard() {
  try {
    const applicationsResponse = await fetch(`${API_URL}/applications`, {
      credentials: "include",
    });

    const applications = await applicationsResponse.json();
    allApplications = applications;

    const internsResponse = await fetch(`${API_URL}/interns`, {
      credentials: "include",
    });

    const interns = await internsResponse.json();
    allInterns = interns;
    const bestInternCount = interns.filter(
      (intern) => intern.best_intern,
    ).length;
    document.getElementById("best-intern-count").textContent = bestInternCount;
    renderInterns(interns);

    document.getElementById("pending-count").textContent = applications.length;

    document.getElementById("intern-count").textContent = interns.length;

    renderApplications(applications);
  } catch (error) {
    console.error(error);
  }
}

function renderApplications(applications) {
  const container = document.getElementById("applications-container");

  container.innerHTML = "";

  applications.forEach((applicant) => {
    container.innerHTML += `

            <div class="application-card s-c">

                <h3>
                    ${applicant.name}
                </h3>

                <p>
                    <strong>College:</strong>
                    ${applicant.college}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${applicant.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${applicant.phone}
                </p>

                <div class="action-buttons">

    <button
        class="approve-btn"
        data-id="${applicant.id}"
    >
        Approve Intern
    </button>

    <button
        class="approve-admin-btn"
        data-id="${applicant.id}"
    >
        Approve Admin
    </button>

    <button
        class="reject-btn"
        data-id="${applicant.id}"
    >
        Reject
    </button>

</div>

            </div>

            `;
  });
  document
    .querySelectorAll("#applications-container .application-card")
    .forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 150);
    });
}

loadDashboard();
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("approve-btn")) {

    const userId = e.target.dataset.id;

    showConfirmModal({

        title: "Approve Internship Application",

        message:
            "This application will be approved as an active intern.\n\nA temporary password will be generated automatically and the applicant will receive access to the Internship Portal.\n\nDo you want to continue?",

        confirmText: "Approve",

        confirmClass: "success",

        onConfirm: async () => {

            try {

                const response = await fetch(
                    `${API_URL}/applications/${userId}/approve`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data.success) {

                    showPasswordModal(data.password);

                    const card =
                        e.target.closest(".application-card");

                    card.classList.add("removing");

                    setTimeout(() => {

                        loadDashboard();

                    }, 400);

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.error(error);

            }

        }

    });

}
  if (e.target.classList.contains("approve-admin-btn")) {

    const userId = e.target.dataset.id;

    showConfirmModal({

        title: "Approve as Administrator",

        message:
            "This application will be approved with administrator privileges.\n\nThe user will be able to manage internship applications, interns, certificates and administrative features.\n\nOnly approve trusted personnel.\n\nDo you want to continue?",

        confirmText: "Approve Admin",

        confirmClass: "success",

        onConfirm: async () => {

            try {

                const response = await fetch(
                    `${API_URL}/applications/${userId}/approve-admin`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data.success) {

                    showPasswordModal(data.password);

                    const card =
                        e.target.closest(".application-card");

                    card.classList.add("removing");

                    setTimeout(() => {

                        loadDashboard();

                    }, 400);

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.error(error);

            }

        }

    });

}
  if (e.target.classList.contains("reject-btn")) {

    const userId = e.target.dataset.id;

    showConfirmModal({

        title: "Reject Internship Application",

        message:
            "This application will be permanently rejected.\n\nThe applicant will not receive internship access and must submit a new application if they wish to apply again.\n\nDo you want to continue?",

        confirmText: "Reject",

        confirmClass: "danger",

        onConfirm: async () => {

            try {

                const response = await fetch(
                    `${API_URL}/applications/${userId}/reject`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (data.success) {

                    const card =
                        e.target.closest(".application-card");

                    card.classList.add("removing");

                    setTimeout(() => {

                        loadDashboard();

                    }, 400);

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.error(error);

            }

        }

    });

}
  if (e.target.classList.contains("best-btn")) {
    const userId = e.target.dataset.id;

    try {
      const response = await fetch(`${API_URL}/interns/${userId}/best-intern`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("certificate-btn")) {
    const userId = e.target.dataset.id;

    try {
      const response = await fetch(
        `${API_URL}/interns/${userId}/certificate-approval`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("deactivate-btn")) {

    const userId = e.target.dataset.id;

    const isDeactivate =
        e.target.textContent.trim() === "Deactivate";

    showConfirmModal({

        title: isDeactivate
            ? "Deactivate Intern Account"
            : "Activate Intern Account",

        message: isDeactivate
            ? "This intern account will be deactivated..."
            : "This intern account will be activated...",

        confirmText: isDeactivate
            ? "Deactivate"
            : "Activate",

        confirmClass: isDeactivate
            ? "danger"
            : "success",

        onConfirm: async () => {

            try {
      const response = await fetch(`${API_URL}/interns/${userId}/deactivate`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }

        }

    });

}
  if (e.target.classList.contains("quick-hour-btn")) {
    const userId = e.target.dataset.id;

    const hours = parseInt(e.target.dataset.hours);

    try {
      const response = await fetch(`${API_URL}/interns/${userId}/hours`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          hours: hours,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("apply-hours-btn")) {
    const userId = e.target.dataset.id;

    const card = e.target.closest(".intern-card");

    const hours = parseInt(card.querySelector(".custom-hours-input").value);

    if (isNaN(hours)) {
      alert("Enter valid hours");

      return;
    }

    try {
      const response = await fetch(`${API_URL}/interns/${userId}/hours`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          hours: hours,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("hours-btn")) {
    const card = e.target.closest(".intern-card");

    const hoursSection = card.querySelector(".hours-section");

    hoursSection.classList.toggle("active");
  }
  if (e.target.classList.contains("view-btn")) {
    const userId = e.target.dataset.id;

    const card = e.target.closest(".intern-card");

    const logsSection = card.querySelector(".logs-section");

    try {
      const response = await fetch(`${API_URL}/interns/${userId}/logs`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        logsSection.innerHTML = "";

        data.logs.forEach((log) => {
          logsSection.innerHTML += `

                    <div class="log-entry">

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

        logsSection.classList.toggle("active");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("edit-btn")) {
    const card = e.target.closest(".intern-card");

    const editSection = card.querySelector(".edit-section");

    editSection.classList.toggle("active");
  }
  if (e.target.classList.contains("save-edit-btn")) {
    const userId = e.target.dataset.id;

    const card = e.target.closest(".intern-card");

    const body = {
      name: card.querySelector(".edit-name").value,

      college: card.querySelector(".edit-college").value,

      course: card.querySelector(".edit-course").value,

      year: parseInt(card.querySelector(".edit-year").value),

      email: card.querySelector(".edit-email").value,

      phone: card.querySelector(".edit-phone").value,
    };

    try {
      const response = await fetch(`${API_URL}/interns/${userId}`, {
        method: "PATCH",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        loadDashboard();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  if (e.target.classList.contains("sidebar-logout-btn")) {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "intern.html";
      }
    } catch (error) {
      console.error(error);
    }
  }
});

function renderInterns(interns) {
  const container = document.getElementById("interns-container");

  container.innerHTML = "";

  interns.forEach((intern) => {
    const progress = Math.min((intern.total_hours / 30) * 100, 100);
    container.innerHTML += `

        <div class="intern-card">

            <div class="intern-top">

                <div>

                    <h3>${intern.name}</h3>

                    <p>${intern.college}</p>

                </div>

                <span class="
    status-badge
    ${intern.status === "active" ? "active-status" : "inactive-status"}
">
    ${intern.status}
</span>

            </div>

            <div class="intern-details">

                <p>
                    <strong>Email:</strong>
                    ${intern.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${intern.phone}
                </p>

                <p>
    <strong>Hours:</strong>
    ${intern.total_hours} / 30
</p>

<div class="progress-bar">

    <div
        class="progress-fill"
        style="width:${progress}%"
    >
    </div>

</div>

<p class="progress-text">
    ${Math.round(progress)}% Completed
</p>

            </div>

            <div class="intern-actions">

                <button
                    class="view-btn"
                    data-id="${intern.id}"
                >
                    View Logs
                </button>
              


                <button
                    class="edit-btn"
                    data-id="${intern.id}"
                >
                    Edit Details
                </button>

                <button
                    class="hours-btn"
                    data-id="${intern.id}"
                >
                    Adjust Hours
                </button>

                <button
                    class="certificate-btn"
                    data-id="${intern.id}"
                >
                    ${
                      intern.certificate_approved
                        ? "Revoke Certificate"
                        : "Approve Certificate"
                    }
                </button>

                <button
                    class="best-btn"
                    data-id="${intern.id}"
                >
                    ${
                      intern.best_intern
                        ? "Remove Best Intern"
                        : "Make Best Intern"
                    }
                </button>

                <button
    class="deactivate-btn"
    data-id="${intern.id}"
>
    ${intern.status === "active" ? "Deactivate" : "Activate"}
</button>

            </div>

            <div class="logs-section"></div>
  <div class="edit-section">

    <h4>
        Edit Intern Details
    </h4>

    <div class="edit-grid">

        <input
            class="edit-name"
            value="${intern.name}"
        >

        <input
            class="edit-college"
            value="${intern.college}"
        >

        <input
            class="edit-course"
            value="${intern.course}"
        >

        <input
            class="edit-year"
            value="${intern.year}"
        >

        <input
            class="edit-email"
            value="${intern.email}"
        >

        <input
            class="edit-phone"
            value="${intern.phone}"
        >

    </div>

    <button
        class="save-edit-btn"
        data-id="${intern.id}"
    >
        Save Changes
    </button>
    </div>
            <div class="hours-section">

                <h4>Adjust Hours</h4>

                <div class="quick-hours">

                    <button class="quick-hour-btn"
data-id="${intern.id}" data-hours="1">+1</button>

                    <button class="quick-hour-btn"
data-id="${intern.id}" data-hours="2">+2</button>

                    <button class="quick-hour-btn"
data-id="${intern.id}" data-hours="5">+5</button>

                    <button class="quick-hour-btn"
data-id="${intern.id}" data-hours="-1">-1</button>

                    <button class="quick-hour-btn"
data-id="${intern.id}" data-hours="-2">-2</button>

                </div>

                <div class="custom-hours">

                    <input
                        type="number"
                        class="custom-hours-input"
                        placeholder="Custom Adjustment"
                    >

                    <button
    class="apply-hours-btn"
    data-id="${intern.id}"
>
    Apply
</button>

                </div>

            </div>

        </div>

        `;
  });
}
function filterInterns() {
  const searchValue = document
    .getElementById("search-intern")
    .value.toLowerCase();

  const statusValue = document.getElementById("status-filter").value;

  let filteredInterns = allInterns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchValue) ||
      intern.email.toLowerCase().includes(searchValue) ||
      intern.college.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusValue === "all" || intern.status === statusValue;

    return matchesSearch && matchesStatus;
  });

  renderInterns(filteredInterns);
}
document
  .getElementById("search-intern")
  .addEventListener("input", filterInterns);
document
  .getElementById("status-filter")
  .addEventListener("change", filterInterns);
function filterApplications() {
  const searchValue = document
    .getElementById("search-application")
    .value.toLowerCase();

  const filteredApplications = allApplications.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchValue) ||
      applicant.email.toLowerCase().includes(searchValue) ||
      applicant.college.toLowerCase().includes(searchValue),
  );

  renderApplications(filteredApplications);
}
document
  .getElementById("search-application")
  .addEventListener("input", filterApplications);
function showPasswordModal(password) {
  document.getElementById("generated-password").textContent = password;

  document.getElementById("password-modal").classList.add("active");
}
document
  .getElementById("copy-password-btn")
  .addEventListener("click", async () => {
    const password = document.getElementById("generated-password").textContent;

    await navigator.clipboard.writeText(password);

    document.getElementById("copy-password-btn").textContent = "Copied!";
  });
document
  .getElementById("close-password-modal")
  .addEventListener("click", () => {
    document.getElementById("password-modal").classList.remove("active");
  });