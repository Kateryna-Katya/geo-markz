// 1. Инициализация плавного скролла Lenis
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 2. Эффект хедера при скролле
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '12px 0';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    } else {
        header.style.padding = '20px 0';
        header.style.boxShadow = 'none';
    }
});

// 3. Плавный переход по якорям (Lenis совместимый)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target);
        }
    });
});
// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Анимация текста SplitType + GSAP
    const heroTitle = new SplitType('#hero-title', { types: 'words, chars' });
    
    gsap.from(heroTitle.chars, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: "back.out(1.7)",
        delay: 0.5
    });

    gsap.from('.hero__description', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.2
    });

    gsap.from('.hero__btns', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 1.4
    });

    // 2. Движение Orb за мышкой (плавное)
    const orb = document.querySelector('#hero-orb');
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) * 0.05;
        const y = (clientY - window.innerHeight / 2) * 0.05;
        
        gsap.to(orb, {
            x: x,
            y: y,
            duration: 2,
            ease: "power2.out"
        });
    });
    // Регистрируем плагин
gsap.registerPlugin(ScrollTrigger);

// Анимация секции About
const aboutTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".about",
        start: "top 70%", // анимация начнется, когда верх секции дойдет до 70% экрана
    }
});

aboutTL.from(".about__image", {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
})
.from(".about__content .section-title", {
    y: 50,
    opacity: 0,
    duration: 0.8
}, "-=0.6")
.from(".feature-item", {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.6
}, "-=0.4");
    // Анимация карточек в секции Benefits
gsap.from(".benefit-card", {
    scrollTrigger: {
        trigger: ".benefits__grid",
        start: "top 80%",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // Карточки вылетают по очереди
    ease: "power2.out"
});
    // Анимация секции Innovations
const innovTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".innovations__timeline",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1 // Линия растет синхронно со скроллом
    }
});

// Рост прогресс-бара
innovTL.to(".timeline__progress", {
    height: "100%",
    ease: "none"
});

// Появление шагов (отдельный ScrollTrigger для каждого шага)
document.querySelectorAll('.step-item').forEach((step, index) => {
    gsap.to(step, {
        scrollTrigger: {
            trigger: step,
            start: "top 70%",
            toggleClass: "active", // Добавляем класс при попадании в фокус
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});
});