// Initialize Lucide icons
lucide.createIcons();

// --- MULTI-USER STATE MANAGEMENT ---
let currentUser = null;
let isSignUpMode = false;
let cycleHistory = [];
let userReminders = [];
window.currentRiskScore = 0;
window.currentScanResult = null;

function saveData() {
    if (!currentUser) return;
    const userData = {
        cycleHistory: cycleHistory,
        userReminders: userReminders
    };
    localStorage.setItem(`flowsense_data_${currentUser}`, JSON.stringify(userData));
}

function loadUserData(username) {
    const data = JSON.parse(localStorage.getItem(`flowsense_data_${username}`)) || {
        cycleHistory: [{ id: 1, start: '2026-02-03', end: '2026-02-07' }],
        userReminders: []
    };
    cycleHistory = data.cycleHistory;
    userReminders = data.userReminders;
}

// --- REMINDERS SYSTEM ---
const reminderMessages = [
    "Don't forget to hydrate today! 💧",
    "Time for a gentle 5-minute walk! 🌸",
    "Cuddle up with a warm heating pad. 💖",
    "A piece of dark chocolate would be perfect. 🍫",
    "Try a quick Child's Pose for 2 minutes. ✨",
    "Rest is productive too, Gorgeous! 😴",
    "Check your iron levels if you feel dizzy. 🥦",
    "Warm herbal tea is a great friend today. 🍵"
];

function updateQuickReminder() {
    const el = document.getElementById('dynamic-reminder');
    if (!el) return;
    let pool = [...reminderMessages];
    if (userReminders.length > 0) pool = [...pool, ...userReminders];
    el.innerText = pool[Math.floor(Math.random() * pool.length)];
}

function addCustomReminder() {
    const input = document.getElementById('custom-reminder-input');
    const text = input.value.trim();
    if (text === "") return alert("Please type your magical note first! 🌸");
    userReminders.push(text);
    input.value = "";
    saveData();
    renderCustomReminders();
    updateQuickReminder();
    triggerSparkle();
}

function renderCustomReminders() {
    const list = document.getElementById('custom-reminders-list');
    if (!list) return;
    list.innerHTML = "";
    userReminders.forEach((rem, index) => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.padding = '1rem';
        item.style.fontSize = '0.85rem';
        item.style.background = 'var(--pale-lavender)';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.marginBottom = '0.5rem';
        item.innerHTML = `<span>✨ ${rem}</span><button onclick="deleteCustomReminder(${index})" style="background:none; border:none; color:var(--deep-pink); cursor:pointer; font-size:1.2rem;">✕</button>`;
        list.appendChild(item);
    });
}

function deleteCustomReminder(index) {
    userReminders.splice(index, 1);
    saveData();
    renderCustomReminders();
    updateQuickReminder();
}

// --- DIET SYSTEM ---
const dietPool = {
    'general': [
        "Include <strong>omega-3</strong> rich foods like walnuts and chia seeds to balance hormones.",
        "Focus on <strong>lean protein</strong> from eggs or tofu for sustained energy.",
        "Eat <strong>fiber-rich</strong> whole grains to help eliminate excess estrogen.",
        "Include <strong>vibrant plant foods</strong> like bell peppers for a natural antioxidant boost."
    ],
    'cramping': [
        "Consume <strong>anti-inflammatory berries</strong> like blueberries to lower prostaglandin levels.",
        "Snack on <strong>magnesium-rich pumpkin seeds</strong> to help relax uterine muscles.",
        "Drink <strong>ginger or chamomile tea</strong>; ginger lowers inflammation just like NSAIDs!",
        "Incorporate <strong>turmeric</strong> with black pepper into your meals for powerful pain relief."
    ],
    'heavy-flow': [
        "Focus on <strong>iron-rich spinach, kale, and beans</strong> to replenish blood loss and prevent anemia.",
        "Pair your iron meals with <strong>citrus fruits (Vitamin C)</strong> like oranges to double your absorption rate.",
        "Eat <strong>Vitamin K</strong> rich foods like broccoli and cheese to support healthy clotting.",
        "Increase <strong>Vitamin B12</strong> intake through fortified cereals or eggs to support red blood cell health.",
        "Consume <strong>Molasses or Tofu</strong> as they are excellent non-meat sources of iron."
    ],
    'fatigue': [
        "Opt for <strong>complex carbohydrates</strong> like sweet potatoes or quinoa for steady energy release.",
        "Include <strong>B-vitamin rich</strong> fish, eggs, or poultry to support metabolic energy production.",
        "Snack on <strong>dark chocolate (70%+)</strong> for a quick magnesium and endorphin boost.",
        "Hydrate with <strong>electrolytes</strong> from coconut water or intentional fruit intake.",
        "Add <strong>Greek Yogurt</strong> to your breakfast for a stable blood sugar start to your day."
    ],
    'indian': [
        "Sip on <strong>Jeera Water</strong> or <strong>Ajwain Tea</strong> to reduce bloating and digestive discomfort.",
        "Eat <strong>Iron-rich Ragi Malt</strong> or Ragi Rotis to boost hemoglobin levels.",
        "Include <strong>Drumstick (Moringa)</strong> leaves in your dal for a natural energy and iron boost.",
        "Snack on <strong>Roasted Makhana</strong>; they are low-calorie and excellent for hormonal balance.",
        "Drink <strong>Haldi Doodh</strong> (Turmeric Milk) at night to reduce inflammatory pain and aid sleep.",
        "Consume <strong>Khichdi</strong> with ghee for a light, easily digestible meal that provides comfort."
    ]
};

function generateDailyDiet() {
    const score = window.currentRiskScore || 0;
    const flow = document.getElementById('app-flow') ? document.getElementById('app-flow').value : 'moderate';

    let condition = 'general';
    if (flow === 'heavy') {
        condition = 'heavy-flow';
    } else if (score >= 9) {
        condition = 'fatigue';
    } else if (score >= 5) {
        condition = 'cramping';
    }

    const plans = dietPool[condition];
    const indianPlans = dietPool['indian'];
    const target = document.getElementById('dynamic-diet-content');
    if (!target) return;

    let shuffled = [...plans].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 1);
    
    let indianShuffled = [...indianPlans].sort(() => 0.5 - Math.random());
    let indianSelected = indianShuffled.slice(0, 1);

    target.innerHTML = `
        <h4 style="margin-bottom: 1rem; color: var(--deep-pink); display: flex; align-items: center; gap: 8px;">
            <i data-lucide="sparkles" style="width: 18px;"></i>
            Dietary Plan for ${condition.replace('-', ' ')}
        </h4>
        <p style="font-size: 0.9rem; line-height: 1.8; margin-bottom: 1.5rem;">
            Clinical & Traditional Indian Nutrients:
        </p>
        <ul style="padding-left: 0; font-size: 0.9rem; line-height: 1.6;">
            <li style="margin-bottom: 15px; background: rgba(240, 98, 146, 0.05); padding: 12px; border-radius: 12px; list-style: none; position: relative; padding-left: 45px;">
                <span style="position: absolute; left: 15px; font-size: 1.2rem;">🥗</span> ${selected[0]}
            </li>
            <li style="margin-bottom: 15px; background: rgba(144, 202, 249, 0.1); padding: 12px; border-radius: 12px; list-style: none; position: relative; padding-left: 45px;">
                <span style="position: absolute; left: 15px; font-size: 1.2rem;">🇮🇳</span> ${indianSelected[0]}
            </li>
        </ul>
        <div style="margin-top: 1rem; padding: 10px; background: var(--pale-lavender); border-radius: 10px; font-size: 0.8rem; color: var(--text-dark);">
            <b>Scientific Tip:</b> Every time you refresh, we pull different insights for your ${condition} state.
        </div>
    `;
    lucide.createIcons();
    triggerSparkle();
}

// --- INSIGHTS ENGINE ---
function updateInsights() {
    const target = document.getElementById('tab-insights');
    if (!target) return;

    const cycleCount = cycleHistory.length;
    let avgLength = 0;
    if (cycleCount > 0) {
        avgLength = Math.round(cycleHistory.reduce((acc, curr) => {
            const s = new Date(curr.start);
            const e = new Date(curr.end);
            return acc + (e - s) / (1000 * 60 * 60 * 24) + 1;
        }, 0) / cycleCount);
    }

    target.innerHTML = `
        <header style="margin-bottom: 2.5rem;">
            <h2 class="text-gradient">Health Insights & AI Analysis</h2>
            <p>A deep dive into your cycle health patterns.</p>
        </header>
        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 2.5rem;">
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                <div class="card" style="background: var(--gradient-primary); text-align: center; border: none;">
                    <i data-lucide="activity" style="width: 40px; height: 40px; margin-bottom: 1rem; color: var(--text-dark);"></i>
                    <h5 style="text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Avg. Period Duration</h5>
                    <h2 style="font-size: 2.5rem; margin-top: 0.5rem;">${avgLength} Days</h2>
                </div>
                <div class="card" style="border-left: 5px solid var(--cute-purple);">
                    <h4>Predictive Stability</h4>
                    <p style="font-size: 0.85rem; margin-top: 1rem;">Based on your last <b>${cycleCount}</b> entries, your cycle appears <b>Regular</b>. This indicates healthy hormonal balance.</p>
                </div>
            </div>
                <div class="card">
                <h4>AI Health Summary ✨</h4>
                <p style="margin-top: 1.5rem; line-height: 1.8; font-size: 0.9rem;">
                    FlowSense AI has analyzed your history. 
                    ${cycleCount > 0 ? `Your "Fresh Flow" frequency is observed at <b>${avgLength} days</b>. ` : ''}
                    
                    ${avgLength > 35 || avgLength < 21 ? 
                        `⚠️ <strong>Clinical Observation:</strong> Your cycle length is currently outside the typical 21-35 day range. This variability, combined with any flow irregularities, may indicate hormonal imbalances like <b>PCOS (Polycystic Ovary Syndrome)</b> or <b>PCOD</b>. ` : 
                        `Your patterns suggest typical clinical PMS ranges. `}
                    
                    <br><br>
                    🌸 <strong>Way Forward:</strong> Regular tracking helps identify PCOS trends early. If you experience excessive facial hair growth or severe acne, we recommend a clinical screening for PCOD.
                </p>
                <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <div class="badge badge-low">PH BALANCE: OPTIMAL</div>
                    <div class="badge badge-mod">ENERGY: MODERATE</div>
                    <div class="badge badge-low">HYDRATION: GOOD</div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// --- AUTH LOGIC (Multi-User) ---
function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    const title = document.getElementById('login-title');
    const subtitle = document.getElementById('login-subtitle');
    const authBtn = document.getElementById('auth-btn');
    const toggleText = document.getElementById('toggle-text');
    const toggleBtn = document.getElementById('toggle-btn');

    if (isSignUpMode) {
        title.innerText = "Welcome, Goddess! ✨";
        subtitle.innerText = "Create your magical account.";
        authBtn.innerText = "Join the Circle 🪄";
        toggleText.innerText = "Already an expert?";
        toggleBtn.innerText = "Log In 🌸";
    } else {
        title.innerText = "Hello, Gorgeous! 🌸";
        subtitle.innerText = "Unlock your clinical cycle tracker.";
        authBtn.innerText = "Step Inside ✨";
        toggleText.innerText = "New here?";
        toggleBtn.innerText = "Sign Up 🪄";
    }
}

function handleAuth() {
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;

    if (username === "" || password.length < 4) {
        return alert("Please enter a valid name and a code (min 4 chars)! 🌸");
    }

    let users = JSON.parse(localStorage.getItem('flowsense_users')) || {};

    if (isSignUpMode) {
        if (users[username]) {
            return alert("This name is already taken! Try something even more unique. ✨");
        }
        users[username] = password;
        localStorage.setItem('flowsense_users', JSON.stringify(users));
        alert("Account created successfully! Welcome to FlowSense. 💖");
        isSignUpMode = false;
        toggleAuthMode();
    } else {
        if (users[username] && users[username] === password) {
            currentUser = username;
            loadUserData(username);
            document.getElementById('login-overlay').style.display = 'none';
            document.querySelectorAll('.app-tab h2').forEach(h => {
                if (h.innerText.includes("Sarah") || h.innerText.includes("Welcome back")) {
                    h.innerText = `Welcome back, ${currentUser} ✨`;
                }
            });
            renderCalendar();
            renderCustomReminders();
            updateQuickReminder();
            triggerSparkle();
        } else {
            alert("Oops! Wrong name or magical code. Try again, Gorgeous! 🌸");
        }
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('login-user').value = "";
    document.getElementById('login-pass').value = "";
    isSignUpMode = true; // Set to true so toggleAuthMode() makes it false (Login)
    toggleAuthMode();
}

function triggerSparkle() {
    const s = document.createElement('div');
    s.innerText = "✨ Magic Activated! ✨";
    s.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); padding:1.5rem 2rem; background:var(--gradient-cute); color:white; border-radius:50px; z-index: 100000; box-shadow:var(--hover-shadow); animation:float 1.5s ease-in-out forwards; font-weight:800;`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1500);
}

// --- TAB NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('.app-tab').forEach(tab => tab.style.display = 'none');
    const targetTab = document.getElementById('tab-' + tabId);
    if (targetTab) targetTab.style.display = 'block';

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabId)) { item.classList.add('active'); }
    });

    if (tabId === 'tracker') renderCalendar();
    if (tabId === 'diet') generateDailyDiet();
    if (tabId === 'insights') updateInsights();
    updateQuickReminder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- AI SCAN LOGIC (Consistent Canvas Analysis) ---
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        } h /= 6;
    } return { h: h * 360, s: s * 100, l: l * 100 };
}

function analyzeImageColor() {
    const img = document.getElementById('scan-preview');
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const size = Math.min(50, canvas.width, canvas.height);
    const data = ctx.getImageData(centerX - size / 2, centerY - size / 2, size, size).data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; count++; }

    const { h, s, l } = rgbToHsl(r / count, g / count, b / count);
    let result = 'bright-red';
    if (l < 25) { result = 'blackish'; }
    else if (l < 40 && h < 35) { result = 'dark-red'; }
    else if (h >= 10 && h <= 50 && s < 60) { result = 'brown'; }
    window.currentScanResult = result;

    const hexMap = { 'bright-red': '#FF4081', 'dark-red': '#C2185B', 'brown': '#795548', 'blackish': '#212121' };
    const nameMap = { 'bright-red': 'Bright Red', 'dark-red': 'Dark Red', 'brown': 'Brownish', 'blackish': 'Blackish Alert' };
    document.getElementById('detected-color-box').style.background = hexMap[result];
    document.getElementById('detected-color-name').innerText = nameMap[result];
    document.getElementById('detected-info').innerText = translations[result]['en-US'];
}

function previewScan(event) {
    if (!event.target.files || !event.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('scan-preview').src = e.target.result;
        document.getElementById('scan-preview-container').style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
        document.getElementById('analyze-btn').style.display = 'block';
        document.getElementById('scan-result-box').style.display = 'none';
    }; reader.readAsDataURL(event.target.files[0]);
}

function startAIScan() {
    const line = document.getElementById('scan-line');
    line.style.display = 'block';
    document.getElementById('scan-status').innerText = "Analyzing clinical indicators... 🌸";
    setTimeout(() => {
        analyzeImageColor();
        document.getElementById('scan-result-box').style.display = 'block';
        document.getElementById('scan-status').innerText = "Scan complete! ✨";
        line.style.display = 'none';
        triggerSparkle();
    }, 2500);
}

function speakResult() {
    if (!window.currentScanResult) return;
    const lang = document.getElementById('tts-lang').value;
    const utter = new SpeechSynthesisUtterance(translations[window.currentScanResult][lang] || translations[window.currentScanResult]['en-US']);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
}



function updateNextPeriodCountdown() {
    const el = document.getElementById('next-period-countdown');
    if (!el || cycleHistory.length === 0) {
        if (el) el.innerText = "-- Days";
        return;
    }

    // Sort by start date ascending
    const sorted = [...cycleHistory].sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Calculate average cycle length (gap between starts)
    let avgCycle = 28;
    if (sorted.length > 1) {
        let totalGap = 0;
        for (let i = 1; i < sorted.length; i++) {
            const currentStart = new Date(sorted[i].start);
            const prevStart = new Date(sorted[i-1].start);
            totalGap += (currentStart - prevStart) / (1000 * 60 * 60 * 24);
        }
        avgCycle = Math.round(totalGap / (sorted.length - 1));
    }

    // Predicted start = latest start + avgCycle
    const latestStart = new Date(sorted[sorted.length - 1].start);
    const predicted = new Date(latestStart);
    predicted.setDate(latestStart.getDate() + avgCycle);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = predicted - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        el.innerText = "Overdue";
    } else if (diffDays === 0) {
        el.innerText = "Today! 🩸";
    } else {
        el.innerText = `${diffDays} Days`;
    }
}

// --- CALENDAR LOGIC ---
function renderCalendar() {
    const grid = document.getElementById('calendar-days');
    if (!grid) return; grid.innerHTML = "";
    document.getElementById('current-month').innerText = currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const h = document.createElement('div'); h.className = 'day-name'; h.innerText = d; grid.appendChild(h);
    });
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div')).className = 'day-empty';
    for (let d = 1; d <= days; d++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), d, 12);
        const dStr = date.toISOString().split('T')[0];
        const el = document.createElement('div'); el.className = 'day'; el.innerText = d;
        if (cycleHistory.some(c => dStr >= c.start && dStr <= c.end)) { el.classList.add('period'); el.innerHTML += '<div style="font-size:10px;">🩸</div>'; }
        grid.appendChild(el);
    }
    renderHistoryList();
    updateNextPeriodCountdown();
}

function renderHistoryList() {
    const list = document.getElementById('cycle-history-list');
    if (!list) return; list.innerHTML = "";
    cycleHistory.slice().reverse().forEach(c => {
        const item = document.createElement('div');
        item.className = 'card'; item.style.cssText = `padding:1rem; display:flex; justify-content:space-between; align-items:center; background:var(--soft-pink); margin-top:0.5rem; border: none;`;
        item.innerHTML = `<div style="font-size:0.85rem; font-weight:700;"><i data-lucide="calendar" style="width:14px; margin-right:5px;"></i> ${c.start} to ${c.end}</div><button onclick="deleteCycle(${c.id})" style="background:none; border:none; color:var(--deep-pink); cursor:pointer;"><i data-lucide="trash-2" style="width:18px;"></i></button>`;
        list.appendChild(item);
    }); lucide.createIcons();
}

function logPeriodDates() {
    const s = document.getElementById('period-start').value, e = document.getElementById('period-end').value;
    if (!s || !e) return alert("Select dates! 🌸");
    cycleHistory.push({ id: Date.now(), start: s, end: e });
    saveData(); renderCalendar(); triggerSparkle(); updateNextPeriodCountdown();
}

function deleteCycle(id) {
    if (confirm("Delete this entry? 🌸")) { cycleHistory = cycleHistory.filter(c => c.id !== id); saveData(); renderCalendar(); triggerSparkle(); updateNextPeriodCountdown(); }
}

function runAppAnalysis() {
    const color = document.getElementById('app-color').value;
    const flow = document.getElementById('app-flow').value;
    const isPainful = document.getElementById('app-pain').checked;
    const isFatigued = document.getElementById('app-fatigue').checked;
    
    // Scoring logic
    const score = (color === 'blackish' ? 5 : 0) + (flow === 'heavy' ? 4 : (flow === 'light' ? 1 : 2)) + (isPainful ? 4 : 0) + (isFatigued ? 2 : 0);
    window.currentRiskScore = score;
    
    const b = document.getElementById('app-risk-badge');
    const recs = document.getElementById('app-recommendations');
    
    let riskLevel = score >= 10 ? "HIGH" : (score >= 6 ? "MODERATE" : "LOW");
    b.innerText = riskLevel + " RISK ✨";
    b.className = `badge badge-${riskLevel.toLowerCase()}`;

    // Detailed Content Mapping
    const colorImpact = {
        'bright-red': "<strong>Fresh Flow:</strong> Your current color indicates healthy, oxygenated blood flow.",
        'dark-red': "<strong>Standard Flow:</strong> This color is typical for midway through a cycle as blood oxygenates.",
        'pink': "<strong>Hormonal Shift:</strong> Pinkish blood often indicates light flow or low estrogen levels.",
        'brown': "<strong>Old Flow:</strong> Typical at the start or end of your period as old blood leaves the uterus.",
        'blackish': "🚨 <strong>Infection Alert:</strong> Blackish or grayish blood, especially if accompanied by a strong odor or pain, can be a clinical indicator of <b>retained blood</b> or an <b>infection</b> like BV. Immediate gynecological consultation is advised."
    };

    const flowImpact = {
        'light': "<strong>Flow Analysis (Light):</strong> Minimal blood loss. This is normal for the start/end or if you are on specific hormonal contraceptives. If consistently light, it may indicate 'Scanty Periods'.",
        'moderate': "<strong>Flow Analysis (Moderate):</strong> Clinical baseline. You are within the healthy range of 30-50ml total blood loss per cycle.",
        'heavy': "<strong>Flow Analysis (Heavy):</strong> Significant blood loss detected. <b>Menorrhagia</b> risk is high. This can lead to Iron-Deficiency Anemia and is often associated with <b>PCOS/PCOD</b> or Fibroids."
    };

    let reportHTML = `
        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            <div class="card" style="background: rgba(240, 98, 146, 0.03); padding: 1rem; border-left: 4px solid var(--deep-pink);">
                <p style="font-size: 0.85rem; line-height: 1.6;">${colorImpact[color]}</p>
            </div>
            <div class="card" style="background: rgba(156, 39, 176, 0.03); padding: 1rem; border-left: 4px solid var(--accent-purple);">
                <p style="font-size: 0.85rem; line-height: 1.6;">${flowImpact[flow]}</p>
            </div>
        </div>
    `;

    if (flow === 'heavy' && isPainful) {
        reportHTML += `
            <div style="margin-top: 1rem; padding: 12px; background: #fff5f8; border: 1px dashed #ff4d4d; border-radius: 12px;">
                <p style="font-size: 0.8rem; color: #d32f2f;">
                    ⚠️ <strong>Clinical Note on PCOD/PCOS:</strong> The combination of extremely heavy flow and acute pain is a primary indicator for hormonal testing. Consider tracking these symptoms for 3 cycles and sharing this log with a specialist.
                </p>
            </div>
        `;
    }

    recs.innerHTML = reportHTML;
    triggerSparkle();
}

function prevMonth() { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); }
function nextMonth() { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); }

// --- TRANSLATIONS (EN, HI, TA, TE) ---
const translations = {
    'bright-red': {
        'en-US': "Bright Red flow detected. Healthy and normal.",
        'hi-IN': "चमकीला लाल रंग पाया गया। स्वस्थ और सामान्य।",
        'ta-IN': "பிரகாசமான சிவப்பு ரத்தம் கண்டறியப்பட்டது. ஆரோக்கியமானது.",
        'te-IN': "ప్రకాశవంతమైన ఎరుపు రక్తం కనుగొనబడింది. ఆరోగ్యకరమైనది."
    },
    'dark-red': {
        'en-US': "Dark Red detected. Typical oxidized flow.",
        'hi-IN': "गहरा लाल रंग पाया गया। ऑक्सीकृत प्रवाह।",
        'ta-IN': "அடர் சிவப்பு கண்டறியப்பட்டது. ஆக்ஸிஜனேற்றப்பட்ட ரத்தம்.",
        'te-IN': "ముదురు ఎరుపు కనుగొనబడింది. ఆక్సిడైజ్డ్ రక్తం."
    },
    'brown': {
        'en-US': "Brown color detected. Normal old blood.",
        'hi-IN': "भूरा रंग पाया गया। सामान्य पुराना रक्त।",
        'ta-IN': "பழுப்பு நிறம் கண்டறியப்பட்டது. பழைய ரத்தம்.",
        'te-IN': "గోధుమ రంగు కనుగొనబడింది. పాత రక్తం."
    },
    'pink': {
        'en-US': "Pinkish color detected. Often signals light flow or hormonal shifts.",
        'hi-IN': "गुलाबी रंग पाया गया। यह अक्सर हल्के रंग के प्रवाह का संकेत देता है।",
        'ta-IN': "இளஞ்சிவப்பு நிறம் கண்டறியப்பட்டது. இது பெரும்பாலும் லேசான ரத்த ஓட்டத்தைக் குறிக்கிறது.",
        'te-IN': "పింక్ రంగు కనుగొనబడింది. ఇది తరచుగా తక్కువ రక్త ప్రవాహాన్ని తెలియజేస్తుంది."
    },
    'blackish': {
        'en-US': "Alert: Blackish color. Consult a doctor if pain persists.",
        'hi-IN': "चेतावनी: काला रंग। दर्द होने पर डॉक्टर से मिलें।",
        'ta-IN': "எச்சரிக்கை: கருப்பு நிறம். வலி இருந்தால் மருத்துவரை அணுகவும்.",
        'te-IN': "హెచ్చరిక: నలుపు రంగు. నొప్పి ఉంటే వైద్యుడిని సంప్రదించండి."
    }
};

let currentDate = new Date();

window.onload = () => { updateQuickReminder(); };
// Exporting
Object.assign(window, { handleAuth, toggleAuthMode, handleLogout, switchTab, previewScan, startAIScan, speakResult, logPeriodDates, deleteCycle, prevMonth, nextMonth, runAppAnalysis, generateDailyDiet, addCustomReminder, deleteCustomReminder, renderCustomReminders, updateInsights });
