/* ==========================================================================
   INGESTION ENNOVATION — SHARED SCRIPT
   Used by: index.html, who-we-are.html, what-we-do.html,
            our-values.html, contact-us.html

   Each page sets two data attributes on <body> to configure behavior:
   data-content-section="CSS-CLASS-NAME"  -> section used to trigger the
                                              white header background and
                                              as the scroll-down target
   data-scroll-target="bottom" (optional) -> on index.html the scroll
                                              button goes all the way to
                                              the bottom of the page
                                              instead of to the content
                                              section
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menuIcon');
    const logo = document.getElementById('logo');
    const navBar = document.getElementById('navBar');
    const header = document.querySelector('header');
    const scrollDownBtn = document.getElementById('scrollDownBtn');

    const contentSectionClass = document.body.dataset.contentSection;
    const scrollTargetMode = document.body.dataset.scrollTarget || 'section';
    const contentSection = contentSectionClass
        ? document.querySelector('.' + contentSectionClass)
        : null;

    /* --- Mobile menu toggle --- */
    if (menuIcon && navBar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            navBar.classList.toggle('active');
        });
    }

    /* --- Scroll down button + header background switch --- */
    let isScrolledToBottom = false;

    function updateScrollButton() {
        if (!scrollDownBtn) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < 100) {
            if (!isScrolledToBottom) {
                scrollDownBtn.classList.add('scrolled-to-bottom');
                isScrolledToBottom = true;
            }
        } else {
            if (isScrolledToBottom) {
                scrollDownBtn.classList.remove('scrolled-to-bottom');
                isScrolledToBottom = false;
            }
        }
    }

    function updateHeaderBackground() {
        if (!contentSection || !header) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const sectionTop = contentSection.offsetTop;
        const sectionHeight = contentSection.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        if (scrollTop > sectionBottom) {
            header.classList.add('white-bg');
        } else {
            header.classList.remove('white-bg');
        }
    }

    updateScrollButton();
    updateHeaderBackground();

    window.addEventListener('scroll', () => {
        updateScrollButton();
        updateHeaderBackground();
    });

    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            if (isScrolledToBottom) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (scrollTargetMode === 'bottom') {
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
            } else if (contentSection) {
                contentSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* --- Logo click returns to homepage --- */
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    /* --- Close mobile nav on link click / outside click --- */
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navBar) navBar.classList.remove('active');
            if (menuIcon) menuIcon.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navBar && menuIcon && !navBar.contains(e.target) && !menuIcon.contains(e.target)) {
            navBar.classList.remove('active');
            menuIcon.classList.remove('active');
        }
    });

    /* --- Footer collapsible service/link descriptions (index page only) --- */
    document.querySelectorAll('.service-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const parentLi = this.closest('li');
            const isActive = parentLi.classList.contains('active');
            document.querySelectorAll('.footer-services li').forEach(li => li.classList.remove('active'));
            if (!isActive) parentLi.classList.add('active');
        });
    });

    document.querySelectorAll('.link-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html')) return; // let real links navigate
            e.preventDefault();
            const parentLi = this.closest('li');
            const isActive = parentLi.classList.contains('active');
            document.querySelectorAll('.footer-links li').forEach(li => li.classList.remove('active'));
            if (!isActive) parentLi.classList.add('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.footer-services') && !e.target.closest('.footer-links')) {
            document.querySelectorAll('.footer-services li, .footer-links li').forEach(li => li.classList.remove('active'));
        }
    });

    /* --- Contact form (contact-us.html only) --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            const subject = `Contact Form Inquiry: ${formData.service ? formData.service : 'General Inquiry'}`;
            const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0AService Interest: ${formData.service}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
            const mailtoLink = `mailto:info@ingestionennovation.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            contactForm.reset();
            alert('Thank you for your message! Your email client will open with your message. Please send the email to complete your inquiry.');
        });
    }

    /* --- Force hero image to full opacity once loaded --- */
    const heroImg = document.querySelector('.image-container img, .contact-hero-image img, .values-hero-image img, .services-hero-image img, .about-hero-image img');
    if (heroImg && heroImg.complete) {
        heroImg.style.opacity = '1';
    }
});
