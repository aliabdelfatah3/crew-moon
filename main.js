import $ from "jquery";
import {
  heroData,
  aboutData,
  servicesData,
  showreelData,
  clientsData,
  providersData,
  contactData,
} from "./data.js";

const toggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggle.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("translate-x-full");
  if (isOpen) {
    mobileMenu.classList.add("translate-x-full");
    toggle.classList.remove("open");
  } else {
    mobileMenu.classList.remove("translate-x-full");
    toggle.classList.add("open");
  }
});

// Close menu on link click
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    toggle.classList.remove("open");
  });
});

$(document).ready(function () {
  renderProject();
  initInteractions();
  initLazyLoading();
});

function renderProject() {
  // Render Hero
  const heroVideo = $("#hero-video")[0];
  // Use data attribute for lazy loading
  heroVideo.dataset.src = heroData.videoSrc;
  loadVideoLazy(heroVideo);

  $("#hero-title").text(heroData.title);
  $("#hero-subtitle").html(
    heroData.subtitle.replace(
      "Every Frame Tells a Story",
      '<span class="text-white font-semibold">Every Frame Tells a Story</span>',
    ),
  );
  $("#hero-description").text(heroData.description);
  $("#hero-cta-tag").text(heroData.cta);

  // Render About
  $("#about-header").text(aboutData.header);
  $("#about-title").html(
    `${aboutData.title.split("creative")[0]} <span class="text-slate-500">creative solutions.</span>`,
  );
  $("#about-description").text(aboutData.description);

  // Lazy load main image
  const aboutImg = $("#about-main-image")[0];
  if (aboutImg) {
    aboutImg.dataset.src = aboutData.mainImage;
    aboutImg.classList.add("lazy-img");
  }

  // Render Image Strip - with lazy loading
  const stripHtml = aboutData.imageStrip
    .map(
      (img) => `
        <div class="min-w-62.5 aspect-3/4 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ${img.special === "red" ? "bg-red-900/40 relative" : "bg-slate-800"}">
            ${img.special === "red" ? '<div class="absolute inset-0 bg-red-600/20 mix-blend-multiply"></div>' : ""}
            <img src="" data-src="${img.src}" alt="${img.alt}" class="w-full h-full object-cover lazy-img">
        </div>
    `,
    )
    .join("");
  $("#image-strip").html(stripHtml);

  // Render Services
  $("#services-header").text(servicesData.header);
  $("#services-title").text(servicesData.title);
  $("#services-cta").text(servicesData.cta);

  const servicesHtml = servicesData.items
    .map(
      (item, index) => `
        <div class="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 reveal opacity-0 translate-y-10 transition-all duration-1000 ${index % 2 !== 0 ? "delay-200" : ""}">
            <div class="aspect-video relative overflow-hidden">
                <div class="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <img src="" data-src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 lazy-img">
                    <div class="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent"></div>
                </div>
                <div class="absolute bottom-6 left-6 flex items-center gap-3">
                    ${item.icon === "pulse" ? '<div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>' : getIcon(item.icon)}
                    <span class="text-[10px] uppercase tracking-widest font-bold">${item.tag}</span>
                </div>
            </div>
            <div class="p-8 lg:p-10 space-y-4">
                <h4 class="text-2xl font-bold tracking-tight">${item.title}</h4>
                <p class="text-slate-400 leading-relaxed font-light text-sm md:text-base">${item.description}</p>
            </div>
        </div>
    `,
    )
    .join("");
  $("#services-grid").html(servicesHtml);

  // Render Showreel - LAZY LOAD (don't load until in viewport)
  const $showreelVideo = $("#showreel-video");
  if ($showreelVideo.length) {
    // Store src as data attribute for lazy loading
    $showreelVideo[0].dataset.src = showreelData.videoSrc;
    $showreelVideo[0].dataset.needsLoad = true;
  }

  $("#showreel-title").text(showreelData.title);
  $("#showreel-tagline").text(showreelData.tagline);
  $("#showreel-cta").text(showreelData.cta);

  // Render Clients
  $("#clients-title").text(clientsData.title);
  const logosHtml = clientsData.logos
    .map(
      (logo) => `
        <div class="w-32 md:w-48 h-12 shrink-0 brightness-0 invert opacity-40 hover:invert-0 hover:brightness-100 hover:opacity-100 transition-all duration-500">
            <img src="" data-src="${logo.src}" alt="${logo.name}" class="w-full h-full object-contain lazy-img">
        </div>
    `,
    )
    .join("");

  // Double the logos for seamless infinite scroll
  $("#clients-slider").html(logosHtml + logosHtml);

  // Render Providers (Creative Diference: Reverse, Glass Cards)
  $("#providers-header").text(providersData.header);
  $("#providers-title").text(providersData.title);

  const providerLogosHtml = providersData.logos
    .map(
      (logo, index) => `
        <div class="relative preserve-3d animate-float-logo" style="animation-delay: ${index * 0.5}s">
            <div class="w-32 md:w-44 h-12 shrink-0">
                <img src="" data-src="${logo.src}" alt="${logo.name}" class="w-full h-full object-contain filter brightness-0 invert opacity-100 lazy-img">
            </div>
        </div>
    `,
    )
    .join("");

  // Double the logos for seamless infinite loop in 3D
  $("#providers-slider").html(providerLogosHtml + providerLogosHtml);

  // Render Contact
  if ($("#contact-section").length) {
    $("#contact-header").text(contactData.header);
    $("#contact-title").text(contactData.title);
    $("#contact-cta").text(contactData.cta);
  }
}

function getIcon(type) {
  const icons = {
    video:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
    digital:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7h18"/><path d="M3 17h18"/></svg>',
    camera:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
  };
  return icons[type] || "";
}

function initInteractions() {
  const $video = $("#hero-video");
  const $muteBtn = $("#mute-btn");
  const $heroContent = $("#hero-content");

  // Mute/Unmute
  $muteBtn.on("click", function () {
    const isMuted = $video.prop("muted");
    $video.prop("muted", !isMuted);
    $(this).html(
      isMuted
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L5.413 8.582H3a1 1 0 0 0-1 1v4.836a1 1 0 0 0 1 1h2.413l4.385 4.38a.705.705 0 0 0 1.202-.498V4.702Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L5.413 8.582H3a1 1 0 0 0-1 1v4.836a1 1 0 0 0 1 1h2.413l4.385 4.38a.705.705 0 0 0 1.202-.498V4.702Z"/><line x1="16" x2="22" y1="9" y2="15"/><line x1="22" x2="16" y1="9" y2="15"/></svg>',
    );
  });

  // 3D Hover Interaction
  const $heroSection = $("#hero-section");
  $heroSection.on("mousemove", function (e) {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    $heroContent.css("transform", `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`);
  });

  $heroSection.on("mouseleave", function () {
    $heroContent.css({
      transform: "rotateY(0deg) rotateX(0deg)",
      transition: "transform 0.5s ease-out",
    });
    // Remove transition after it completes to keep movement snappy next time
    setTimeout(() => {
      $heroContent.css("transition", "none");
    }, 500);
  });

  // Scroll Effects
  $(window).on("scroll", function () {
    const scroll = $(window).scrollTop();

    // Hero Parallax
    const heroScale = 1.05 + scroll / 2000;
    $video.css("transform", `scale(${heroScale})`);

    // Showreel Parallax & Zoom
    const $showreelSection = $("#showreel-section");
    const $showreelVideo = $("#showreel-video");

    if ($showreelSection.length) {
      const sectionTop = $showreelSection.offset().top;
      const sectionHeight = $showreelSection.outerHeight();
      const viewportHeight = window.innerHeight;

      // Check if section is in viewport
      if (
        scroll + viewportHeight > sectionTop &&
        scroll < sectionTop + sectionHeight
      ) {
        const relativeScroll =
          (scroll + viewportHeight - sectionTop) /
          (sectionHeight + viewportHeight);

        // Parallax: video moves slower
        const yPos = (scroll - sectionTop) * 0.3;

        // Scale: Significant zoom-out as we leave
        // Start at 1.4 when entering, hit 1.1 at center, and zoom out as we leave
        // Actually, user wants zoom-out "أثناء النزول"
        // Let's make it start large (1.4) and scale down to 1.0 as it leaves
        const showreelScale = 1.4 - relativeScroll * 0.4;

        $showreelVideo.css({
          transform: `translateY(${yPos}px) scale(${showreelScale})`,
          opacity: 0.5 + relativeScroll * 0.4, // Fade in subtlely
        });
      }
    }
  });

  // Loop at 20s
  $video.on("timeupdate", function () {
    if (this.currentTime >= 20) {
      this.currentTime = 0;
      this.play();
    }
  });

  // Reveal Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass(
            "!opacity-100 !translate-y-0 !translate-x-0",
          );
        }
      });
    },
    { threshold: 0.1 },
  );

  $(".reveal").each(function () {
    observer.observe(this);
  });

  // Ambient Spotlight Follow logic
  const $spotlight = $(".ambient-spotlight");
  $(window).on("mousemove", function (e) {
    // Direct spotlight follow
    $spotlight.css(
      "transform",
      `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`,
    );

    // Update magnetic elements
    $(".magnetic").each(function () {
      const $el = $(this);
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const magneticRadius = 150;

      if (distance < magneticRadius) {
        // Move element towards mouse
        const moveX = (deltaX / magneticRadius) * 20;
        const moveY = (deltaY / magneticRadius) * 20;
        $el.css("transform", `translate(${moveX}px, ${moveY}px)`);
      } else {
        // Reset position
        $el.css("transform", "translate(0, 0)");
      }
    });
  });

  // Add transition for smooth resetting
  $(".magnetic").css({
    transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
    display: "inline-block",
  });
}

// LAZY LOADING FUNCTIONS
function initLazyLoading() {
  // Lazy load images with Intersection Observer
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        }
      });
    },
    { rootMargin: "50px" },
  );

  // Observe all lazy images
  document
    .querySelectorAll(".lazy-img")
    .forEach((img) => imageObserver.observe(img));

  // Lazy load video sections
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && video.dataset.needsLoad === "true") {
          loadVideoLazy(video);
          video.dataset.needsLoad = false;
          videoObserver.unobserve(video);
        }
      });
    },
    { rootMargin: "100px" },
  );

  // Observe showreel video
  const showreelVideo = document.getElementById("showreel-video");
  if (showreelVideo && showreelVideo.dataset.needsLoad) {
    videoObserver.observe(showreelVideo);
  }
}

function loadVideoLazy(videoElement) {
  const src = videoElement.dataset.src;
  if (src) {
    videoElement.src = src;
    videoElement.load();

    // For showreel, handle autoplay
    if (videoElement.id === "showreel-video") {
      videoElement.setAttribute("autoplay", "");
      videoElement.setAttribute("muted", "");
      videoElement.setAttribute("loop", "");
      videoElement.setAttribute("playsinline", "");

      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay blocked. Waiting for interaction.", error);

          const handleInteraction = () => {
            videoElement
              .play()
              .then(() => {
                console.log("Video playing after interaction");
                $(document).off("click scroll touchend", handleInteraction);
              })
              .catch((err) => console.error("Cannot play video:", err));
          };
          $(document).on("click scroll touchend", handleInteraction);
        });
      }
    }
  }
}
