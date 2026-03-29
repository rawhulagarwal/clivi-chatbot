require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const TOKEN = process.env.ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ── Chatbot Logic ──────────────────────────────
function getBotResponse(message) {
    const msg = message.trim().toLowerCase();

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return 'Hello! Welcome to CliEvi! 👋\n\nWe provide Clinical and Evidence-Based Research Services.\n\nType *services* to know more!';
    } else if (msg.includes('service') || msg.includes('what do you offer')) {
        return 'Our Services:\n\n1️⃣ Real-World Evidence (RWE)\n2️⃣ Clinical Research\n3️⃣ Medical Writing\n4️⃣ Statistical Analysis\n5️⃣ Global Data Services\n\nType any service name to know more!';
    } else if (msg.includes('rwe') || msg.includes('real world')) {
        return '🔬 *RWE & HEOR Services:*\n\n✅ RWE Patient Data Analysis\n✅ Evidence Synthesis\n✅ Electronic Records Analysis\n✅ Health Economic Outcomes Research\n✅ Health Technology Assessments\n\nVisit: clievi.com/services/rwd.html';
    } else if (msg.includes('clinical') || msg.includes('trial')) {
        return '🏥 *Clinical Research Services:*\n\n✅ Clinical Study Reports\n✅ Regulatory Writing\n✅ Clinical Trial Support\n✅ Systematic Reviews\n\nVisit: clievi.com/services/clinical-research-services.html';
    } else if (msg.includes('medical writing') || msg.includes('manuscript')) {
        return '✍️ *Medical Writing Services:*\n\n✅ Manuscript Services\n✅ Literature Search\n✅ PROSPERO Registration\n✅ PICO Framework\n✅ Proofreading\n\nVisit: clievi.com/services/medical-writing-and-research-support.html';
    } else if (msg.includes('statistic') || msg.includes('analysis') || msg.includes('meta')) {
        return '📊 *Statistical Services:*\n\n✅ Meta-analysis\n✅ Network Meta-analysis\n✅ Longitudinal Data Analysis\n✅ Statistical Model Building\n✅ RCT Analysis\n\nVisit: clievi.com/services/analytical-methods.html';
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('quote')) {
        return '💰 *Pricing:*\n\nFor customized quotes, please contact us:\n\n📧 Email: help@clievi.com\n📞 WhatsApp: +44-772-183-3232\n\nOur team will get back to you shortly!';
    } else if (msg.includes('contact') || msg.includes('email') || msg.includes('phone')) {
        return '📞 *Contact CliEvi:*\n\n📧 Email: help@clievi.com\n📞 WhatsApp: +44-772-183-3232\n📍 Address: 9, Prescot St, London, UK\n\nAvailable 24/7!';
    } else if (msg.includes('location') || msg.includes('address') || msg.includes('where')) {
        return '📍 *CliEvi Location:*\n\n9, Prescot St, London, United Kingdom\n\nWe serve clients in 30+ countries worldwide! 🌍';
    } else if (msg.includes('career') || msg.includes('job')) {
        return '💼 *Careers at CliEvi:*\n\nInterested in joining us?\nVisit: clievi.com/career.html\n\nWe are always looking for talented researchers!';
    } else if (msg.includes('about') || msg.includes('who')) {
        return 'ℹ️ *About CliEvi:*\n\n🏆 500+ Projects Delivered\n🌍 30+ Countries Served\n⭐ 5+ Years of Expertise\n📚 150+ Journals Published\n\nYour trusted partner in Evidence-Based Research!';
    } else if (msg.includes('bye') || msg.includes('thank')) {
        return 'Thank you for contacting CliEvi! 🙏\n\nFor further assistance:\n📧 help@clievi.com\n📞 +44-772-183-3232\n\nHave a great day! 😊';
    } else if (msg.includes('help')) {
        return '❓ *How can I help?*\n\nType any of these:\n\n• *services* - Our services\n• *rwe* - Real World Evidence\n• *clinical* - Clinical Research\n• *medical writing* - Medical Writing\n• *statistics* - Statistical Analysis\n• *price* - Pricing info\n• *contact* - Contact us\n• *about* - About CliEvi';
    } else {
        return 'Sorry, I did not understand! 😊\n\nType *help* to see what I can assist with!\n\nOr contact us directly:\n📧 help@clievi.com';
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
        console.log("❌ Error sending message:", error.message);
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

// ── Webhook Receive Messages ───────────────────
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

                console.log(`📩 Message from ${from}: ${text}`);

                const reply = getBotResponse(text);
                await sendWhatsAppMessage(from, reply);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.log("❌ Webhook error:", error.message);
        res.sendStatus(500);
    }
});

// ── Website Chatbot ────────────────────────────
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>CliEvi Support Chatbot</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial; background: #f0f4f8; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .chat-container { width: 520px; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow: hidden; }
                .chat-header { background: #1A3C6E; color: white; padding: 18px 20px; display: flex; align-items: center; gap: 12px; }
                .avatar { width: 42px; height: 42px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
                .header-info h2 { font-size: 16px; }
                .header-info p { font-size: 12px; opacity: 0.8; margin-top: 2px; }
                .online-dot { width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; display: inline-block; margin-right: 4px; }
                #chat { height: 380px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8f9fa; }
                .user-msg { align-self: flex-end; background: #1A3C6E; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 13px; line-height: 1.5; }
                .bot-msg { align-self: flex-start; background: white; color: #333; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 80%; font-size: 13px; line-height: 1.5; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
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
                    <div class="bot-msg">Hello! Welcome to CliEvi.com! How can I help you today?</div>
                </div>
                <div class="quick-btns">
                    <span class="quick-btn" onclick="sendQuick('services')">📋 Services</span>
                    <span class="quick-btn" onclick="sendQuick('rwe')">🔬 RWE</span>
                    <span class="quick-btn" onclick="sendQuick('clinical')">🏥 Clinical</span>
                    <span class="quick-btn" onclick="sendQuick('medical writing')">✍️ Writing</span>
                    <span class="quick-btn" onclick="sendQuick('contact')">📞 Contact</span>
                    <span class="quick-btn" onclick="sendQuick('price')">💰 Price</span>
                </div>
                <div class="chat-input">
                    <input type="text" id="userInput" placeholder="Ask about our services..." onkeypress="if(event.key==='Enter') sendMessage()"/>
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <script>
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
                        body: JSON.stringify({ message: message })
                    });
                    const data = await response.json();
                    chat.innerHTML += '<div class="bot-msg">' + data.reply.replace(/\\n/g, '<br>') + '</div>';
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
    const user_message = req.body.message;
    const reply = getBotResponse(user_message);
    res.json({ reply: reply });
});

app.listen(3000, () => {
    console.log('================================');
    console.log('  CliEvi Chatbot Server Running!');
    console.log('  Website: http://localhost:3000');
    console.log('  Webhook: /webhook');
    console.log('================================');
});
