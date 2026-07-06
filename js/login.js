const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://chetnabackend-production.up.railway.app/login", {
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

    const messageBox =
        document.getElementById("login-message");

    messageBox.textContent =
        "Login successful.";

    messageBox.className =
        "login-message success";

    localStorage.setItem(
        "user_id",
        data.user.id
    );

    if (data.setup_required) {

        openSetupModal();

        return;

    }

    window.location.href =
        "intern_dash.html";

}
    else if (data.role === "admin" || data.role === "super_admin") {
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
function openSetupModal(){

    document
        .getElementById(
            "setup-modal"
        )
        .classList
        .add("show");

}
const setupBtn =
    document.getElementById("setup-btn");

setupBtn.addEventListener(
    "click",
    async () => {

        const answer =
            document
            .getElementById(
                "security-answer"
            )
            .value
            .trim();

        const password =
            document
            .getElementById(
                "new-password"
            )
            .value;

        const confirmPassword =
            document
            .getElementById(
                "confirm-password"
            )
            .value;

        const message =
            document
            .getElementById(
                "setup-message"
            );

        if(
            !answer ||
            !password ||
            !confirmPassword
        ){

            message.textContent =
                "Please fill all fields.";

            message.className =
                "login-message error";

            return;

        }

        try{

            const response =
                await fetch(

                    "https://chetnabackend-production.up.railway.app/setup-account",

                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        credentials:"include",

                        body:JSON.stringify({

                            answer,

                            password,

                            confirm_password:
                            confirmPassword

                        })

                    }

                );

            const data =
                await response.json();

            if(!response.ok){

                message.textContent =
                    data.message;

                message.className =
                    "login-message error";

                return;

            }

            message.textContent =
                "Account setup completed.";

            message.className =
                "login-message success";

            setTimeout(()=>{

                window.location.href =
                    "intern_dash.html";

            },1000);

        }

        catch{

            message.textContent =
                "Server Error";

            message.className =
                "login-message error";

        }

    }
);
const forgotLink =
    document.getElementById(
        "forgot-link"
    );

forgotLink.addEventListener(

    "click",

    (e)=>{

        e.preventDefault();

        document.body.classList.add(
            "modal-open"
        );

        document
            .getElementById(
                "forgot-modal"
            )
            .classList
            .add("show");

    }

);
const continueBtn =
    document.getElementById("continue-btn");

continueBtn.addEventListener(
    "click",
    async ()=>{

        const email =
            document
            .getElementById("forgot-email")
            .value
            .trim();

        const message =
            document
            .getElementById("forgot-message");

        if(!email){

            message.textContent =
                "Please enter your email.";

            message.className =
                "login-message error";

            return;

        }

        try{

            const response =
                await fetch(

                    "https://chetnabackend-production.up.railway.app/forgot-password",

                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:JSON.stringify({
                            email
                        })

                    }

                );

            const data =
                await response.json();

            if(!response.ok){

                message.textContent =
                    data.message;

                message.className =
                    "login-message error";

                return;

            }

            document
                .getElementById(
                    "security-question"
                )
                .value =
                data.question;

            document
                .getElementById(
                    "forgot-step-1"
                )
                .style.display =
                "none";

            document
                .getElementById(
                    "forgot-step-2"
                )
                .style.display =
                "block";

        }

        catch{

            message.textContent =
                "Server Error";

            message.className =
                "login-message error";

        }

    }
);
const resetBtn =
    document.getElementById("reset-btn");

resetBtn.addEventListener(
    "click",
    async ()=>{

        const email =
            document
            .getElementById("forgot-email")
            .value
            .trim();

        const answer =
            document
            .getElementById("forgot-answer")
            .value
            .trim();

        const password =
            document
            .getElementById("forgot-password")
            .value;

        const confirmPassword =
            document
            .getElementById("forgot-confirm-password")
            .value;

        const message =
            document
            .getElementById("reset-message");

        if(
            !answer ||
            !password ||
            !confirmPassword
        ){

            message.textContent =
                "Please fill all fields.";

            message.className =
                "login-message error";

            return;

        }

        try{

            const response =
                await fetch(

                    "https://chetnabackend-production.up.railway.app/reset-password",

                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:JSON.stringify({

                            email,

                            answer,

                            password,

                            confirm_password:
                            confirmPassword

                        })

                    }

                );

            const data =
                await response.json();

            if(!response.ok){

                message.textContent =
                    data.message;

                message.className =
                    "login-message error";

                return;

            }

            message.textContent =
                "Password reset successfully.";

            message.className =
                "login-message success";

            setTimeout(()=>{

                document
                    .getElementById(
                        "forgot-modal"
                    )
                    .classList
                    .remove("show");

                document.body
                    .classList
                    .remove("modal-open");

            },1200);

        }

        catch{

            message.textContent =
                "Server Error";

            message.className =
                "login-message error";

        }

    }
);