# ASGT website

A static website for Advanced Systems Global Technology Ltd. There is no build
step and no server code: upload the folder to any web host and it works.

## Folder layout

```
asgt-website/
├── index.html          All page content, in clearly commented sections
├── css/styles.css      All styling, with a table of contents at the top
├── js/
│   ├── config.js       Settings you may need to change (form key, email)
│   └── main.js         Beam demo, product tabs, contact form
├── assets/images/      Logo, favicon and product screenshots
└── README.md           This file
```

## 1. Switch on the contact form (5 minutes, free)

The form posts to [Web3Forms](https://web3forms.com), which emails each
enquiry to you. Until you add a key, the form falls back to opening the
visitor's own email app, so enquiries are never lost, but it only becomes a
proper "Send" button once the key is set.

1. Go to https://web3forms.com and enter the address that should receive
   enquiries (for example `info@advancedsystemsglobaltechnology.co.uk`).
2. They email you an **access key**. Open `js/config.js` and replace
   `YOUR_WEB3FORMS_ACCESS_KEY` with it.
3. Upload the site, fill in the form yourself and press **Send enquiry**.
   You should see a green "Thank you" message and receive the email. Check
   your spam folder the first time.

If you would rather use Formspree: create a form there, set `endpoint` in
`js/config.js` to your form URL (`https://formspree.io/f/xxxxxxxx`) and set
`accessKey` to `""`.

What the form already does: checks the required fields and the email format,
blocks repeat clicks while sending, gives up after 15 seconds, shows a clear
error (with your email address as a fallback) if anything fails, and uses a
hidden honeypot field to catch basic spam bots.

## 2. Preview on your computer

Open `index.html` in a browser, or run a tiny local server from this folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000. Fonts load from Google Fonts, so you need an
internet connection to see them.

## 3. Deploy

Any static host works. Common options:

- **Netlify**: drag the whole folder onto https://app.netlify.com/drop
- **Vercel**: `vercel` from this folder, or import it from GitHub
- **GitHub Pages**: push the folder to a repository and enable Pages
- **cPanel / shared hosting**: upload the contents to `public_html`

Then point your domain at the host and make sure HTTPS is on (all of the
above do this for you).

## Things to check before launch

- **Email address**: `info@advancedsystemsglobaltechnology.co.uk` appears in `index.html` and
  `js/config.js`. A company-domain address looks more established.
- **Location wording**: the page gives a London address and also says ASGT is
  based in Delta, Lagos, Nigeria (contact section, FAQ and page description). Make
  sure that matches how you want to present the company.
- **Claims**: product facts such as "8,000+ lines" and "Eurocode 2 with the UK
  National Annex" are carried over from the original page. Confirm they are
  still accurate.

## Editing tips

- Colours and fonts are variables at the top of `css/styles.css`
  (`--brand`, `--brand-dark`, `--tint`, `--font`, and so on).
- To add a navigation link, copy a `site-nav__link` line in `index.html`.
- Screenshots live in `assets/images/`; replace a file and keep its name.
