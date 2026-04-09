// Initialize Lucide icons
lucide.createIcons();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Risk Assessment Logic
function analyzeSymptoms() {
    const color = document.getElementById('symptom-color').value;
    const flow = document.getElementById('symptom-flow').value;
    const clots = document.getElementById('symptom-clots').value;
    const fatigue = document.getElementById('symptom-fatigue').checked;
    const smell = document.getElementById('symptom-smell').checked;

    let score = 0;
    const recommendations = [];

    // Blood Color Logic
    if (color === 'blackish') {
        score += 4;
        recommendations.push("Blackish or grayish blood may indicate an older flow or a potential infection. Monitor for fever.");
    } else if (color === 'brown' || color === 'pink' || color === 'dark-red') {
        score += 1;
        if (color === 'brown') recommendations.push("Brown discharge is often old blood but can indicate hormonal shifts if frequent.");
    }

    // Flow Intensity Logic
    if (flow === 'heavy') {
        score += 3;
        recommendations.push("Heavy flow requires monitoring iron levels to prevent fatigue.");
    } else if (flow === 'moderate') {
        score += 1;
    }

    // Clots Logic
    if (clots === 'large') {
        score += 5;
        recommendations.push("Large clots (quarter-sized or larger) can be a sign of uterine fibroids or hormonal imbalance.");
    } else if (clots === 'small') {
        score += 1;
    }

    // Systemic Symptoms
    if (fatigue) {
        score += 3;
        if (flow === 'heavy') {
            recommendations.push("<strong>Potential Anemia Risk:</strong> High flow coupled with fatigue suggests iron deficiency. Consider an iron test.");
        } else {
            recommendations.push("Significant fatigue during cycles might indicate hormonal fluctuations or underlying stress.");
        }
    }

    if (smell) {
        score += 6;
        recommendations.push("<strong>Potential Infection Alert:</strong> Unusual smell is a strong indicator of bacterial or yeast concerns. Consultation recommended.");
    }

    // Update UI
    updateDashboard(score, recommendations);
}

function updateDashboard(score, recommendations) {
    const meter = document.getElementById('meter-pointer');
    const scoreText = document.getElementById('risk-score-text');
    const badge = document.getElementById('risk-badge');
    const title = document.getElementById('risk-title');
    const desc = document.getElementById('risk-desc');
    const list = document.getElementById('risk-items');

    // Clamp score to 12 max for visual meter
    const visualScore = Math.min(score, 12);
    const rotation = (visualScore / 12) * 180;
    
    // Apply rotation to meter (conic gradient starts from 0 to 180)
    // We'll use a CSS variable to make it smoother
    meter.style.transform = `rotate(${rotation}deg)`;
    scoreText.innerText = score;

    // Reset classes
    badge.className = 'badge';
    list.innerHTML = "";

    if (score < 5) {
        badge.innerText = "LOW RISK";
        badge.classList.add('badge-low');
        title.innerText = "Baseline Health: Stable";
        desc.innerText = "Your symptoms appear to be within normal clinical ranges. Continue monitoring your cycle habits.";
        if (recommendations.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = "Everything looks normal based on your inputs. Keep maintaining a healthy lifestyle.";
            list.appendChild(li);
        }
    } else if (score < 9) {
        badge.innerText = "MODERATE RISK";
        badge.classList.add('badge-mod');
        title.innerText = "Monitor Patterns";
        desc.innerText = "Some indicators suggest a need for closer observation over the next 1-2 cycles.";
    } else {
        badge.innerText = "HIGH RISK";
        badge.classList.add('badge-high');
        title.innerText = "Clincial Review Recommended";
        desc.innerText = "Multiple indicators suggest potential underlying health conditions. We advise speaking with a gynecologist.";
    }

    // Populate recommendations list
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = rec;
        li.style.marginBottom = "0.5rem";
        list.appendChild(li);
    });

    // Scroll to results on mobile
    if (window.innerWidth < 768) {
        document.querySelector('.risk-results').scrollIntoView({ behavior: 'smooth' });
    }
}

// Add simple hover effect for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--accent-purple)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'rgba(248, 187, 208, 0.2)';
    });
});
