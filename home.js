function openURL() {
  var url = "Resume.pdf";

  window.open(url, "_blank");
}
let mybutton = document.getElementById("backtotopbutton");

// Monitor scroll events
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    // Show the button only when scrolled past 400px
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// Scroll to top when the button is clicked
function scrolltoTopfunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from refreshing the page

  // Get form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Simple validation
  if (name && email && message) {
      // Show confirmation message
      document.getElementById('confirmationMessage').style.display = 'block';

      // Clear the form (optional)
      document.getElementById('contactForm').reset();
  }
});

