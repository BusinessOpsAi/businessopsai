(function () {
  "use strict";

  var CONTACT_EMAIL = "businessopsai@gmail.com";
  var CONTACT_PHONE = "209-400-5825";

  var PILOT_PLANS = {
    "Starter Pilot": {
      subject: "BusinessOps AI Starter Pilot Request"
    },
    "Growth Pilot": {
      subject: "BusinessOps AI Growth Pilot Request"
    },
    "Custom Ops": {
      subject: "BusinessOps AI Custom Ops Request"
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    setupHeader();
    setupMobileNavigation();
    setupSmoothActions();
    setupRevealMotion();
    setupPlanButtons();
    setupPilotForm();
    setupQuestionModal();
    setupCopyButtons();
  });

  function setupHeader() {
    var header = document.querySelector("[data-header]");

    if (!header) {
      return;
    }

    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  function setupMobileNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName !== "A") {
        return;
      }

      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  }

  function setupSmoothActions() {
    document.querySelectorAll("[data-scroll-target]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = link.getAttribute("data-scroll-target");
        var target = document.getElementById(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();
        scrollToElement(target);

        if (targetId === "contact") {
          focusContactForm();
        }
      });
    });
  }

  function setupRevealMotion() {
    var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (!revealItems.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupPlanButtons() {
    document.querySelectorAll("[data-plan]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var selectedPlan = button.getAttribute("data-plan") || "";
        var form = document.getElementById("pilot-form");
        var contact = document.getElementById("contact");

        if (!form || !contact) {
          return;
        }

        var planField = form.elements.selectedPlan;

        if (planField) {
          planField.value = selectedPlan;
          planField.classList.remove("is-invalid");
        }

        scrollToElement(contact);
        window.setTimeout(function () {
          var nameField = form.elements.name;

          if (nameField) {
            nameField.focus({ preventScroll: true });
          }
        }, 480);
      });
    });
  }

  function setupPilotForm() {
    var form = document.getElementById("pilot-form");
    var note = document.getElementById("pilot-form-note");
    var fallback = document.getElementById("pilot-fallback");
    var fallbackText = document.getElementById("pilot-fallback-text");

    if (!form) {
      return;
    }

    setupLiveValidation(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideFallback(fallback);

      if (!validateForm(form, note)) {
        return;
      }

      var values = getFormValues(form);
      var selectedPlan = values.selectedPlan || "Pilot request";
      var subject = (PILOT_PLANS[selectedPlan] && PILOT_PLANS[selectedPlan].subject) || "BusinessOps AI Pilot Request";
      var body = [
        "Hi BusinessOps AI,",
        "",
        "I would like to request a managed pilot review.",
        "",
        "Name: " + values.name,
        "Business name: " + values.businessName,
        "Email: " + values.email,
        "Phone: " + values.phone,
        "Business type: " + values.businessType,
        "Selected plan: " + values.selectedPlan,
        "Main pain point: " + values.painPoint,
        "",
        "Message:",
        values.message || "No additional message provided."
      ].join("\n");

      openMailto(CONTACT_EMAIL, subject, body);
      showFallback(fallback, fallbackText, subject, body);
      setNote(note, "Your email app should open with the prepared request. If it does not, email " + CONTACT_EMAIL + " or call " + CONTACT_PHONE + ".", "success");
    });
  }

  function setupQuestionModal() {
    var modal = document.getElementById("question-modal");
    var form = document.getElementById("question-form");
    var note = document.getElementById("question-form-note");
    var fallback = document.getElementById("question-fallback");
    var fallbackText = document.getElementById("question-fallback-text");
    var openButtons = document.querySelectorAll("[data-open-question]");
    var closeButtons = document.querySelectorAll("[data-close-question]");
    var lastFocused = null;

    if (!modal || !form) {
      return;
    }

    setupLiveValidation(form);

    openButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        lastFocused = document.activeElement;
        hideFallback(fallback);
        setNote(note, "This opens your email app with a prepared question.", "");
        openModal(modal, form);
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        closeModal(modal, lastFocused);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal(modal, lastFocused);
      }

      if (event.key === "Tab" && modal.classList.contains("is-open")) {
        trapFocus(modal, event);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      hideFallback(fallback);

      if (!validateForm(form, note)) {
        return;
      }

      var values = getFormValues(form);
      var body = [
        "Hi BusinessOps AI,",
        "",
        "I have a question.",
        "",
        "Name: " + values.questionName,
        "Email: " + values.questionEmail,
        "",
        "Question:",
        values.question
      ].join("\n");

      openMailto(CONTACT_EMAIL, "BusinessOps AI Question", body);
      showFallback(fallback, fallbackText, "BusinessOps AI Question", body);
      setNote(note, "Your email app should open with the prepared question. If it does not, email " + CONTACT_EMAIL + " or call " + CONTACT_PHONE + ".", "success");
    });
  }

  function setupCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        var target = document.getElementById(button.getAttribute("data-copy-target"));

        if (!target) {
          return;
        }

        copyText(target.value, target, button);
      });
    });
  }

  function openModal(modal, form) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    modal.removeAttribute("inert");
    document.body.classList.add("modal-open");

    window.setTimeout(function () {
      var firstField = form.querySelector("input, textarea, select, button");

      if (firstField) {
        firstField.focus({ preventScroll: true });
      }
    }, 120);
  }

  function closeModal(modal, lastFocused) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.setAttribute("inert", "");
    document.body.classList.remove("modal-open");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  function trapFocus(modal, event) {
    var focusable = Array.prototype.slice.call(modal.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter(function (element) {
        return element.offsetParent !== null;
      });

    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setupLiveValidation(form) {
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.required) {
        return;
      }

      field.addEventListener("input", function () {
        field.classList.toggle("is-invalid", !field.checkValidity());
      });

      field.addEventListener("change", function () {
        field.classList.toggle("is-invalid", !field.checkValidity());
      });
    });
  }

  function validateForm(form, note) {
    var requiredFields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    var firstInvalid = null;

    requiredFields.forEach(function (field) {
      var isValid = field.checkValidity();
      field.classList.toggle("is-invalid", !isValid);

      if (!isValid && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      setNote(note, "Please complete the highlighted required fields.", "error");
      firstInvalid.focus();
      return false;
    }

    setNote(note, "", "");
    return true;
  }

  function setNote(note, message, type) {
    if (!note) {
      return;
    }

    note.textContent = message;
    note.classList.remove("error", "success");

    if (type) {
      note.classList.add(type);
    }
  }

  function getFormValues(form) {
    var formData = new FormData(form);
    var values = {};

    formData.forEach(function (value, key) {
      values[key] = String(value).trim();
    });

    return values;
  }

  function openMailto(email, subject, body) {
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function showFallback(wrapper, textarea, subject, body) {
    if (!wrapper || !textarea) {
      return;
    }

    textarea.value = [
      "To: " + CONTACT_EMAIL,
      "Subject: " + subject,
      "",
      body
    ].join("\n");
    wrapper.hidden = false;
  }

  function hideFallback(wrapper) {
    if (wrapper) {
      wrapper.hidden = true;
    }
  }

  function copyText(text, fallbackField, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        setCopyButtonText(button, "Copied");
      }).catch(function () {
        selectFallbackText(fallbackField);
        setCopyButtonText(button, "Selected");
      });
      return;
    }

    selectFallbackText(fallbackField);
    setCopyButtonText(button, "Selected");
  }

  function selectFallbackText(field) {
    if (!field) {
      return;
    }

    field.focus();
    field.select();
  }

  function setCopyButtonText(button, text) {
    if (!button) {
      return;
    }

    button.textContent = text;

    window.setTimeout(function () {
      button.textContent = "Copy message";
    }, 1800);
  }

  function scrollToElement(element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function focusContactForm() {
    window.setTimeout(function () {
      var field = document.querySelector("#pilot-form input[name='name']");

      if (field) {
        field.focus({ preventScroll: true });
      }
    }, 480);
  }
})();
