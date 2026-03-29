require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ── Track user sessions ────────────────────────
const userSessions = {};

// ── Complete CliEvi Chatbot Logic ──────────────
function getBotResponse(message, userId) {
    const msg = message.trim().toLowerCase();
    const isNewUser = !userSessions[userId];

    // ── New User OR Empty Message OR Any First Message ──
    if (isNewUser || msg === '' || msg === ' ') {
        userSessions[userId] = true;
        return 'Hello! 👋 Welcome to *CliEvi*!\n\nClinical and Evidence-Based Research Services.\n\nType *menu* to see all options!';
    }

    // ── Main Menu ──
    if (msg.includes('menu') || msg.includes('options') || msg.includes('help') || msg.includes('start') || msg.includes('back')) {
        return '📋 *CliEvi Main Menu:*\n\n1. RWE, HEOR & Data Analytics\n2. Clinical Research & Regulatory Support\n3. Medical Writing & Research Consulting\n4. Statistical & Analytical Services\n5. Global Data Services\n6. Additional Services\n7. Process / How It Works\n8. Timeline & Delivery\n9. Pricing & Quote\n10. Contact Us\n\nReply with a *number (1-10)*!';

    // ── Greetings ──
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good evening') || msg.includes('good afternoon') || msg.includes('namaste') || msg.includes('namaskar') || msg.includes('salam') || msg.includes('assalam')) {
        return 'Hello! 👋 Welcome to *CliEvi*!\n\nClinical and Evidence-Based Research Services.\n\nType *menu* to see all options!';

    // ── Services Menu ──
    } else if (msg === '1' || msg.includes('rwe') || msg.includes('real world') || msg.includes('heor') || msg.includes('health economic') || msg.includes('hta')) {
        return '🔬 *RWE, HEOR & Data Analytics:*\n\nSelect a service:\n\nA. RWE Patient Data Analysis\nB. Evidence Synthesis\nC. Electronic Records Analyses\nD. Health Economic Outcomes Research (HEOR)\nE. Health Technology Assessments (HTA)\nF. Burden of Disease Analysis\nG. Patient Treatment Pathway\nH. Global Data Services\n\nReply *A to H* or type *menu* to go back!';

    } else if (msg === '2' || msg.includes('clinical') || msg.includes('csr') || msg.includes('regulatory') || msg.includes('trial') || msg.includes('cdisc') || msg.includes('epidemiology')) {
        return '🏥 *Clinical Research Services:*\n\nSelect a service:\n\nA. Clinical Study Reports (CSR)\nB. Regulatory Writing Services\nC. Clinical Trial Support\nD. Systematic Review & Meta-analysis\nE. Resource Utilization & Epidemiology Analysis\nF. CDISC SEND Services\n\nReply *A to F* or type *menu* to go back!';

    } else if (msg === '3' || msg.includes('writing') || msg.includes('manuscript') || msg.includes('literature') || msg.includes('prospero') || msg.includes('pico') || msg.includes('proofreading') || msg.includes('grant') || msg.includes('search strategy') || msg.includes('medico')) {
        return '✍️ *Medical Writing Services:*\n\nSelect a service:\n\nA. Manuscript Preparation & Submission\nB. Customized Literature Search\nC. PROSPERO Registration\nD. Search Strategy Formulation\nE. PICO Framework Assistance\nF. Proofreading & Editing\nG. Grant Proposal Assistance\nH. Medico-marketing Assistance\n\nReply *A to H* or type *menu* to go back!';

    } else if (msg === '4' || msg.includes('statistic') || msg.includes('meta analysis') || msg.includes('meta-analysis') || msg.includes('regression') || msg.includes('survival') || msg.includes('longitudinal') || msg.includes('cohort') || msg.includes('gvd') || msg.includes('rct') || msg.includes('randomized')) {
        return '📊 *Statistical & Analytical Services:*\n\nSelect a service:\n\nA. Meta-analysis & Network Meta-analysis\nB. Systematic Literature Review\nC. Global Value Dossier (GVD)\nD. Longitudinal Data & Cohort Analysis\nE. Statistical Model Building\n   (Linear, Logistic, Survival Analysis)\nF. Diagnostic Tests & Risk Factor Analysis\nG. RCT Analysis\nH. Survey Design & Analysis\n\nReply *A to H* or type *menu* to go back!';

    } else if (msg === '5' || msg.includes('gbd') || msg.includes('global burden') || msg.includes('trinetx') || msg.includes('nfhs') || msg.includes('who database') || msg.includes('cnns') || msg.includes('global data')) {
        return '🌍 *Global Data Services:*\n\nSelect a database:\n\nA. GBD: Global Burden of Disease\nB. TriNetX: Global Health Research\nC. NFHS: National Family Health Survey\nD. WHO Database Analysis\nE. CNNS: Comprehensive National Nutrition Survey\nF. Country-Specific Databases\n\nReply *A to F* or type *menu* to go back!';

    } else if (msg === '6' || msg.includes('additional') || msg.includes('data cleaning') || msg.includes('infographic') || msg.includes('presentation')) {
        return '➕ *Additional Services:*\n\nSelect a service:\n\nA. Data Cleaning & Formatting\nB. Presentation & Infographic Creation\nC. Proofreading of Medical Content\nD. Grant Proposal & Funding Assistance\nE. Survey Design & Analysis\n\nReply *A to E* or type *menu* to go back!';

    // ── Sub-options A ──
    } else if (msg === 'a') {
        return '📊 *Option A Selected:*\n\nPlease first select a main category (1-6) to choose a specific service!\n\nType *menu* to see all options!';

    // ── Sub-options B ──
    } else if (msg === 'b') {
        return '📊 *Option B Selected:*\n\nPlease first select a main category (1-6) to choose a specific service!\n\nType *menu* to see all options!';

    // ── Manuscript ──
    } else if (msg.includes('manuscript preparation') || msg.includes('manuscript')) {
        return '📄 *Manuscript Preparation & Submission:*\n\n✅ Full manuscript drafting\n✅ Journal selection guidance\n✅ Q1/Q2 Scopus & Web of Science\n✅ Response to reviewer comments\n✅ Final submission support\n\n📞 help@clievi.com\n📞 +44-772-183-3232\n\nType *menu* to go back!';

    // ── Literature Search ──
    } else if (msg.includes('literature search')) {
        return '🔍 *Customized Literature Search:*\n\n✅ PubMed, Cochrane, Embase\n✅ Scopus & Web of Science\n✅ Custom search strategy\n✅ PRISMA compliant\n✅ Detailed search reports\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── PROSPERO ──
    } else if (msg.includes('prospero')) {
        return '📋 *PROSPERO Registration:*\n\n✅ Protocol development\n✅ PROSPERO submission\n✅ Registration ID obtained\n✅ Fast turnaround\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── PICO ──
    } else if (msg.includes('pico')) {
        return '🎯 *PICO Framework Assistance:*\n\nPICO = Patient, Intervention, Comparators, Outcome\n\n✅ Research question formulation\n✅ PICO element identification\n✅ Protocol development\n✅ Systematic review design\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── Proofreading ──
    } else if (msg.includes('proofreading') || msg.includes('editing')) {
        return '✏️ *Proofreading & Editing:*\n\n✅ Grammar & language correction\n✅ Scientific accuracy check\n✅ Journal formatting\n✅ Plagiarism check\n✅ Fast turnaround (48-72 hours)\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── Grant ──
    } else if (msg.includes('grant proposal') || msg.includes('grant')) {
        return '💰 *Grant Proposal Assistance:*\n\n✅ Grant proposal writing\n✅ Budget preparation\n✅ Research objectives framing\n✅ Compliance with funding guidelines\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── Medico ──
    } else if (msg.includes('medico')) {
        return '📢 *Medico-marketing Assistance:*\n\n✅ Medical content creation\n✅ Product monographs\n✅ Scientific slide decks\n✅ KOL communication materials\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── Process ──
    } else if (msg === '7' || msg.includes('process') || msg.includes('how it works') || msg.includes('how to start') || msg.includes('steps')) {
        return '⚙️ *How CliEvi Works — 5 Steps:*\n\nStep 1️⃣ *Submit a Request*\nFill our form or email us your research question.\n\nStep 2️⃣ *Scope & Assessment*\nOur team reviews requirements & methodology.\n\nStep 3️⃣ *Proposal & Quote*\nDetailed proposal with timeline & pricing.\n\nStep 4️⃣ *Research & Analysis*\nRigorous data collection & evidence synthesis.\n\nStep 5️⃣ *Delivery & Support*\nPublication-ready reports with post-delivery support.\n\n📌 clievi.com/how-it-works-clievi.html\n\nType *menu* to go back!';

    // ── Timeline ──
    } else if (msg === '8' || msg.includes('timeline') || msg.includes('delivery') || msg.includes('how long') || msg.includes('duration') || msg.includes('urgent')) {
        return '⏱️ *Project Timelines:*\n\n🚀 Urgent — ≤ 2 weeks\n📅 Standard — 1 month\n📊 Medium — 2–3 months\n🔬 Large — 3–6 months\n✅ Flexible — Based on your needs\n\n💡 48-hour response to all inquiries!\n\n📧 help@clievi.com\n📞 +44-772-183-3232\n\nType *menu* to go back!';

    // ── Pricing ──
    } else if (msg === '9' || msg.includes('price') || msg.includes('cost') || msg.includes('quote') || msg.includes('how much') || msg.includes('fee') || msg.includes('budget')) {
        return '💰 *Pricing & Quotes:*\n\nCustomized pricing based on:\n\n📌 Project scope & complexity\n📌 Timeline requirements\n📌 Data sources needed\n📌 Type of analysis\n\n✅ No hidden charges\n✅ Upfront pricing in proposal\n✅ NDA available on request\n\nFor a *FREE quote*:\n📧 help@clievi.com\n📞 +44-772-183-3232\n\nType *menu* to go back!';

    // ── Contact ──
    } else if (msg === '10' || msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('reach') || msg.includes('human') || msg.includes('expert')) {
        return '📞 *Contact CliEvi:*\n\n📧 Email: help@clievi.com\n📞 WhatsApp: +44-772-183-3232\n📍 Address: 9, Prescot St, London, UK\n🌐 Website: clievi.com\n\n⏱️ Response within 1–2 business days\n🕐 Available 24/7!\n\nType *menu* to go back!';

    // ── About ──
    } else if (msg.includes('about') || msg.includes('who are you') || msg.includes('what is clievi') || msg.includes('company')) {
        return 'ℹ️ *About CliEvi:*\n\nClinical and Evidence-Based Research Services\nA brand of Cloud Publishing\n\n🏢 9, Prescot St, London, UK\n🌍 Serving 30+ countries\n\n🏆 500+ Projects Delivered\n📚 150+ Journals Published\n⭐ 5+ Years of Expertise\n\n✅ PRISMA, Cochrane, ISPOR, FDA compliant\n\nType *menu* to go back!';

    // ── NDA ──
    } else if (msg.includes('nda') || msg.includes('confidential') || msg.includes('privacy') || msg.includes('secure')) {
        return '🔒 *Confidentiality & Privacy:*\n\n✅ Full NDA available on request\n✅ Strict privacy on all projects\n✅ Data never shared with third parties\n✅ GDPR compliant\n\nYour research is safe with us! 🛡️\n\nType *menu* to go back!';

    // ── Publication ──
    } else if (msg.includes('publication') || msg.includes('journal') || msg.includes('publish') || msg.includes('scopus') || msg.includes('q1') || msg.includes('q2')) {
        return '📚 *Publication Support:*\n\n✅ Q1 & Q2 peer-reviewed journals\n✅ Scopus indexed journals\n✅ Web of Science indexed journals\n\nServices:\n• Manuscript preparation\n• Journal selection\n• Reviewer response\n• Final submission\n\n📞 help@clievi.com\n\nType *menu* to go back!';

    // ── Career ──
    } else if (msg.includes('career') || msg.includes('job') || msg.includes('hiring') || msg.includes('join') || msg.includes('vacancy')) {
        return '💼 *Careers at CliEvi:*\n\nRoles we hire for:\n• Biostatisticians\n• Medical Writers\n• Clinical Research Associates\n• Health Economists\n• Data Analysts\n\n📌 clievi.com/career.html\n📧 help@clievi.com\n\nType *menu* to go back!';

    // ── Thank You ──
    } else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('bye') || msg.includes('goodbye')) {
        return 'Thank you for contacting *CliEvi*! 🙏\n\nFor further assistance:\n📧 help@clievi.com\n📞 +44-772-183-3232\n\nHave a great day! 😊\n\nType *menu* anytime to start again!';

    // ── Default — Any Unknown Message ──
    } else {
        return 'Hello! 👋 Welcome to *CliEvi*!\n\nI am your Clinical Research Assistant.\n\nType *menu* to see all options!\n\nOr contact us directly:\n📧 help@clievi.com\n📞 +44-772-183-3232';
    }
}

// ── Send WhatsApp Message ──────────────────────
async function sendWhatsAppMessage(to, message) {
    try {
        await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`✅ Message sent to ${to}`);
    } catch (error) {
        console.log("❌ Error:", error.message);
    }
}

// ── Webhook Verify ─────────────────────────────
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified!');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// ── Webhook Receive ────────────────────────────
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry[0];
            const changes = entry.changes[0];
            const value = changes.value;
            if (value.messages && value.messages[0]) {
                const message = value.messages[0];
                const from = message.from;
                const text = message.text ? message.text.body : '';
                console.log(`📩 From ${from}: ${text}`);
                const reply = getBotResponse(text, from);
                await sendWhatsAppMessage(from, reply);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.log("❌ Webhook error:", error.message);
        res.sendStatus(500);
    }
});

// ── Website Chatbot UI ─────────────────────────
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>CliEvi Support Chatbot</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial; background: #f0f4f8; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                .chat-container { width: 520px; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow: hidden; }
                .chat-header { background: #1A3C6E; color: white; padding: 18px 20px; display: flex; align-items: center; gap: 12px; }
                .avatar { width: 42px; height: 42px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
                .header-info h2 { font-size: 16px; }
                .header-info p { font-size: 12px; opacity: 0.8; margin-top: 2px; }
                .online-dot { width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; display: inline-block; margin-right: 4px; }
                #chat { height: 400px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8f9fa; }
                .user-msg { align-self: flex-end; background: #1A3C6E; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 13px; line-height: 1.5; }
                .bot-msg { align-self: flex-start; background: white; color: #333; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 80%; font-size: 13px; line-height: 1.6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-line; }
                .quick-btns { display: flex; gap: 6px; padding: 10px 16px; flex-wrap: wrap; background: white; border-top: 1px solid #eee; }
                .quick-btn { padding: 5px 10px; background: #EBF5FB; color: #1A3C6E; border: 1px solid #AED6F1; border-radius: 14px; cursor: pointer; font-size: 11px; }
                .quick-btn:hover { background: #D6EAF8; }
                .chat-input { display: flex; padding: 12px 16px; gap: 8px; background: white; border-top: 1px solid #eee; }
                #userInput { flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 22px; font-size: 13px; outline: none; }
                #userInput:focus { border-color: #1A3C6E; }
                button { padding: 10px 18px; background: #1A3C6E; color: white; border: none; border-radius: 22px; cursor: pointer; font-size: 13px; font-weight: bold; }
                button:hover { background: #2471A3; }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="chat-header">
                    <div class="avatar">🔬</div>
                    <div class="header-info">
                        <h2>CliEvi Support</h2>
                        <p><span class="online-dot"></span>Online • Clinical Research Assistant</p>
                    </div>
                </div>
                <div id="chat">
                    <div class="bot-msg">Hello! Welcome to CliEvi.com! 👋

I am your Clinical Research Assistant.

Type menu to see all options!</div>
                </div>
                <div class="quick-btns">
                    <span class="quick-btn" onclick="sendQuick('menu')">📋 Menu</span>
                    <span class="quick-btn" onclick="sendQuick('1')">🔬 RWE</span>
                    <span class="quick-btn" onclick="sendQuick('2')">🏥 Clinical</span>
                    <span class="quick-btn" onclick="sendQuick('3')">✍️ Writing</span>
                    <span class="quick-btn" onclick="sendQuick('4')">📊 Statistics</span>
                    <span class="quick-btn" onclick="sendQuick('7')">⚙️ Process</span>
                    <span class="quick-btn" onclick="sendQuick('8')">⏱️ Timeline</span>
                    <span class="quick-btn" onclick="sendQuick('9')">💰 Price</span>
                    <span class="quick-btn" onclick="sendQuick('10')">📞 Contact</span>
                </div>
                <div class="chat-input">
                    <input type="text" id="userInput" placeholder="Type 1-10 or ask anything..." onkeypress="if(event.key==='Enter') sendMessage()"/>
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <script>
                const userId = 'web_' + Math.random().toString(36).substr(2, 9);
                async function sendMessage() {
                    const input = document.getElementById('userInput');
                    const chat = document.getElementById('chat');
                    const message = input.value.trim();
                    if (!message) return;
                    chat.innerHTML += '<div class="user-msg">' + message + '</div>';
                    input.value = '';
                    chat.scrollTop = chat.scrollHeight;
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: message, userId: userId })
                    });
                    const data = await response.json();
                    const formatted = data.reply
                        .replace(/\\n/g, '<br>')
                        .replace(/\\*(.*?)\\*/g, '<b>$1</b>');
                    chat.innerHTML += '<div class="bot-msg">' + formatted + '</div>';
                    chat.scrollTop = chat.scrollHeight;
                }
                function sendQuick(msg) {
                    document.getElementById('userInput').value = msg;
                    sendMessage();
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/chat', (req, res) => {
    const { message, userId } = req.body;
    const reply = getBotResponse(message || '', userId || 'default');
    res.json({ reply: reply });
});

app.listen(3000, () => {
    console.log('================================');
    console.log('  CliEvi Chatbot Server Running!');
    console.log('  Website: http://localhost:3000');
    console.log('================================');
});