require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ══════════════════════════════════════════════
//  CHAWLA VEG KITCHEN
// ══════════════════════════════════════════════
const chawlaMenu = {
    'S1': { name: "Talumein Soup", price: 120 },
    'S2': { name: "Manchow Soup", price: 120 },
    'S3': { name: "Noodle Soup", price: 100 },
    'S4': { name: "Hakka Saka Soup", price: 120 },
    'T1': { name: "Haryali Paneer Tikka", price: 290 },
    'T2': { name: "Dahi Ke Sholay", price: 260 },
    'T3': { name: "Mushroom Tikka", price: 250 },
    'D1': { name: "Dal Tadka", price: 140 },
    'D2': { name: "Rajma", price: 120 },
    'D3': { name: "Dal Langar", price: 140 },
    'C1': { name: "Chilly Mushroom", price: 240 },
    'C2': { name: "Kurkuri Chaap", price: 160 },
    'C3': { name: "Spring Roll", price: 120 },
    'C4': { name: "Chilli Potato", price: 120 },
};

const chawlaSessions = {};

function getChawlaSession(userId) {
    if (!chawlaSessions[userId]) {
        chawlaSessions[userId] = { cart: {}, step: 'new', orderType: '', address: '' };
    }
    return chawlaSessions[userId];
}

function getChawlaCartTotal(cart) {
    let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
        total += chawlaMenu[id].price * qty;
    }
    return total;
}

function getChawlaCartSummary(cart) {
    if (Object.keys(cart).length === 0) return 'Your cart is empty!';
    let summary = 'Your Cart:\n\n';
    let total = 0;
    let index = 1;
    for (const [id, qty] of Object.entries(cart)) {
        const item = chawlaMenu[id];
        const subtotal = item.price * qty;
        total += subtotal;
        summary += `${index}. ${item.name}\n   ${qty} x Rs.${item.price} = Rs.${subtotal}\n\n`;
        index++;
    }
    const delivery = total >= 300 ? 'FREE Delivery Applied!' : `Add Rs.${300 - total} more for FREE Delivery!`;
    summary += `Total: Rs.${total}\n${delivery}`;
    return summary;
}

function getChawlaBotResponse(message, userId) {
    const msg = message.trim().toLowerCase();
    const session = getChawlaSession(userId);
    const cart = session.cart;

    if (session.step === 'new') {
        session.step = 'select_type';
        return `Hi User! 👋\n\n🌟 Welcome to Chawla Veg Kitchen 🌟\n\n🍔 Ab 200 ka khaana, Rs.300 mei kyu lena?\nWith us, you always get lower prices than Swiggy & Zomato 🚀\n\n🎉 FREE Home Delivery on all orders above Rs.300 🛵✨\n\n📲 Order now and save more!\n— Chawla Veg Kitchen Team\n\n━━━━━━━━━━━━━━━\nPlease select:\n\n1 - Home Delivery 🏠\n2 - Takeaway 🏃`;

    } else if (session.step === 'select_type') {
        if (msg === '1' || msg.includes('home') || msg.includes('delivery')) {
            session.orderType = 'Home Delivery';
            session.step = 'get_address';
            return `✅ Great! You have selected Home Delivery 🏠\n\nPlease share your delivery address and contact number.\n\nExample:\n123 Main Street, Delhi - 9876543210\n\nWhen ready, type menu to explore! 😋`;
        } else if (msg === '2' || msg.includes('takeaway') || msg.includes('take away')) {
            session.orderType = 'Takeaway';
            session.step = 'ordering';
            return `✅ Great! You have selected Takeaway 🏃\n\nPickup from: Chawla Veg Kitchen, Main Market\n\nType menu to explore our delicious offerings! 😋`;
        } else {
            return `Please select:\n\n1 - Home Delivery 🏠\n2 - Takeaway 🏃`;
        }

    } else if (session.step === 'get_address') {
        session.address = message;
        session.step = 'ordering';
        return `✅ Address saved!\n📍 ${message}\n\nNow type menu to explore our delicious offerings! 😋`;

    } else if (msg === 'menu') {
        session.step = 'ordering';
        return `🍽️ Chawla Veg Kitchen Menu\n\n🥣 SOUPS\nS1. Talumein Soup — Rs.120\nS2. Manchow Soup — Rs.120\nS3. Noodle Soup — Rs.100\nS4. Hakka Saka Soup — Rs.120\n\n🔥 TANDOOR KE SHOLAY\nT1. Haryali Paneer Tikka — Rs.290\nT2. Dahi Ke Sholay — Rs.260\nT3. Mushroom Tikka — Rs.250\n\n🫘 DAL WAAL\nD1. Dal Tadka — Rs.140\nD2. Rajma — Rs.120\nD3. Dal Langar — Rs.140\n\n🍜 CHINESE\nC1. Chilly Mushroom — Rs.240\nC2. Kurkuri Chaap — Rs.160\nC3. Spring Roll — Rs.120\nC4. Chilli Potato — Rs.120\n\nType item code to add!\nExample: S1 for Talumein Soup\n\nType cart to view cart\nType order to checkout`;

    } else if (chawlaMenu[msg.toUpperCase()]) {
        const itemId = msg.toUpperCase();
        const item = chawlaMenu[itemId];
        cart[itemId] = (cart[itemId] || 0) + 1;
        session.step = 'ordering';
        return `✅ ${item.name} added! Rs.${item.price}\n\n${getChawlaCartSummary(cart)}\n\nType more codes to add\nType remove ${itemId} to remove\nType cart to view\nType order to checkout`;

    } else if (msg === 'cart' || msg === 'view cart' || msg === 'my cart') {
        if (Object.keys(cart).length === 0) {
            return 'Your cart is empty!\n\nType menu to see our menu!';
        }
        return `${getChawlaCartSummary(cart)}\n\nType item code to add more\nType remove [code] to remove\nType clear to clear cart\nType order to checkout`;

    } else if (msg.startsWith('remove')) {
        const parts = msg.split(' ');
        const itemId = parts[1] ? parts[1].toUpperCase() : '';
        if (itemId && cart[itemId]) {
            const itemName = chawlaMenu[itemId].name;
            if (cart[itemId] > 1) {
                cart[itemId]--;
                return `✅ 1 ${itemName} removed!\n\n${getChawlaCartSummary(cart)}\n\nType order to checkout`;
            } else {
                delete cart[itemId];
                return `✅ ${itemName} removed!\n\n${getChawlaCartSummary(cart)}\n\nType menu to add more`;
            }
        } else {
            return `Type remove [item code]\n\nExample:\nremove S1 for Talumein Soup\nremove D1 for Dal Tadka\n\nType cart to see your cart!`;
        }

    } else if (msg === 'clear' || msg === 'clear cart') {
        Object.keys(cart).forEach(key => delete cart[key]);
        return 'Cart cleared!\n\nType menu to start ordering again!';

    } else if (msg === 'order' || msg === 'checkout' || msg === 'place order') {
        if (Object.keys(cart).length === 0) {
            return 'Your cart is empty!\n\nType menu to add items!';
        }
        const total = getChawlaCartTotal(cart);
        session.step = 'confirm';
        return `${getChawlaCartSummary(cart)}\n\n━━━━━━━━━━━━━━━\nOrder Type: ${session.orderType}\n${session.orderType === 'Home Delivery' ? 'Address: ' + session.address : 'Pickup from our kitchen'}\nTotal: Rs.${total}\n\nConfirm your order?\nType yes to confirm\nType no to cancel`;

    } else if ((msg === 'yes' || msg === 'confirm' || msg === 'ok') && session.step === 'confirm') {
        const total = getChawlaCartTotal(cart);
        const summary = getChawlaCartSummary(cart);
        const orderType = session.orderType;
        const address = session.address;
        Object.keys(cart).forEach(key => delete cart[key]);
        session.step = 'ordering';
        return `🎉 Order Confirmed!\n\n${summary}\n\n━━━━━━━━━━━━━━━\nOrder Type: ${orderType}\n${orderType === 'Home Delivery' ? 'Address: ' + address : 'Pickup Ready'}\nTotal: Rs.${total}\n\n💳 Payment Options:\n1. Cash on Delivery\n2. UPI / GPay / PhonePe\n   UPI ID: chawla@upi\n\n━━━━━━━━━━━━━━━\n🙏 Thank you for ordering from\nChawla Veg Kitchen! 🌟\n\n⏰ Your order will be delivered in 30 minutes 🛵\n\nType menu to order again!`;

    } else if ((msg === 'no' || msg === 'cancel') && session.step === 'confirm') {
        session.step = 'ordering';
        return `Order cancelled!\n\n${getChawlaCartSummary(cart)}\n\nType order to try again\nType menu to add more items`;

    } else if (msg === 'help') {
        return `Help:\n\nmenu - See full menu\ncart - View cart\nS1,T1,D1,C1... - Add items\nremove S1 - Remove item\nclear - Clear cart\norder - Place order`;

    } else {
        session.step = 'select_type';
        return `Hi User! 👋\n\n🌟 Welcome to Chawla Veg Kitchen 🌟\n\n🍔 Ab 200 ka khaana, Rs.300 mei kyu lena?\nWith us, you always get lower prices than Swiggy & Zomato 🚀\n\n🎉 FREE Home Delivery on all orders above Rs.300 🛵✨\n\nPlease select:\n\n1 - Home Delivery 🏠\n2 - Takeaway 🏃`;
    }
}

// ── Chawla Website UI ──────────────────────────
app.get('/restaurant', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chawla Veg Kitchen</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial; background: linear-gradient(135deg, #FF6F00, #FFA000); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
                .chat-container { width: 100%; max-width: 520px; background: white; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.25); overflow: hidden; }
                .chat-header { background: #E65100; color: white; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }
                .avatar { width: 48px; height: 48px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
                .header-info h2 { font-size: 16px; font-weight: bold; }
                .header-info p { font-size: 12px; opacity: 0.85; margin-top: 2px; }
                .online-dot { width: 8px; height: 8px; background: #76FF03; border-radius: 50%; display: inline-block; margin-right: 4px; }
                #chat { height: 450px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #FFF8F0; }
                .user-msg { align-self: flex-end; background: #E65100; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 82%; font-size: 13px; line-height: 1.5; word-break: break-word; }
                .bot-msg { align-self: flex-start; background: white; color: #333; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 82%; font-size: 13px; line-height: 1.6; box-shadow: 0 1px 4px rgba(0,0,0,0.12); white-space: pre-line; word-break: break-word; }
                .quick-btns { display: flex; gap: 6px; padding: 10px 14px; flex-wrap: wrap; background: white; border-top: 1px solid #eee; }
                .quick-btn { padding: 7px 13px; background: #FFF3E0; color: #E65100; border: 1.5px solid #FFCC80; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: bold; }
                .quick-btn:hover { background: #FFE0B2; }
                .chat-input { display: flex; padding: 12px 14px; gap: 8px; background: white; border-top: 1px solid #eee; }
                #userInput { flex: 1; padding: 11px 16px; border: 1.5px solid #ddd; border-radius: 24px; font-size: 13px; outline: none; }
                #userInput:focus { border-color: #E65100; }
                #sendBtn { padding: 11px 20px; background: #E65100; color: white; border: none; border-radius: 24px; cursor: pointer; font-size: 13px; font-weight: bold; }
                #sendBtn:hover { background: #BF360C; }
                .typing { align-self: flex-start; background: white; padding: 10px 14px; border-radius: 18px; font-size: 12px; color: #999; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <div class="chat-header">
                    <div class="avatar">🥗</div>
                    <div class="header-info">
                        <h2>Chawla Veg Kitchen</h2>
                        <p><span class="online-dot"></span>Online • Lower prices than Swiggy! 🚀</p>
                    </div>
                </div>
                <div id="chat">
                    <div class="bot-msg">👋 Welcome to Chawla Veg Kitchen!

Click Start to begin ordering! 😊</div>
                </div>
                <div class="quick-btns">
                    <span class="quick-btn" onclick="sendQuick('hi')">👋 Start</span>
                    <span class="quick-btn" onclick="sendQuick('1')">🏠 Delivery</span>
                    <span class="quick-btn" onclick="sendQuick('2')">🏃 Takeaway</span>
                    <span class="quick-btn" onclick="sendQuick('menu')">📋 Menu</span>
                    <span class="quick-btn" onclick="sendQuick('cart')">🛒 Cart</span>
                    <span class="quick-btn" onclick="sendQuick('order')">✅ Order</span>
                    <span class="quick-btn" onclick="sendQuick('clear')">🗑️ Clear</span>
                </div>
                <div class="chat-input">
                    <input type="text" id="userInput" placeholder="Type hi to start..." />
                    <button id="sendBtn">Send</button>
                </div>
            </div>
            <script>
                const userId = 'web_' + Math.random().toString(36).substr(2, 9);
                document.getElementById('sendBtn').addEventListener('click', sendMessage);
                document.getElementById('userInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') sendMessage();
                });
                async function sendMessage() {
                    const chat = document.getElementById('chat');
                    const input = document.getElementById('userInput');
                    const message = input.value.trim();
                    if (!message) return;
                    chat.innerHTML += '<div class="user-msg">' + message + '</div>';
                    input.value = '';
                    chat.scrollTop = chat.scrollHeight;
                    const typingDiv = document.createElement('div');
                    typingDiv.className = 'typing';
                    typingDiv.id = 'typing';
                    typingDiv.textContent = 'Chawla Kitchen is typing...';
                    chat.appendChild(typingDiv);
                    chat.scrollTop = chat.scrollHeight;
                    try {
                        await new Promise(r => setTimeout(r, 500));
                        const res = await fetch('/restaurant-chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: message, userId: userId })
                        });
                        const data = await res.json();
                        const typing = document.getElementById('typing');
                        if (typing) typing.remove();
                        const botDiv = document.createElement('div');
                        botDiv.className = 'bot-msg';
                        botDiv.textContent = data.reply;
                        chat.appendChild(botDiv);
                        chat.scrollTop = chat.scrollHeight;
                    } catch(err) {
                        const typing = document.getElementById('typing');
                        if (typing) typing.remove();
                        const errDiv = document.createElement('div');
                        errDiv.className = 'bot-msg';
                        errDiv.textContent = 'Error! Please refresh.';
                        chat.appendChild(errDiv);
                    }
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

app.post('/restaurant-chat', (req, res) => {
    const { message, userId } = req.body;
    const reply = getChawlaBotResponse(message || 'hi', userId || 'default');
    res.json({ reply: reply });
});

// ══════════════════════════════════════════════
//  CLIEVI CHATBOT
// ══════════════════════════════════════════════
const cliEviSessions = {};

function getCliEviSession(userId) {
    if (!cliEviSessions[userId]) {
        cliEviSessions[userId] = true;
    }
    return cliEviSessions[userId];
}

function getCliEviBotResponse(message, userId) {
    const msg = message.trim().toLowerCase();
    const isNew = !cliEviSessions[userId];
    if (isNew || msg === '' || msg === ' ') {
        cliEviSessions[userId] = true;
        return 'Hello! 👋 Welcome to CliEvi!\n\nClinical and Evidence-Based Research Services.\n\nType menu to see all options!';
    }

    if (msg.includes('menu') || msg.includes('options') || msg.includes('help') || msg.includes('start') || msg.includes('back')) {
        return 'CliEvi Main Menu:\n\n1. RWE, HEOR & Data Analytics\n2. Clinical Research & Regulatory Support\n3. Medical Writing & Research Consulting\n4. Statistical & Analytical Services\n5. Global Data Services\n6. Additional Services\n7. Process / How It Works\n8. Timeline & Delivery\n9. Pricing & Quote\n10. Contact Us\n\nReply with a number (1-10)!';

    } else if (msg === '1' || msg.includes('rwe') || msg.includes('real world') || msg.includes('heor')) {
        return 'RWE, HEOR & Data Analytics:\n\nA. RWE Patient Data Analysis\nB. Evidence Synthesis\nC. Electronic Records Analyses\nD. Health Economic Outcomes Research\nE. Health Technology Assessments\nF. Burden of Disease Analysis\nG. Patient Treatment Pathway\nH. Global Data Services\n\nReply A to H or type menu to go back!';

    } else if (msg === '2' || msg.includes('clinical') || msg.includes('csr') || msg.includes('regulatory') || msg.includes('trial')) {
        return 'Clinical Research Services:\n\nA. Clinical Study Reports (CSR)\nB. Regulatory Writing Services\nC. Clinical Trial Support\nD. Systematic Review & Meta-analysis\nE. Epidemiology Analysis\nF. CDISC SEND Services\n\nReply A to F or type menu to go back!';

    } else if (msg === '3' || msg.includes('writing') || msg.includes('manuscript') || msg.includes('prospero') || msg.includes('pico')) {
        return 'Medical Writing Services:\n\nA. Manuscript Preparation & Submission\nB. Customized Literature Search\nC. PROSPERO Registration\nD. Search Strategy Formulation\nE. PICO Framework Assistance\nF. Proofreading & Editing\nG. Grant Proposal Assistance\nH. Medico-marketing Assistance\n\nReply A to H or type menu to go back!';

    } else if (msg === '4' || msg.includes('statistic') || msg.includes('meta') || msg.includes('regression')) {
        return 'Statistical & Analytical Services:\n\nA. Meta-analysis & Network Meta-analysis\nB. Systematic Literature Review\nC. Global Value Dossier (GVD)\nD. Longitudinal Data & Cohort Analysis\nE. Statistical Model Building\nF. Diagnostic Tests & Risk Factor Analysis\nG. RCT Analysis\nH. Survey Design & Analysis\n\nReply A to H or type menu to go back!';

    } else if (msg === '5' || msg.includes('gbd') || msg.includes('trinetx') || msg.includes('global data')) {
        return 'Global Data Services:\n\nA. GBD: Global Burden of Disease\nB. TriNetX: Global Health Research\nC. NFHS: National Family Health Survey\nD. WHO Database Analysis\nE. CNNS Survey\nF. Country-Specific Databases\n\nReply A to F or type menu to go back!';

    } else if (msg === '6' || msg.includes('additional') || msg.includes('data cleaning') || msg.includes('infographic')) {
        return 'Additional Services:\n\nA. Data Cleaning & Formatting\nB. Presentation & Infographic Creation\nC. Proofreading of Medical Content\nD. Grant Proposal & Funding Assistance\nE. Survey Design & Analysis\n\nReply A to E or type menu to go back!';

    } else if (msg === '7' || msg.includes('process') || msg.includes('how it works') || msg.includes('steps')) {
        return 'How CliEvi Works - 5 Steps:\n\nStep 1 - Submit a Request\nFill our form or email us your research question.\n\nStep 2 - Scope & Assessment\nOur team reviews requirements & methodology.\n\nStep 3 - Proposal & Quote\nDetailed proposal with timeline & pricing.\n\nStep 4 - Research & Analysis\nRigorous data collection & evidence synthesis.\n\nStep 5 - Delivery & Support\nPublication-ready reports with post-delivery support.\n\nclievi.com/how-it-works-clievi.html\n\nType menu to go back!';

    } else if (msg === '8' || msg.includes('timeline') || msg.includes('delivery') || msg.includes('how long') || msg.includes('urgent')) {
        return 'Project Timelines:\n\nUrgent - 2 weeks\nStandard - 1 month\nMedium - 2-3 months\nLarge - 3-6 months\nFlexible - Based on your needs\n\n48-hour response to all inquiries!\n\nEmail: help@clievi.com\nWhatsApp: +44-772-183-3232\n\nType menu to go back!';

    } else if (msg === '9' || msg.includes('price') || msg.includes('cost') || msg.includes('quote') || msg.includes('how much') || msg.includes('fee')) {
        return 'Pricing & Quotes:\n\nCustomized pricing based on:\n- Project scope & complexity\n- Timeline requirements\n- Data sources needed\n- Type of analysis\n\nNo hidden charges\nUpfront pricing in proposal\nNDA available on request\n\nFor a FREE quote:\nEmail: help@clievi.com\nWhatsApp: +44-772-183-3232\n\nType menu to go back!';

    } else if (msg === '10' || msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('reach')) {
        return 'Contact CliEvi:\n\nEmail: help@clievi.com\nWhatsApp: +44-772-183-3232\nAddress: 9, Prescot St, London, UK\nWebsite: clievi.com\n\nResponse within 1-2 business days\nAvailable 24/7!\n\nType menu to go back!';

    } else if (msg.includes('about') || msg.includes('who are you') || msg.includes('company')) {
        return 'About CliEvi:\n\nClinical and Evidence-Based Research Services\nA brand of Cloud Publishing\n\n9, Prescot St, London, UK\nServing 30+ countries\n\n500+ Projects Delivered\n150+ Journals Published\n5+ Years of Expertise\n\nPRISMA, Cochrane, ISPOR, FDA compliant\n\nType menu to go back!';

    } else if (msg.includes('nda') || msg.includes('confidential') || msg.includes('privacy') || msg.includes('secure')) {
        return 'Confidentiality & Privacy:\n\nFull NDA available on request\nStrict privacy on all projects\nData never shared with third parties\nGDPR compliant\n\nYour research is safe with us!\n\nType menu to go back!';

    } else if (msg.includes('publication') || msg.includes('journal') || msg.includes('publish') || msg.includes('scopus')) {
        return 'Publication Support:\n\nQ1 & Q2 peer-reviewed journals\nScopus indexed journals\nWeb of Science indexed journals\n\nServices:\n- Manuscript preparation\n- Journal selection\n- Reviewer response\n- Final submission\n\nEmail: help@clievi.com\n\nType menu to go back!';

    } else if (msg.includes('career') || msg.includes('job') || msg.includes('hiring') || msg.includes('join')) {
        return 'Careers at CliEvi:\n\nRoles we hire for:\n- Biostatisticians\n- Medical Writers\n- Clinical Research Associates\n- Health Economists\n- Data Analysts\n\nclievi.com/career.html\nEmail: help@clievi.com\n\nType menu to go back!';

    } else if (msg.includes('thank') || msg.includes('thanks') || msg.includes('bye') || msg.includes('goodbye')) {
        return 'Thank you for contacting CliEvi!\n\nFor further assistance:\nEmail: help@clievi.com\nWhatsApp: +44-772-183-3232\n\nHave a great day!\n\nType menu anytime to start again!';

    } else {
        cliEviSessions[userId] = true;
        return 'Hello! 👋 Welcome to CliEvi!\n\nI am your Clinical Research Assistant.\n\nType menu to see all options!\n\nOr contact us:\nEmail: help@clievi.com\nWhatsApp: +44-772-183-3232';
    }
}

// ── CliEvi Website UI ──────────────────────────
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CliEvi Support Chatbot</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: Arial; background: #f0f4f8; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
                .chat-container { width: 100%; max-width: 520px; background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); overflow: hidden; }
                .chat-header { background: #1A3C6E; color: white; padding: 18px 20px; display: flex; align-items: center; gap: 12px; }
                .avatar { width: 42px; height: 42px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
                .header-info h2 { font-size: 16px; }
                .header-info p { font-size: 12px; opacity: 0.8; margin-top: 2px; }
                .online-dot { width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; display: inline-block; margin-right: 4px; }
                #chat { height: 400px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8f9fa; }
                .user-msg { align-self: flex-end; background: #1A3C6E; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 13px; line-height: 1.5; word-break: break-word; }
                .bot-msg { align-self: flex-start; background: white; color: #333; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 80%; font-size: 13px; line-height: 1.6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); white-space: pre-line; word-break: break-word; }
                .quick-btns { display: flex; gap: 6px; padding: 10px 16px; flex-wrap: wrap; background: white; border-top: 1px solid #eee; }
                .quick-btn { padding: 5px 10px; background: #EBF5FB; color: #1A3C6E; border: 1px solid #AED6F1; border-radius: 14px; cursor: pointer; font-size: 11px; }
                .quick-btn:hover { background: #D6EAF8; }
                .chat-input { display: flex; padding: 12px 16px; gap: 8px; background: white; border-top: 1px solid #eee; }
                #userInput { flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 22px; font-size: 13px; outline: none; }
                #userInput:focus { border-color: #1A3C6E; }
                #sendBtn { padding: 10px 18px; background: #1A3C6E; color: white; border: none; border-radius: 22px; cursor: pointer; font-size: 13px; font-weight: bold; }
                #sendBtn:hover { background: #2471A3; }
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
                    <input type="text" id="userInput" placeholder="Type 1-10 or ask anything..." />
                    <button id="sendBtn">Send</button>
                </div>
            </div>
            <script>
                const userId = 'web_' + Math.random().toString(36).substr(2, 9);
                document.getElementById('sendBtn').addEventListener('click', sendMessage);
                document.getElementById('userInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') sendMessage();
                });
                async function sendMessage() {
                    const chat = document.getElementById('chat');
                    const input = document.getElementById('userInput');
                    const message = input.value.trim();
                    if (!message) return;
                    chat.innerHTML += '<div class="user-msg">' + message + '</div>';
                    input.value = '';
                    chat.scrollTop = chat.scrollHeight;
                    const typingDiv = document.createElement('div');
                    typingDiv.className = 'typing';
                    typingDiv.id = 'typing';
                    typingDiv.textContent = 'CliEvi is typing...';
                    chat.appendChild(typingDiv);
                    chat.scrollTop = chat.scrollHeight;
                    try {
                        await new Promise(r => setTimeout(r, 600));
                        const res = await fetch('/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: message, userId: userId })
                        });
                        const data = await res.json();
                        const typing = document.getElementById('typing');
                        if (typing) typing.remove();
                        const botDiv = document.createElement('div');
                        botDiv.className = 'bot-msg';
                        botDiv.textContent = data.reply;
                        chat.appendChild(botDiv);
                        chat.scrollTop = chat.scrollHeight;
                    } catch(err) {
                        const typing = document.getElementById('typing');
                        if (typing) typing.remove();
                        const errDiv = document.createElement('div');
                        errDiv.className = 'bot-msg';
                        errDiv.textContent = 'Error! Please refresh.';
                        chat.appendChild(errDiv);
                    }
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
    const reply = getCliEviBotResponse(message || '', userId || 'default');
    res.json({ reply: reply });
});

// ══════════════════════════════════════════════
//  WHATSAPP WEBHOOK
// ══════════════════════════════════════════════
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
                const reply = getChawlaBotResponse(text, from);
                await sendWhatsAppMessage(from, reply);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.log("❌ Webhook error:", error.message);
        res.sendStatus(500);
    }
});

// ══════════════════════════════════════════════
//  START SERVER
// ══════════════════════════════════════════════
app.listen(3000, () => {
    console.log('================================');
    console.log('  Servers Running!');
    console.log('  CliEvi: http://localhost:3000');
    console.log('  Chawla: http://localhost:3000/restaurant');
    console.log('================================');
});
