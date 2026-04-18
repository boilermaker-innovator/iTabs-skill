<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>iTabs | City Metro Plumbing & Gas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        :root {
            --bg-primary: #0a0a0f; --bg-secondary: #12121a; --bg-tertiary: #1e1e2e;
            --text-primary: #ffffff; --text-secondary: #9090b0;
            --accent: #7c3aed; --accent2: #06b6d4; --i-button: #f59e0b;
            --card-radius: 16px; --transition: 0.2s ease;
        }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.5; }
        .container { max-width: 430px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; position: relative; }

        .biz-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; z-index: 90; }
        .biz-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .biz-location { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
        .contact-pill { padding: 7px 14px; background: var(--accent); border: none; border-radius: 99px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }

        .progress-container { display: flex; gap: 4px; padding: 8px 16px 6px; background: var(--bg-primary); }
        .progress-segment { flex: 1; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; transition: background var(--transition); }
        .progress-segment.viewed { background: rgba(255,255,255,0.6); }
        .progress-segment.active { background: var(--accent); }

        .cards-wrapper { flex: 1; position: relative; overflow: hidden; }
        .card { position: absolute; inset: 0; display: flex; flex-direction: column; opacity: 0; transform: translateX(100%); transition: all 0.3s ease; pointer-events: none; }
        .card.active { opacity: 1; transform: translateX(0); pointer-events: all; }
        .card.prev { opacity: 0; transform: translateX(-100%); }

        .card-hero { padding: 20px 20px 20px; min-height: 36%; display: flex; flex-direction: column; justify-content: flex-end; }
        .card-hero.hero-large { min-height: 52%; }
        .hero-default { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
        .hero-cyan    { background: linear-gradient(135deg, #164e63 0%, #0c4a6e 100%); }
        .hero-amber   { background: linear-gradient(135deg, #78350f 0%, #431407 100%); }
        .hero-green   { background: linear-gradient(135deg, #14532d 0%, #052e16 100%); }
        .hero-purple  { background: linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%); }
        .hero-red     { background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%); }

        .card-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
        .tag-cyan { color: #67e8f9; } .tag-amber { color: #fcd34d; } .tag-green { color: #6ee7b7; } .tag-red { color: #fca5a5; } .tag-purple { color: #a78bfa; }
        .card-headline { font-size: clamp(20px, 5vw, 26px); font-weight: 700; line-height: 1.25; }
        .hero-default em { color: #cbd5e1; font-style: normal; } .hero-cyan em { color: #67e8f9; font-style: normal; }
        .hero-amber em { color: #fcd34d; font-style: normal; } .hero-green em { color: #6ee7b7; font-style: normal; }
        .hero-purple em { color: #a78bfa; font-style: normal; } .hero-red em { color: #fca5a5; font-style: normal; }

        .card-body { flex: 1; background: var(--bg-secondary); padding: 16px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .card-summary { font-size: 15px; color: var(--text-secondary); line-height: 1.65; }
        .analogy-box { background: var(--bg-tertiary); border-left: 3px solid var(--accent2); border-radius: 8px; padding: 12px 14px; }
        .analogy-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px; }
        .analogy-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        .i-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
        .i-button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--i-button); cursor: pointer; }
        .i-dot { width: 16px; height: 16px; background: var(--i-button); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #000; flex-shrink: 0; }

        .lead-form { display: flex; flex-direction: column; gap: 10px; }
        .lead-form input, .lead-form select { width: 100%; padding: 11px 14px; background: var(--bg-tertiary); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--text-primary); font-size: 14px; font-family: 'Inter', sans-serif; }
        .lead-form input::placeholder { color: var(--text-secondary); }
        .submit-btn { padding: 13px; background: var(--accent); border: none; border-radius: 10px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; }
        .success-msg { text-align: center; color: #6ee7b7; font-size: 15px; font-weight: 600; padding: 20px 0; display: none; }

        .nav-area { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px 20px; background: var(--bg-secondary); border-top: 1px solid rgba(255,255,255,0.06); }
        .nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: var(--text-primary); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }
        .card-counter { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
        .itabs-footer { text-align: center; font-size: 10px; color: rgba(255,255,255,0.15); padding-bottom: 4px; background: var(--bg-secondary); letter-spacing: 0.1em; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
        .modal-overlay.active .modal-sheet { transform: translateY(0); }
        .modal-handle { width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 16px; }
        .modal-term { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
        .modal-type { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--i-button); margin-bottom: 12px; }
        .modal-content { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .modal-close { margin-top: 20px; width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: none; border-radius: 10px; color: var(--text-primary); font-size: 14px; font-weight: 600; cursor: pointer; }

        .contact-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .contact-overlay.active { opacity: 1; pointer-events: all; }
        .contact-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
        .contact-overlay.active .contact-sheet { transform: translateY(0); }
        .contact-biz-name { font-size: 16px; font-weight: 700; margin-bottom: 16px; text-align: center; }
        .contact-actions { display: flex; flex-direction: column; gap: 8px; }
        .contact-action { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,0.06); border: none; border-radius: 12px; color: var(--text-primary); text-decoration: none; cursor: pointer; width: 100%; text-align: left; font-family: 'Inter', sans-serif; }
        .ca-icon { font-size: 20px; width: 28px; text-align: center; }
        .ca-label { font-size: 14px; font-weight: 600; flex: 1; }
        .ca-detail { font-size: 12px; color: var(--text-secondary); }
    </style>
</head>
<body>
<div class="container">
    <div class="biz-header">
        <div class="biz-info">
            <div class="biz-name">City Metro Plumbing & Gas</div>
            <div class="biz-location">Perth Metro — 24/7</div>
        </div>
        <button class="contact-pill" id="contactBtn">💬 Contact</button>
    </div>
    <div class="progress-container" id="progress"></div>
    <div class="cards-wrapper" id="cardsWrapper"></div>
    <div class="nav-area">
        <button class="nav-btn" id="prevBtn">←</button>
        <span class="card-counter" id="counter">1 / 7</span>
        <button class="nav-btn" id="nextBtn">→</button>
    </div>
    <div class="itabs-footer">ITABS</div>
</div>

<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
    <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-term" id="modalTerm"></div>
        <div class="modal-type" id="modalType"></div>
        <div class="modal-content" id="modalContent"></div>
        <button class="modal-close" onclick="closeModal()">Close</button>
    </div>
</div>

<div class="contact-overlay" id="contactOverlay" onclick="if(event.target===this)closeContact()">
    <div class="contact-sheet">
        <div class="modal-handle"></div>
        <div class="contact-biz-name">City Metro Plumbing & Gas</div>
        <div class="contact-actions">
            <a href="tel:0433350646" class="contact-action">
                <span class="ca-icon">📞</span>
                <span class="ca-label">Call</span>
                <span class="ca-detail">0433 350 646</span>
            </a>
            <a href="https://wa.me/61433350646" class="contact-action">
                <span class="ca-icon">💬</span>
                <span class="ca-label">WhatsApp</span>
                <span class="ca-detail">Message us</span>
            </a>
            <a href="mailto:info@citymetroplumbingandgas.com.au" class="contact-action">
                <span class="ca-icon">✉️</span>
                <span class="ca-label">Email</span>
                <span class="ca-detail">citymetroplumbingandgas.com.au</span>
            </a>
            <button onclick="saveContact()" class="contact-action">
                <span class="ca-icon">💾</span>
                <span class="ca-label">Save Contact</span>
                <span class="ca-detail">Add to phone</span>
            </button>
        </div>
    </div>
</div>

<script>
var bizName = 'City Metro Plumbing & Gas';
var bizPhone = '0433350646';
var bizEmail = 'info@citymetroplumbingandgas.com.au';
var bizWebsite = 'https://citymetroplumbingandgas.com.au';

var cards = [
    {
        tag: '01 / WHO WE ARE',
        tagClass: 'tag-cyan',
        headline: 'Your <em>Trusted Local</em> Plumbers',
        heroClass: 'hero-cyan',
        bigHero: true,
        summary: 'City Metro Plumbing & Gas services the whole Perth metro area. Fully licensed and insured, we show up the same day and never charge a call out fee.',
        analogy: null,
        iButtons: [
            { label: 'Licensed & insured', type: 'context', term: 'Fully Licensed', content: 'City Metro holds full licensing for both plumbing and gas fitting. Every job is done to code and you are covered if anything goes wrong. No cowboys, no shortcuts.' },
            { label: 'No call out fee', type: 'why-it-matters', term: 'What That Means', content: 'Most plumbers charge $80 to $150 just to show up. We do not. You only pay for the work done. No surprises on the invoice.' }
        ]
    },
    {
        tag: '02 / BLOCKED DRAINS',
        tagClass: 'tag-cyan',
        headline: 'Blocked Drain? <em>No Worries</em>',
        heroClass: 'hero-cyan',
        bigHero: true,
        summary: 'We use the latest equipment including the Sewer Jetter to blast through any blockage. Tree roots, grease, sludge — we clear it fast with no mess.',
        analogy: { title: 'What is a Sewer Jetter?', text: 'High-pressure water that blasts through even the toughest blockages. Way more effective than a standard drain snake and leaves the pipe clean.' },
        iButtons: [
            { label: 'Warning signs', type: 'why-it-matters', term: 'Do Not Ignore It', content: 'Slow draining water, gurgling sounds, or bad smells are early warning signs. Left too long, a blocked drain can back up into your home and cause serious water damage.' }
        ]
    },
    {
        tag: '03 / PLUMBING & GAS',
        tagClass: 'tag-amber',
        headline: 'Plumbing <em>and</em> Gas — One Call',
        heroClass: 'hero-amber',
        bigHero: true,
        summary: 'From leaking taps and burst pipes to gas appliance installs — we handle it all. One trade, one call, everything sorted.',
        analogy: null,
        iButtons: [
            { label: 'Gas safety', type: 'why-it-matters', term: 'Gas Leaks Are Urgent', content: 'If you smell gas, turn off the supply at the meter, open windows, and call us immediately. Do not switch lights on or off. Gas leaks are a serious fire and health hazard.' },
            { label: 'What we fix', type: 'definition', term: 'Our Services', content: 'Blocked drains, burst pipes, leaking taps, hot water systems, gas appliance installation, bathroom work, and general plumbing maintenance across Perth metro.' }
        ]
    },
    {
        tag: '04 / WHY CHOOSE US',
        tagClass: 'tag-purple',
        headline: '<em>Same Day</em> Response — Always',
        heroClass: 'hero-purple',
        photoUrl: null,
        summary: 'Fully licensed and insured. Same day response. No call out fee. Available 24 hours, 7 days a week. That is the City Metro guarantee.',
        analogy: null,
        iButtons: [
            { label: 'Our guarantee', type: 'context', term: 'The City Metro Promise', content: 'We show up when we say we will, we charge what we quote, and we do the job right first time. If you are not happy, we will come back and fix it.' }
        ]
    },
    {
        tag: '05 / HOW IT WORKS',
        tagClass: 'tag-green',
        headline: '<em>Three Steps</em> to Fixed',
        heroClass: 'hero-green',
        photoUrl: null,
        summary: 'Step 1 — Call or message us. Step 2 — We arrive same day, assess the job, and give you a clear quote. Step 3 — We fix it properly and clean up after ourselves.',
        analogy: null,
        iButtons: [
            { label: 'Free quotes', type: 'context', term: 'No Obligation Quote', content: 'We assess the job and give you a clear price before we start. No hidden extras, no surprise invoices. You decide if you want to proceed.' }
        ]
    },
    {
        tag: '06 / PRICING',
        tagClass: 'tag-amber',
        headline: 'Honest Pricing, <em>No Surprises</em>',
        heroClass: 'hero-amber',
        photoUrl: null,
        summary: 'No call out fee. Free quotes. We tell you the price before we start and that is what you pay. Competitive rates for Perth metro, 24 hours a day.',
        analogy: null,
        iButtons: [
            { label: 'After hours', type: 'context', term: 'After Hours Rates', content: 'We are available 24/7 including weekends and public holidays. After hours rates apply for emergency callouts outside business hours — we will be upfront about this when you call.' }
        ]
    },
    {
        tag: '07 / GET IN TOUCH',
        tagClass: 'tag-green',
        headline: 'Ready to <em>Sort It</em> Today',
        heroClass: 'hero-green',
        photoUrl: null,
        summary: 'Call or message us now. Same day response, no call out fee. Tell us what the problem is and we will get there.',
        analogy: null,
        iButtons: [],
        isLeadCard: true
    }
];

var currentCard = 0;
var totalCards = cards.length;
var modalOverlay = document.getElementById('modalOverlay');
var modalTerm = document.getElementById('modalTerm');
var modalType = document.getElementById('modalType');
var modalContent = document.getElementById('modalContent');

document.getElementById('contactBtn').addEventListener('click', function() { openContact(); });
document.getElementById('prevBtn').addEventListener('click', function() { navigate(-1); });
document.getElementById('nextBtn').addEventListener('click', function() { navigate(1); });

function init() {
    var progress = document.getElementById('progress');
    var wrapper = document.getElementById('cardsWrapper');
    for (var i = 0; i < cards.length; i++) {
        var seg = document.createElement('div');
        seg.className = 'progress-segment' + (i === 0 ? ' active' : '');
        progress.appendChild(seg);
        wrapper.appendChild(buildCard(cards[i], i));
    }
    document.getElementById('counter').textContent = '1 / ' + totalCards;
    document.getElementById('prevBtn').disabled = true;
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'Escape') { closeModal(); closeContact(); }
    });
    var startX = 0;
    var cw = document.getElementById('cardsWrapper');
    cw.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    cw.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    });
}

function buildCard(card, index) {
    var el = document.createElement('div');
    el.className = 'card' + (index === 0 ? ' active' : '');
    var heroEl = document.createElement('div');
    heroEl.className = 'card-hero ' + card.heroClass + (card.bigHero ? ' hero-large' : '');
    if (card.photoUrl) {
        heroEl.style.backgroundImage = 'url(' + card.photoUrl + ')';
        heroEl.style.backgroundSize = card.photoSize || 'cover';
        heroEl.style.backgroundPosition = card.photoPos || 'center center';
    }
    heroEl.innerHTML = '<div class="card-tag ' + (card.tagClass || '') + '">' + card.tag + '</div><h2 class="card-headline">' + card.headline + '</h2>';
    var bodyEl = document.createElement('div');
    bodyEl.className = 'card-body';
    var html = '<p class="card-summary">' + card.summary + '</p>';
    if (card.analogy) {
        html += '<div class="analogy-box"><div class="analogy-title">' + card.analogy.title + '</div><div class="analogy-text">' + card.analogy.text + '</div></div>';
    }
    if (card.iButtons && card.iButtons.length) {
        html += '<div class="i-buttons">';
        for (var j = 0; j < card.iButtons.length; j++) {
            var b = card.iButtons[j];
            html += '<button class="i-button" data-term="' + b.term + '" data-type="' + b.type + '" data-content="' + encodeURIComponent(b.content) + '"><span class="i-dot">i</span>' + b.label + '</button>';
        }
        html += '</div>';
    }
    if (card.isLeadCard) {
        html += '<div class="lead-form" id="leadForm">';
        html += '<input type="text" id="fname" placeholder="Your name" />';
        html += '<input type="tel" id="fphone" placeholder="Your phone number" />';
        html += '<input type="text" id="fjob" placeholder="What do you need fixed?" />';
        html += '<button class="submit-btn" id="submitBtn">Get a Free Quote</button>';
        html += '</div>';
        html += '<div class="success-msg" id="successMsg">Thanks! We will call you shortly.</div>';
    }
    bodyEl.innerHTML = html;
    el.appendChild(heroEl);
    el.appendChild(bodyEl);
    el.querySelectorAll('.i-button').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openModal(btn.dataset.term, btn.dataset.type, decodeURIComponent(btn.dataset.content));
        });
    });
    if (card.isLeadCard) {
        var submitBtn = el.querySelector('#submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() { submitLead(); });
        }
    }
    return el;
}

function submitLead() {
    var name = document.getElementById('fname').value;
    var phone = document.getElementById('fphone').value;
    var job = document.getElementById('fjob').value;
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_key: '99a11c15-5c61-4765-99c5-673adec64b16',
            subject: 'City Metro Plumbing Lead — iTabs',
            name: name, phone: phone, message: job,
            from_name: 'iTabs City Metro Widget'
        })
    }).catch(function() {});
    document.getElementById('leadForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
}

function navigate(direction) {
    var next = currentCard + direction;
    if (next >= 0 && next < totalCards) updateCard(next);
}

function updateCard(index) {
    document.querySelectorAll('.card').forEach(function(c, i) {
        c.classList.remove('active', 'prev');
        if (i === index) c.classList.add('active');
        else if (i < index) c.classList.add('prev');
    });
    document.querySelectorAll('.progress-segment').forEach(function(s, i) {
        s.classList.remove('active', 'viewed');
        if (i === index) s.classList.add('active');
        else if (i < index) s.classList.add('viewed');
    });
    currentCard = index;
    document.getElementById('counter').textContent = (index + 1) + ' / ' + totalCards;
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === totalCards - 1;
}

function openModal(term, type, content) {
    var typeLabels = { 'definition': 'Definition', 'context': 'Context', 'why-it-matters': 'Why It Matters', 'related': 'Related' };
    modalTerm.textContent = term;
    modalType.textContent = typeLabels[type] || type;
    modalContent.textContent = content;
    modalOverlay.classList.add('active');
}

function closeModal() { modalOverlay.classList.remove('active'); }
function openContact() { document.getElementById('contactOverlay').classList.add('active'); }
function closeContact() { document.getElementById('contactOverlay').classList.remove('active'); }

function saveContact() {
    var vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + bizName + '\nTEL:' + bizPhone + '\nEMAIL:' + bizEmail + '\nURL:' + bizWebsite + '\nEND:VCARD';
    var blob = new Blob([vcard], { type: 'text/vcard' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'CityMetroPlumbing.vcf';
    a.click();
    URL.revokeObjectURL(url);
}

init();
</script>
</body>
</html>
