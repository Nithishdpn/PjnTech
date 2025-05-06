// Mobile Menu Variables
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const dropdowns = document.querySelectorAll('.dropdown');
let isMenuOpen = false;
let activeDropdown = null;

// Initialize mobile menu
function initializeMobileMenu() {
    isMenuOpen = false;
    activeDropdown = null;
    navLinks.classList.remove('active');
    mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
    closeAllDropdowns();
}

// Close all dropdowns
function closeAllDropdowns() {
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const chevron = dropdownToggle?.querySelector('.fas.fa-chevron-down');
        
        if (dropdownMenu && dropdownToggle) {
            dropdownMenu.classList.remove('show');
            dropdownToggle.classList.remove('active');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu(force = null) {
    isMenuOpen = force !== null ? force : !isMenuOpen;
    navLinks.classList.toggle('active', isMenuOpen);
    mobileMenu.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    // If closing main menu, also close all dropdowns
    if (!isMenuOpen) {
        closeAllDropdowns();
        activeDropdown = null;
    }
}

// Mobile menu click handler
mobileMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
});

// Handle mobile navigation
function setupMobileNavigation() {
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const menuItems = dropdown.querySelectorAll('.menu-item');

        // Dropdown toggle click handler for mobile
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth > 992) return; // Only handle mobile clicks
            
            e.preventDefault();
            e.stopPropagation();

            // Keep the main menu open
            if (!navLinks.classList.contains('active')) {
                navLinks.classList.add('active');
                isMenuOpen = true;
            }

            // Check if clicking the active dropdown
            const isCurrentlyActive = dropdown === activeDropdown;

            // Close all dropdowns
            closeAllDropdowns();

            // If we didn't click the active dropdown, open the clicked one
            if (!isCurrentlyActive) {
                dropdownMenu.classList.add('show');
                dropdownToggle.classList.add('active');
                const chevron = dropdownToggle.querySelector('.fas.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = 'rotate(180deg)';
                    chevron.style.transition = 'transform 0.3s ease';
                }
                activeDropdown = dropdown;
            } else {
                activeDropdown = null;
            }
        });

        // Handle clicks on menu items
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (window.innerWidth > 992) return;
                
                e.preventDefault();
                e.stopPropagation();

                const serviceId = item.getAttribute('data-service');
                const parentDropdown = item.closest('.dropdown');
                const dropdownToggle = parentDropdown?.querySelector('.dropdown-toggle');
                const dropdownType = dropdownToggle?.getAttribute('href')?.replace('#', '');

                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Close mobile menu
                toggleMobileMenu(false);

                // Navigate to homepage if not already there
                if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                    window.location.href = `index.html#${dropdownType || 'services'}`;
                    return;
                }

                // If already on homepage, scroll to appropriate section
                const targetSection = document.querySelector(`.${dropdownType || 'services'}`);
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Update content for the clicked item if needed
                if (serviceId) {
                    updateContent(serviceId, dropdown);
                }
            });
        });
    });

    // Handle clicks outside dropdowns
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 992) return;

        const clickedDropdownToggle = e.target.closest('.dropdown-toggle');
        const clickedMenuItem = e.target.closest('.menu-item');
        const clickedDropdownMenu = e.target.closest('.dropdown-menu');
        const clickedMobileMenu = e.target.closest('.mobile-menu');
        
        // If clicked outside dropdown areas and not on mobile menu button, close all dropdowns
        if (!clickedDropdownToggle && !clickedMenuItem && !clickedDropdownMenu && !clickedMobileMenu) {
            closeAllDropdowns();
            activeDropdown = null;
            
            // If also clicked outside nav-links, close the mobile menu
            if (!e.target.closest('.nav-links')) {
                toggleMobileMenu(false);
            }
        }
    });
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 992) {
            initializeMobileMenu();
        }
    }, 250);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    setupMobileNavigation();
});

// Mega Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const menuItems = dropdown.querySelectorAll('.menu-item');
        let timeoutId;

        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
                    otherDropdown.querySelector('.dropdown-toggle i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Show current dropdown
            dropdownMenu.classList.add('show');
            dropdownToggle.querySelector('i').style.transform = 'rotate(180deg)';
            
            // Show first content section by default
            if (menuItems.length > 0) {
                const firstServiceId = menuItems[0].getAttribute('data-service');
                updateContent(firstServiceId, dropdown);
            }
        });

        // Hide dropdown when mouse leaves
        dropdown.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdownMenu.classList.remove('show');
                dropdownToggle.querySelector('i').style.transform = 'rotate(0deg)';
            }, 200);
        });

        // Handle menu item hover
        if (menuItems) {
            menuItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    // Update active state
                    menuItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    
                    // Update content
                    const serviceId = item.getAttribute('data-service');
                    if (serviceId) {
                        updateContent(serviceId, dropdown);
                    }
                });
            });
        }

        // Mobile toggle
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
                    otherDropdown.querySelector('.dropdown-toggle i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current dropdown
            const isOpen = dropdownMenu.classList.contains('show');
            dropdownMenu.classList.toggle('show');
            dropdownToggle.querySelector('i').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            
            // Show first content section when opening
            if (!isOpen && menuItems.length > 0) {
                const firstServiceId = menuItems[0].getAttribute('data-service');
                updateContent(firstServiceId, dropdown);
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80; // Height of fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow and change background when scrolling down
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Hide/show navbar on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Here you would typically send the form data to a server
    console.log('Form submitted:', formObject);
    
    // Show success message
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitButton.textContent = 'Message Sent!';
        submitButton.style.background = '#28a745';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
    }, 1500);
});

// Newsletter Form Handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitButton = newsletterForm.querySelector('button');
        
        if (emailInput.value) {
            // Here you would typically send the email to a server
            console.log('Newsletter subscription:', emailInput.value);
            
            // Show success message
            const originalHtml = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-check"></i>';
            submitButton.style.background = '#28a745';
            
            // Reset form
            emailInput.value = '';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalHtml;
                submitButton.style.background = '';
            }, 3000);
        }
    });
}

// Testimonials Slider
const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        testimonialsSlider.classList.add('active');
        startX = e.pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        testimonialsSlider.classList.remove('active');
    });

    testimonialsSlider.addEventListener('mouseup', () => {
        isDown = false;
        testimonialsSlider.classList.remove('active');
    });

    testimonialsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .solution-card, .about-content, .testimonial, .contact-container');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial styles for animation
document.querySelectorAll('.service-card, .solution-card, .about-content, .testimonial, .contact-container').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
animateOnScroll();

// Add CSS class for active nav item based on scroll position
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Dropdown menu interaction
document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    const detailContents = document.querySelectorAll('.detail-content');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Function to show service details
    function showServiceDetails(serviceId) {
        // Hide all detail contents
        detailContents.forEach(dc => dc.classList.remove('active'));
        serviceItems.forEach(si => si.classList.remove('active'));

        // Show the selected content
        const detailContent = document.getElementById(`${serviceId}-details`);
        const serviceItem = document.querySelector(`[data-service="${serviceId}"]`);
        
        if (detailContent && serviceItem) {
            detailContent.classList.add('active');
            serviceItem.classList.add('active');
        }
    }

    // Show first service details by default
    if (serviceItems.length > 0 && detailContents.length > 0) {
        const firstServiceId = serviceItems[0].getAttribute('data-service');
        showServiceDetails(firstServiceId);
    }

    // Handle hover events on service items
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const serviceId = this.getAttribute('data-service');
            showServiceDetails(serviceId);
        });
    });

    // Keep dropdown menu visible when hovering
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.querySelector('.dropdown-menu').style.opacity = '1';
            this.querySelector('.dropdown-menu').style.visibility = 'visible';
        });

        dropdown.addEventListener('mouseleave', function() {
            this.querySelector('.dropdown-menu').style.opacity = '0';
            this.querySelector('.dropdown-menu').style.visibility = 'hidden';
        });
    });
}); 

// Function to update content
function updateContent(serviceId, dropdown) {
    const allContent = dropdown.querySelectorAll('.content-section');
    const isMobile = window.innerWidth <= 992;
    
    allContent.forEach(content => {
        content.style.display = 'none';
        content.style.opacity = '0';
    });

    const selectedContent = dropdown.querySelector(`.content-section[data-content="${serviceId}"]`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        
        setTimeout(() => {
            selectedContent.style.transition = 'opacity 0.3s ease';
            selectedContent.style.opacity = '1';
            
            if (isMobile) {
                const headerHeight = 80;
                const elementPosition = selectedContent.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Toggle dropdown on click
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isActive = this.classList.contains('active');
            
            // Close all other dropdowns
            dropdowns.forEach(d => {
                d.querySelector('.dropdown-toggle').classList.remove('active');
                d.querySelector('.dropdown-menu').classList.remove('show');
            });

            // Toggle current dropdown
            if (!isActive) {
                this.classList.add('active');
                menu.classList.add('show');
            }
        });

        // Handle menu item interactions for services
        const menuItems = dropdown.querySelectorAll('.menu-item');
        const contentSections = dropdown.querySelectorAll('.content-section');

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const service = this.getAttribute('data-service');
                
                // Remove active class from all items
                menuItems.forEach(mi => mi.classList.remove('active'));
                
                // Add active class to current item
                this.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show corresponding content section
                const activeContent = dropdown.querySelector(`[data-content="${service}"]`);
                if (activeContent) {
                    activeContent.style.display = 'block';
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.querySelector('.dropdown-toggle').classList.remove('active');
                dropdown.querySelector('.dropdown-menu').classList.remove('show');
            });
        }
    });

    // Handle hover states for service rows
    const serviceRows = document.querySelectorAll('.service-row');
    serviceRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.color = 'var(--primary-color)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.color = 'var(--text-color)';
        });
    });
}); 