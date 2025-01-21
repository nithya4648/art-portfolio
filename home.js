//preloader
var loader = document.getElementById("preloader");
window.addEventListener("load", function () {
    loader.style.display = "none";
})

//mobile nav
        var theToggle = document.getElementById('toggle');
        var menu = document.getElementById('menu');
        var lastScrollTop = 0;
        // Toggle button and menu display
        theToggle.onclick = function () {
            toggleClass(this, 'on');
            toggleClass(menu, 'show');
        };
        function hasClass(elem, className) {
            return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
        }
        function addClass(elem, className) {
            if (!hasClass(elem, className)) {
                elem.className += ' ' + className;
            }
        }
        function removeClass(elem, className) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
            if (hasClass(elem, className)) {
                while (newClass.indexOf(' ' + className + ' ') >= 0) {
                    newClass = newClass.replace(' ' + className + ' ', ' ');
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            }
        }
        function toggleClass(elem, className) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, " ") + ' ';
            if (hasClass(elem, className)) {
                while (newClass.indexOf(" " + className + " ") >= 0) {
                    newClass = newClass.replace(" " + className + " ", " ");
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            } else {
                elem.className += ' ' + className;
            }
        }
        // Hide menu on scroll down, show on scroll up
        window.addEventListener("scroll", function () {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                menu.classList.remove('show');
                theToggle.classList.remove('on');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
        });

//screenshort
document.addEventListener('keydown', (e) => {
    if (e.key === 'PrintScreen') {
      alert('Screenshots are disabled!');
      e.preventDefault();
    }
  });
  
//right click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// back to top button
// Show button when scrolling down
window.onscroll = function () {
    const backToTopButton = document.getElementById('backtotopbutton');
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopButton.style.display = 'block'; // Show the button
    } else {
        backToTopButton.style.display = 'none'; // Hide the button
    }
};

// Scroll to the top when the button is clicked
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
