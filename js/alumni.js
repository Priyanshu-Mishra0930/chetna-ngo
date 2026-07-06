const API_URL = "https://chetnabackend-production.up.railway.app";

let allAlumni = [];
async function loadAlumni() {
  try {
    const response = await fetch(`${API_URL}/alumni`);

    const alumni = await response.json();

    allAlumni = alumni;

    renderAlumni(alumni);
    renderBestInterns(alumni);
    populateFilters(alumni);
    updateStats(alumni);
  } catch (error) {
    console.error(error);
  }
}
function renderAlumni(alumni) {
  const container = document.getElementById("alumni-container");

  container.innerHTML = "";

  alumni.forEach((person) => {
    container.innerHTML += `

            <div class="alumni-card sc">

                <h3>
                    ${person.name}
                </h3>

                <span class="college">

                    ${person.college}

                </span>

                <div class="alumni-info">

                    <p>

                        <strong>
                            Joined:
                        </strong>

                        ${new Date(person.date).getFullYear()}

                    </p>

                    <p>

                        <strong>
                            Hours:
                        </strong>

                        ${person.total_hours}

                    </p>

                </div>

                <button
                    class="contact-btn"
                >
                    Contact
                </button>

                <div
                    class="contact-info"
                >

                    <p>
                        📧
                        ${person.email}
                    </p>

                    <p>
                        📞
                        ${person.phone}
                    </p>

                </div>

                ${
                  person.best_intern
                    ? `<span class="best-badge">
                        🏆 Best Intern
                    </span>`
                    : ""
                }

            </div>

            `;
  });
}
function populateFilters(alumni) {
  const collegeFilter = document.getElementById("college-filter");

  const yearFilter = document.getElementById("year-filter");

  const colleges = [...new Set(alumni.map((a) => a.college))];

  const years = [...new Set(alumni.map((a) => new Date(a.date).getFullYear()))];

  collegeFilter.innerHTML = '<option value="all">All Colleges</option>';

  yearFilter.innerHTML = '<option value="all">All Years</option>';

  colleges.forEach((college) => {
    collegeFilter.innerHTML += `

            <option value="${college}">
                ${college}
            </option>

        `;
  });

  years
    .sort((a, b) => b - a)
    .forEach((year) => {
      yearFilter.innerHTML += `

                <option value="${year}">
                    ${year}
                </option>

            `;
    });
}
function filterAlumni() {
  const searchValue = document
    .getElementById("search-alumni")
    .value.toLowerCase();

  const collegeValue = document.getElementById("college-filter").value;

  const yearValue = document.getElementById("year-filter").value;

  const filtered = allAlumni.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchValue) ||
      alumni.college.toLowerCase().includes(searchValue);

    const matchesCollege =
      collegeValue === "all" || alumni.college === collegeValue;

    const matchesYear =
      yearValue === "all" ||
      String(new Date(alumni.date).getFullYear()) === yearValue;

    return matchesSearch && matchesCollege && matchesYear;
  });

  renderAlumni(filtered);
}
document
  .getElementById("search-alumni")
  .addEventListener("input", filterAlumni);

document
  .getElementById("college-filter")
  .addEventListener("change", filterAlumni);

document.getElementById("year-filter").addEventListener("change", filterAlumni);
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("contact-btn")) {
    const info = e.target.nextElementSibling;

    info.classList.toggle("active");
  }
});

function updateStats(alumni) {
  document.getElementById("total-alumni").textContent = alumni.length;
  // document.getElementById("total-colleges").textContent = "50+";

  document.getElementById("total-best-interns").textContent = alumni.filter(
    (a) => a.best_intern,
  ).length;
}
function renderBestInterns(alumni) {
  const container = document.getElementById("best-intern-container");

  container.innerHTML = "";

  const bestInterns = alumni.filter((person) => person.best_intern);

  if (bestInterns.length === 0) {
    container.innerHTML = `
            <p>
                No Best Interns Yet
            </p>
        `;

    return;
  }

  bestInterns.forEach((person) => {
    container.innerHTML += `

        <div class="best-card sc">

            <div class="trophy">
                🏆
            </div>

            <h3>
                ${person.name}
            </h3>

            <p class="college">
                ${person.college}
            </p>

            <p>
                Best Intern Award Recipient
            </p>

        </div>

        `;
  });
}
loadAlumni();