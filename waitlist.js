// Beta waitlist: posts the email to the "Diction beta" Google Form, which
// timestamps each response and collects them in its linked Sheet.
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfk1JtMhb2zG_3hzbGr108RqvdpNlmup1oTCW4eHOXoCKbFfg/formResponse';
const EMAIL_FIELD = 'entry.956964409';

document.querySelectorAll('.waitlist').forEach(form => {
  const msg = form.querySelector('.waitlist-msg');
  const btn = form.querySelector('button');
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const email = form.email.value.trim();
    if (!form.email.checkValidity()) {
      msg.textContent = 'Please enter a valid email address.';
      return;
    }
    if (form.website.value) return; // honeypot: bots fill the hidden field
    btn.disabled = true;
    msg.textContent = 'Joining…';
    try {
      // Google Forms sends no CORS headers, so the response is opaque;
      // a network failure still throws and is reported below.
      await fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ [EMAIL_FIELD]: email })
      });
      form.classList.add('done');
      msg.textContent = "You're on the list. We'll email you when the beta opens.";
    } catch (err) {
      btn.disabled = false;
      msg.textContent = 'Something went wrong. Please try again.';
    }
  });
});
