const API_URL = "http://127.0.0.1:5000";

const certificateInput =
    document.getElementById("certificate-number");

const result =
    document.getElementById("verification-result");

async function verifyCertificate() {

    try {

        const certificateNumber =
            certificateInput.value.trim();

        if (!certificateNumber) {

            result.className = "verify-result invalid";

            result.innerHTML = `
                <h3>❌ Certificate ID Required</h3>
                <p>Please enter a certificate ID.</p>
            `;

            return;

        }

        const response = await fetch(
            `${API_URL}/verify-certificate`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    certificate_number: certificateNumber,
                }),

            }
        );

        const data = await response.json();

        if (data.valid) {

            result.className = "verify-result valid";

            result.innerHTML = `

                <h3>
                    ✅ Certificate Verified
                </h3>

                <p>
                    <strong>Name:</strong>
                    ${data.name}
                </p>

                <p>
                    <strong>College:</strong>
                    ${data.college}
                </p>

                <p>
                    <strong>Certificate ID:</strong>
                    ${data.certificate_number}
                </p>

            `;

        } else {

            result.className = "verify-result invalid";

            result.innerHTML = `

                <h3>
                    ❌ Invalid Certificate
                </h3>

                <p>
                    Certificate not found.
                </p>

            `;

        }

    } catch (error) {

        console.error(error);

        result.className = "verify-result invalid";

        result.innerHTML = `

            <h3>
                ❌ Server Error
            </h3>

            <p>
                Please try again later.
            </p>

        `;

    }

}

document
    .getElementById("verify-btn")
    .addEventListener(
        "click",
        verifyCertificate
    );

const params =
    new URLSearchParams(window.location.search);

const certificateId =
    params.get("id");

if (certificateId) {

    certificateInput.value = certificateId;

    verifyCertificate();

}
certificateInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        verifyCertificate();

    }

});