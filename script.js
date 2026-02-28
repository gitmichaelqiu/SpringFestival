const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const envelopeOpened = ref(false);

        const openEnvelope = () => {
            if(!envelopeOpened.value) {
                envelopeOpened.value = true;
                // Simple click animation feedback
                gsap.to('.custom-item:first-child .w-64', {
                    rotate: 0,
                    scale: 1.1,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            }
        };

        const initLenis = () => {
            const lenis = new Lenis({
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
            
            if(cursorDot && cursorOutline) {
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
        });

        return {
            envelopeOpened,
            openEnvelope
        };
    }
}).mount('#app');
