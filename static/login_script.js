const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacc = document.getElementById("create-acct");
const signupEmailIn = document.getElementById("email-signup");
const usernameIn = document.getElementById("username-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");
const forgetBtn = document.querySelector(".forget-btn");

var email, password, signupEmail, username, signupPassword, confirmSignUpPassword;

createacctbtn.addEventListener("click", function() {
    var isVerified = true;

    signupEmail = signupEmailIn.value;
    signupPassword = signupPasswordIn.value;
    confirmSignUpPassword = confirmSignUpPasswordIn.value;
    username = usernameIn.value;

    // Password strength validation
    if (signupPassword.length < 8 || !/[!@#$%^&*]/.test(signupPassword)) {
        window.alert("Password must be at least 8 characters and include a special character (e.g., !@#$%^&*).");
        isVerified = false;
    }

    if (signupPassword != confirmSignUpPassword) {
        window.alert("Password fields do not match. Try again.");
        isVerified = false;
    }

    if (!signupEmail || !username || !signupPassword || !confirmSignUpPassword) {
        window.alert("Please fill out all required fields.");
        isVerified = false;
    }

    // Validate username length (≤10, matches sign_up table)
    if (username.length > 10) {
        window.alert("Username must be 10 characters or less.");
        isVerified = false;
    }

    const data = {
        email: signupEmail,
        username: username,
        password: signupPassword
    };

    if (isVerified) {
        console.log("Sending signup data:", data);
        var url = 'http://127.0.0.1:5000/signup_data';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Signup response:', data);
            if (data.success) {
                window.alert("Sign-up successful! Please log in.");
                toggle(); // Switch to login form
            } else {
                window.alert("Sign-up failed: " + (data.message || "Unknown error"));
            }
        })
        .catch(error => console.error('Signup error:', error));
    }
});

submitButton.addEventListener("click", function() {
    var isVerified = true;
    email = emailInput.value;
    password = passwordInput.value;

    if (!email || !password) {
        window.alert("Please fill out all required fields.");
        isVerified = false;
    }

    const data = {
        email: email,
        password: password
    };

    if (isVerified) {
        console.log("Sending login data:", data);
        var url = 'http://127.0.0.1:5000/login_data';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log('Login response:', data);
            if (data == true) {
                console.log('Done, Login Credentials matched.');
                localStorage.setItem("username", email);
                window.location.replace("./quiz_html");
            } else {
                window.alert("Login credentials don't match with our database.");
            }
        })
        .catch(error => console.error('Login error:', error));
    }
});
// Password reset handler
forgetBtn.addEventListener("click", function() {
    const email = prompt("Enter your email to receive a password reset link:");
    if (email) {
        fetch('http://127.0.0.1:5000/request_reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.alert("Reset link sent to your email. Please check your inbox.");
            } else {
                window.alert("Error: " + data.message);
            }
        })
        .catch(error => console.error('Reset request error:', error));
    }
});