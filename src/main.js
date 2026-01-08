/**
 * GEO-MARKZ.BLOG - Main JavaScript Asset
 * Libraries used: GSAP, ScrollTrigger, SplitType, Lenis, Swiper
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ИНИЦИАЛИЗАЦИЯ SMOOTH SCROLL (LENIS)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Интеграция Lenis со ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // ==========================================
    // 2. HEADER & NAVIGATION
    // ==========================================
    const header = document.querySelector('.header');
    
    // Эффект хедера при скролле
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(248, 250, 252, 0.8)';
        }
    });

    // Плавный переход по якорям через Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });


    // ==========================================
    // 3. МОБИЛЬНОЕ МЕНЮ (BURGER)
    // ==========================================
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('#mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    function toggleMenu() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            lenis.stop(); // Блокируем скролл при открытом меню
            gsap.from('.mobile-nav__link', {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5,
                delay: 0.3
            });
        } else {
            lenis.start();
        }
    }

    if(burger) burger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) toggleMenu();
        });
    });


    // ==========================================
    // 4. HERO ANIMATIONS (GSAP + SPLITTYPE)
    // ==========================================
    // Анимация текста заголовка
    const heroTitle = new SplitType('#hero-title', { types: 'words, chars' });
    
    const heroTL = gsap.timeline({ delay: 0.5 });

    heroTL.from(heroTitle.chars, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: "back.out(1.7)"
    })
    .from('.hero__description', {
        opacity: 0,
        y: 20,
        duration: 0.8
    }, "-=0.6")
    .from('.hero__btns', {
        opacity: 0,
        y: 20,
        duration: 0.8
    }, "-=0.6")
    .from('.hero__card', {
        opacity: 0,
        x: 50,
        rotation: 10,
        duration: 1,
        ease: "power3.out"
    }, "-=1");

    // Интерактивный Orb (движение за мышкой)
    const orb = document.querySelector('#hero-orb');
    if (orb) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX - window.innerWidth / 2) * 0.08;
            const y = (clientY - window.innerHeight / 2) * 0.08;
            
            gsap.to(orb, {
                x: x,
                y: y,
                duration: 2,
                ease: "power2.out"
            });
        });
    }


    // ==========================================
    // 5. SCROLL ANIMATIONS (SECTIONS)
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    // О Платформе (About)
    const aboutTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".about",
            start: "top 70%",
        }
    });

    aboutTL.from(".about__image", { x: -60, opacity: 0, duration: 1 })
           .from(".about__content .section-title", { y: 30, opacity: 0, duration: 0.6 }, "-=0.6")
           .from(".feature-item", { y: 20, opacity: 0, stagger: 0.2, duration: 0.5 }, "-=0.4");

    // Преимущества (Benefits)
    gsap.from(".benefit-card", {
        scrollTrigger: {
            trigger: ".benefits__grid",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });

    // Линия инноваций (Innovations Timeline)
    const innovTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".innovations__timeline",
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
        }
    });

    innovTL.to(".timeline__progress", { height: "100%", ease: "none" });

    document.querySelectorAll('.step-item').forEach((step) => {
        gsap.to(step, {
            scrollTrigger: {
                trigger: step,
                start: "top 75%",
                toggleClass: "active",
            },
            opacity: 1,
            x: 0,
            duration: 0.8
        });
    });


    // ==========================================
    // 6. SWIPER (CASES SLIDER)
    // ==========================================
    if (document.querySelector('.cases-slider')) {
        const casesSlider = new Swiper('.cases-slider', {
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
    // 7. КОНТАКТНАЯ ФОРМА & КАПЧА
    // ==========================================
    let captchaAnswer;
    const captchaQ = document.getElementById('captcha-question');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const phoneInput = document.getElementById('phone');

    function generateCaptcha() {
        if (!captchaQ) return;
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = n1 + n2;
        captchaQ.innerText = `${n1} + ${n2}`;
    }

    if (captchaQ) generateCaptcha();

    // Валидация телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });
    }

    // Обработка формы
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userAnswer = parseInt(document.getElementById('captcha').value);

            if (userAnswer !== captchaAnswer) {
                alert('Ошибка: Неверный ответ на защитный вопрос.');
                generateCaptcha();
                return;
            }

            const submitBtn = contactForm.querySelector('button');
            submitBtn.innerText = 'Отправка...';
            submitBtn.disabled = true;

            // Имитация AJAX
            setTimeout(() => {
                gsap.to(contactForm, { opacity: 0, duration: 0.4, onComplete: () => {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'flex';
                    gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5 });
                }});
            }, 1500);
        });
    }

    // Глобальная функция сброса формы для кнопки "Отправить еще раз"
    window.resetForm = function() {
        contactForm.reset();
        contactForm.style.display = 'block';
        contactForm.style.opacity = '1';
        formSuccess.style.display = 'none';
        generateCaptcha();
    };


    // ==========================================
    // 8. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.querySelector('#cookie-popup');
    const cookieAccept = document.querySelector('#cookie-accept');

    if (cookiePopup && !localStorage.getItem('cookies-accepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 3000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookies-accepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

});