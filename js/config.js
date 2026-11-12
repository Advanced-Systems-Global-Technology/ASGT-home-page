/**
 * Site settings you may need to change.
 *
 * Enquiries from the contact form are sent to a form service, which emails
 * them to you. The default is Web3Forms (free). To switch it on:
 *
 *   1. Go to https://web3forms.com and enter the email address that should
 *      receive enquiries. They email you an "access key".
 *   2. Paste that key into `accessKey` below.
 *   3. Upload the site, send yourself a test enquiry, and check your inbox
 *      (and spam folder the first time).
 *
 * Until a key is set, the form falls back to opening the visitor's own email
 * app with the message pre-filled, so enquiries are never silently lost.
 *
 * Prefer Formspree? Set `endpoint` to your form URL
 * (https://formspree.io/f/xxxxxxxx) and set `accessKey` to "".
 */
window.ASGT_CONFIG = {
  // Where the form data is posted.
  endpoint: "https://api.web3forms.com/submit",

  // Public access key from web3forms.com (safe to keep in front-end code).
  accessKey: "39875bb3-d367-4760-88a0-82579b67d26e",

  // Used for the fallback "open my email app" behaviour and for error messages.
  contactEmail: "info@advancedsystemsglobaltechnology.co.uk",

  // Start of the subject line on every enquiry email.
  subjectPrefix: "ASGT website enquiry",

  // Give up waiting for the form service after this many milliseconds.
  timeoutMs: 15000,
};
