/**
 * GEO-MARKZ.BLOG - Full Production Script
 * Фикс: Принудительная активация секции Benefits и пересчет ScrollTrigger
 */

// Регистрируем плагины сразу
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SMOOTH SCROLL (LENIS)
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
        mobileMenu.classList.contains('active') ? lenis.stop() : lenis.start();
    };

    if (burger) burger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) toggleMenu();
        });
    });


    // ==========================================
    // 3. HERO ANIMATIONS
    // ==========================================
    const heroTitle = new SplitType('#hero-title', { types: 'words, chars' });
    const heroTL = gsap.timeline({ delay: 0.5 });

    heroTL.from(heroTitle.chars, {
        opacity: 0,
        y: 50,
        stagger: 0.02,
        duration: 1,
        ease: "back.out(1.7)"
    })
    .from('.hero__description', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from('.hero__btns', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from('.hero__card', { opacity: 0, x: 50, rotation: 5, duration: 1 }, "-=0.8");

    // Эффект Orb
    const orb = document.querySelector('#hero-orb');
    if (orb) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.05;
            const y = (e.clientY - window.innerHeight / 2) * 0.05;
            gsap.to(orb, { x, y, duration: 2, ease: "power2.out" });
        });
    }


    // ==========================================
    // 4. О ПЛАТФОРМЕ (ABOUT)
    // ==========================================
    gsap.from(".about__container > *", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8
    });


    // ==========================================
    // 5. ПРЕИМУЩЕСТВА (BENEFITS) - ФИКСИРОВАННЫЙ БЛОК
    // ==========================================
    const benefitsGrid = document.querySelector('.benefits__grid');
    const benefitCards = document.querySelectorAll('.benefit-card');

    if (benefitsGrid && benefitCards.length > 0) {
        // Используем fromTo для принудительной установки начальных и конечных точек
        gsap.fromTo(benefitCards, 
            { 
                y: 100, 
                opacity: 0,
                visibility: "hidden" 
            }, 
            {
                scrollTrigger: {
                    trigger: benefitsGrid,
                    start: "top 95%", // Срабатывает почти сразу при появлении
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                visibility: "visible",
                stagger: 0.2,
                duration: 1,
                ease: "power3.out",
                onComplete: () => {
                    // Очистка стилей после анимации для избежания конфликтов с hover
                    gsap.set(benefitCards, { clearProps: "y,opacity,visibility" });
                }
            }
        );
    }


    // ==========================================
    // 6. ИННОВАЦИИ (TIMELINE)
    // ==========================================
    const innovTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".innovations__timeline",
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1
        }
    });

    innovTL.to(".timeline__progress", { height: "100%", ease: "none" });

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
    // 7. КЕЙСЫ (SWIPER)
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
    // 8. ФОРМА КОНТАКТОВ
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
        const phone = document.getElementById('phone');
        phone.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^\d+]/g, ''));

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userAns = parseInt(document.getElementById('captcha').value);

            if (userAns !== captchaAnswer) {
                alert('Неверный ответ на капчу!');
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

    window.resetForm = () => {
        contactForm.reset();
        contactForm.style.display = 'block';
        contactForm.style.opacity = '1';
        document.getElementById('form-success').style.display = 'none';
        generateCaptcha();
    };


    // ==========================================
    // 9. COOKIE POPUP
    // ==========================================
    const cookie = document.querySelector('#cookie-popup');
    if (cookie && !localStorage.getItem('cookie-accepted-geo')) {
        setTimeout(() => cookie.classList.add('active'), 3000);
        document.querySelector('#cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookie-accepted-geo', 'true');
            cookie.classList.remove('active');
        });
    }


    // ==========================================
    // 10. ФИНАЛЬНЫЙ ПЕРЕСЧЕТ (REFRESH)
    // ==========================================
    // Это гарантирует, что все триггеры найдут свои координаты после загрузки контента
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });

});