const express = require('express');
const app = express();

app.use(express.json());

function getBotResponse(user_message) {
    const msg = user_message.trim().toLowerCase();

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return 'Hello! Welcome to CliEvi.com! We provide Clinical and Evidence-Based Research Services. How can I help you today?';

    } else if (msg.includes('about') || msg.includes('who are you') || msg.includes('what is clievi')) {
        return 'CliEvi is a trusted partner in Evidence-Based Insights, Analytics, and Clinical Research Excellence. We have completed 500+ projects in 30+ countries with 5+ years of expertise!';

    } else if (msg.includes('service') || msg.includes('what do you offer') || msg.includes('what do you do')) {
        return 'We offer: 1) Real-World Evidence (RWE) & HEOR 2) Clinical Research Services 3) Medical Writing 4) Statistical Analysis 5) Global Data Services. Type any service name to know more!';

    } else if (msg.includes('rwe') || msg.includes('real world') || msg.includes('heor')) {
        return 'Our RWE & HEOR Services include: RWE Patient Data Analysis, Evidence Synthesis, Electronic Records Analyses, Health Economic Outcomes Research, and Health Technology Assessments. Visit: clievi.com/services/rwd.html';

    } else if (msg.includes('clinical research') || msg.includes('clinical trial') || msg.includes('clinical study')) {
        return 'Our Clinical Research Services include: Clinical Study Reports (CSR), Regulatory Writing, Clinical Trial Support, Epidemiology Analysis, and Systematic Reviews. Visit: clievi.com/services/clinical-research-services.html';

    } else if (msg.includes('medical writing') || msg.includes('manuscript') || msg.includes('writing')) {
        return 'Our Medical Writing Services include: Manuscript Services, Customized Literature Search, PROSPERO Registration, Search Strategy Formulation, PICO Framework Assistance, and Proofreading. Visit: clievi.com/services/medical-writing-and-research-support.html';

    } else if (msg.includes('statistical') || msg.includes('statistics') || msg.includes('analysis') || msg.includes('meta analysis')) {
        return 'Our Statistical Services include: Meta-analysis, Network Meta-analysis, Longitudinal Data Analysis, Statistical Model Building (Linear, Logistic, Survival), and Randomized Controlled Trials Analysis. Visit: clievi.com/services/analytical-methods.html';

    } else if (msg.includes('systematic review') || msg.includes('literature review')) {
        return 'We provide comprehensive Systematic Literature Review Services including Literature Screening, Data Extraction, Meta-analysis, and Global Value Dossier (GVD). Visit: clievi.com/services/rwe-and-heor-services.html';

    } else if (msg.includes('regulatory') || msg.includes('csr') || msg.includes('report')) {
        return 'Our Regulatory Writing Services cover Clinical Study Reports (CSR), Regulatory Submissions, and ICH E3 compliant documentation. Visit: clievi.com/services/clinical-research-services/regulatory-writing.html';

    } else if (msg.includes('cdisc') || msg.includes('send')) {
        return 'We provide CDISC SEND (Standard for Exchange of Nonclinical Data) services for FDA and PMDA regulatory submissions. Visit: clievi.com/services/clinical-and-epidemiological-analysis/cdisc-standard-for-exchange-of-nonclinical-data-send.html';

    } else if (msg.includes('gbd') || msg.includes('global burden') || msg.includes('disease burden')) {
        return 'Our GBD (Global Burden of Disease) services help quantify morbidity, mortality, and risk factors worldwide for evidence-based health policy. Visit: clievi.com/services/global-and-country-specific-data-services/gbd-global-burden-of-disease.html';

    } else if (msg.includes('trinetx') || msg.includes('nfhs') || msg.includes('who database') || msg.includes('global data')) {
        return 'We provide Global Data Services including TriNetX, NFHS, WHO Database, CNNS Survey, and Country-Specific Database analysis. Visit: clievi.com/services/global-and-country-specific-data-services/gbd-global-burden-of-disease.html';

    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('quote') || msg.includes('how much')) {
        return 'For pricing and customized quotes, please contact us directly. Email: help@clievi.com | WhatsApp: +44-772-183-3232. Our team will get back to you shortly!';

    } else if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('phone')) {
        return 'Contact CliEvi: Email: help@clievi.com | WhatsApp: +44-772-183-3232 | Address: 9, Prescot St, London, United Kingdom. Available 24/7!';

    } else if (msg.includes('whatsapp')) {
        return 'You can reach us on WhatsApp at +44-772-183-3232. We are available 24/7 to assist you!';

    } else if (msg.includes('location') || msg.includes('address') || msg.includes('where')) {
        return 'CliEvi is located at: 9, Prescot St, London, United Kingdom. We serve clients in 30+ countries worldwide!';

    } else if (msg.includes('career') || msg.includes('job') || msg.includes('work') || msg.includes('hiring')) {
        return 'Interested in joining CliEvi? Visit our careers page: clievi.com/career.html for current opportunities!';

    } else if (msg.includes('progress') || msg.includes('achievement') || msg.includes('stats')) {
        return 'CliEvi Achievements: 500+ Projects Delivered | 30+ Countries Served | 5+ Years of Expertise | 150+ Journals Published with our assistance!';

    } else if (msg.includes('how it works') || msg.includes('process') || msg.includes('steps')) {
        return 'Want to know how CliEvi works? Visit: clievi.com/how-it-works-clievi.html to learn about our process and methodology!';

    } else if (msg.includes('update') || msg.includes('news') || msg.includes('latest')) {
        return 'Check our latest updates and research news at: clievi.com/latest.html. We regularly publish articles on clinical research and evidence-based medicine!';

    } else if (msg.includes('privacy') || msg.includes('policy') || msg.includes('data protection')) {
        return 'For our privacy policy and data protection information, visit: clievi.com/homepage/privacy-policy-clievi.html';

    } else if (msg.includes('pico') || msg.includes('framework')) {
        return 'We provide PICO (Patient, Intervention, Comparators, Outcome) Framework Assistance for structured research questions. Visit: clievi.com/services/medical-writing-and-research-support/pico-patient-intervention-comparators-outcome-framework-assistance.html';

    } else if (msg.includes('prospero') || msg.includes('registration')) {
        return 'We assist with PROSPERO Registration Services for systematic reviews. Visit: clievi.com/services/medical-writing-and-research-support/prospero-registration-services.html';

    } else if (msg.includes('help') || msg.includes('options') || msg.includes('what can you do')) {
        return 'I can help you with: services, rwe, clinical research, medical writing, statistics, contact, location, career, pricing, updates. Just type any topic!';

    } else if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('thank')) {
        return 'Thank you for contacting CliEvi! For further assistance, email help@clievi.com or WhatsApp +44-772-183-3232. Have a great day!';

    } else {
        return 'I am not sure about that. Please contact us directly at help@clievi.com or WhatsApp +44-772-183-3232. Type "help" to see what I can assist with!';
    }
}

app.get('/', function(req, res) {
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
                .quick-btn { padding: 5px 10px; background: #EBF5FB; color: #1A3C6E; border: 1px solid #AED6F1; border-radius: 14px; cursor: pointer; font-size: 11px; white-space: nowrap; }
                .quick-btn:hover { background: #D6EAF8; }
                .chat-input { display: flex; padding: 12px 16px; gap: 8px; background: white; border-top: 1px solid #eee; }
                #userInput { flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 22px; font-size: 13px; outline: none; }
                #userInput:focus { border-color: #1A3C6E; }
                button { padding: 10px 18px; background: #1A3C6E; color: white; border: none; border-radius: 22px; cursor: pointer; font-size: 13px; font-weight: bold; }
                button:hover { background: #2471A3; }
                .typing { align-self: flex-start; background: white; padding: 10px 14px; border-radius: 18px; font-size: 12px; color: #999; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
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
                    <div class="bot-msg">Hello! Welcome to CliEvi.com! I am your Clinical Research Assistant. How can I help you today?</div>
                </div>
                <div class="quick-btns">
                    <span class="quick-btn" onclick="sendQuick('services')">📋 Services</span>
                    <span class="quick-btn" onclick="sendQuick('rwe heor')">🔬 RWE & HEOR</span>
                    <span class="quick-btn" onclick="sendQuick('clinical research')">🏥 Clinical Research</span>
                    <span class="quick-btn" onclick="sendQuick('medical writing')">✍️ Medical Writing</span>
                    <span class="quick-btn" onclick="sendQuick('contact')">📞 Contact</span>
                    <span class="quick-btn" onclick="sendQuick('price')">💰 Pricing</span>
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
                    chat.innerHTML += '<div class="typing" id="typing">CliEvi is typing...</div>';
                    chat.scrollTop = chat.scrollHeight;
                    await new Promise(r => setTimeout(r, 800));
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: message })
                    });
                    const data = await response.json();
                    document.getElementById('typing').remove();
                    chat.innerHTML += '<div class="bot-msg">' + data.reply + '</div>';
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

app.post('/chat', function(req, res) {
    const user_message = req.body.message;
    const reply = getBotResponse(user_message);
    res.json({ reply: reply });
});

app.listen(3000, function() {
    console.log('================================');
    console.log('  CliEvi Chatbot Server Running!');
    console.log('  Open: http://localhost:3000   ');
    console.log('================================');
});

