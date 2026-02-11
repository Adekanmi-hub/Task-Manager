document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const loginStatus = document.getElementById("login-status");
    const togglePasswordButton = document.getElementById("toggle-password");

    // Toggle password visibility
    togglePasswordButton.addEventListener("click", () => {
        const type =
            passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
    });

    // Function to clear all error messages
    const clearErrors = () => {
        emailError.textContent = "";
        passwordError.textContent = "";
        loginStatus.textContent = "";
        loginStatus.classList.remove("success", "error");
    };
})