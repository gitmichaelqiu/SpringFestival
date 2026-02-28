const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const initEnvelopeInteraction = () => {
            const trigger = document.getElementById('envelope-trigger');
            const subpage = document.getElementById('envelope-subpage');
            const closeBtn = document.getElementById('close-envelope');
            const mainContent = document.getElementById('main-content');
            const starsContainer = document.getElementById('stars-container');

            if (!trigger || !subpage) return;

            // Generate SVG stars
            for (let i = 0; i < 30; i++) {
                const star = document.createElement('div');
                star.className = 'absolute w-4 h-4 text-festive-gold';
                star.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

                // Random position within the center
                star.style.left = `calc(50% + ${(Math.random() - 0.5) * 40}px)`;
                star.style.top = `calc(50% + ${(Math.random() - 0.5) * 40}px)`;
                star.style.opacity = 0;
                star.style.transform = 'scale(0) translate(-50%, -50%)';

                starsContainer.appendChild(star);
            }

            const stars = starsContainer.children;

            const tl = gsap.timeline({ paused: true });

            // Ensure subpage is on top and visible during animation
            tl.set(subpage, { pointerEvents: 'auto' })
                .to(subpage, { opacity: 1, duration: 0.1 })

                // Scale main content to sink in
                .to(mainContent, { scale: 0.95, opacity: 0, filter: 'blur(10px)', duration: 0.8, ease: "power3.inOut" }, "<")

                // Stagger stars burst
                .to(stars, {
                    opacity: 1,
                    scale: () => Math.random() * 1.5 + 0.5,
                    x: () => (Math.random() - 0.5) * window.innerWidth * 1.5,
                    y: () => (Math.random() - 0.5) * window.innerHeight * 1.5,
                    rotation: () => Math.random() * 360,
                    duration: 1.5,
                    stagger: 0.02,
                    ease: "expo.out"
                }, "<0.2")

                // Subpage content rising
                .from(subpage.querySelector('.max-w-4xl').children, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                }, "-=1");

            trigger.addEventListener('click', () => {
                lenis.stop(); // Prevent scrolling behind
                tl.play();
            });

            closeBtn.addEventListener('click', () => {
                tl.reverse().then(() => {
                    lenis.start();
                });
            });
        };

        const initLenis = () => {
            window.lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        };

        const initCursor = () => {
            const cursorDot = document.querySelector('.cursor-dot');
            const cursorOutline = document.querySelector('.cursor-outline');

            if (cursorDot && cursorOutline) {
                window.addEventListener('mousemove', (e) => {
                    const posX = e.clientX;
                    const posY = e.clientY;

                    cursorDot.style.left = `${posX}px`;
                    cursorDot.style.top = `${posY}px`;

                    cursorOutline.animate({
                        left: `${posX}px`,
                        top: `${posY}px`
                    }, { duration: 500, fill: "forwards" });
                });
            }
        };

        const initGSAP = () => {
            gsap.registerPlugin(ScrollTrigger);

            // Hero animations
            gsap.from('.hero-content h1', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.2
            });

            gsap.from('.hero-content p', {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power4.out",
                delay: 0.5
            });

            // Parallax image in hero
            gsap.to('#home img', {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: "#home",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Parallax Mythology
            gsap.to('#nian-bg', {
                yPercent: 20,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                    trigger: "#mythology",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Stagger reveal of customs
            gsap.utils.toArray('.custom-item').forEach(item => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                    },
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });

            gsap.utils.toArray('.glass-card').forEach(card => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out"
                });
            });
        };

        // Initialize App
        onMounted(() => {
            // Force Lucide icons render
            setTimeout(() => {
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }, 100);

            initLenis();
            initCursor();
            initGSAP();
            initEnvelopeInteraction();
        });

        return {};
    }
}).mount('#app');
