document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const togglePasswordButton = document.getElementById("toggle-password");
    const registrationStatus = document.getElementById("registration-status");
    const strengthBar = document.getElementById("strength-bar");
    const strengthText = document.getElementById("strength-text");

    // ─── ReqRes Test Credentials ──────────────────────────────────────────────
    // ReqRes only accepts these predefined emails for registration:
    // Email:    eve.holt@reqres.in   → returns { id: 4, token: "..." } ✅
    // Email:    sydney@fife          → returns { error: "Missing password" } ❌
    // Any other email               → returns { error: "Note: Only defined users..." } ❌

    // ─── Toggle Password Visibility ───────────────────────────────────────────
    togglePasswordButton.addEventListener("click", () => {
        const type =
            passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
    });

    // ─── Clear All Errors ─────────────────────────────────────────────────────
    const clearErrors = () => {
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";
        if (confirmPasswordError) confirmPasswordError.textContent = "";
        if (registrationStatus) {
            registrationStatus.textContent = "";
            registrationStatus.classList.remove("success", "error");
        }
    };

    // ─── Set Status Message ───────────────────────────────────────────────────
    function setStatus(message, type) {
        if (!registrationStatus) return;
        registrationStatus.textContent = message;
        registrationStatus.classList.remove("success", "error");
        if (type) registrationStatus.classList.add(type);
    }

    // ─── Password Strength ────────────────────────────────────────────────────
    passwordInput.addEventListener("input", () => {
        const score = calculatePasswordStrength(passwordInput.value);
        updateStrengthUI(score);
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updateStrengthUI(score) {
        if (!strengthBar || !strengthText) return;
        const levels = [
            { width: "0%",   label: "",       color: "" },
            { width: "25%",  label: "Weak",   color: "#dc3545" },
            { width: "50%",  label: "Medium", color: "#ffc107" },
            { width: "75%",  label: "Good",   color: "#28a745" },
            { width: "100%", label: "Strong", color: "#28a745" },
        ];
        const level = levels[Math.min(score, 4)];
        strengthBar.style.width = level.width;
        strengthBar.style.backgroundColor = level.color;
        strengthText.textContent = level.label;
    }

    // ─── Form Validation ──────────────────────────────────────────────────────
    function validateForm(email, password, confirmPassword) {
        let isValid = true;

        // Email
        if (!email) {
            if (emailError) emailError.textContent = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (emailError) emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        // Password
        if (!password) {
            if (passwordError) passwordError.textContent = "Password is required.";
            isValid = false;
        } else if (password.length < 8) {
            if (passwordError) passwordError.textContent = "Password must be at least 8 characters.";
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            if (passwordError) passwordError.textContent = "Password must contain at least one uppercase letter.";
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            if (passwordError) passwordError.textContent = "Password must contain at least one lowercase letter.";
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            if (passwordError) passwordError.textContent = "Password must contain at least one number.";
            isValid = false;
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            if (passwordError) passwordError.textContent = "Password must contain at least one special character.";
            isValid = false;
        }

        // Confirm password
        if (!confirmPassword) {
            if (confirmPasswordError) confirmPasswordError.textContent = "Please confirm your password.";
            isValid = false;
        } else if (password !== confirmPassword) {
            if (confirmPasswordError) confirmPasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        return isValid;
    }

    // ─── Real-time Validation ─────────────────────────────────────────────────
    emailInput.addEventListener("blur", () => {
        if (!emailInput.value.trim()) {
            if (emailError) emailError.textContent = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
            if (emailError) emailError.textContent = "Please enter a valid email address.";
        } else {
            if (emailError) emailError.textContent = "";
        }
    });

    passwordInput.addEventListener("input", () => {
        if (passwordError && passwordInput.value.length >= 8) {
            passwordError.textContent = "";
        }
    });

    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordError) {
            confirmPasswordError.textContent =
                passwordInput.value !== confirmPasswordInput.value
                    ? "Passwords do not match."
                    : "";
        }
    });

    // ─── Registration Logic (ReqRes API) ──────────────────────────────────────
    registrationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Stop if validation fails
        if (!validateForm(email, password, confirmPassword)) {
            setStatus("Please correct the errors above.", "error");
            return;
        }

        const userData = { email, password };

        setStatus("Registering...", "loading");

        try {
            const response = await fetch("https://reqres.in/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ ReqRes returns { id, token } on success
                setStatus("Registration successful! Redirecting to login...", "success");
                console.log("Registered successfully. Token:", data.token);

                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                }

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                // ❌ ReqRes returns { error: "..." } on failure
                setStatus(data.error || "Registration failed. Please try again.", "error");
            }
        } catch (error) {
            setStatus("An unexpected error occurred. Please try again.", "error");
            console.error("Registration error:", error);
        }
    });
});