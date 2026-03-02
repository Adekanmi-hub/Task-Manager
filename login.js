document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const loginStatus = document.getElementById("login-status");
  const togglePasswordButton = document.getElementById("toggle-password");

  // ─── ReqRes Test Credentials ──────────────────────────────────────────────
  // These are the only credentials ReqRes will accept and return a token for:
  // Email:    eve.holt@reqres.in
  // Password: cityslicka

  // Toggle password visibility
  togglePasswordButton.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordButton.textContent = type === "password" ? "Show" : "Hide";
  });

  //Validation and form submission
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = "block";
  }

  function clearError(element) {
    element.textContent = "";
    element.style.display = "none";
  }

  function setStatus(message, color) {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.style.color = color;
  }

  function validateForm() {
    let isValid = true;

    // Validate email
    if (!emailInput.value.trim()) {
      showError(emailError, "Email is required.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailError, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(emailError);
    }

    // Validate password
    if (!passwordInput.value.trim()) {
      showError(passwordError, "Password is required.");
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      showError(passwordError, "Password must be at least 6 characters.");
      isValid = false;
    } else {
      clearError(passwordError);
    }

    return isValid;
  }

  // ─── Real-time Validation (clears errors as user types) ───────────────────
  emailInput.addEventListener("input", () => {
    if (isValidEmail(emailInput.value.trim())) {
      clearError(emailError);
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordInput.value.length >= 6) {
      clearError(passwordError);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the form from refreshing the page

    // Run validation first — stop here if it fails
    if (!validateForm()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Show a loading state
    // loginStatus.textContent = "Logging in...";
    // loginStatus.style.color = "blue";
    setStatus("Logging in...", "blue");

    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful
        loginStatus.textContent = "Login successful! Redirecting...";
        loginStatus.style.color = "green";

        // Save token if your backend returns one (e.g. JWT)
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard.html";
        }, 1500);
      } else {
        // ❌ Backend returned an error (wrong credentials, etc.)
        loginStatus.textContent = data.message || "Invalid email or password.";
        loginStatus.style.color = "red";
      }
    } catch (error) {
      // 🔌 Network error or server is down
      loginStatus.textContent = "Something went wrong. Please try again.";
      loginStatus.style.color = "red";
      console.error("Login error:", error);
    }
  });
  // Function to clear all error messages
  const clearErrors = () => {
    emailError.textContent = "";
    passwordError.textContent = "";
    loginStatus.textContent = "";
    loginStatus.classList.remove("success", "error");
  };
});
