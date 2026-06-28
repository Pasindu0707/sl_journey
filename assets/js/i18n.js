/* =====================================================================
   SL Journeys — language switcher (Google Translate, custom UI)
   Branded dropdown that drives the hidden Google Translate widget.
   Selection is stored in the `googtrans` cookie so it persists across
   every page. Requires the site to be served over http(s) (not file://).
   ===================================================================== */
(function () {
  'use strict';

  // Popular languages shown first; full list follows (A–Z by English name).
  var POPULAR = ['en', 'ja', 'zh-CN', 'zh-TW', 'id', 'th', 'it', 'de', 'fr', 'es', 'ru'];

  var LANGS = [
    ['en', 'English', 'English'],
    ['af', 'Afrikaans', 'Afrikaans'],
    ['sq', 'Shqip', 'Albanian'],
    ['ar', 'العربية', 'Arabic'],
    ['hy', 'Հայերեն', 'Armenian'],
    ['az', 'Azərbaycan', 'Azerbaijani'],
    ['eu', 'Euskara', 'Basque'],
    ['be', 'Беларуская', 'Belarusian'],
    ['bn', 'বাংলা', 'Bengali'],
    ['bs', 'Bosanski', 'Bosnian'],
    ['bg', 'Български', 'Bulgarian'],
    ['ca', 'Català', 'Catalan'],
    ['ceb', 'Cebuano', 'Cebuano'],
    ['ny', 'Chichewa', 'Chichewa'],
    ['zh-CN', '简体中文', 'Chinese (Simplified)'],
    ['zh-TW', '繁體中文', 'Chinese (Traditional)'],
    ['co', 'Corsu', 'Corsican'],
    ['hr', 'Hrvatski', 'Croatian'],
    ['cs', 'Čeština', 'Czech'],
    ['da', 'Dansk', 'Danish'],
    ['nl', 'Nederlands', 'Dutch'],
    ['eo', 'Esperanto', 'Esperanto'],
    ['et', 'Eesti', 'Estonian'],
    ['tl', 'Filipino', 'Filipino'],
    ['fi', 'Suomi', 'Finnish'],
    ['fr', 'Français', 'French'],
    ['fy', 'Frysk', 'Frisian'],
    ['gl', 'Galego', 'Galician'],
    ['ka', 'ქართული', 'Georgian'],
    ['de', 'Deutsch', 'German'],
    ['el', 'Ελληνικά', 'Greek'],
    ['gu', 'ગુજરાતી', 'Gujarati'],
    ['ht', 'Kreyòl Ayisyen', 'Haitian Creole'],
    ['ha', 'Hausa', 'Hausa'],
    ['haw', 'ʻŌlelo Hawaiʻi', 'Hawaiian'],
    ['iw', 'עברית', 'Hebrew'],
    ['hi', 'हिन्दी', 'Hindi'],
    ['hmn', 'Hmoob', 'Hmong'],
    ['hu', 'Magyar', 'Hungarian'],
    ['is', 'Íslenska', 'Icelandic'],
    ['ig', 'Igbo', 'Igbo'],
    ['id', 'Bahasa Indonesia', 'Indonesian'],
    ['ga', 'Gaeilge', 'Irish'],
    ['it', 'Italiano', 'Italian'],
    ['ja', '日本語', 'Japanese'],
    ['jw', 'Basa Jawa', 'Javanese'],
    ['kn', 'ಕನ್ನಡ', 'Kannada'],
    ['kk', 'Қазақ', 'Kazakh'],
    ['km', 'ខ្មែរ', 'Khmer'],
    ['ko', '한국어', 'Korean'],
    ['ku', 'Kurdî', 'Kurdish'],
    ['ky', 'Кыргызча', 'Kyrgyz'],
    ['lo', 'ລາວ', 'Lao'],
    ['la', 'Latina', 'Latin'],
    ['lv', 'Latviešu', 'Latvian'],
    ['lt', 'Lietuvių', 'Lithuanian'],
    ['lb', 'Lëtzebuergesch', 'Luxembourgish'],
    ['mk', 'Македонски', 'Macedonian'],
    ['mg', 'Malagasy', 'Malagasy'],
    ['ms', 'Bahasa Melayu', 'Malay'],
    ['ml', 'മലയാളം', 'Malayalam'],
    ['mt', 'Malti', 'Maltese'],
    ['mi', 'Māori', 'Maori'],
    ['mr', 'मराठी', 'Marathi'],
    ['mn', 'Монгол', 'Mongolian'],
    ['my', 'မြန်မာ', 'Myanmar (Burmese)'],
    ['ne', 'नेपाली', 'Nepali'],
    ['no', 'Norsk', 'Norwegian'],
    ['ps', 'پښتو', 'Pashto'],
    ['fa', 'فارسی', 'Persian'],
    ['pl', 'Polski', 'Polish'],
    ['pt', 'Português', 'Portuguese'],
    ['pa', 'ਪੰਜਾਬੀ', 'Punjabi'],
    ['ro', 'Română', 'Romanian'],
    ['ru', 'Русский', 'Russian'],
    ['sm', 'Gagana Samoa', 'Samoan'],
    ['gd', 'Gàidhlig', 'Scots Gaelic'],
    ['sr', 'Српски', 'Serbian'],
    ['st', 'Sesotho', 'Sesotho'],
    ['sn', 'Shona', 'Shona'],
    ['sd', 'سنڌي', 'Sindhi'],
    ['si', 'සිංහල', 'Sinhala'],
    ['sk', 'Slovenčina', 'Slovak'],
    ['sl', 'Slovenščina', 'Slovenian'],
    ['so', 'Soomaali', 'Somali'],
    ['es', 'Español', 'Spanish'],
    ['su', 'Basa Sunda', 'Sundanese'],
    ['sw', 'Kiswahili', 'Swahili'],
    ['sv', 'Svenska', 'Swedish'],
    ['tg', 'Тоҷикӣ', 'Tajik'],
    ['ta', 'தமிழ்', 'Tamil'],
    ['te', 'తెలుగు', 'Telugu'],
    ['th', 'ไทย', 'Thai'],
    ['tr', 'Türkçe', 'Turkish'],
    ['uk', 'Українська', 'Ukrainian'],
    ['ur', 'اردو', 'Urdu'],
    ['uz', 'Oʻzbek', 'Uzbek'],
    ['vi', 'Tiếng Việt', 'Vietnamese'],
    ['cy', 'Cymraeg', 'Welsh'],
    ['xh', 'isiXhosa', 'Xhosa'],
    ['yi', 'ייִדיש', 'Yiddish'],
    ['yo', 'Yorùbá', 'Yoruba'],
    ['zu', 'isiZulu', 'Zulu']
  ];

  var BY_CODE = {};
  LANGS.forEach(function (l) { BY_CODE[l[0]] = l; });

  /* ---- cookie helpers (drive Google Translate across pages) ---- */
  function setGoogTrans(code) {
    var val = (!code || code === 'en') ? '' : '/en/' + code;
    var expire = val ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
    var host = location.hostname;
    var domains = [''];
    if (host) { domains.push(';domain=' + host); if (host.indexOf('.') >= 0) domains.push(';domain=.' + host); }
    domains.forEach(function (d) { document.cookie = 'googtrans=' + val + ';path=/' + d + expire; });
  }
  function currentLang() {
    var m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'en';
  }
  function shortCode(code) {
    if (code === 'zh-CN') return '中';
    if (code === 'zh-TW') return '繁';
    return code.split('-')[0].toUpperCase();
  }

  function apply(code) {
    setGoogTrans(code);
    location.reload();
  }

  /* ---- build the dropdown ---- */
  function build() {
    var btn = document.getElementById('langBtn');
    var panel = document.getElementById('langPanel');
    if (!btn || !panel) return;

    var cur = currentLang();
    var curLabel = (BY_CODE[cur] || BY_CODE.en)[1];
    var codeEl = btn.querySelector('.lang__code');
    if (codeEl) codeEl.textContent = shortCode(cur);
    btn.setAttribute('title', 'Language: ' + curLabel);

    var list = panel.querySelector('.lang__list');
    var search = panel.querySelector('.lang__search');

    function optHTML(l) {
      var active = l[0] === cur ? ' active' : '';
      return '<button type="button" class="lang__opt' + active + '" data-code="' + l[0] + '">' +
        '<span>' + l[1] + '</span><span class="en">' + l[2] + '</span></button>';
    }
    function render(filter) {
      filter = (filter || '').trim().toLowerCase();
      var html = '';
      if (!filter) {
        html += '<div class="lang__group">Popular</div>';
        POPULAR.forEach(function (c) { if (BY_CODE[c]) html += optHTML(BY_CODE[c]); });
        html += '<div class="lang__group">All languages</div>';
        LANGS.forEach(function (l) { if (POPULAR.indexOf(l[0]) === -1) html += optHTML(l); });
      } else {
        var hits = LANGS.filter(function (l) {
          return l[1].toLowerCase().indexOf(filter) >= 0 ||
                 l[2].toLowerCase().indexOf(filter) >= 0 ||
                 l[0].toLowerCase().indexOf(filter) >= 0;
        });
        html = hits.length ? hits.map(optHTML).join('') :
          '<div class="lang__group" style="padding:14px 7px">No match</div>';
      }
      list.innerHTML = html;
    }
    render('');

    function open() { document.querySelector('.lang').classList.add('open'); btn.setAttribute('aria-expanded', 'true'); setTimeout(function () { search.focus(); }, 60); }
    function close() { document.querySelector('.lang').classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    function toggle() { document.querySelector('.lang').classList.contains('open') ? close() : open(); }

    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    search.addEventListener('input', function () { render(search.value); });
    list.addEventListener('click', function (e) {
      var o = e.target.closest('.lang__opt');
      if (o) apply(o.getAttribute('data-code'));
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang')) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // mobile drawer entry
    var mlang = document.querySelector('.m-lang');
    if (mlang) {
      mlang.addEventListener('click', function () {
        var mn = document.querySelector('.mobile-nav'); if (mn) mn.classList.remove('is-open');
        var bg = document.querySelector('.burger'); if (bg) bg.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(open, 350);
      });
    }
  }

  /* ---- keep Google's injected banner from shifting the layout ---- */
  function tidyGoogle() {
    if (document.body.style.top && document.body.style.top !== '0px') document.body.style.top = '0px';
  }
  var tidyTimer = setInterval(tidyGoogle, 400);
  setTimeout(function () { clearInterval(tidyTimer); }, 8000);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
