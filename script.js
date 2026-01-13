document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.course-slider-track');
    const progressBarFill = document.getElementById('progressBarFill');
    
    // Configuration for the auto-scroll
    const SCROLL_SPEED = 1; // Pixels to scroll per interval (lower = slower)
    const INTERVAL_DELAY = 20; // Milliseconds between scroll updates (lower = smoother/faster updates)
    let scrollInterval;

    // --- 1. Progress Bar Update Function (from previous code) ---

    const updateProgressBar = () => {
        // totalScrollWidth: The maximum distance the user can scroll
        const totalScrollWidth = sliderTrack.scrollWidth - sliderTrack.clientWidth;
        
        // currentScrollPosition: The current scroll distance from the left
        const currentScrollPosition = sliderTrack.scrollLeft;

        if (totalScrollWidth > 0) {
            const scrollPercentage = (currentScrollPosition / totalScrollWidth) * 100;
            progressBarFill.style.width = `${scrollPercentage}%`;
        } else {
            progressBarFill.style.width = '0%'; 
        }
    };

    // --- 2. Auto-Scroll Logic ---

    const startAutoScroll = () => {
        // Clear any existing interval to prevent multiple loops
        clearInterval(scrollInterval); 

        scrollInterval = setInterval(() => {
            // Get the current scroll position
            let currentScrollLeft = sliderTrack.scrollLeft;
            
            // Calculate the maximum scrollable width
            const maxScrollLeft = sliderTrack.scrollWidth - sliderTrack.clientWidth;

            // Check if we've reached the end
            if (currentScrollLeft >= maxScrollLeft) {
                // If at the end, jump back to the beginning to create a loop illusion
                sliderTrack.scrollLeft = 0;
            } else {
                // Otherwise, scroll forward by the defined speed
                sliderTrack.scrollLeft += SCROLL_SPEED;
            }
            
            // Update the progress bar on every scroll movement
            updateProgressBar();
            
        }, INTERVAL_DELAY);
    };

    // --- 3. Interaction Handling (Pause on Hover) ---
    
    // Pause auto-scroll when the mouse hovers over the slider
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(scrollInterval);
    });

    // Resume auto-scroll when the mouse leaves the slider
    sliderTrack.addEventListener('mouseleave', () => {
        startAutoScroll();
    });

    // --- 4. Initialization ---

    // Initial progress bar update and start the loop
    updateProgressBar();
    startAutoScroll();
});

 // --- SIGN IN AND GET START ---
document.addEventListener('DOMContentLoaded', () => {
    // Select the main Modal Overlay
    const authModal = document.getElementById('authModal');
    
    // Select the Close "X" button
    const closeBtn = document.querySelector('.auth-close-x');
    
    // Select the containers for switching
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');

    // UI Elements for Logged In state
    const loggedOutUI = document.getElementById('logged-out-UI');
    const loggedInUI = document.getElementById('logged-in-UI');
    const userDisplayName = document.getElementById('user-display-name');

    // --- 1. CLOSING LOGIC ---

    // --- 1. CLOSING LOGIC ---

const closeModal = () => {
    authModal.style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
};

// Use addEventListener instead of .onclick for better mobile support
if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents the click from "bleeding through" to elements behind
        closeModal();
    });
}

// Close when clicking outside the box
window.addEventListener('click', (event) => {
    if (event.target === authModal) {
        closeModal();
    }
});

    // --- 2. OPENING LOGIC ---

    // Open Login (Sign In button)
    document.querySelector('.signin').onclick = (e) => {
        e.preventDefault();
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
        authModal.style.display = 'block';
    };

    // Open Register (Get Started button)
    document.querySelector('.get-started').onclick = (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
        authModal.style.display = 'block';
    };

    // --- 3. SWITCHING LOGIC (Inside Modal) ---

    document.getElementById('switchToRegister').onclick = () => {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    };

    document.getElementById('switchToLogin').onclick = () => {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    };

    // --- 4. AUTHENTICATION LOGIC ---

    const loginUser = (userData) => {
        localStorage.setItem("activeUser", JSON.stringify(userData));
        userDisplayName.innerText = "Hello, " + userData.name;
        if(loggedOutUI) loggedOutUI.style.display = "none";
        if(loggedInUI) loggedInUI.style.display = "flex";
        closeModal();
    };

    // Check if user is already logged in on refresh
    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) {
        loginUser(JSON.parse(savedUser));
    }

    // Handle Registration
    document.getElementById('registerForm').onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('regConfirmPassword').value;

        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        const newUser = { name, email, pass };
        localStorage.setItem(`userDB_${email}`, JSON.stringify(newUser));
        alert("Registration successful! Please log in.");
        document.getElementById('switchToLogin').click();
    };

    // Handle Login
    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        const storedUser = localStorage.getItem(`userDB_${email}`);

        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.pass === pass) {
                loginUser(userData);
            } else {
                alert("Incorrect password.");
            }
        } else {
            alert("Email not found. Please register.");
        }
    };

    // Handle Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("activeUser");
            window.location.reload();
        };
    }
});

const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon from bars to X when open
    const icon = mobileMenu.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});