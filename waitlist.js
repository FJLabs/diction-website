// Beta waitlist: posts the email to the Google Apps Script web app, which
// writes a timestamped row to the waitlist Sheet (see apps-script/waitlist.gs).
const WAITLIST_ENDPOINT = '';

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
    btn.disabled = true;
    msg.textContent = 'Joining…';
    try {
      if (!WAITLIST_ENDPOINT) throw new Error('no endpoint');
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams({ email, website: form.website.value })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      form.classList.add('done');
      msg.textContent = data.duplicate
        ? "You're already on the list. We'll be in touch."
        : "You're on the list. We'll email you when the beta opens.";
    } catch (err) {
      btn.disabled = false;
      msg.textContent = 'Something went wrong. Please try again.';
    }
  });
});
