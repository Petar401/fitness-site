/* ==========================================================================
   FORGE PT — "Spotter" chat assistant
   100% client-side. No API, no keys, no network calls.
   It understands the whole site via a local knowledge base + intent matching.
   ========================================================================== */
(function () {
  'use strict';

  // Resolve links relative to site root so the bot works from /blog/ pages too.
  var ROOT = (function () {
    return /\/blog\//.test(window.location.pathname) ? '../' : '';
  })();
  function L(path) { return ROOT + path; }

  /* ---------------- Knowledge base ----------------
     Each intent: keywords (matched on), an answer (HTML allowed), and
     optional follow-up chips. Order matters only for ties. */
  var KB = [
    {
      id: 'greeting',
      keywords: ['hi', 'hello', 'hey', 'yo', 'hiya', 'good morning', 'good afternoon', 'good evening', 'help'],
      answer: "Hey! I'm <strong>Spotter</strong>, Jordan's virtual assistant 💪 I can help with services, prices, booking, location and more. What are you after?",
      chips: ['See prices', 'Services', 'Book a free consult', 'Where are you based?']
    },
    {
      id: 'prices',
      keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'fee', 'fees', 'rate', 'rates', 'expensive', 'cheap', 'afford', 'package', 'packages'],
      answer: "Here's the headline pricing:<br>" +
              "• <strong>Taster session</strong> — £25 (one-off)<br>" +
              "• <strong>1-2-1 Personal Training</strong> — from £40/session, less in blocks<br>" +
              "• <strong>10-session block</strong> — £360 (£36/session)<br>" +
              "• <strong>Monthly unlimited-ish (12 sessions)</strong> — £420/mo<br>" +
              "• <strong>Small-group (2–4 people)</strong> — £18pp/session<br>" +
              "• <strong>Online coaching</strong> — from £99/month<br>" +
              'Full breakdown on the <a href="' + L('pricing.html') + '">pricing page</a>.',
      chips: ['Online coaching', 'Book a free consult', 'Whats included?']
    },
    {
      id: 'services',
      keywords: ['service', 'services', 'what do you offer', 'offer', 'training', 'options', 'programmes', 'programs', 'sessions', 'coaching'],
      answer: "Jordan offers:<br>• <strong>1-2-1 Personal Training</strong><br>• <strong>Online Coaching</strong><br>• <strong>Small-Group Training</strong><br>• <strong>Strength &amp; Conditioning</strong><br>• <strong>Nutrition Coaching</strong><br>" +
              'See details on the <a href="' + L('services.html') + '">services page</a>.',
      chips: ['See prices', 'Online coaching', 'Nutrition help']
    },
    {
      id: 'online',
      keywords: ['online coaching', 'online', 'remote coaching', 'remote', 'app', 'virtual', 'distance', 'from home', 'home workout', 'not in norwich', 'away'],
      answer: "<strong>Online coaching</strong> (from £99/mo) gives you a custom training + nutrition plan in an app, weekly check-ins, video form reviews and WhatsApp support — train anywhere, even outside Norwich. " +
              'More on the <a href="' + L('services.html') + '">services page</a>.',
      chips: ['See prices', 'Book a free consult']
    },
    {
      id: 'nutrition',
      keywords: ['nutrition', 'diet', 'eat', 'eating', 'food', 'meal', 'meals', 'macros', 'calories', 'weight loss', 'fat loss', 'lose weight', 'slim', 'tone'],
      answer: "Nutrition is built into every plan — no crash diets. You'll get flexible, sustainable habits, macro guidance and meal ideas that fit your life. Fat-loss is one of Jordan's specialities. " +
              'There\'s a handy read on the <a href="' + L('blog/fat-loss-busy-professionals.html') + '">blog</a> too.',
      chips: ['See prices', 'Services', 'Book a free consult']
    },
    {
      id: 'smallgroup',
      keywords: ['group', 'small group', 'friend', 'friends', 'partner', 'buddy', 'couple', 'together', 'team'],
      answer: "Small-group training (2–4 people) is <strong>£18 per person / session</strong> — bring a friend or partner and keep each other accountable. Great value and good craic.",
      chips: ['See prices', 'Book a free consult']
    },
    {
      id: 'booking',
      keywords: ['book', 'booking', 'consult', 'consultation', 'free', 'trial', 'start', 'sign up', 'signup', 'join', 'get started', 'appointment', 'enquire', 'enquiry'],
      answer: "Love it. Your first <strong>consultation is free</strong> — a chat about your goals, a movement screen and a plan. " +
              'Head to the <a href="' + L('contact.html') + '">contact page</a>, call <a href="tel:+441603555014">01603 555 014</a>, or email <a href="mailto:hello@forgept-norwich.co.uk">hello@forgept-norwich.co.uk</a>.',
      chips: ['Where are you based?', 'Opening hours', 'See prices']
    },
    {
      id: 'location',
      keywords: ['where', 'location', 'based', 'address', 'studio', 'gym', 'norwich', 'find you', 'directions', 'postcode', 'nr1', 'parking', 'area', 'areas'],
      answer: "FORGE is based at a private studio on <strong>Riverside, Norwich (NR1)</strong>, with free parking. Jordan also covers Thorpe St Andrew, Sprowston, Costessey &amp; Wymondham. " +
              'Map &amp; directions on the <a href="' + L('contact.html') + '">contact page</a>.',
      chips: ['Opening hours', 'Book a free consult', 'See prices']
    },
    {
      id: 'hours',
      keywords: ['hours', 'open', 'opening', 'times', 'time', 'when', 'available', 'availability', 'weekend', 'saturday', 'sunday', 'early', 'evening', 'morning'],
      answer: "Studio hours:<br>• <strong>Mon–Fri</strong>: 6:00am – 8:00pm<br>• <strong>Saturday</strong>: 7:00am – 1:00pm<br>• <strong>Sunday</strong>: by appointment<br>Early-bird and evening slots fill fast — book ahead!",
      chips: ['Book a free consult', 'Where are you based?']
    },
    {
      id: 'qualifications',
      keywords: ['qualified', 'qualification', 'qualifications', 'certified', 'credential', 'credentials', 'experience', 'insured', 'insurance', 'level', 'trust', 'safe', 'about', 'who', 'jordan'],
      answer: "Jordan Hale is a <strong>Level 3 qualified Personal Trainer</strong> with 9+ years' experience, REPs-registered, fully insured, first-aid certified and an ex-rugby S&amp;C coach. " +
              'Full story on the <a href="' + L('about.html') + '">about page</a>.',
      chips: ['Services', 'Book a free consult', 'Read reviews']
    },
    {
      id: 'beginner',
      keywords: ['beginner', 'beginners', 'new', 'never', 'first time', 'nervous', 'unfit', 'out of shape', 'overweight', 'old', 'older', 'age', 'injury', 'injured', 'back', 'knee', 'rehab', 'pregnant', 'postnatal'],
      answer: "Total beginners are very welcome — most clients start exactly there. Jordan adapts everything around injuries, age and confidence, with a no-judgement approach. There's a <a href=\"" + L('blog/beginners-strength-plan.html') + '">beginner\'s strength guide</a> on the blog to get you started.',
      chips: ['Book a free consult', 'See prices', 'Services']
    },
    {
      id: 'results',
      keywords: ['results', 'review', 'reviews', 'testimonial', 'testimonials', 'transformation', 'transformations', 'proof', 'work', 'works', 'success'],
      answer: "Clients have dropped 2+ stone, hit their first pull-up and got stronger for life — with a 4.9★ average from 120+ reviews. You'll find their words on the <a href=\"" + L('index.html') + '#reviews">home page</a>.',
      chips: ['Book a free consult', 'See prices']
    },
    {
      id: 'blog',
      keywords: ['blog', 'article', 'articles', 'read', 'tips', 'advice', 'guide', 'guides', 'post', 'posts'],
      answer: "The <a href=\"" + L('blog.html') + "\">blog</a> has free guides — best gyms &amp; outdoor spots in Norwich, fat loss for busy people, a beginner strength plan, and what to eat around training.",
      chips: ['Services', 'Book a free consult']
    },
    {
      id: 'contact',
      keywords: ['contact', 'phone', 'call', 'email', 'number', 'reach', 'message', 'whatsapp', 'instagram', 'social'],
      answer: "📞 <a href=\"tel:+441603555014\">01603 555 014</a><br>✉️ <a href=\"mailto:hello@forgept-norwich.co.uk\">hello@forgept-norwich.co.uk</a><br>📸 @forge.norwich on Instagram<br>Or use the form on the <a href=\"" + L('contact.html') + '">contact page</a>.',
      chips: ['Opening hours', 'Book a free consult']
    },
    {
      id: 'thanks',
      keywords: ['thanks', 'thank you', 'cheers', 'ta', 'appreciate', 'awesome', 'great', 'cool', 'nice', 'perfect'],
      answer: "Anytime! 💪 Anything else I can help with?",
      chips: ['See prices', 'Book a free consult', 'Where are you based?']
    },
    {
      id: 'bye',
      keywords: ['bye', 'goodbye', 'see you', 'later', 'cya', 'no thanks', 'thats all', 'that is all', 'nothing'],
      answer: "Take care — and remember, the first session's on us. Come train with FORGE! 👋",
      chips: ['Book a free consult']
    }
  ];

  var FALLBACK = {
    answer: "Good question — I'm not 100% sure on that one. I can help with <strong>services, prices, booking, location, hours, online coaching</strong> and more. You can also reach Jordan on <a href=\"tel:+441603555014\">01603 555 014</a> or <a href=\"mailto:hello@forgept-norwich.co.uk\">hello@forgept-norwich.co.uk</a>.",
    chips: ['See prices', 'Services', 'Book a free consult', 'Opening hours']
  };

  var WELCOME = {
    answer: "👋 Hi, I'm <strong>Spotter</strong> — FORGE PT's assistant. Ask me anything about training with Jordan in Norwich!",
    chips: ['See prices', 'Services', 'Book a free consult', 'Where are you based?']
  };

  // Map chip labels to the query they fire
  function chipQuery(label) { return label; }

  /* ---------------- Matching ---------------- */
  function normalise(s) {
    return ' ' + s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }
  function scoreIntent(text, intent) {
    var n = normalise(text), score = 0;
    intent.keywords.forEach(function (kw) {
      var k = ' ' + kw + ' ';
      if (n.indexOf(k) !== -1) { score += kw.indexOf(' ') !== -1 ? 3 : 2; } // phrases weigh more
      else if (n.indexOf(' ' + kw) !== -1 || n.indexOf(kw + ' ') !== -1) { score += 1; }
    });
    return score;
  }
  function findReply(text) {
    var best = null, bestScore = 0;
    KB.forEach(function (intent) {
      var s = scoreIntent(text, intent);
      if (s > bestScore) { bestScore = s; best = intent; }
    });
    return (best && bestScore > 0) ? best : FALLBACK;
  }

  /* ---------------- UI ---------------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    var launcher = el('button', 'chat-launcher');
    launcher.setAttribute('aria-label', 'Open chat assistant');
    launcher.innerHTML = '<span class="dot"></span>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

    var panel = el('div', 'chat-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'FORGE PT chat assistant');
    panel.innerHTML =
      '<div class="chat-head">' +
        '<div class="avatar">S</div>' +
        '<div><b>Spotter</b><small>Online · replies instantly</small></div>' +
        '<button class="chat-close" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chat-log" aria-live="polite"></div>' +
      '<div class="chips js-chips"></div>' +
      '<form class="chat-form">' +
        '<input type="text" placeholder="Ask about prices, booking…" aria-label="Type your message" autocomplete="off">' +
        '<button type="submit" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var log = panel.querySelector('.chat-log');
    var chipsBox = panel.querySelector('.js-chips');
    var form = panel.querySelector('.chat-form');
    var input = panel.querySelector('input');
    var greeted = false;

    function scrollDown() { log.scrollTop = log.scrollHeight; }

    function addMsg(text, who) {
      var m = el('div', 'msg ' + who, text);
      log.appendChild(m);
      scrollDown();
      return m;
    }

    function renderChips(list) {
      chipsBox.innerHTML = '';
      (list || []).forEach(function (label) {
        var c = el('button', 'chip', label);
        c.type = 'button';
        c.addEventListener('click', function () { handle(chipQuery(label)); });
        chipsBox.appendChild(c);
      });
    }

    function botRespond(text) {
      var typing = el('div', 'msg bot typing', '<span></span><span></span><span></span>');
      log.appendChild(typing); scrollDown();
      var reply = findReply(text);
      setTimeout(function () {
        typing.remove();
        addMsg(reply.answer, 'bot');
        renderChips(reply.chips);
      }, 420);
    }

    function handle(text) {
      text = (text || '').trim();
      if (!text) return;
      addMsg(text, 'user');
      renderChips([]);
      botRespond(text);
    }

    function openPanel() {
      panel.classList.add('open');
      launcher.querySelector('.dot').style.display = 'none';
      if (!greeted) {
        greeted = true;
        setTimeout(function () {
          addMsg(WELCOME.answer, 'bot');
          renderChips(WELCOME.chips);
        }, 250);
      }
      setTimeout(function () { input.focus(); }, 300);
    }
    function closePanel() { panel.classList.remove('open'); launcher.focus(); }

    launcher.addEventListener('click', function () {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    panel.querySelector('.chat-close').addEventListener('click', closePanel);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      handle(v);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
