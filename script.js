// SITE UTILITIES
document.getElementById('year').textContent = new Date().getFullYear();

// mobile nav toggle (if mobile toggle exists)
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');
if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* ==========================
   LEAFLET MAP (North India)
   ========================== */
const map = L.map('map', { zoomControl: true }).setView([28.6139, 77.2090], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const places = [
  { id: 'shimla', name: 'Shimla', coords: [31.1048, 77.1734], tags: ['Mountains','Cafés'], summary: 'Colonial charm, ridge walks, cozy cafés.', itin: ['Day 1 — Ridge & Mall Walk', 'Day 2 — Jakhu + cafe crawl', 'Day 3 — Nearby viewpoint & local bazaar'] },
  { id: 'manali', name: 'Manali', coords: [32.2396, 77.1887], tags: ['Trek','Adventure'], summary: 'Solang Valley adventures and Old Manali vibes.', itin: ['Day 1 — Old Manali + cafés', 'Day 2 — Solang: paragliding/valley', 'Day 3 — Hidimba temple & waterfalls'] },
  { id: 'rishikesh', name: 'Rishikesh', coords: [30.0869, 78.2676], tags: ['Yoga','River'], summary: 'Ganga aarti, rafting and calm ashrams.', itin: ['Day 1 — Ganga aarti + café', 'Day 2 — Rafting + local walk', 'Day 3 — Meditation & slow return'] },
  { id: 'jaipur', name: 'Jaipur', coords: [26.9124, 75.7873], tags: ['Palaces','Culture'], summary: 'Amber Fort, Hawa Mahal and rooftop dinners.', itin: ['Day 1 — City Palace + markets', 'Day 2 — Amer Fort + stepwell', 'Day 3 — Local food crawl'] }
];

const drawer = document.getElementById('detailDrawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerTags = document.getElementById('drawerTags');
const drawerSummary = document.getElementById('drawerSummary');
const drawerItinerary = document.getElementById('drawerItinerary');
const closeDrawer = document.getElementById('closeDrawer');

places.forEach(p => {
  const marker = L.marker(p.coords).addTo(map).bindPopup(`<strong>${p.name}</strong>`);
  marker.on('click', () => openDrawer(p));
});

// card click -> center map + open drawer
document.querySelectorAll('.dest-card').forEach(card => {
  card.addEventListener('click', () => {
    const lat = parseFloat(card.dataset.lat);
    const lng = parseFloat(card.dataset.lng);
    map.setView([lat, lng], 9);
    const place = places.find(x => x.name.toLowerCase() === card.dataset.name.toLowerCase());
    if (place) openDrawer(place);
  });
});

function openDrawer(place) {
  drawerTitle.textContent = place.name;
  drawerTags.innerHTML = place.tags.map(t => `<span class="tag">${t}</span>`).join(' ');
  drawerSummary.textContent = place.summary;
  drawerItinerary.innerHTML = `<h4 style="margin-top:10px;">Sample 3-day plan</h4><ul style="padding-left:18px;margin-top:6px;">${place.itin.map(i => `<li>${i}</li>`).join('')}</ul>`;
  drawer.classList.remove('hidden');
  drawer.setAttribute('aria-hidden', 'false');
}

if (closeDrawer) closeDrawer.addEventListener('click', () => {
  drawer.classList.add('hidden');
  drawer.setAttribute('aria-hidden', 'true');
});

/* ==========================
   BLOG CARDS (already in HTML) - placeholder behavior
   ========================== */
// (If you later want click -> full post pages, we can create blog pages and link here)

/* ==========================
   LEADS / CONTACT FORM
   ========================== */
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const msg = document.getElementById('leadMsg').value.trim();
    // For now, show simple confirmation — later send to backend / Google Sheets
    alert(`Thanks ${name}! We saved your request.\n\n${email}\n${msg}`);
    leadForm.reset();
  });
}

/* ==========================
   CHATBOT (mock) — ready for real AI hook
   ========================== */
const chatLaunch = document.getElementById('chatLaunch');
const chatBox = document.getElementById('chatBox');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function appendBubble(text, who = 'bot') {
  const d = document.createElement('div');
  d.className = 'chat-bubble' + (who === 'user' ? ' user' : '');
  d.textContent = text;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// toggle chat
chatLaunch.addEventListener('click', () => {
  chatBox.classList.toggle('hidden');
  chatBox.setAttribute('aria-hidden', chatBox.classList.contains('hidden') ? 'true' : 'false');
});

// close button
chatClose.addEventListener('click', () => {
  chatBox.classList.add('hidden');
  chatBox.setAttribute('aria-hidden', 'true');
});

// send message
function handleUserMessage() {
  const text = (chatInput.value || '').trim();
  if (!text) return;
  appendBubble(text, 'user');
  chatInput.value = '';
  // Simple rule-based replies (replace with API call later)
  setTimeout(() => {
    const q = text.toLowerCase();
    if (q.includes('manali') || q.includes('shimla') || q.includes('himachal')) {
      appendBubble('Nice pick! Best time Oct–Mar. Want a calm itinerary or adventure heavy?');
    } else if (q.includes('budget') || q.includes('cheap') || q.includes('₹')) {
      appendBubble('Got it — budget noted. Prefer trains or cheap flights? I can compare sample options.');
    } else if (q.includes('plan') || q.includes('help')) {
      appendBubble('Tell me days + month + rough budget. I’ll make a mini plan for you.');
    } else {
      appendBubble('Sweet. Give me days + month + a rough budget and I’ll shape a mini-plan.');
    }
  }, 450);
}

chatSend.addEventListener('click', handleUserMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserMessage();
});

/* ==========================
   FUTURE: Hook to OpenAI / backend
   ==========================
   Replace the rule-based reply in handleUserMessage with a fetch() call to your backend
   which then calls OpenAI/GPT and returns the assistant reply.
   Keep messages appended using appendBubble().
*/
