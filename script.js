/* ============================================================
   RESIDER — Business Consulting, UAE Residency & Setup
   script.js — Interactive Calculator, WhatsApp Generator & Motion
   ============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  /* ------------------------------------------------------------
     1. Header State on Scroll
     ------------------------------------------------------------ */
  const header = document.getElementById("site-header");
  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 20);
  };
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  /* ------------------------------------------------------------
     2. Mobile Navigation Toggle
     ------------------------------------------------------------ */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");

  const setNavState = (isOpen) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", isOpen);
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      setNavState(!isOpen);
    });

    // Close on navigation link click
    nav.addEventListener("click", (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (link) setNavState(false);
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      if (!nav.contains(target) && !navToggle.contains(target)) {
        setNavState(false);
      }
    });
  }

  /* ------------------------------------------------------------
     3. Scroll Reveal Animations
     ------------------------------------------------------------ */
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(300, (index % 5) * 60)}ms`;
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-in"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------
     4. Animated Number Counters
     ------------------------------------------------------------ */
  const counterElements = Array.from(document.querySelectorAll("[data-count-to]"));

  const runCounter = (el) => {
    const targetStr = el.getAttribute("data-count-to") ?? "";
    const target = Number(targetStr);
    if (!Number.isFinite(target)) return;

    const suffix = el.getAttribute("data-suffix") ?? "";
    const format = el.getAttribute("data-format") ?? "plain";
    const duration = 1400;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * ease);

      if (format === "comma") {
        el.textContent = `${current.toLocaleString()}${suffix}`;
      } else {
        el.textContent = `${current}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(frame);
  };

  if (counterElements.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counterElements.forEach((el) => {
        const suffix = el.getAttribute("data-suffix") ?? "";
        el.textContent = `${el.getAttribute("data-count-to")}${suffix}`;
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.3 }
      );
      counterElements.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ------------------------------------------------------------
     5. Interactive Setup & Visa Estimator / Calculator
     ------------------------------------------------------------ */
  const calcState = {
    service: "business-setup",
    jurisdiction: "freezone",
    visas: "1",
    bank: true,
    vip: true,
    marketing: false
  };

  const planTitles = {
    "business-setup": {
      freezone: "Dubai Freezone Company Formation + Investor Visa",
      mainland: "Dubai Mainland (DED) Company Formation + LLC Setup",
      trader: "Dubai DED Trader License Formation (Digital/E-Commerce)"
    },
    "golden-visa": {
      freezone: "UAE 10-Year Golden Visa (Investor / Entrepreneur Category)",
      mainland: "UAE 10-Year Golden Visa (Direct DED Executive / Investor)",
      trader: "UAE 10-Year Golden Visa Consultation & Fast-Track"
    },
    "trader-license": {
      freezone: "Dubai E-Commerce / Freezone Digital Startup License",
      mainland: "Official Dubai DED Trader License (Activity 741302)",
      trader: "Official Dubai DED Trader License (DE@AE Tier 1)"
    },
    "investor-visa": {
      freezone: "Dubai Freezone Investor & Family Residency Visa Package",
      mainland: "Dubai Mainland Partner & Family Residency Visa Package",
      trader: "Investor & Dependent Sponsorship Residency Package"
    }
  };

  const updateCalculatorUI = () => {
    const summaryTitle = document.getElementById("summary-title");
    const summaryTimeline = document.getElementById("summary-timeline");
    const summaryBanking = document.getElementById("summary-banking");
    const summaryFeaturesList = document.getElementById("summary-features-list");
    const btnCalcQuote = document.getElementById("btn-calc-quote");

    if (!summaryTitle || !btnCalcQuote) return;

    // Determine Title
    const title = planTitles[calcState.service]?.[calcState.jurisdiction] ?? "UAE Business Setup & Residency Package";
    summaryTitle.textContent = title;

    // Determine Timeline
    let timeline = "3 to 5 Working Days";
    if (calcState.service === "golden-visa") {
      timeline = "5 to 8 Working Days (VIP Nomination)";
    } else if (calcState.jurisdiction === "trader") {
      timeline = "2 to 4 Working Days";
    }
    if (calcState.vip) {
      timeline += " (VIP Fast-Track Included)";
    }
    summaryTimeline.textContent = timeline;

    // Banking
    summaryBanking.textContent = calcState.bank ? "Emirates NBD / Mashreq / Wio Assistance" : "Client Managed";

    // Feature list
    const features = [];
    if (calcState.service === "business-setup") {
      features.push("Trade Name Reservation & Initial DED/Freezone Approvals");
      features.push("Official Certificate of Incorporation & Memorandum of Association");
    } else if (calcState.service === "golden-visa") {
      features.push("Comprehensive Golden Visa Eligibility & Asset/Income Audit");
      features.push("Government Nomination & 10-Year Long-Term Visa Grant");
    } else if (calcState.service === "trader-license") {
      features.push("Official Dubai Trader License Issuance (DED Approved)");
      features.push("DE@AE Tier 1 Digital Economy Initiative Support");
    } else {
      features.push("Investor / Partner Entry Permit & Quota Allocation");
      features.push("Family Sponsorship Support (Spouse & Children)");
    }

    if (calcState.visas !== "0") {
      features.push(`${calcState.visas}x UAE Residency Visa(s) Stamping & E-Visa Processing`);
    }

    if (calcState.vip) {
      features.push("VIP Medical Fitness & Priority Emirates ID Biometrics Concierge");
    }

    if (calcState.bank) {
      features.push("Corporate Bank Account Profile Dossier & Bank Introduction");
    }

    if (calcState.marketing) {
      features.push("Marketing Management & Go-To-Market Brand Launch (Activity 741302)");
    }

    if (summaryFeaturesList) {
      summaryFeaturesList.innerHTML = features.map((f) => `<li>${f}</li>`).join("");
    }

    // Build WhatsApp URL
    const message = `Hello Anas Resider,

I calculated a package on your website:
• Selected Plan: ${title}
• Jurisdiction: ${calcState.jurisdiction.toUpperCase()}
• Residency Visas: ${calcState.visas}
• Corporate Banking: ${calcState.bank ? "Yes" : "No"}
• VIP Medical & Emirates ID: ${calcState.vip ? "Yes" : "No"}
• Marketing Management: ${calcState.marketing ? "Yes" : "No"}

Please provide me with the exact quote and process steps.`;

    btnCalcQuote.href = `https://wa.me/971563224851?text=${encodeURIComponent(message)}`;
  };

  // Button Group Handlers
  const bindButtonGroup = (containerId, stateKey) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener("click", (e) => {
      const btn = e.target instanceof Element ? e.target.closest(".calc-opt-btn") : null;
      if (!btn) return;

      const value = btn.getAttribute("data-value");
      if (!value) return;

      calcState[stateKey] = value;

      Array.from(container.querySelectorAll(".calc-opt-btn")).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      updateCalculatorUI();
    });
  };

  bindButtonGroup("opt-service", "service");
  bindButtonGroup("opt-jurisdiction", "jurisdiction");
  bindButtonGroup("opt-visas", "visas");

  // Checkbox Handlers
  const bindCheckbox = (id, stateKey) => {
    const chk = document.getElementById(id);
    if (!chk) return;
    chk.addEventListener("change", (e) => {
      const target = e.target;
      if (target instanceof HTMLInputElement) {
        calcState[stateKey] = target.checked;
        updateCalculatorUI();
      }
    });
  };

  bindCheckbox("chk-bank", "bank");
  bindCheckbox("chk-vip", "vip");
  bindCheckbox("chk-marketing", "marketing");

  // Initial Calculation Run
  updateCalculatorUI();

  /* ------------------------------------------------------------
     6. Consultation Booking Form Handlers (WhatsApp & Email)
     ------------------------------------------------------------ */
  const form = document.getElementById("consultation-form");
  const btnEmailSubmit = document.getElementById("btn-submit-email");

  const buildFormMessage = () => {
    const name = document.getElementById("form-name")?.value.trim() ?? "";
    const phone = document.getElementById("form-phone")?.value.trim() ?? "";
    const email = document.getElementById("form-email")?.value.trim() ?? "";
    const service = document.getElementById("form-service")?.value ?? "";
    const note = document.getElementById("form-message")?.value.trim() ?? "";

    return {
      name,
      phone,
      email,
      service,
      note,
      fullText: `Hello Muhammad Anas (RESIDER),

I would like to consult regarding UAE Business & Residency:
• Name: ${name || "Client"}
• Phone / WhatsApp: ${phone || "Not provided"}
• Email: ${email || "Not provided"}
• Service Needed: ${service}
• Details / Questions: ${note || "None"}

Looking forward to your guidance.`
    };
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = buildFormMessage();
      if (!data.name || !data.phone) {
        alert("Please enter your name and phone number.");
        return;
      }
      const waUrl = `https://wa.me/971563224851?text=${encodeURIComponent(data.fullText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  if (btnEmailSubmit) {
    btnEmailSubmit.addEventListener("click", () => {
      const data = buildFormMessage();
      const subject = encodeURIComponent(`Consultation Inquiry: ${data.service} — ${data.name}`);
      const body = encodeURIComponent(data.fullText);
      window.location.href = `mailto:anasresider@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
