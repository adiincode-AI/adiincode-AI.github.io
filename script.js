// Select all the fill bars
const skillFills = document.querySelectorAll('.progress-fill');

// Define the animation trigger
const animateSkills = (entries, observer) => {
  entries.forEach(entry => {
    // When the bar enters the viewport
    if (entry.isIntersecting) {
      const bar = entry.target;
      // Grab the percentage from the HTML data-width attribute
      const targetWidth = bar.getAttribute('data-width');
      // Apply the width, triggering the CSS transition
      bar.style.width = targetWidth;
      
      // Stop observing once animated so it doesn't repeat on scroll up
      observer.unobserve(bar); 
    }
  });
};

// Create the observer (threshold 0.2 means it triggers when 20% visible)
const skillObserver = new IntersectionObserver(animateSkills, {
  threshold: 0.2 
});

// Attach the observer to every bar
skillFills.forEach(bar => {
  skillObserver.observe(bar);
});

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

// The data-focused phrases you want to cycle through
const textArray = ["Data Analyst", "Python Programmer", "Data Visualization", "Data Storyteller"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // How long to wait before deleting
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

// Start the animation when the page loads
document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});