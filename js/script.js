// --- Skill bars: fill on scroll + animate the KPI-style percent readout ---
const skillCards = document.querySelectorAll('.skill-card');

const animateSkills = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const bar = card.querySelector('.progress-fill');
      const percentLabel = card.querySelector('.skill-percent');

      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;

      if (percentLabel) {
        const target = parseInt(percentLabel.getAttribute('data-target'), 10) || 0;
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          percentLabel.textContent = `${Math.round(eased * target)}%`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }

      observer.unobserve(card);
    }
  });
};

const skillObserver = new IntersectionObserver(animateSkills, { threshold: 0.2 });
skillCards.forEach(card => skillObserver.observe(card));

// --- Scroll reveal for section content ---
const revealEls = document.querySelectorAll('.reveal');

const revealOnScroll = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
};

const revealObserver = new IntersectionObserver(revealOnScroll, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// --- Nav: shadow state on scroll ---
const siteNav = document.getElementById('siteNav');

const updateNavState = () => {
  if (window.scrollY > 10) {
    siteNav.classList.add('scrolled');
  } else {
    siteNav.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();

// --- Nav: mobile hamburger toggle ---
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- Hero typed-text rotation ---
document.addEventListener("DOMContentLoaded", function () {
  // 1. Select elements inside the event listener to ensure HTML has loaded
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  // 2. Safety check: prevent crashes if elements aren't found
  if (!typedTextSpan || !cursorSpan) {
    console.warn("Typing effect skipped: Missing '.typed-text' or '.cursor' in HTML.");
    return; 
  }

  const textArray = ["Data Analyst", "Python Programmer", "Data Visualization", "Data Storyteller"];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      cursorSpan.classList.remove("typing");
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }

  // Start the typing loop
  if (textArray.length) setTimeout(type, newTextDelay + 250);
});

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  // --- 1. Handle Mobile Menu Toggle ---
  navToggle.addEventListener("click", () => {
    // Check if menu is currently open
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    
    // Toggle accessibility state
    navToggle.setAttribute("aria-expanded", !isExpanded);
    
    // Toggle the visible class (Make sure your CSS uses .active to show the menu)
    mobileMenu.classList.toggle("active"); 
    navToggle.classList.toggle("active"); 
  });

  // --- 2. Handle Navigation Clicks & Clean URLs ---
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Stop standard navigation

      // If clicked from the mobile menu, close the menu first
      if (mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }

      const targetId = this.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Smoothly scroll to the section
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Change the URL without reloading the page
        history.pushState(null, "", `/${targetId}`);
      }
    });
  });

  // --- 3. Handle 404 Redirects (From previous step) ---
  if (sessionStorage.redirect) {
    const redirectUrl = sessionStorage.redirect;
    delete sessionStorage.redirect; 
    
    const urlObj = new URL(redirectUrl);
    const sectionName = urlObj.pathname.replace("/", ""); 

    const targetSection = document.getElementById(sectionName);

    if (sectionName && targetSection) {
        history.replaceState(null, "", `/${sectionName}`);
        
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }
  }
});
