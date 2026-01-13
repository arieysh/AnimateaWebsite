// --- 1. Highlight Card Function ---
function highlightCard(element) {
    if (!element || !element.parentElement) return;
    
    let siblings = element.parentElement.children;
    for(let i=0; i< siblings.length; i++) {
        siblings[i].classList.remove('active-card');
    }
    element.classList.add('active-card');
}

// --- 2. Light Simulator ---
function setLight(type, btn) {
    const sphere = document.getElementById('light-sphere');
    const desc = document.getElementById('light-desc');
    
    if (!sphere || !desc || !btn) return;

    let btns = btn.parentElement.children;
    for(let i=0; i< btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');

    if(type === 'ambient') {
        sphere.style.background = '#333';
        sphere.style.boxShadow = 'none';
        desc.innerText = "Uniform light. No shadows. Looks flat.";
    } else if (type === 'point') {
        sphere.style.background = 'radial-gradient(circle at 30% 30%, #fff, #333 60%, #000 100%)';
        sphere.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
        desc.innerText = "Light radiates from a single point. Strong highlight.";
    } else if (type === 'sun') {
        sphere.style.background = 'linear-gradient(135deg, #ffdbba 0%, #333 50%, #000 100%)';
        sphere.style.boxShadow = '10px 10px 30px rgba(0,0,0,0.8)';
        desc.innerText = "Parallel rays (Sun). Sharp direction and strong shadow.";
    }
}

// --- 3. Shader Simulator ---
function setShader(type, btn) {
    const sphere = document.getElementById('shader-sphere');
    const desc = document.getElementById('shader-desc');

    if (!sphere || !desc || !btn) return;

    let btns = btn.parentElement.children;
    for(let i=0; i< btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');

    if(type === 'flat') {
        sphere.style.background = '#555'; 
        desc.innerText = "Flat: One color per face. No gradients.";
    } else if (type === 'gouraud') {
        sphere.style.background = 'linear-gradient(to bottom right, #777, #222)';
        desc.innerText = "Gouraud: Smooth gradient interpolation.";
    } else if (type === 'phong') {
        sphere.style.background = 'radial-gradient(circle at 30% 30%, #fff 0%, #555 20%, #111 100%)';
        desc.innerText = "Phong: Calculates specular highlight (shiny spot).";
    }
}

// --- 4. Toggle Details (Accordion) ---
function toggleDetails(elementId, btn) {
    const content = document.getElementById(elementId);
    
    // Safety Check: If content isn't found, log error and stop.
    if (!content) {
        console.error("Could not find element with ID:", elementId);
        return;
    }

    if (content.classList.contains('active')) {
        content.classList.remove('active');
        // Only try to change text if 'btn' exists
        if(btn && btn.tagName === 'BUTTON') {
            if(btn.innerText.includes('Hide')) btn.innerText = 'Show Details';
            else if(btn.innerText.includes('Collapse')) btn.innerText = 'Expand';
            else if(btn.innerText.includes('Less')) btn.innerText = 'More Info';
        }
    } else {
        content.classList.add('active');
        // Only try to change text if 'btn' exists
        if(btn && btn.tagName === 'BUTTON') {
            if(btn.innerText.includes('Show')) btn.innerText = 'Hide Details';
            else if (btn.innerText.includes('Expand')) btn.innerText = 'Collapse';
            else if (btn.innerText.includes('More')) btn.innerText = 'Less Info';
        }
    }
    
    // Stop the click from bubbling up (Safety for nested clicks)
    if (window.event) {
        window.event.cancelBubble = true;
        if (window.event.stopPropagation) window.event.stopPropagation();
    }
}

// --- 5. POP-OUT MODAL LOGIC ---
function openModal(title, bodyText) {
    const modal = document.getElementById('infoModal');
    if(!modal) return;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerText = bodyText;
    modal.classList.add('open');
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    if(modal) modal.classList.remove('open');
}

// Close modal when clicking outside content
const infoModal = document.getElementById('infoModal');
if (infoModal) {
    infoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// --- 6. SCROLL ANIMATION & TO-TOP BTN ---
// Helper function needs to be global for onclick
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Wrap initialization in DOMContentLoaded to ensure elements exist
document.addEventListener("DOMContentLoaded", function() {
    const scrollBtn = document.getElementById("scrollTopBtn");
    const reveals = document.querySelectorAll('.tutorial-section');

    function reveal() {
        const windowHeight = window.innerHeight;
        // Reduce threshold slightly so elements appear sooner
        const elementVisible = 50; 

        for (let i = 0; i < reveals.length; i++) {
            const elementTop = reveals[i].getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("visible");
            }
        }

        // To-Top Button Visibility
        if (scrollBtn) {
            if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
                scrollBtn.style.display = "flex";
            } else {
                scrollBtn.style.display = "none";
            }
        }
    }

    window.addEventListener('scroll', reveal);
    
    // Trigger immediately to show sections already in view
    reveal();
});