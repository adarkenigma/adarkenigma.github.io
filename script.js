// adarkenigma LLC - minimal accessible mobile navigation
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Close on Escape and return focus to the toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close when a nav link is activated (mobile)
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  // Reset state when resizing back to desktop
  var mq = window.matchMedia('(min-width: 861px)');
  mq.addEventListener('change', function (e) { if (e.matches) setOpen(false); });
})();


/* ============================================================
   adarkenigma LLC - contact form validation
   Checks each field before the form is sent, shows an error
   under any field that needs fixing, and shows a success
   message when everything passes.
   ============================================================ */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return; // other pages have no form, so stop here

  var successBox = document.getElementById('form-success');

  // Each object describes one field: where it is, where its error
  // goes, and what to say when it is wrong.
  var fields = [
    { id: 'name',    errorId: 'name-error',    required: true,  label: 'name' },
    { id: 'email',   errorId: 'email-error',   required: true,  label: 'email address' },
    { id: 'topic',   errorId: 'topic-error',   required: true,  label: 'topic' },
    { id: 'message', errorId: 'message-error', required: true,  label: 'message' }
  ];

  // Returns "" when the value is fine, or the message to display.
  function checkField(field) {
    var input = document.getElementById(field.id);
    var value = input.value.trim(); // String object method

    if (field.required && value.length === 0) {
      if (field.id === 'topic') {
        return 'Choose what you would like help with.';
      }
      return 'Enter your ' + field.label + '.';
    }

    if (field.id === 'email' && value.length > 0) {
      // Basic email-format check for the classroom demonstration form.
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(value)) {
        return 'Enter a valid email address, like name@hotel.com.';
      }
    }

    if (field.id === 'message' && value.length > 0 && value.length < 10) {
      return 'Please add a little more detail (at least 10 characters).';
    }

    return '';
  }

  function showError(field, messageText) {
    var input = document.getElementById(field.id);
    var errorBox = document.getElementById(field.errorId);
    errorBox.textContent = messageText;

    if (messageText === '') {
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-invalid');
    } else {
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('is-invalid');
    }
  }

  // Re-check a field once the person has left it, so errors clear as they fix them.
  for (var i = 0; i < fields.length; i++) {
    (function (field) {
      var input = document.getElementById(field.id);
      if (!input) return;
      var evt = (input.tagName === 'SELECT') ? 'change' : 'blur';
      input.addEventListener(evt, function () {
        showError(field, checkField(field));
      });
    })(fields[i]);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // handle it here instead of reloading the page

    try {
      var firstBadField = null;

      // Loop every field and post its result.
      for (var i = 0; i < fields.length; i++) {
        var problem = checkField(fields[i]);
        showError(fields[i], problem);
        if (problem !== '' && firstBadField === null) {
          firstBadField = fields[i];
        }
      }

      if (firstBadField !== null) {
        successBox.hidden = true;
        document.getElementById(firstBadField.id).focus(); // send them to the first problem
        return;
      }

      // Everything passed validation. No information is submitted or stored.
      successBox.hidden = false;
      successBox.focus();
      form.reset();
    } catch (err) {
      // If anything unexpected breaks, say so instead of failing silently.
      successBox.hidden = true;
      console.error('Contact form error:', err);
      alert('Sorry, something went wrong sending that. Please email hello@adarkenigma.com instead.');
    }
  });
})();
