// creating the global const
const App = {
    toggleBtn : document.querySelector(".menu-icon"),
    sidebar : document.querySelector(".sidebar"),
    feather : document.querySelector(".sidebar-feather"),
    contentLoader : document.getElementById('content-loader'),
    navbarLinks : document.querySelectorAll('.sidebar ul li a'),
};

// creating content function for loading content from url
// now we do not need to include the full url path with the .html extension
function loadContent(url, title, event) {
    fetch(includeHtmlExtension(url))
      .then(response => response.text())
      .then(html => {
            App.contentLoader.innerHTML = html;

            // Update the URL without reloading the page
            history.pushState(
                { content: html, title: title }, 
                    title, 
                    // url <We commented this part out so that the url doen't change on the browser, wle when we reload page it will become an issue>
                );

            // Update the active navbar item after loading content
            setActiveNavbarItem(title, event);

            // on mobile device, we want to automatically close navbar on each click
            mobileNavbarMenuToggle();

            console.log(html, url);
      })
      .catch(error => console.error('Error fetching content:', error));
}

// here we try to set an active class on the clicked element
function setActiveNavbarItem(title, event) {
    // Remove active class from all links
    App.navbarLinks.forEach(link => {
        link.classList.remove('active');
    });

    // change document title
    document.title = title;

    // Add active class to the clicked element
    if(event){
        event.classList.add('active');
    }
}

// ... (DOMContentLoaded) when document has been loaded
document.addEventListener('DOMContentLoaded', () => {

    // on navbar <hamburger> click, toggle class [.open]
    App.toggleBtn.addEventListener("click", () => {
        App.sidebar.classList.toggle("open");
    });

    // We automatically add an event listener to all 
    // menu anchor <a> tags
    App.navbarLinks.forEach(link => {
        // Handle link click here
        link.addEventListener('click', (event) => {
            // Stop event propagation
            event.stopPropagation(); 
            event.preventDefault();

            // getting <href> and link text as title
            const url = link.getAttribute('href');
            const title = link.textContent;

            loadContent(url, title, link);
        });
    });

    // click outisde offcanvas - navbar dashboard menu
    document.addEventListener("mouseup", function (e) {
        // the (e) from the function is the element we clicked on [this]
        // If Clicked on the [feather] element
        // by default the z-index: makes the feature go to back of the sidebar
        if (App.feather.contains(e.target)) {
            mobileNavbarMenuToggle();
        }
    });
});



// Removes .html at the end of the string
// we do not actually need this, but just a re-usable code
function removeHtmlExtension(url) {
    return url.replace(/\.html$/, ''); 
}

// Include .html at the end of the string
function includeHtmlExtension(url) {
    // Check if the URL ends with ".html", if not, append it
    if (!url.endsWith('.html')) {
        url += '.html';
    }

    return url;
}

// if sidebar contains the open class
// then toggle open class
function mobileNavbarMenuToggle() {
    if (App.sidebar.classList.contains("open")) {
        App.sidebar.classList.toggle("open");
    }
}