// script.js
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registration-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error",
  );
  const togglePasswordButton = document.getElementById("toggle-password");
  const registrationStatus = document.getElementById("registration-status");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");

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
    confirmPasswordError.textContent = "";
    registrationStatus.textContent = "";
    registrationStatus.classList.remove("success", "error");
  };

  // Password strength validation
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);

    updateUI(strength);
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

  function updateUI(score) {
    if (score === 0) {
      strengthBar.style.width = "0%";
      strengthText.textContent = "";
      return;
    }
    if (score === 1) {
      strengthBar.style.width = "25%";
      strengthText.textContent = "Weak";
      strengthBar.style.backgroundColor = "#dc3545";
    } else if (score === 2) {
      strengthBar.style.width = "50%";
      strengthText.textContent = "Medium";
      strengthBar.style.backgroundColor = "#ffc107";
    } else if (score === 3) {
      strengthBar.style.width = "75%";
      strengthText.textContent = "Good";
      strengthBar.style.backgroundColor = "#28a745";
    } else {
      strengthBar.style.width = "100%";
      strengthText.textContent = "Strong";
      strengthBar.style.backgroundColor = "#28a745";
    }
  }

  // Event listener for form submission
  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    clearErrors(); // Clear previous error/status messages

    // 1. Get input values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true; // Flag to track overall form validity

    // 2. Perform client-side validation
    // Email validation
    if (email === "") {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Basic email regex
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (password === "") {
      passwordError.textContent = "Password is required.";
      isValid = false;
    } else if (password.length < 8) {
      passwordError.textContent =
        "Password must be at least 8 characters long.";
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent =
        "Password must contain at least one uppercase letter.";
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      passwordError.textContent =
        "Password must contain at least one lowercase letter.";
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = "Password must contain at least one number.";
      isValid = false;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      passwordError.textContent =
        "Password must contain at least one special character.";
      isValid = false;
    }

    // Confirm password validation
    if (confirmPassword === "") {
      confirmPasswordError.textContent = "Please confirm your password.";
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
    }

    // If client-side validation fails, stop here
    if (!isValid) {
      registrationStatus.textContent = "Please correct the errors above.";
      registrationStatus.classList.add("error");
      return;
    }

    // 3. Prepare data for backend (only if validation passes)
    const userData = {
      email: email,
      password: password,
    };

    // 4. Simulate sending data to a backend API
    // In a real application, you would replace this with a fetch() call to your actual backend.
    // For this lesson, we'll simulate a network request and a backend response.
    try {
      // Simulate network delay
      console.log("Sending registration data to backend:", userData);
      const response = await simulateBackendRegistration(userData);

      if (response.success) {
        registrationStatus.textContent =
          "Registration successful! Redirecting to login...";
        registrationStatus.classList.add("success");
        // In a real app, you would redirect to a login page or directly log the user in
        setTimeout(() => {
          window.location.href = "login.html"; // Assume a login page exists
        }, 2000);
      } else {
        // Display error message from the simulated backend
        registrationStatus.textContent = `Registration failed: ${response.message}`;
        registrationStatus.classList.add("error");
        console.error("Backend registration error:", response.message);
      }
    } catch (error) {
      registrationStatus.textContent =
        "An unexpected error occurred during registration.";
      registrationStatus.classList.add("error");
      console.error("Frontend error during registration:", error);
    }
  });

  /**
   * Simulates a backend API call for user registration.
   * In a real application, this would be a `fetch` call to a live server.
   * @param {object} data - The user data (email, password) to register.
   * @returns {Promise<object>} - A promise resolving to a simulated backend response.
   */
  const simulateBackendRegistration = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate various backend responses
        if (data.email === "existing@example.com") {
          // Simulate an email already taken error
          resolve({ success: false, message: "Email already registered." });
        } else if (data.password.includes("admin")) {
          // Simulate a simple server-side password policy failure
          resolve({
            success: false,
            message: "Password is too common or weak.",
          });
        } else if (data.email.endsWith("@fail.com")) {
          // Simulate a generic server error for certain emails
          resolve({
            success: false,
            message: "Could not process registration at this time.",
          });
        } else {
          // Simulate successful registration
          console.log("Backend received data, creating user:", data);
          resolve({ success: true, message: "User registered successfully." });
        }
      }, 1500); // Simulate 1.5 second network delay
    });
  };

  // Add real-time validation feedback (optional, for improved UX)
  emailInput.addEventListener("input", () => {
    emailError.textContent = ""; // Clear error on input
    if (emailInput.value.trim() === "") {
      emailError.textContent = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
    }
  });

  passwordInput.addEventListener("input", () => {
    passwordError.textContent = ""; // Clear error on input
    if (passwordInput.value.length < 8) {
      passwordError.textContent =
        "Password must be at least 8 characters long.";
    }
    // Could add more real-time password strength indicators here
  });

  confirmPasswordInput.addEventListener("input", () => {
    confirmPasswordError.textContent = ""; // Clear error on input
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
    }
  });
});
