const translations = {
    th: { title: "📅 SafeDays Pro", date: "วันแรกที่ประจำเดือนมา:", cycle: "รอบเดือนปกติ (วัน):", btn: "วิเคราะห์ความเสี่ยง", ovulation: "🥚 วันที่คาดว่าไข่จะตก:", nextMenses: "🩸 วันที่คาดว่าประจำเดือนจะมา:", riskH: "เสี่ยงสูง", riskM: "เสี่ยงปานกลาง", riskL: "เสี่ยงต่ำ", note: "⚠️ หมายเหตุ: หากประจำเดือนยังไม่หมดภายใน 7 วัน ควรหลีกเลี่ยงการมีเพศสัมพันธ์โดยไม่ป้องกัน", disclaimer: "🛡️ ข้อความปฏิเสธความรับผิดชอบ: ข้อมูลนี้เป็นเพียงการคำนวณตามสถิติเบื้องต้นเท่านั้น ผู้พัฒนาจะไม่รับผิดชอบต่อความผิดพลาดใดๆ ที่เกิดขึ้น โปรดใช้วิจารณญาณในการใช้งาน", warning: "*การคำนวณนี้ใช้เฉพาะกรณีประจำเดือนปกติเท่านั้น", donate: "☕ สนับสนุนนักพัฒนา", dmsg: "Scan QR เพื่อสนับสนุนค่าน้ำใจ", dsub: "(ชื่อจริงอาจแสดงในระบบธนาคาร)", clear: "ล้างข้อมูลทั้งหมด", comment: "💬 พูดคุย/สอบถาม", send: "ส่งข้อความ", reply: "ตอบกลับ", edit: "แก้ไข", del: "ลบ", days: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] },
    en: { title: "📅 SafeDays Pro", date: "First day of period:", cycle: "Cycle length:", btn: "Analyze Risk", ovulation: "🥚 Expected Ovulation:", nextMenses: "🩸 Expected Next Period:", riskH: "High Risk", riskM: "Medium", riskL: "Low Risk", note: "⚠️ Note: If period >7 days, avoid unprotected sex.", disclaimer: "🛡️ Disclaimer: This tool is for educational purposes. The developer is not responsible for any misuse or outcomes. Use at your own risk.", warning: "*Regular cycles only.", donate: "☕ Support", dmsg: "Scan QR to support", dsub: "(Real name may appear)", clear: "Clear All Data", comment: "💬 Discussion", send: "Send", reply: "Reply", edit: "Edit", del: "Delete", days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
};

window.onload = function() {
    loadComments();
    const savedDate = localStorage.getItem('lastDate');
    const savedCycle = localStorage.getItem('lastCycle');
    if(savedDate) document.getElementById('mensesDate').value = savedDate;
    if(savedCycle) document.getElementById('cycleDays').value = savedCycle || 28;
    changeLanguage();
    if(savedDate) calculateAll();
};

function changeLanguage() {
    const lang = document.getElementById('langSelect').value;
    const t = translations[lang] || translations['en'];
    document.getElementById('ui-title').innerHTML = `📅 SafeDays Pro <span class="beta-tag">BETA</span>`;
    document.getElementById('ui-label-date').innerText = t.date;
    document.getElementById('ui-label-cycle').innerText = t.cycle;
    document.getElementById('ui-btn').innerText = t.btn;
    document.getElementById('ui-ovulation-label').innerText = t.ovulation;
    document.getElementById('ui-next-menses-label').innerText = t.nextMenses;
    document.getElementById('ui-risk-h').innerText = t.riskH;
    document.getElementById('ui-risk-m').innerText = t.riskM;
    document.getElementById('ui-risk-l').innerText = t.riskL;
    document.getElementById('ui-note').innerHTML = t.note;
    document.getElementById('ui-disclaimer').innerHTML = t.disclaimer;
    document.getElementById('ui-warning').innerText = t.warning;
    document.getElementById('ui-donate-title').innerText = t.donate;
    document.getElementById('ui-donate-msg').innerText = t.dmsg;
    document.getElementById('ui-donate-sub').innerText = t.dsub;
    document.getElementById('ui-clear-btn').innerText = t.clear;
    document.getElementById('ui-comment-title').innerText = t.comment;
    document.getElementById('ui-send-btn').innerText = t.send;
}

function calculateAll() {
    const dValue = document.getElementById('mensesDate').value;
    const cycle = parseInt(document.getElementById('cycleDays').value);
    if(!dValue || isNaN(cycle)) return;
    localStorage.setItem('lastDate', dValue);
    localStorage.setItem('lastCycle', cycle);
    const start = new Date(dValue);
    const ovulationDate = new Date(start);
    ovulationDate.setDate(start.getDate() + (cycle - 14));
    const nextMensesDate = new Date(start);
    nextMensesDate.setDate(start.getDate() + cycle);
    document.getElementById('ovulationDateText').innerText = ovulationDate.toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});
    document.getElementById('nextMensesDateText').innerText = nextMensesDate.toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});
    document.getElementById('resultArea').style.display = 'block';
    renderDualCalendar(start, cycle);
}

function renderDualCalendar(startDate, cycle) {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = "";
    const m1 = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    container.appendChild(createMonthUI(m1, startDate, cycle));
    const m2 = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    container.appendChild(createMonthUI(m2, startDate, cycle));
}

function createMonthUI(monthDate, baseStartDate, cycle) {
    const lang = document.getElementById('langSelect').value;
    const t = translations[lang] || translations['en'];
    const wrapper = document.createElement('div');
    wrapper.className = "month-wrapper";
    const title = document.createElement('h3');
    title.className = "calendar-month-title";
    title.innerText = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    wrapper.appendChild(title);
    const header = document.createElement('div');
    header.className = "calendar-days-header";
    header.innerHTML = t.days.map(d => `<div>${d}</div>`).join('');
    wrapper.appendChild(header);
    const grid = document.createElement('div');
    grid.className = "mini-calendar";
    const firstDay = monthDate.getDay();
    const totalDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    for(let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));
    for(let day = 1; day <= totalDays; day++) {
        const curr = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        const div = document.createElement('div');
        div.className = 'day-box';
        div.innerText = day;
        const diffDays = Math.ceil((curr.getTime() - baseStartDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 6) div.classList.add('color-green'); 
        else if (diffDays >= (cycle - 21) && diffDays <= (cycle - 11)) div.classList.add('color-red');
        else if (diffDays >= (cycle - 7) && diffDays < cycle) div.classList.add('color-green');
        else if (diffDays > 6 && diffDays < (cycle - 21)) div.classList.add('color-yellow');
        grid.appendChild(div);
    }
    wrapper.appendChild(grid);
    return wrapper;
}

// --- ฟังก์ชันใหม่ที่เพิ่มเข้ามา ---
function exportToGoogle() {
    const dVal = document.getElementById('mensesDate').value;
    const cycle = parseInt(document.getElementById('cycleDays').value);
    if(!dVal) return;
    const d = new Date(dVal);
    d.setDate(d.getDate() + (cycle - 14));
    const iso = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ovulation+Day&dates=${iso}/${iso}`, '_blank');
}

function exportToApple() {
    const dVal = document.getElementById('mensesDate').value;
    const cycle = parseInt(document.getElementById('cycleDays').value);
    if(!dVal) return;
    const d = new Date(dVal);
    d.setDate(d.getDate() + (cycle - 14));
    const stamp = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${stamp}\nDTEND:${stamp}\nSUMMARY:Ovulation Day\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], {type: 'text/calendar'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ovulation.ics'; a.click();
}

function clearAllData() {
    if(confirm("ยืนยันการล้างข้อมูลทั้งหมด?")) {
        localStorage.clear();
        location.reload();
    }
}

// --- ระบบ Comment (คงเดิม) ---
let comments = [];
function loadComments() {
    const saved = localStorage.getItem('safeDaysComments');
    if(saved) { comments = JSON.parse(saved); renderAllComments(); }
}
function saveComments() { localStorage.setItem('safeDaysComments', JSON.stringify(comments)); }
function addMainComment() {
    const name = document.getElementById('mainName').value || "Anonymous";
    const text = document.getElementById('mainText').value;
    if(!text) return;
    comments.unshift({ id: Date.now(), name, text, replies: [] });
    saveComments(); renderAllComments();
    document.getElementById('mainText').value = "";
}
function renderAllComments() {
    document.getElementById('commentList').innerHTML = comments.map(c => createCommentHTML(c)).join('');
}
function createCommentHTML(c, isReply = false) {
    const lang = document.getElementById('langSelect').value;
    const t = translations[lang] || translations['en'];
    return `
        <div class="comment-item" style="${isReply ? 'margin-left:20px; border-left:2px solid #ff4d94;' : ''}">
            <strong>${c.name}</strong>: <p>${c.text}</p>
            <div class="comment-btns">
                ${!isReply ? `<button onclick="showReplyBox(${c.id})">${t.reply}</button>` : ''}
                <button onclick="editComment(${c.id})">${t.edit}</button>
                <button onclick="deleteComment(${c.id})" style="background:#ff4d4d; color:white;">${t.del}</button>
            </div>
            <div id="reply-area-${c.id}">${c.replies ? c.replies.map(r => createCommentHTML(r, true)).join('') : ''}</div>
        </div>`;
}
function deleteComment(id) {
    if(!confirm("ลบข้อความนี้ใช่ไหม?")) return;
    comments = comments.filter(c => {
        if(c.id === id) return false;
        c.replies = c.replies.filter(r => r.id !== id);
        return true;
    });
    saveComments(); renderAllComments();
}
function editComment(id) {
    const nt = prompt("แก้ไขข้อความ:");
    if(!nt) return;
    comments.forEach(c => { if(c.id === id) c.text = nt; c.replies.forEach(r => { if(r.id === id) r.text = nt; }); });
    saveComments(); renderAllComments();
}
function showReplyBox(id) {
    if(document.getElementById(`reply-input-${id}`)) return;
    const box = `<div id="reply-input-${id}" class="reply-box"><input type="text" id="rn-${id}" placeholder="ชื่อ"><textarea id="rt-${id}" placeholder="ข้อความตอบกลับ"></textarea><button onclick="submitReply(${id})">ส่ง</button></div>`;
    document.getElementById(`reply-area-${id}`).insertAdjacentHTML('beforebegin', box);
}
function submitReply(pid) {
    const n = document.getElementById(`rn-${pid}`).value || "Anonymous";
    const t = document.getElementById(`rt-${pid}`).value;
    const p = comments.find(c => c.id === pid);
    if(p && t) { p.replies.push({ id: Date.now(), name: n, text: t }); saveComments(); renderAllComments(); }
}