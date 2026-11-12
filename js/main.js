/**
 * ASGT website behaviour.
 *
 *   1. initBeamDemo      Interactive beam diagram in the hero
 *   2. initProductTabs   Sphere Design Hub / PrepJ tabs
 *   3. initContactForm   Enquiry form: validation, sending, status messages
 *
 * Settings (form endpoint, access key, email) are in js/config.js.
 */
(function () {
  "use strict";

  var config = window.ASGT_CONFIG || {};


  /* ------------------------------------------------------------------
   * 1. Beam demo
   * A simply supported beam with a point load P at distance a from
   * support A. With span L and b = L - a:
   *   reaction at A = P * b / L      reaction at B = P * a / L
   *   maximum moment (under the load) = P * a * b / L
   * ---------------------------------------------------------------- */
  function initBeamDemo() {
    var slider = document.getElementById("load-slider");
    var loadArrow = document.getElementById("load-arrow");
    var momentShape = document.getElementById("moment-diagram");
    var outPosition = document.getElementById("out-position");
    var outReactions = document.getElementById("out-reactions");
    var outMoment = document.getElementById("out-moment");
    if (!slider || !loadArrow || !momentShape) return;

    var SPAN_M = 10;          // beam span in metres
    var LOAD_KN = 100;        // point load in kN
    var BEAM_X = 40;          // left end of the beam in SVG units
    var BEAM_WIDTH = 440;     // beam length in SVG units
    var MOMENT_BASELINE_Y = 182;
    var MOMENT_SCALE = 0.42;  // SVG units per kNm

    var autoPlaying = true;
    var startTime = null;
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function render() {
      var a = Number(slider.value);
      var b = SPAN_M - a;
      var maxMoment = (LOAD_KN * a * b) / SPAN_M;
      var loadX = BEAM_X + (a / SPAN_M) * BEAM_WIDTH;

      loadArrow.setAttribute("transform", "translate(" + loadX + ",0)");
      momentShape.setAttribute(
        "points",
        BEAM_X + "," + MOMENT_BASELINE_Y + " " +
        loadX + "," + (MOMENT_BASELINE_Y + maxMoment * MOMENT_SCALE) + " " +
        (BEAM_X + BEAM_WIDTH) + "," + MOMENT_BASELINE_Y
      );

      outPosition.textContent = a.toFixed(1) + " m";
      outReactions.textContent =
        ((LOAD_KN * b) / SPAN_M).toFixed(0) + " / " + ((LOAD_KN * a) / SPAN_M).toFixed(0) + " kN";
      outMoment.textContent = maxMoment.toFixed(0) + " kNm";
    }

    // Slide the load back and forth until the visitor takes control.
    function autoPlay(timestamp) {
      if (!autoPlaying) return;
      if (startTime === null) startTime = timestamp;
      var seconds = (timestamp - startTime) / 1000;
      slider.value = 5 + 4.5 * Math.sin(seconds * 0.9 - 1.2);
      render();
      requestAnimationFrame(autoPlay);
    }

    slider.addEventListener("input", function () {
      autoPlaying = false;
      render();
    });

    slider.value = 1;
    render();

    if (!prefersReducedMotion) {
      setTimeout(function () { requestAnimationFrame(autoPlay); }, 1400);
    }
  }


  /* ------------------------------------------------------------------
   * 2. Product tabs (accessible: click, and left/right arrow keys)
   * ---------------------------------------------------------------- */
  function initProductTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(selectedTab) {
      tabs.forEach(function (tab) {
        var isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls"))
          .classList.toggle("is-active", isSelected);
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(tab); });

      tab.addEventListener("keydown", function (event) {
        var step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        var next = tabs[(index + step + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  }


  /* ------------------------------------------------------------------
   * 3. Contact form
   * ---------------------------------------------------------------- */
  var MIN_MESSAGE_LENGTH = 10;

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var statusBox = document.getElementById("form-status");
    if (!form || !statusBox) return;

    var submitButton = form.querySelector('button[type="submit"]');
    var idleLabel = submitButton.textContent;

    // Show a message under the button. type: "pending", "success" or "error".
    function showStatus(type, message, includeEmailLink) {
      statusBox.className = "form-status form-status--" + type;
      statusBox.textContent = message;

      if (includeEmailLink && config.contactEmail) {
        var link = document.createElement("a");
        link.href = "mailto:" + config.contactEmail;
        link.textContent = config.contactEmail;
        statusBox.appendChild(link);
        statusBox.appendChild(document.createTextNode("."));
      }
    }

    function setBusy(isBusy) {
      submitButton.disabled = isBusy;
      submitButton.textContent = isBusy ? "Sending\u2026" : idleLabel;
    }

    // Read every field as trimmed text.
    function readForm() {
      var raw = new FormData(form);
      return {
        name: String(raw.get("name") || "").trim(),
        email: String(raw.get("email") || "").trim(),
        organisation: String(raw.get("organisation") || "").trim(),
        enquiryType: String(raw.get("enquiry_type") || "").trim(),
        message: String(raw.get("message") || "").trim(),
        botcheck: raw.get("botcheck") !== null
      };
    }

    // True once a real access key (or a non-keyed endpoint) has been set.
    function isConfigured() {
      var key = config.accessKey || "";
      return Boolean(config.endpoint) && key.indexOf("YOUR_") !== 0;
    }

    // Fallback: open the visitor's own email app with the enquiry pre-filled.
    function openMailClient(data) {
      var subject = (config.subjectPrefix || "Website enquiry") + ": " + data.enquiryType;
      var body =
        "Name: " + data.name + "\n" +
        "Email: " + data.email + "\n" +
        "Organisation: " + data.organisation + "\n" +
        "Enquiry type: " + data.enquiryType + "\n\n" +
        data.message;

      window.location.href =
        "mailto:" + config.contactEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    }

    // POST the enquiry to the form service. Rejects on any failure.
    function sendEnquiry(data) {
      var payload = {
        subject: (config.subjectPrefix || "Website enquiry") + ": " + data.enquiryType,
        from_name: "ASGT website",
        name: data.name,
        email: data.email,          // the service uses this as the reply-to address
        organisation: data.organisation || "Not provided",
        enquiry_type: data.enquiryType,
        message: data.message
      };
      if (config.accessKey) payload.access_key = config.accessKey;

      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, config.timeoutMs || 15000);

      return fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (result) {
            // Web3Forms replies { success: true|false }, Formspree { ok: true }.
            var failed = !response.ok || result.success === false || result.ok === false;
            if (failed) throw new Error(result.message || "HTTP " + response.status);
          });
        })
        .finally(function () { clearTimeout(timer); });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Ignore repeat submits (double-click, Enter key) while one is in flight.
      if (submitButton.disabled) return;

      var data = readForm();

      // Bots tend to tick the hidden box. Pretend it worked and send nothing.
      if (data.botcheck) {
        showStatus("success", "Thank you. Your enquiry has been sent.");
        form.reset();
        return;
      }

      if (data.message.length < MIN_MESSAGE_LENGTH) {
        showStatus("error", "Please add a few more details about your project.");
        form.elements.message.focus();
        return;
      }

      if (!isConfigured()) {
        console.warn("ASGT: no form access key set in js/config.js. Using the email-app fallback.");
        openMailClient(data);
        return;
      }

      setBusy(true);
      showStatus("pending", "Sending your enquiry\u2026");

      sendEnquiry(data)
        .then(function () {
          showStatus("success", "Thank you. Your enquiry has been sent. We typically respond within two working days.");
          form.reset();
        })
        .catch(function (error) {
          console.error("ASGT: enquiry could not be sent.", error);
          showStatus("error", "Sorry, your enquiry could not be sent. Please try again, or email us directly at ", true);
        })
        .then(function () { setBusy(false); });
    });
  }


  initBeamDemo();
  initProductTabs();
  initContactForm();
})();
