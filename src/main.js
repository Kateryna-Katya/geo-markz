/**
 * GEO-MARKZ.BLOG - Full Script Bundle 2026
 * Порядок: Lenis -> GSAP -> SplitType -> Swiper -> Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. ПЛАВНЫЙ СКРОЛЛ (LENIS)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Синхронизация Lenis со ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // ==========================================
    // 2. МОБИЛЬНОЕ МЕНЮ (BURGER)
    // ==========================================
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('#mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    const toggleMenu = () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            lenis.stop(); // Остановить скролл при открытом меню
        } else {
            lenis.start();
        }
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) toggleMenu();
        });
    });


    // ==========================================
    // 3. АНИМАЦИИ ГЕРОЯ (HERO)
    // ==========================================
    const heroTitle = new SplitType('#hero-title', { types: 'words, chars' });
    const heroTL = gsap.timeline({ delay: 0.3 });

    heroTL.from(heroTitle.chars, {
        opacity: 0,
        y: 40,
        stagger: 0.03,
        duration: 1,
        ease: "back.out(1.7)"
    })
    .from('.hero__description', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from('.hero__btns', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from('.hero__visual', { opacity: 0, x: 50, duration: 1.2, ease: "power3.out" }, "-=1");

    // Эффект Orb (за мышкой)
    const orb = document.querySelector('#hero-orb');
    if (orb) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.05;
            const y = (e.clientY - window.innerHeight / 2) * 0.05;
            gsap.to(orb, { x, y, duration: 2, ease: "power2.out" });
        });
    }


    // ==========================================
    // 4. СКРОЛЛ-АНИМАЦИИ (SCROLLTRIGGER)
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    // Секция About
    gsap.from(".about__container > *", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    });

    // Секция Benefits (Фикс: подгружаем все карточки через stagger)
    gsap.from(".benefit-card", {
        scrollTrigger: {
            trigger: ".benefits__grid",
            start: "top 80%",
        },
        y: 60,
        autoAlpha: 0, // autoAlpha лучше opacity для рендеринга
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
    });

    // Линия Инноваций (Timeline)
    const innovTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".innovations__timeline",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
        }
    });

    innovTL.to(".timeline__progress", { height: "100%", ease: "none" });

    // Анимация самих шагов (Инновации)
    document.querySelectorAll('.step-item').forEach((step) => {
        gsap.to(step, {
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleClass: "active"
            },
            opacity: 1,
            x: 0,
            duration: 0.8
        });
    });


    // ==========================================
    // 5. СЛАЙДЕР КЕЙСОВ (SWIPER)
    // ==========================================
    if (document.querySelector('.cases-slider')) {
        new Swiper('.cases-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1100: { slidesPerView: 2.5 }
            }
        });
    }


    // ==========================================
    // 6. КОНТАКТНАЯ ФОРМА & КАПЧА
    // ==========================================
    let captchaAnswer;
    const captchaLabel = document.getElementById('captcha-question');
    const contactForm = document.getElementById('contact-form');

    const generateCaptcha = () => {
        if (!captchaLabel) return;
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = a + b;
        captchaLabel.innerText = `${a} + ${b}`;
    };

    generateCaptcha();

    if (contactForm) {
        // Ограничение ввода телефона
        const phone = document.getElementById('phone');
        phone.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userAns = parseInt(document.getElementById('captcha').value);

            if (userAns !== captchaAnswer) {
                alert('Неверная капча!');
                generateCaptcha();
                return;
            }

            const btn = contactForm.querySelector('button');
            btn.innerText = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                gsap.to(contactForm, { opacity: 0, duration: 0.5, onComplete: () => {
                    contactForm.style.display = 'none';
                    const success = document.getElementById('form-success');
                    success.style.display = 'flex';
                    gsap.from(success, { opacity: 0, y: 20 });
                }});
            }, 1500);
        });
    }

    // Глобальная функция сброса
    window.resetForm = () => {
        contactForm.reset();
        contactForm.style.display = 'block';
        contactForm.style.opacity = '1';
        document.getElementById('form-success').style.display = 'none';
        generateCaptcha();
    };


    // ==========================================
    // 7. COOKIE POPUP
    // ==========================================
    const cookie = document.querySelector('#cookie-popup');
    if (cookie && !localStorage.getItem('cookie-ok')) {
        setTimeout(() => cookie.classList.add('active'), 2500);
        document.querySelector('#cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookie-ok', 'true');
            cookie.classList.remove('active');
        });
    }


    // ==========================================
    // 8. ФИКС: ОБНОВЛЕНИЕ SCROLLTRIGGER
    // ==========================================
    // Это решает проблему, когда подгружается только первый элемент
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

});