document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation & 404 Handling
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  // Unified function to handle scrolling
  const scrollToSection = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `/${targetId}`);
    }
  };

  // Nav Click Listener
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("data-target");

      // Close mobile menu if open
      if (mobileMenu?.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        navToggle?.classList.remove("active");
        navToggle?.setAttribute("aria-expanded", "false");
      }
      scrollToSection(targetId);
    });
  });

  // 404 Redirect Check
  if (sessionStorage.redirect) {
    const path = new URL(sessionStorage.redirect).pathname.replace("/", "");
    delete sessionStorage.redirect;
    setTimeout(() => {
      const targetSection = document.getElementById(path);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }

  // 2. Mobile Menu Toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      mobileMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // 3. Typing Effect
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");
  const textArray = [
    "Creative Marketing Professional",
    "Content Strategist",
    "Digital Marketer",
    "Brand Storyteller",
  ];

  if (typedTextSpan && cursorSpan) {
    let textArrayIndex = 0,
      charIndex = 0;
    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(
          charIndex++,
        );
        setTimeout(type, 100);
      } else {
        setTimeout(erase, 2000);
      }
    }
    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          --charIndex,
        );
        setTimeout(erase, 50);
      } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, 500);
      }
    }
    setTimeout(type, 1000);
  }

  // 4. Intersection Observers (Skill Bars & Reveals)
  const observerOptions = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Skill Bar Animation
        const bar = entry.target.querySelector(".progress-fill");
        if (bar) bar.style.width = bar.getAttribute("data-width");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".skill-card, .reveal")
    .forEach((el) => observer.observe(el));

  // 5. Nav Shadow
  const siteNav = document.getElementById("siteNav");
  window.addEventListener(
    "scroll",
    () => {
      siteNav?.classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true },
  );
});
