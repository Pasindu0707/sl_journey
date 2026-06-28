# -*- coding: utf-8 -*-
"""
SL Journeys static site generator.
Authors shared chrome (head/header/footer) once, outputs pure static HTML to the
project root. Re-run with:  python _build/build.py
"""
import os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --------------------------------------------------------------------------- #
#  Brand / contact
# --------------------------------------------------------------------------- #
BRAND   = "SL Journeys"
TAGLINE = "Explore the Soul of Sri Lanka"
PHONE   = "+94 77 619 4579"
WA      = "94776194579"
EMAIL   = "info@ciaoceylontours.com"
ADDRESS = "No: 40A/1, Dummaladeniya North, Wennappuwa"
SITEURL = "https://sljourneys.com"

def wa_link(text="Hello SL Journeys! I'd love to plan a trip to Sri Lanka."):
    from urllib.parse import quote
    return "https://wa.me/%s?text=%s" % (WA, quote(text))

# --------------------------------------------------------------------------- #
#  Inline SVG icons (Lucide-style, stroke)
# --------------------------------------------------------------------------- #
def svg(p, fill=False):
    sw = '' if fill else 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'
    f  = 'fill="currentColor"' if fill else sw
    return '<svg viewBox="0 0 24 24" %s xmlns="http://www.w3.org/2000/svg">%s</svg>' % (f, p)

IC = {
 "compass": svg('<circle cx="12" cy="12" r="9"/><polygon points="16.2 7.8 13.4 13.4 7.8 16.2 10.6 10.6 16.2 7.8"/>'),
 "gift":    svg('<path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7C9.5 7 7 6 7 4.5 7 3 8.5 2.5 12 7c3.5-4.5 5-4 5-2.5C17 6 14.5 7 12 7z"/>'),
 "users":   svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
 "shield":  svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
 "phone":   svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
 "mail":    svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
 "pin":     svg('<path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'),
 "clock":   svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 "calendar":svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
 "arrow":   svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
 "star":    svg('<polygon points="12 2 15.1 8.6 22 9.3 17 14.1 18.2 21 12 17.5 5.8 21 7 14.1 2 9.3 8.9 8.6 12 2"/>', fill=True),
 "whatsapp":svg('<path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>', fill=True),
 "instagram":svg('<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>'),
 "facebook":svg('<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>'),
 "tripadvisor": svg('<circle cx="6.5" cy="12" r="2.4"/><circle cx="17.5" cy="12" r="2.4"/><path d="M6.5 7.5c2.2 0 4.1 1 5.5 2 1.4-1 3.3-2 5.5-2M3 9.5C4 8 5 7.5 6.5 7.5M21 9.5C20 8 19 7.5 17.5 7.5"/>'),
 "x":       svg('<path d="M18 6 6 18M6 6l12 12"/>'),
 "chevL":   svg('<path d="m15 18-6-6 6-6"/>'),
 "chevR":   svg('<path d="m9 18 6-6-6-6"/>'),
 "check":   svg('<path d="M20 6 9 17l-5-5"/>'),
 "leaf":    svg('<path d="M11 20A7 7 0 0 1 4 13c0-6 7-11 16-11 0 9-5 16-9 18z"/><path d="M2 22c3-3 6-5 9-7"/>'),
 "globe":   svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
 "headset": svg('<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="13" width="4" height="7" rx="1.5"/><rect x="18" y="13" width="4" height="7" rx="1.5"/><path d="M20 18v1a3 3 0 0 1-3 3h-4"/>'),
}

I = lambda k: IC[k]

# --------------------------------------------------------------------------- #
#  Navigation
# --------------------------------------------------------------------------- #
PACKAGES = [
 dict(slug="package-hill-country.html", name="Hill Country Adventures",
      dur="3 Nights / 4 Days", days="4 Days · 3 Nights",
      img="train-ella", hero="nuwara-eliya",
      price="From $640 pp",
      route="Pinnawala · Kandy · Peradeniya · Nuwara Eliya · Kithulgala · Colombo",
      intro="Discover the magic of Sri Lanka's hill country on a journey filled with beauty, culture, and adventure. Witness the charm of gentle elephants at Pinnawala, pay homage at the Temple of the Sacred Tooth Relic, and wander through lush botanical gardens. Savour the taste of world-famous Ceylon tea, experience the thrill of white-water rafting in Kithulgala, and wrap up your adventure with an exciting tour of Colombo. A perfect escape for those who love both nature and adrenaline.",
      attractions=["Pinnawala Elephant Orphanage","Spice & Herbal Garden","Temple of the Tooth Relic","Gem Museum","Royal Botanical Garden","Tea Factory Tour","Pink Post Office","Gregory Lake & Park","Kithulgala Water Rafting","Colombo City Tour"]),
 dict(slug="package-cultural-special.html", name="Cultural Special",
      dur="9 Nights / 10 Days", days="10 Days · 9 Nights",
      img="sigiriya", hero="anuradhapura",
      price="From $1,490 pp",
      route="Pinnawala · Sigiriya · Dambulla · Polonnaruwa · Anuradhapura · Kandy · Nuwara Eliya · Ella · Yala · Mirissa · Galle · Colombo",
      intro="Step into Sri Lanka's living heritage with a ten-day cultural odyssey that captures the island's true spirit. Journey through the ancient cities of Anuradhapura and Polonnaruwa, marvel at the rock fortress of Sigiriya, and soak in the scenic beauty of Ella. Ride the world-famous hill country train, explore sacred temples, and witness the vibrant rhythms of traditional dance. Round off your experience with the wild charm of Yala and the serene beaches of the southern coast. This is more than a holiday — it's a cultural odyssey through Sri Lanka's timeless wonders.",
      attractions=["Pinnawala Elephant Orphanage","Spice & Herbal Garden","Sigiriya Lion Rock","Sigiriya Village Tour","Dambulla Cave Temple","Polonnaruwa Ancient City","Anuradhapura Sacred City","Temple of the Tooth Relic","Gem Museum","Kandy Cultural Dance","Royal Botanical Garden","Tea Factory Tour","Pink Post Office","Gregory Lake & Park","Tea Train: Nanu Oya to Ella","Nine Arch Bridge","Little Adam's Peak","Lipton's Seat","Adisham Bungalow","Ravana Falls","Yala Safari","Coconut Tree Hills","Parrot Island","Stilt Fishermen","Turtle Farm","Galle Dutch Fort","Natural Gem Mines","Madu River Safari","Colombo City Tour"]),
 dict(slug="package-down-south.html", name="Down South Explore",
      dur="7 Nights / 8 Days", days="8 Days · 7 Nights",
      img="beach-boats", hero="galle-fort",
      price="From $1,180 pp",
      route="Colombo · Balapitiya · Bentota · Hikkaduwa · Galle · Mirissa · Hiriketiya",
      intro="Uncover the tropical beauty of Sri Lanka's southern coast on this unforgettable eight-day journey. Start with the buzzing energy of Colombo and the iconic Lotus Tower before gliding along the tranquil waters of the Madu River. Explore historic coastal forts, relax on golden beaches, and dive into adventure with water sports and whale watching. Along the way, witness traditions like stilt fishing that keep the island's coastal culture alive. A perfect blend of sunshine, adventure, and heritage for every traveller.",
      attractions=["Lotus Tower","Colombo City Tour","Madu River Safari","Natural Gem Mines","Water Sports","Turtle Farm","Stilt Fishermen","Galle Dutch Fort","Tea Plantation Visit","Whale Watching","Parrot Island","Coconut Tree Hills","Surfing in Hiriketiya"]),
 dict(slug="package-honeymoon.html", name="Honeymoon Vibes",
      dur="8 Nights / 9 Days", days="9 Days · 8 Nights",
      img="beach-sunset", hero="beach-sunset",
      price="From $1,690 / couple",
      route="Pinnawala · Sigiriya · Kandy · Nuwara Eliya · Ella · Yala · Mirissa · Galle · Balapitiya · Colombo",
      intro="Begin your new journey together with a romantic escape through Sri Lanka's most dreamy landscapes. Share scenic train rides, drift across peaceful lakes, and embrace the lively charm of Ella, Mirissa, Galle, and Colombo. Discover wonders like Sigiriya and Yala, indulge in golden beach sunsets, and enjoy moments of adventure, culture, and pure relaxation. Designed for couples, this tour is all about creating timeless memories in paradise.",
      attractions=["Pinnawala Elephant Orphanage","Sigiriya Lion Rock","Sigiriya Village Tour","Spice & Herbal Garden","Gem Museum","Temple of the Tooth Relic","Tea Factory Tour","Gregory Lake & Park","Nanu Oya to Ella Train Ride","Ravana Pool Club","Nine Arch Bridge","Little Adam's Peak","Nightlife in Ella","Yala Safari","Mirissa Beach","Nightlife in Mirissa","Galle Dutch Fort","Nightlife in Galle Fort","Madu River Safari","Natural Gem Mines","Colombo City Tour","Nightlife in Colombo"]),
]
PKG_BY = {p["slug"]: p for p in PACKAGES}

NAV = [
 ("Home", "index.html"),
 ("About", "about.html"),
 ("__DROP__", None),
 ("Blog", "blog.html"),
 ("Gallery", "gallery.html"),
 ("Contact", "contact.html"),
]

def nav_html(active):
    out = []
    for label, href in NAV:
        if label == "__DROP__":
            sub = "".join(
                '<a href="%s">%s<small>%s</small></a>' % (p["slug"], p["name"], p["days"])
                for p in PACKAGES)
            out.append('<li class="has-drop"><a href="index.html#packages">Tour Packages<i class="caret"></i></a>'
                       '<div class="drop">%s</div></li>' % sub)
        else:
            cls = ' class="is-active"' if href == active else ''
            out.append('<li><a href="%s"%s>%s</a></li>' % (href, cls, label))
    return "<ul class='header__nav'>%s</ul>" % "".join(out)

def mobile_nav_html(active):
    links = ['<a href="index.html">Home</a>', '<a href="about.html">About</a>']
    for p in PACKAGES:
        links.append('<a href="%s">%s</a>' % (p["slug"], p["name"]))
    links += ['<a href="blog.html">Blog</a>', '<a href="gallery.html">Gallery</a>',
              '<a href="contact.html">Contact</a>']
    mlang = ('<button class="m-lang notranslate" translate="no">%s Language</button>' % I("globe"))
    contact = ('<div class="m-contact">%s &middot; '
               '<a href="tel:%s">%s</a><br><a href="mailto:%s">%s</a></div>'
               % (TAGLINE, PHONE.replace(" ",""), PHONE, EMAIL, EMAIL))
    return '<nav class="mobile-nav">%s%s%s</nav>' % ("".join(links), mlang, contact)

# --------------------------------------------------------------------------- #
#  Chrome: head / header / footer
# --------------------------------------------------------------------------- #
def head(title, desc, active, inverted=False, og="lib/sigiriya.jpg"):
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/{active}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="{site}/assets/img/{og}">
<meta name="theme-color" content="#0f1d3a">
<link rel="icon" type="image/png" href="assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="assets/img/favicon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
<noscript><style>[data-reveal],[data-stagger]>*{{opacity:1!important;transform:none!important}}</style></noscript>
</head>
<body>
<a href="#main" class="skip-link" style="position:absolute;left:-999px;top:0;background:#fff;color:#16284b;padding:10px 16px;z-index:999;border-radius:0 0 8px 0" onfocus="this.style.left='0'" onblur="this.style.left='-999px'">Skip to content</a>
{header}
{mnav}
""".format(title=html.escape(title), desc=html.escape(desc), site=SITEURL, active=active,
           og=og, header=header_html(active, inverted), mnav=mobile_nav_html(active))

def header_html(active, inverted):
    cls = "header header--inverted" if inverted else "header"
    return """<header class="{cls}">
  <div class="container header__inner">
    <a class="header__logo" href="index.html" aria-label="{brand} — home">
      <img class="logo-light" src="assets/logo/logo-horizontal-white.png" alt="{brand}">
      <img class="logo-dark" src="assets/logo/logo-horizontal-trans.png" alt="{brand}">
    </a>
    {nav}
    <div class="header__actions">
      <div class="lang notranslate" translate="no">
        <button id="langBtn" class="lang__btn" aria-label="Choose language" aria-expanded="false" aria-haspopup="true">
          {globe}<span class="lang__code">EN</span><i class="caret"></i>
        </button>
        <div id="langPanel" class="lang__panel" role="menu">
          <input class="lang__search" type="text" placeholder="Search language…" aria-label="Search language">
          <div class="lang__list"></div>
        </div>
      </div>
      <a class="header__cta" href="contact.html">Plan Your Trip</a>
    </div>
    <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</header>""".format(cls=cls, brand=BRAND, nav=nav_html(active), globe=I("globe"))

def footer_html():
    quick = "".join('<a href="%s">%s</a>' % (h, l) for l, h in
                    [("Home","index.html"),("About Us","about.html"),
                     ("Tour Packages","index.html#packages"),("Blog","blog.html"),
                     ("Gallery","gallery.html"),("Contact Us","contact.html")])
    tours = "".join('<a href="%s">%s</a>' % (p["slug"], p["name"]) for p in PACKAGES)
    return """
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <div class="wm notranslate" translate="no"><img src="assets/logo/logo-mark-white.png" alt=""> {brand}</div>
        <p>We craft unforgettable, tailor-made journeys across Sri Lanka — blending culture, wildlife, hill country and golden coastlines with the warmth of true local hospitality.</p>
        <p class="tag">{tagline}</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <div class="footer__links">{quick}</div>
      </div>
      <div>
        <h4>Tour Packages</h4>
        <div class="footer__links">{tours}</div>
      </div>
      <div>
        <h4>Get in Touch</h4>
        <ul class="footer__contact">
          <li>{pin}<span>{address}</span></li>
          <li>{phone}<a href="tel:{phoneraw}">{phonetxt}</a></li>
          <li>{mail}<a href="mailto:{email}">{email}</a></li>
        </ul>
        <div class="footer__social" style="margin-top:18px">
          <a href="{wa}" aria-label="WhatsApp" target="_blank" rel="noopener">{waicon}</a>
          <a href="#" aria-label="Instagram">{ig}</a>
          <a href="#" aria-label="Facebook">{fb}</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span>&copy; <span data-year>2026</span> {brand}. All rights reserved.</span>
      <span>{tagline}</span>
    </div>
  </div>
</footer>
<a class="wa-float" href="{wa}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">{waicon}</a>
<div id="google_translate_element"></div>
<script>function googleTranslateElementInit(){{new google.translate.TranslateElement({{pageLanguage:'en',autoDisplay:false}},'google_translate_element');}}</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" defer></script>
<script src="assets/js/main.js" defer></script>
<script src="assets/js/i18n.js" defer></script>
</body>
</html>""".format(brand=BRAND, tagline=TAGLINE, quick=quick, tours=tours,
                  address=ADDRESS, phone=I("phone"), phoneraw=PHONE.replace(" ",""),
                  phonetxt=PHONE, mail=I("mail"), email=EMAIL, pin=I("pin"),
                  wa=wa_link(), waicon=I("whatsapp"), ig=I("instagram"), fb=I("facebook"))

def img(name, alt, cls="", lazy=True, sizes=""):
    l = ' loading="lazy" decoding="async"' if lazy else ''
    c = ' class="%s"' % cls if cls else ''
    return '<img src="assets/img/lib/%s.jpg" alt="%s"%s%s>' % (name, html.escape(alt), c, l)

# --------------------------------------------------------------------------- #
#  Reusable sections
# --------------------------------------------------------------------------- #
FEATURES = [
 ("compass","Superior Service","Friendly, knowledgeable guides and full support from the first message to the final farewell."),
 ("gift","Customised Packages","Every itinerary is shaped around your pace, interests and budget — never off-the-shelf."),
 ("users","Expert Local Guides","Discover the island's culture, wildlife and hidden corners with passionate local experts."),
 ("shield","Safe & Reliable","Trusted drivers, vetted hotels and 24/7 care so you can travel with complete peace of mind."),
]

EXPERIENCES = [
 ("leopard","Wildlife","Safari in Yala","Spot leopards, elephants and a wealth of wildlife in Sri Lanka's most iconic national park."),
 ("kandy-temple","Heritage","Cultural Exploration","Discover the island's soul at Sigiriya, Anuradhapura and the sacred Temple of the Tooth in Kandy."),
 ("adams-peak","Trekking","Hiking & Trekking","Conquer Ella Rock, Adam's Peak and the wild ridges of the Knuckles Mountain Range."),
 ("surf-sunset","Ocean","Diving & Surfing","Dive coral reefs and shipwrecks, then surf world-class breaks at Arugam Bay and Hikkaduwa."),
 ("river-safari","Adventure","White-Water Rafting","Ride the Kelani River rapids in Kitulgala — the island's ultimate water adventure."),
 ("train-ella","Scenic","Train Journeys","The Kandy–Ella ride is one of the world's most beautiful, crossing the iconic Nine Arch Bridge."),
 ("cave-view","Nature","Rainforest Trails","Explore Sinharaja, a UNESCO rainforest brimming with endemic birds, life and ancient calm."),
 ("mirissa-bay","Marine","Whale Watching","See blue whales, sperm whales and dolphins off Mirissa — at their best from November to April."),
]

DESTINATIONS = [
 ("sigiriya","Sigiriya"),("kandy-temple","Kandy"),("nuwara-eliya","Nuwara Eliya"),
 ("ella-ninearch","Ella"),("galle-fort","Galle Fort"),("safari-jeep","Yala National Park"),
 ("anuradhapura","Anuradhapura"),("beach-sunset","Mirissa"),
]

REVIEWS = [
 ("Anne R.","Italy","Very good experience — we highly recommend it",
  "Mr. Sudam was a wonderful driver: thoughtful and attentive to everyone, especially the children. We highly recommend SL Journeys to anyone visiting Sri Lanka."),
 ("Yasith P.","Sri Lanka","The beauty of the deep south",
  "“Ayubowan!” I returned to my motherland after six years and it felt so good. I loved the beautiful environment and the seamless journey. Thank you so much, SL Journeys."),
 ("Michelle","France","An unforgettable trip to Sri Lanka",
  "Many thanks to our fantastic guide, who with professionalism, kindness and deep knowledge of Sri Lanka made our trip unforgettable. We discovered wonderful places and lived authentic experiences, always feeling safe and well looked after. An impeccable, attentive and beautifully organised tour operator — highly recommended for anyone who wants to experience Sri Lanka in an authentic, stress-free way."),
]

BLOG = [
 dict(slug="post-best-time.html", title="Best Time to Visit Sri Lanka", img="ella-ninearch",
      date=("12","Sep"), excerpt="A year-round island with two monsoons — here's how to pick the perfect season for your coast and your kind of adventure.",
      prev=None, next=("post-cuisine.html","Sri Lankan Cuisine: A Taste of Authentic Flavours"),
      body=[
        ("p","Sri Lanka is a year-round destination, but the best time to visit truly depends on the region you wish to explore. With two distinct monsoons crossing the island, there is almost always sunshine somewhere."),
        ("h2","West & South Coasts + Hill Country"),
        ("p","From December to April, the west and south coasts and the central hill country enjoy sunny, dry weather — ideal for beach holidays, whale watching and exploring tea country."),
        ("h2","East Coast"),
        ("p","From May to September, the east comes alive. This is the ideal window for surfing, diving and beach relaxation in Trincomalee, Arugam Bay and Pasikudah."),
        ("quote","With its tropical climate, Sri Lanka welcomes travellers with sunshine almost throughout the year — a versatile destination for every season."),
      ]),
 dict(slug="post-cuisine.html", title="Sri Lankan Cuisine: A Taste of Authentic Flavours", img="cuisine",
      date=("12","Sep"), excerpt="Spices, coconut and rice come together in one of Asia's most underrated food cultures. These are the dishes you simply must try.",
      prev=("post-best-time.html","Best Time to Visit Sri Lanka"), next=("post-things-to-do.html","Top Things to Do in Sri Lanka"),
      body=[
        ("p","Sri Lankan food is a burst of flavours, shaped by centuries of culture and trade. Known for its generous use of spices, coconut and rice, every meal here is a feast for the senses."),
        ("list",[
          ("Rice & Curry","The island's staple — fragrant rice served with an array of vegetable, fish or meat curries."),
          ("Hoppers (Appa)","Crispy, bowl-shaped pancakes, often enjoyed for breakfast with an egg cracked in the centre."),
          ("Kottu Roti","A beloved street food of chopped roti stir-fried with vegetables, egg and spices to a rhythmic clatter."),
          ("Ceylon Tea","World-famous tea grown in the misty central highlands — best enjoyed with a hilltop view."),
        ]),
        ("quote","No trip to Sri Lanka is complete without surrendering to the island's culinary delights."),
      ]),
 dict(slug="post-things-to-do.html", title="Top Things to Do in Sri Lanka", img="sigiriya",
      date=("12","Sep"), excerpt="From ancient rock fortresses to leopard safaris and the world's most scenic train ride — the experiences that define the island.",
      prev=("post-cuisine.html","Sri Lankan Cuisine: A Taste of Authentic Flavours"), next=("post-discover.html","Discover Sri Lanka: The Pearl of the Indian Ocean"),
      body=[
        ("p","Sri Lanka offers something for every traveller. Whether you're an adventurer, a history lover or a beach enthusiast, these are the must-do experiences."),
        ("list",[
          ("Climb Sigiriya Rock Fortress","A world-famous UNESCO site with ancient frescoes and breathtaking summit views."),
          ("Safari at Yala National Park","Spot leopards, elephants and exotic birds in their natural habitat."),
          ("Ride the Scenic Train to Ella","One of the most beautiful train journeys on earth, winding through tea-clad hills."),
          ("Visit Sacred Kandy","Home to the Temple of the Tooth Relic, one of Buddhism's most revered sites."),
          ("Relax on the Beaches","Mirissa, Arugam Bay and Unawatuna are perfect for sun, surf and sea."),
        ]),
      ]),
 dict(slug="post-discover.html", title="Discover Sri Lanka: The Pearl of the Indian Ocean", img="beach-sunset",
      date=("12","Sep"), excerpt="Golden beaches, lush tea plantations, ancient ruins and warm hospitality — why this little island leaves such a lasting impression.",
      prev=("post-things-to-do.html","Top Things to Do in Sri Lanka"), next=None,
      body=[
        ("p","Sri Lanka, often called the “Pearl of the Indian Ocean,” is a tropical paradise that blends golden beaches, lush tea plantations, ancient ruins and vibrant culture. From the sacred city of Anuradhapura to the misty hills of Nuwara Eliya, every corner of the island tells a story of history and beauty."),
        ("p","Visitors can enjoy a wonderful variety of experiences — exploring UNESCO World Heritage sites, embarking on wildlife safaris in Yala, or simply relaxing along the palm-fringed beaches of Mirissa and Bentota."),
        ("quote","With warm hospitality and mouth-watering cuisine, Sri Lanka is not just a destination — it's an experience that stays with you forever."),
      ]),
]

def feature_cards():
    cards = "".join(
      '<div class="feature"><div class="feature__ic">%s</div><h3>%s</h3><p>%s</p></div>'
      % (I(ic), t, d) for ic, t, d in FEATURES)
    return cards

def package_cards():
    out = []
    for p in PACKAGES:
        out.append("""<a class="pkg" href="{slug}" data-reveal="scale">
  <div class="pkg__img">{img}</div>
  <div class="pkg__body">
    <span class="pkg__dur">{days}</span>
    <h3>{name}</h3>
    <p class="pkg__route">{route}</p>
    <div class="pkg__foot">
      <div class="pkg__price">Starting<b>{price}</b></div>
      <span class="pkg__link">View Tour {arrow}</span>
    </div>
  </div>
</a>""".format(slug=p["slug"], img=img(p["img"], p["name"]), days=p["days"],
               name=p["name"], route=p["route"], price=p["price"], arrow=I("arrow")))
    return "".join(out)

def experience_cards():
    out = []
    for im, tag, t, d in EXPERIENCES:
        out.append('<article class="exp" tabindex="0">%s<div class="exp__body"><span class="tag">%s</span><h3>%s</h3><p>%s</p></div></article>'
                   % (img(im, t), tag, t, d))
    return "".join(out)

def destination_cards():
    out = []
    for im, name in DESTINATIONS:
        out.append('<a class="dest" href="gallery.html" aria-label="%s">%s<div class="dest__cap"><h3>%s</h3><span class="arr">%s</span></div></a>'
                   % (name, img(im, name), name, I("arrow")))
    return "".join(out)

def review_band():
    cards = "".join(
      '<article class="review" data-reveal><div class="stars">%s</div><h4>%s</h4><p>%s</p>'
      '<div class="who"><span class="av">%s</span><div><b>%s</b><span>Verified · %s</span></div></div></article>'
      % ("".join([I("star")]*5), title, body, name[0], name, country)
      for name, country, title, body in REVIEWS)
    return cards

def blog_cards(items=None):
    items = items or BLOG
    out = []
    for b in items:
        out.append("""<a class="post-card" href="{slug}" data-reveal>
  <div class="post-card__img">{img}<div class="post-card__date"><b>{d}</b><span>{m}</span></div></div>
  <div class="post-card__body"><h3>{title}</h3><p>{ex}</p><span class="link-arrow">Read Story {arrow}</span></div>
</a>""".format(slug=b["slug"], img=img(b["img"], b["title"]), d=b["date"][0], m=b["date"][1],
               title=b["title"], ex=b["excerpt"], arrow=I("arrow")))
    return "".join(out)

def cta_band():
    return """<section class="section"><div class="container"><div class="cta-band" data-reveal>
  {img}
  <div class="cta-band__inner">
    <span class="eyebrow center">Your Journey Awaits</span>
    <h2 style="margin-top:16px">Let's Plan Your Sri Lanka Story</h2>
    <p>Tell us how you like to travel and our local experts will craft a private, tailor-made itinerary — at no obligation.</p>
    <div class="hero__cta">
      <a class="btn btn--primary btn--lg" href="{wa}" target="_blank" rel="noopener">{wa_i} Chat on WhatsApp</a>
      <a class="btn btn--light btn--lg" href="contact.html">Enquire Now</a>
    </div>
  </div>
</div></div></section>""".format(img=img("harbor-dusk","Plan your Sri Lanka journey"),
                                 wa=wa_link(), wa_i=I("whatsapp"))

def enquiry_form(default_pkg="", heading="New enquiry from SL Journeys website"):
    opts_pkg = "".join('<option%s>%s</option>' % (' selected' if p["name"]==default_pkg else '', p["name"]) for p in PACKAGES)
    return """<form class="form-card" data-enquiry="{heading}" novalidate>
  <div class="field-row">
    <div class="field"><label>Your Name <span class="req">*</span></label><input name="name" type="text" autocomplete="name" placeholder="Jane Traveller" required></div>
    <div class="field"><label>Email <span class="req">*</span></label><input name="email" type="email" autocomplete="email" placeholder="you@email.com" required></div>
  </div>
  <div class="field-row">
    <div class="field"><label>Nationality</label><input name="nationality" type="text" placeholder="e.g. German"></div>
    <div class="field"><label>Phone / WhatsApp</label><input name="phone" type="tel" autocomplete="tel" placeholder="+.."></div>
  </div>
  <div class="field-row">
    <div class="field"><label>Arrival Date</label><input name="arrival" type="date"></div>
    <div class="field"><label>Departure Date</label><input name="departure" type="date"></div>
  </div>
  <div class="field-row">
    <div class="field"><label>No. of Adults</label><input name="adults" type="number" min="1" placeholder="2"></div>
    <div class="field"><label>No. of Children</label><input name="children" type="number" min="0" placeholder="0"></div>
  </div>
  <div class="field-row">
    <div class="field"><label>Accommodation Type</label><select name="accommodation">
      <option value="">Select…</option><option>Standard (2–3 Stars)</option><option>Deluxe (3–4 Stars)</option>
      <option>High End (4 Stars)</option><option>Luxury (5 Stars)</option><option>Ultra Luxury</option></select></div>
    <div class="field"><label>Meal Basis</label><select name="meals">
      <option value="">Select…</option><option>Bed &amp; Breakfast</option><option>Half Board</option>
      <option>Full Board</option><option>Room Only</option></select></div>
  </div>
  <div class="field"><label>Tour Package</label><select name="package">
    {opts}<option>I'd like to customise my tour</option></select></div>
  <div class="field"><label>Tell us about your dream trip</label><textarea name="message" placeholder="Interests, pace, special occasions, must-sees…"></textarea></div>
  <button class="btn btn--primary btn--lg" type="submit" style="width:100%">{wa_i} Send Enquiry via WhatsApp</button>
  <p class="form-note">By sending, WhatsApp opens with your details pre-filled. Prefer email? Write to <a href="mailto:{email}" style="color:var(--gold-600)">{email}</a>.</p>
  <div class="form-msg"></div>
</form>""".format(heading=heading, opts=opts_pkg, wa_i=I("whatsapp"), email=EMAIL)

def write(path, content):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8") as f:
        f.write(content)
    print("  wrote", path)

# --------------------------------------------------------------------------- #
#  PAGE: Home
# --------------------------------------------------------------------------- #
def page_home():
    h = head(BRAND + " — " + TAGLINE,
             "SL Journeys crafts tailor-made Sri Lanka tours — hill country, culture, wildlife, beaches and honeymoons. Expert local guides, 5-star rated, fully personalised.",
             "index.html", inverted=False, og="lib/sigiriya.jpg")
    body = """
<main id="main">
<section class="hero">
  <div class="hero__bg">{hero}</div>
  <div class="container hero__inner">
    <span class="eyebrow" style="color:var(--gold-400)">Explore the Soul of Sri Lanka</span>
    <h1 style="margin-top:20px">Discover the <em>real</em><br>Sri Lanka, your way</h1>
    <p class="hero__sub">From misty tea hills and ancient cities to leopard safaris and golden southern beaches — we design private, unforgettable journeys across the island.</p>
    <div class="hero__cta">
      <a class="btn btn--primary btn--lg" href="#packages">Explore Packages</a>
      <a class="btn btn--light btn--lg" href="{wa}" target="_blank" rel="noopener">{wa_i} Plan via WhatsApp</a>
    </div>
    <div class="hero__trust">
      <span class="hero__stars">{stars}</span>
      <span>Rated <b style="color:#fff">Excellent</b> on Tripadvisor &middot; Tailor-made by local experts</span>
    </div>
  </div>
  <div class="hero__scroll"><span>Scroll</span><span class="mouse"></span></div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track">
  <span>Sigiriya</span><span>Kandy</span><span>Ella</span><span>Yala Safari</span><span>Galle Fort</span><span>Mirissa</span><span>Nuwara Eliya</span><span>Anuradhapura</span>
  <span>Sigiriya</span><span>Kandy</span><span>Ella</span><span>Yala Safari</span><span>Galle Fort</span><span>Mirissa</span><span>Nuwara Eliya</span><span>Anuradhapura</span>
</div></div>

<section class="section">
  <div class="container">
    <div class="split">
      <div class="split__media" data-reveal="left">
        <div class="accent-dot"></div>
        <div class="frame">{intro_img}</div>
        <div class="badge badge--br"><span class="num">5.0</span><span class="lbl">Traveller rating</span></div>
      </div>
      <div data-reveal="right">
        <span class="eyebrow">Sri Lanka's Trusted Travel Designers</span>
        <h2 style="margin-top:18px">Unforgettable journeys, crafted with local soul</h2>
        <p class="lead" style="margin-top:18px">At {brand}, we create unforgettable travel experiences across the breathtaking island of Sri Lanka. With deep local expertise and a genuine passion for hospitality, we design personalised tour packages that bring you closer to the island's rich culture, stunning landscapes and hidden treasures.</p>
        <p style="margin-top:16px">Whether you seek adventure, relaxation or cultural discovery, we make sure every journey is seamless, safe and truly memorable.</p>
        <div class="stats">
          <div class="stat"><div class="num" data-count="4">4</div><div class="lbl">Signature Journeys</div></div>
          <div class="stat"><div class="num"><span data-count="100" data-suffix="%">100%</span></div><div class="lbl">Tailor-Made</div></div>
          <div class="stat"><div class="num"><span data-count="24" data-suffix="/7">24/7</span></div><div class="lbl">On-Trip Support</div></div>
        </div>
        <div style="margin-top:30px"><a class="btn btn--navy" href="about.html">Learn More About Us {arrow}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--cream2">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">Why Travel With Us</span>
      <h2>The {brand} difference</h2>
      <p>Four promises behind every itinerary we design.</p>
    </div>
    <div class="grid cols-4" data-stagger="100">{features}</div>
  </div>
</section>

<section class="section" id="packages">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">Choose Your Adventure</span>
      <h2>Popular Tour Packages</h2>
      <p>Carefully curated routes covering the very best of the island — each fully customisable to you.</p>
    </div>
    <div class="grid cols-4">{packages}</div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">Find Your Perfect Experience</span>
      <h2 style="color:#fff">Things to do in Sri Lanka</h2>
      <p>An island packed into one — wildlife, heritage, mountains and ocean, all within a few hours' drive.</p>
    </div>
    <div class="grid cols-4" data-stagger="80">{experiences}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">Prime Destinations</span>
      <h2>Authentic experiences, iconic places</h2>
      <p>The places that capture the soul of Sri Lanka.</p>
    </div>
    <div class="grid cols-4" data-stagger="70">{destinations}</div>
  </div>
</section>

<section class="section section--navy">
  <div class="container">
    <div class="reviews-head">
      <div data-reveal="left">
        <span class="eyebrow center" style="justify-content:flex-start">Loved by Travellers</span>
        <h2 style="color:#fff;margin-top:14px">Stories from the road</h2>
      </div>
      <div class="trust-badge" data-reveal="right">
        <div class="score">Excellent</div>
        <div><div class="stars">{stars}</div><div class="meta">Based on real reviews &middot; Posted on Tripadvisor</div></div>
      </div>
    </div>
    <div class="grid cols-3">{reviews}</div>
  </div>
</section>

<section class="section section--cream2">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">Travel Stories &amp; Guides</span>
      <h2>From our journal</h2>
      <p>Tips, tastes and inspiration for your Sri Lankan adventure.</p>
    </div>
    <div class="grid cols-4">{blog}</div>
  </div>
</section>

{cta}
</main>
""".format(hero=img("sigiriya","Sigiriya rock fortress at sunset, Sri Lanka", lazy=False),
           wa=wa_link(), wa_i=I("whatsapp"), stars="".join([I("star")]*5),
           intro_img=img("ella-ninearch","Scenic train crossing the Nine Arch Bridge in Ella"),
           brand=BRAND, arrow=I("arrow"), features=feature_cards(), packages=package_cards(),
           experiences=experience_cards(), destinations=destination_cards(),
           reviews=review_band(), blog=blog_cards(), cta=cta_band())
    write("index.html", h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: About
# --------------------------------------------------------------------------- #
def page_about():
    h = head("About Us — " + BRAND,
             "Meet SL Journeys — passionate Sri Lankan travel designers crafting personalised, seamless and safe journeys across the island.",
             "about.html", inverted=False, og="lib/safari-jeep.jpg")
    body = """
<main id="main">
<section class="subhero">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; About Us</div>
    <h1>The soul behind<br>your journey</h1>
    <span class="pill">Explore the Soul of Sri Lanka</span>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="split">
      <div class="split__media" data-reveal="left">
        <div class="accent-dot"></div>
        <div class="frame frame--wide">{img1}</div>
        <div class="badge badge--br"><span class="num">Local</span><span class="lbl">Born &amp; raised guides</span></div>
      </div>
      <div data-reveal="right">
        <span class="eyebrow">Who We Are</span>
        <h2 style="margin-top:18px">Sri Lanka's leading travel designers</h2>
        <p class="lead" style="margin-top:18px">At {brand}, we create unforgettable travel experiences across the breathtaking island of Sri Lanka. With our local expertise and passion for hospitality, we design personalised tour packages that bring you closer to the island's rich culture, stunning landscapes and hidden treasures.</p>
        <p style="margin-top:16px">Whether you're looking for adventure, relaxation or cultural discovery, we ensure your journey is seamless, safe and truly memorable. From the first message to your final farewell at the airport, you travel with people who know — and love — every corner of this island.</p>
        <div style="margin-top:28px"><a class="btn btn--primary" href="contact.html">Start Planning {arrow}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--cream2">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow center">What We Stand For</span>
      <h2>Promises behind every journey</h2>
    </div>
    <div class="grid cols-4" data-stagger="100">{features}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="split split--reverse">
      <div class="split__media" data-reveal="right">
        <div class="frame">{img2}</div>
      </div>
      <div data-reveal="left">
        <span class="eyebrow">Our Approach</span>
        <h2 style="margin-top:18px">No two travellers are the same</h2>
        <p class="lead" style="margin-top:18px">That's why no two {brand} itineraries are either. We listen first, then design around your pace, your interests and your budget.</p>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:16px;margin-top:22px">
          <li class="ck-row">{ck}<span><b>Personal from day one</b> — a dedicated trip designer, not a call centre.</span></li>
          <li class="ck-row">{ck}<span><b>Honest local knowledge</b> — the right places, at the right time, away from the crowds.</span></li>
          <li class="ck-row">{ck}<span><b>Seamless on the ground</b> — trusted drivers, hand-picked stays and 24/7 support.</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

{cta}
</main>
""".format(bg=img("safari-jeep","Safari jeep tour in Sri Lanka", lazy=False),
           img1=img("river-safari","Travellers on a river safari in Sri Lanka"),
           img2=img("train-ella","Scenic hill country train, Sri Lanka"),
           brand=BRAND, arrow=I("arrow"), features=feature_cards(),
           ck='<span class="ck-ic">%s</span>' % I("check"), cta=cta_band())
    write("about.html", h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: Package detail
# --------------------------------------------------------------------------- #
def page_package(p):
    attrs = "".join('<div class="attr"><span class="n">%d</span><span>%s</span></div>' % (i+1, a)
                    for i, a in enumerate(p["attractions"]))
    h = head(p["name"] + " — " + p["dur"] + " | " + BRAND,
             p["intro"][:155],
             p["slug"], inverted=False, og="lib/%s.jpg" % p["hero"])
    body = """
<main id="main">
<section class="subhero">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="index.html#packages">Tour Packages</a> &nbsp;/&nbsp; {name}</div>
    <h1>{name}</h1>
    <div class="pkg-meta">
      <span class="chip">{clock} {dur}</span>
      <span class="chip">{pin} {stops} Destinations</span>
      <span class="chip">{cal} {price}</span>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="pkg-detail-grid" style="display:grid;grid-template-columns:1.6fr 1fr;gap:clamp(32px,5vw,64px);align-items:start">
      <div data-reveal>
        <span class="eyebrow">Tour Overview</span>
        <h2 style="margin-top:16px">{name}</h2>
        <p class="lead" style="margin-top:18px">{intro}</p>

        <h3 style="margin:42px 0 6px">Tour Highlights</h3>
        <p style="margin-bottom:22px">Every experience below is included and fully customisable to your pace.</p>
        <div class="attractions" data-stagger="40">{attrs}</div>

        <div style="margin-top:38px;display:flex;gap:14px;flex-wrap:wrap">
          <a class="btn btn--primary" href="{wa}" target="_blank" rel="noopener">{wa_i} Ask About This Tour</a>
          <a class="btn btn--ghost" href="index.html#packages">View Other Tours</a>
        </div>
      </div>

      <aside class="book-aside" data-reveal="right">
        <div style="margin-bottom:14px"><span class="eyebrow">Book Your Tour</span></div>
        {form}
      </aside>
    </div>
  </div>
</section>

{cta}
</main>
""".format(bg=img(p["hero"], p["name"], lazy=False), name=p["name"], clock=I("clock"),
           dur=p["dur"], pin=I("pin"), stops=len(p["attractions"]), cal=I("calendar"),
           price=p["price"], intro=p["intro"], attrs=attrs, wa=wa_link("Hi SL Journeys! I'm interested in the %s tour (%s)." % (p["name"], p["dur"])),
           wa_i=I("whatsapp"),
           form=enquiry_form(default_pkg=p["name"], heading="Booking enquiry — %s (%s)" % (p["name"], p["dur"])),
           cta=cta_band())
    write(p["slug"], h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: Blog index
# --------------------------------------------------------------------------- #
def page_blog_index():
    h = head("Travel Blog — " + BRAND,
             "Travel stories and guides for Sri Lanka: best time to visit, local cuisine, top things to do and more from SL Journeys.",
             "blog.html", inverted=False, og="lib/cuisine.jpg")
    body = """
<main id="main">
<section class="subhero" style="min-height:50vh">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Blog</div>
    <h1>Travel Stories &amp; Guides</h1>
    <span class="pill">Inspiration for your island adventure</span>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="grid cols-2">{cards}</div>
  </div>
</section>
{cta}
</main>
""".format(bg=img("ella-ninearch","Sri Lanka travel inspiration", lazy=False),
           cards=blog_cards(), cta=cta_band())
    write("blog.html", h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: Blog post
# --------------------------------------------------------------------------- #
def render_body(blocks):
    out = []
    for kind, val in blocks:
        if kind == "p":
            out.append("<p>%s</p>" % val)
        elif kind == "h2":
            out.append("<h2>%s</h2>" % val)
        elif kind == "h3":
            out.append("<h3>%s</h3>" % val)
        elif kind == "quote":
            out.append('<p class="pullquote">%s</p>' % val)
        elif kind == "list":
            lis = "".join("<li><b>%s</b> — %s</li>" % (t, d) for t, d in val)
            out.append('<ul class="dash">%s</ul>' % lis)
    return "".join(out)

def page_post(b):
    recent = "".join('<a href="%s" class="link-arrow" style="display:block;margin-bottom:12px">%s</a>' % (x["slug"], x["title"]) for x in BLOG)
    nav = []
    if b["prev"]:
        nav.append('<a class="prev" href="%s"><span>&larr; Previous</span><b>%s</b></a>' % (b["prev"][0], b["prev"][1]))
    if b["next"]:
        nav.append('<a class="next" href="%s"><span>Next &rarr;</span><b>%s</b></a>' % (b["next"][0], b["next"][1]))
    h = head(b["title"] + " — " + BRAND, b["excerpt"], b["slug"], inverted=False, og="lib/%s.jpg" % b["img"])
    body = """
<main id="main">
<section class="subhero" style="min-height:56vh">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="blog.html">Blog</a></div>
    <h1 style="max-width:820px">{title}</h1>
    <span class="pill">{date}</span>
  </div>
</section>
<section class="section">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 300px;gap:clamp(32px,5vw,64px);align-items:start" class="pkg-detail-grid">
      <article class="article" data-reveal>{content}
        <div class="post-nav">{nav}</div>
      </article>
      <aside class="book-aside" data-reveal="right">
        <div class="form-card">
          <span class="eyebrow">Recent Posts</span>
          <div style="margin-top:18px">{recent}</div>
          <div style="margin-top:24px;padding-top:22px;border-top:1px solid var(--line)">
            <h3 style="font-size:1.2rem;margin-bottom:8px">Ready to go?</h3>
            <p style="font-size:.92rem;margin-bottom:16px">Let us turn this inspiration into your own tailor-made journey.</p>
            <a class="btn btn--primary" href="contact.html" style="width:100%">Plan Your Trip {arrow}</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
{cta}
</main>
""".format(bg=img(b["img"], b["title"], lazy=False), title=b["title"],
           date=b["date"][0] + " " + {"Sep":"September"}.get(b["date"][1], b["date"][1]),
           content=render_body(b["body"]), nav="".join(nav), recent=recent, arrow=I("arrow"),
           cta=cta_band())
    write(b["slug"], h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: Gallery
# --------------------------------------------------------------------------- #
GALLERY = [
 ("sigiriya","Sigiriya Rock Fortress"),("ella-ninearch","Nine Arch Bridge, Ella"),
 ("leopard","Leopard, Yala"),("kandy-temple","Temple of the Tooth, Kandy"),
 ("beach-boats","Southern Coast"),("nuwara-eliya","Misty Hills of Nuwara Eliya"),
 ("galle-fort","Galle Lighthouse"),("anuradhapura","Sacred Anuradhapura"),
 ("train-ella","Hill Country Train"),("cuisine","Authentic Rice & Curry"),
 ("surf-sunset","Surfing the South"),("red-mosque","Red Mosque, Colombo"),
 ("buddha-statues","Golden Buddhas"),("cave-view","Rainforest Trails"),
 ("safari-jeep","On Safari"),("harbor-dusk","Harbour at Dusk"),
 ("adams-peak","Above the Clouds"),("ancient-ruins","Ancient Ruins"),
 ("beach-sunset","Mirissa Sunset"),("colombo-night","Colombo by Night"),
 ("hill-lake","Hill Country Lake"),("mirissa-bay","Tropical Bay"),
 ("river-safari","Madu River Safari"),("colonial","Colonial Heritage"),
]
def page_gallery():
    items = "".join('<a class="g-item" data-full="assets/img/lib/%s.jpg"><img src="assets/img/lib/%s.jpg" alt="%s" loading="lazy" decoding="async"><span class="g-cap">%s</span></a>'
                    % (im, im, html.escape(cap), cap) for im, cap in GALLERY)
    h = head("Gallery — Travel Moments | " + BRAND,
             "A gallery of travel moments from across Sri Lanka — wildlife, heritage, hill country and golden coastlines, captured with SL Journeys.",
             "gallery.html", inverted=False, og="lib/sigiriya.jpg")
    body = """
<main id="main">
<section class="subhero" style="min-height:50vh">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Gallery</div>
    <h1>Travel Moments</h1>
    <span class="pill">Tap any image to explore</span>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="gallery-grid">{items}</div>
  </div>
</section>
<div class="lightbox" aria-hidden="true">
  <button class="lb-close" aria-label="Close">{x}</button>
  <button class="lb-nav prev" aria-label="Previous">{cl}</button>
  <img src="" alt="">
  <button class="lb-nav next" aria-label="Next">{cr}</button>
</div>
{cta}
</main>
""".format(bg=img("beach-boats","Sri Lanka travel gallery", lazy=False), items=items,
           x=I("x"), cl=I("chevL"), cr=I("chevR"), cta=cta_band())
    write("gallery.html", h + body + footer_html())

# --------------------------------------------------------------------------- #
#  PAGE: Contact
# --------------------------------------------------------------------------- #
def page_contact():
    h = head("Contact Us — " + BRAND,
             "Get in touch with SL Journeys for customised Sri Lanka travel packages. Our experts are ready to plan your dream holiday.",
             "contact.html", inverted=False, og="lib/harbor-dusk.jpg")
    body = """
<main id="main">
<section class="subhero" style="min-height:48vh">
  <div class="subhero__bg">{bg}</div>
  <div class="container subhero__inner">
    <div class="crumb"><a href="index.html">Home</a> &nbsp;/&nbsp; Contact</div>
    <h1>Let's plan your<br>Sri Lanka story</h1>
  </div>
</section>

<section class="section">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(32px,5vw,64px);align-items:start" class="pkg-detail-grid">
      <div data-reveal="left">
        <span class="eyebrow">Get in Touch</span>
        <h2 style="margin-top:16px">We'd love to hear from you</h2>
        <p class="lead" style="margin-top:16px">Get in touch with {brand} for customised Sri Lanka travel packages. Our experts are ready to help you plan your dream holiday — contact us today for a truly personalised experience.</p>
        <div class="contact-list">
          <div class="contact-item"><span class="ic">{phone}</span><div><div class="lbl">Phone</div><a href="tel:{praw}">{p}</a></div></div>
          <div class="contact-item"><span class="ic">{wa_i}</span><div><div class="lbl">WhatsApp</div><a href="{wa}" target="_blank" rel="noopener">{p}</a></div></div>
          <div class="contact-item"><span class="ic">{mail}</span><div><div class="lbl">Email</div><a href="mailto:{email}">{email}</a></div></div>
          <div class="contact-item"><span class="ic">{pin}</span><div><div class="lbl">Address</div><p>{addr}</p></div></div>
        </div>
        <div style="margin-top:28px"><a class="btn btn--primary btn--lg" href="{wa}" target="_blank" rel="noopener">{wa_i} Chat on WhatsApp</a></div>
      </div>
      <div data-reveal="right">
        {form}
      </div>
    </div>
  </div>
</section>
</main>
""".format(bg=img("harbor-dusk","Contact SL Journeys", lazy=False), brand=BRAND,
           phone=I("phone"), praw=PHONE.replace(" ",""), p=PHONE, wa_i=I("whatsapp"),
           wa=wa_link(), mail=I("mail"), email=EMAIL, pin=I("pin"), addr=ADDRESS,
           form=enquiry_form(heading="General enquiry from SL Journeys website"))
    write("contact.html", h + body + footer_html())

# --------------------------------------------------------------------------- #
def main():
    print("Building SL Journeys…")
    page_home()
    page_about()
    for p in PACKAGES:
        page_package(p)
    page_blog_index()
    for b in BLOG:
        page_post(b)
    page_gallery()
    page_contact()
    print("Done.")

if __name__ == "__main__":
    main()
