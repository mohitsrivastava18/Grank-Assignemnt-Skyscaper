document.addEventListener("DOMContentLoaded", () => {
    
    /*=========================================
      MOBILE MENU TOGGLE
    =========================================*/
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    
    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
            menuToggle.classList.toggle("open");
        });
        
        // Close menu when clicking a link
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("active");
                menuToggle.classList.remove("open");
            });
        });
    }

    /*=========================================
      STICKY HEADER
    =========================================*/
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    });

    /*=========================================
      STATS COUNTER ANIMATION
    =========================================*/
    const counters = document.querySelectorAll(".counter");
    
    const startCounting = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            const isFloat = counter.dataset.target.includes('.');
            let count = 0;
            const duration = 2000; // 2 seconds animation
            const steps = 60;
            const stepTime = duration / steps;
            const increment = target / steps;
            
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = isFloat ? count.toFixed(1) : Math.ceil(count);
                    setTimeout(updateCount, stepTime);
                } else {
                    counter.innerText = isFloat ? target.toFixed(1) : target;
                }
            };
            
            updateCount();
        });
    };

    // Trigger counter animation using Intersection Observer
    const statsSection = document.querySelector(".stats-banner-wrapper");
    if (statsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(statsSection);
    } else {
        // Fallback if Observer is not supported
        startCounting();
    }

    /*=========================================
      FLOOR PLANS TAB TOGGLE
    =========================================*/
    const planToggleButtons = document.querySelectorAll(".plan-toggle-btn");
    const planCards = document.querySelectorAll(".plan-card");
    
    planToggleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            planToggleButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const type = btn.dataset.type;
            
            planCards.forEach((card, index) => {
                card.style.opacity = "0";
                card.style.transform = "translateY(15px)";
                
                setTimeout(() => {
                    // In a real application, different tabs would load different floorplan images.
                    // For demo purposes, we toggle details or shuffle ribbons slightly to show interactivity.
                    const img = card.querySelector("img");
                    if (type === "master") {
                        img.src = "assets/tower/a.jpg";
                    } else {
                        // Change image slightly or rotate to show different view
                        img.src = "assets/tower/a.jpg";
                    }
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 200 + (index * 50));
            });
        });
    });

    /*=========================================
      AMENITIES DYNAMIC CAROUSEL SLIDER (51 ICONS)
    =========================================*/
    const amenitiesGrid = document.getElementById("amenities-grid");
    const prevBtn = document.getElementById("amenity-prev");
    const nextBtn = document.getElementById("amenity-next");
    const filterButtons = document.querySelectorAll(".amenity-filter-btn");

    // All 51 amenities icons mapping (1 to 52, excluding 11) matching the exact icon grid
    const amenitiesData = [
        { id: 1, name: "Cycling Track", category: "outdoor" },
        { id: 2, name: "Beauty Salon & Spa", category: "clubhouse" },
        { id: 3, name: "Amphitheatre", category: "outdoor" },
        { id: 4, name: "Digital Kiosk & ATM", category: "utility" },
        { id: 5, name: "Billiards & Snooker", category: "clubhouse" },
        { id: 6, name: "Cards & Board Games", category: "clubhouse", file: "6-new.png" },
        { id: 7, name: "Swimming Pool", category: "outdoor" },
        { id: 8, name: "Fine Dining Restaurant", category: "clubhouse" },
        { id: 9, name: "Covered Car Parking", category: "utility" },
        { id: 10, name: "Clinic & Pharmacy", category: "utility" },
        { id: 12, name: "Conference Room", category: "clubhouse" },
        { id: 13, name: "Cricket Practice Pitch", category: "outdoor" },
        { id: 14, name: "Yoga Deck", category: "clubhouse" },
        { id: 15, name: "Outdoor Seating Lounge", category: "outdoor" },
        { id: 16, name: "Barbecue Corner", category: "outdoor" },
        { id: 17, name: "Gated Emergency Exit", category: "utility" },
        { id: 18, name: "Housekeeping & Maintenance", category: "utility" },
        { id: 19, name: "Flower & Butterfly Garden", category: "outdoor" },
        { id: 20, name: "Football & Soccer Turf", category: "outdoor" },
        { id: 21, name: "Water Fountain", category: "outdoor" },
        { id: 22, name: "Organic Gardening Zone", category: "outdoor" },
        { id: 23, name: "Weightlifting Gym", category: "clubhouse" },
        { id: 24, name: "Reception & Concierge", category: "utility" },
        { id: 25, name: "Treadmill Fitness Studio", category: "clubhouse" },
        { id: 26, name: "Basketball Court", category: "outdoor" },
        { id: 27, name: "Mini Theatre & AV Room", category: "clubhouse" },
        { id: 28, name: "Badminton Court", category: "outdoor" },
        { id: 29, name: "Poolside Deck & Sunbed", category: "outdoor" },
        { id: 30, name: "Kitchenette & Pantry", category: "clubhouse" },
        { id: 31, name: "Landscaped Greenery", category: "outdoor" },
        { id: 32, name: "Internal Paved Driveway", category: "utility" },
        { id: 33, name: "Supermarket & Store", category: "utility" },
        { id: 34, name: "Solar Energy Station", category: "utility" },
        { id: 35, name: "Lawn Maintenance", category: "utility" },
        { id: 36, name: "Doctor Consultation Desk", category: "utility" },
        { id: 37, name: "Sun Deck & Solarium", category: "outdoor" },
        { id: 38, name: "Crèche & Play School", category: "clubhouse" },
        { id: 39, name: "Power Grid Substation", category: "utility" },
        { id: 40, name: "Zen Buddha Garden", category: "outdoor" },
        { id: 41, name: "Open Air Cafeteria", category: "clubhouse" },
        { id: 42, name: "Senior Citizen Park", category: "outdoor" },
        { id: 43, name: "Security Guard Booth", category: "utility" },
        { id: 44, name: "Lawn Tennis Court", category: "outdoor" },
        { id: 45, name: "Jacuzzi & Hot Tub", category: "clubhouse" },
        { id: 46, name: "Visitors Lounge", category: "utility" },
        { id: 47, name: "Table Tennis Room", category: "clubhouse" },
        { id: 48, name: "Patio Seating & Umbrella", category: "outdoor" },
        { id: 49, name: "Coworking & Study Lounge", category: "clubhouse" },
        { id: 50, name: "Quality Masonry", category: "utility" },
        { id: 51, name: "Meditation Pavilion", category: "outdoor" },
        { id: 52, name: "Reflexology Path", category: "outdoor" }
    ];

    const renderAmenities = (filter = "all") => {
        if (!amenitiesGrid) return;
        amenitiesGrid.innerHTML = "";

        const filtered = filter === "all" 
            ? amenitiesData 
            : amenitiesData.filter(item => item.category === filter);

        const itemsPerPage = 18; // 6 columns x 3 rows per page slide grid
        const totalPages = Math.ceil(filtered.length / itemsPerPage);

        for (let i = 0; i < totalPages; i++) {
            const slideEl = document.createElement("div");
            slideEl.className = "amenities-slide";

            const pageItems = filtered.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
            pageItems.forEach(item => {
                const fileName = item.file || `${item.id}.png`;
                const amenityEl = document.createElement("div");
                amenityEl.className = "amenity-item";
                amenityEl.setAttribute("data-category", item.category);
                amenityEl.innerHTML = `
                    <div class="amenity-circle">
                        <img src="assets/icon/${fileName}" alt="${item.name}">
                    </div>
                    <span class="amenity-name">${item.name}</span>
                `;
                slideEl.appendChild(amenityEl);
            });

            amenitiesGrid.appendChild(slideEl);
        }

        // Reset scroll position
        amenitiesGrid.scrollLeft = 0;
    };

    // Initialize rendering
    if (amenitiesGrid) {
        renderAmenities();

        // Bind filter buttons
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const filterValue = button.getAttribute("data-filter");
                renderAmenities(filterValue);
            });
        });

        // Arrow controls navigation (Slide panel by grid width)
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => {
                const scrollAmount = amenitiesGrid.clientWidth;
                amenitiesGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: "smooth"
                });
            });

            nextBtn.addEventListener("click", () => {
                const scrollAmount = amenitiesGrid.clientWidth;
                amenitiesGrid.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth"
                });
            });
        }
    }

    /*=========================================
      GALLERY TABS SWITCHING
    =========================================*/
    const galleryTabBtns = document.querySelectorAll(".gallery-tab-btn");
    const galleryContents = document.querySelectorAll(".gallery-content");
    
    galleryTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            galleryTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetTab = btn.dataset.tab;
            
            galleryContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === `gallery-${targetTab}`) {
                    content.classList.add("active");
                }
            });
        });
    });

    /*=========================================
      LIGHTBOX CONTROLS
    =========================================*/
    // Video Lightbox
    const videoLightbox = document.getElementById("video-lightbox");
    const lightboxIframe = document.getElementById("lightbox-iframe");
    const videoCards = document.querySelectorAll(".video-card");
    const closeVideo = document.getElementById("close-video");
    
    if (videoLightbox && lightboxIframe) {
        videoCards.forEach(card => {
            card.addEventListener("click", () => {
                const url = card.dataset.videoUrl;
                lightboxIframe.src = url;
                videoLightbox.classList.add("active");
            });
        });
        
        const stopVideoAndClose = () => {
            videoLightbox.classList.remove("active");
            lightboxIframe.src = "";
        };
        
        if (closeVideo) {
            closeVideo.addEventListener("click", stopVideoAndClose);
        }
        
        videoLightbox.addEventListener("click", (e) => {
            if (e.target === videoLightbox) {
                stopVideoAndClose();
            }
        });
    }

    // Image Lightbox (Floorplans and Gallery images)
    const imageLightbox = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeImage = document.getElementById("close-image");
    
    const zoomableImages = document.querySelectorAll(".zoomable-plan, .masonry-item img, .circle-image-container img");
    
    if (imageLightbox && lightboxImg) {
        zoomableImages.forEach(img => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent duplicate trigger from card elements
                lightboxImg.src = img.src;
                imageLightbox.classList.add("active");
            });
        });
        
        const closeImageLightbox = () => {
            imageLightbox.classList.remove("active");
            lightboxImg.src = "";
        };
        
        if (closeImage) {
            closeImage.addEventListener("click", closeImageLightbox);
        }
        
        imageLightbox.addEventListener("click", (e) => {
            if (e.target === imageLightbox) {
                closeImageLightbox();
            }
        });
    }

    /*=========================================
      BACK TO TOP BUTTON
    =========================================*/
    const topBtn = document.getElementById("topBtn");
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        });
        
        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /*=========================================
      ACTIVE NAVIGATION LINK INDICATOR
    =========================================*/
    const sections = document.querySelectorAll("section, footer");
    const navLinks = document.querySelectorAll(".nav-links a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href").substring(1);
            if (href === current) {
                link.classList.add("active");
            }
        });
    });
});