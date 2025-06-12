document.addEventListener("DOMContentLoaded", function() {

    // --- KÓD PRE NAVIGÁCIU A HAMBURGER MENU ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    
    const header = document.querySelector('.site-header');
    let navHeight = header.offsetHeight;
    
    window.addEventListener('resize', () => {
        navHeight = header.offsetHeight;
    });

    const toggleNav = () => {
        hamburger.classList.toggle("is-active");
        navMenu.classList.toggle("is-open");
        document.body.classList.toggle("body-no-scroll");

        // UPRAVENÁ GSAP Animácia pre položky menu a logo
        if (navMenu.classList.contains("is-open")) {
            // Použijeme časovú os (timeline) pre lepšiu kontrolu sekvencie animácií
            const tl = gsap.timeline();
            
            // 1. Animácia pre logo
            tl.to(".nav-header-image", { 
                opacity: 1, 
                duration: 0.6, 
                ease: "power2.out", 
                delay: 0.2 
            });
            
            // 2. Animácia pre položky menu (začne sa krátko po začiatku animácie loga)
            tl.fromTo(".nav-item", 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
                "-=0.4" // Spustí sa 0.4s pred koncom predošlej animácie pre plynulý efekt
            );

        } else {
            // Pri zatvorení skryjeme logo aj položky menu
            gsap.set([".nav-header-image", ".nav-item"], { opacity: 0 });
        }
    };
    
    const closeNav = () => {
        if (navMenu.classList.contains("is-open")) {
            hamburger.classList.remove("is-active");
            navMenu.classList.remove("is-open");
            document.body.classList.remove("body-no-scroll");
            // Pri zatvorení skryjeme logo aj položky menu
            gsap.set([".nav-header-image", ".nav-item"], { opacity: 0 });
        }
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            closeNav();
        });
    });

    hamburger.addEventListener("click", toggleNav);
    
    const observerOptions = {
        root: null,
        rootMargin: `-${navHeight}px 0px -50% 0px`,
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- PÔVODNÝ KÓD ---
    
    const elementsToAnimate = document.querySelectorAll('.fade-in-element');
    if (elementsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const thirdSection = document.getElementById("why-us");

    if (scrollToTopBtn && thirdSection) {
        const checkScrollPosition = () => {
            const thirdSectionTop = thirdSection.offsetTop;
            if (window.scrollY > thirdSectionTop) {
                scrollToTopBtn.classList.add("visible");
            } else {
                scrollToTopBtn.classList.remove("visible");
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        window.addEventListener("scroll", checkScrollPosition);
        scrollToTopBtn.addEventListener("click", scrollToTop);
    }

    // --- KÓD PRE ZMENU VEĽKOSTI OKNA ---
    const breakpoint = 992; 

    window.addEventListener('resize', () => {
        if (window.innerWidth > breakpoint) {
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('is-open');
            document.body.classList.remove('body-no-scroll');
            // Pri prechode na desktop resetujeme štýly loga aj položiek
            gsap.set([".nav-header-image", ".nav-item"], { clearProps: "all" });
        }
    });
    
// --- PRIDANÉ: Oneskorené načítanie skriptu tretej strany (Elfsight) ---

    // Táto funkcia sa postará o načítanie skriptu a spustí sa iba raz
    const loadElfsightScript = () => {
        const elfsightScript = document.createElement('script');
        elfsightScript.src = 'https://static.elfsight.com/platform/platform.js';
        elfsightScript.defer = true; // Použijeme defer pre istotu
        document.body.appendChild(elfsightScript);

        // Odstránime "poslucháčov", aby sa funkcia nespúšťala zbytočne znova
        window.removeEventListener('scroll', loadElfsightScript);
        window.removeEventListener('mousemove', loadElfsightScript);
        window.removeEventListener('touchstart', loadElfsightScript);
    };

    // Pripravíme "poslucháčov" na prvú interakciu používateľa.
    // Hneď ako používateľ pohne myšou, začne skrolovať alebo sa dotkne obrazovky, skript sa načíta.
    window.addEventListener('scroll', loadElfsightScript, { once: true });
    window.addEventListener('mousemove', loadElfsightScript, { once: true });
    window.addEventListener('touchstart', loadElfsightScript, { once: true });
});