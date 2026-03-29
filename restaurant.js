require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ── Menu Data ──────────────────────────────────
const menu = {
    'S1': { name: "Talumein Soup", price: 120, category: "Soups" },
    'S2': { name: "Manchow Soup", price: 120, category: "Soups" },
    'S3': { name: "Noodle Soup", price: 100, category: "Soups" },
    'S4': { name: "Hakka Saka Soup", price: 120, category: "Soups" },
    'T1': { name: "Haryali Paneer Tikka", price: 290, category: "Tandoor Ke Sholay" },
    'T2': { name: "Dahi Ke Sholay", price: 260, category: "Tandoor Ke Sholay" },
    'T3': { name: "Mushroom Tikka", price: 250, category: "Tandoor Ke Sholay" },
    'D1': { name: "Dal Tadka", price: 140, category: "Dal Waal" },
    'D2': { name: "Rajma", price: 120, category: "Dal Waal" },
    'D3': { name: "Dal Langar", price: 140, category: "Dal Waal" },
    'C1': { name: "Chilly Mushroom", price: 240, category: "Chinese" },
    'C2': { name: "Kurkuri Chaap", price: 160, category: "Chinese" },
    'C3': { name: "Spring Roll", price: 120, category: "Chinese" },
    'C4': { name: "Chilli Potato", price: 120, category: "Chinese" },
};

// ── User Sessions ──────────────────────────────
const userSessions = {};

function getSession(userId) {
    if (!userSessions[userId]) {
        userSessions[userId] = {
            cart: {},
            step: 'new',
            orderType: '',
            address: ''
        };
    }
    return userSessions[userId];
}

function getCartTotal(cart) {
    let total = 0;
    for (const [id, qty] of Object.entries(cart)) {
        total += menu[id].price * qty;
    }
    return total;
}

function getCartSummary(cart) {
    if (Object.keys(cart).length === 0) return 'Your cart is empty!';
    let summary = 'Your Cart:\n\n';
    let total = 0;
    let index = 1;
    for (const [id, qty] of Object.entries(cart)) {
        const item = menu[id];
        const subtotal = item.price * qty;
        total += subtotal;
        summary += `${index}. ${item.name}\n   ${qty} x Rs.${item.price} = Rs.${subtotal}\n\n`;
        index++;
    }
    const delivery = total >= 300 ? 'FREE Delivery!' : `Add Rs.${300 - total} more for FREE Delivery!`;
    summary += `Total: Rs.${total}\n${delivery}`;
    return summary;
}

function getBotResponse(message, userId) {
    const msg = message.trim().toLowerCase();
    const session = getSession(userId);
    const cart = session.cart;

    // ── Welcome ──
    if (session.step === 'new') {
        session.step = 'select_type';
        return `Hi User! 👋\n\n🌟 Welcome to Chawla Veg Kitchen 🌟\n\n🍔 Ab 200 ka khaana, Rs.300 mei kyu lena?\nWith us, you always get lower prices than Swiggy & Zomato 🚀\n\n🎉 FREE Home Delivery on all orders above Rs.300 🛵✨\n\n📲 Order now and save more!\n— Chawla Veg Kitchen Team\n\n━━━━━━━━━━━━━━━\nPlease select:\n\n1 - Home Delivery 🏠\n2 - Takeaway 🏃`;

    // ── Order Type ──
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

    // ── Get Address ──
    } else if (session.step === 'get_address') {
        session.address = message;
        session.step = 'ordering';
        return `✅ Address saved!\n📍 ${message}\n\nNow type menu to explore our delicious offerings! 😋`;

    // ── Show Menu ──
    } else if (msg === 'menu') {
        session.step = 'ordering';
        return `🍽️ Chawla Veg Kitchen Menu\n\n🥣 SOUPS\nS1. Talumein Soup — Rs.120\nS2. Manchow Soup — Rs.120\nS3. Noodle Soup — Rs.100\nS4. Hakka Saka Soup — Rs.120\n\n🔥 TANDOOR KE SHOLAY\nT1. Haryali Paneer Tikka — Rs.290\nT2. Dahi Ke Sholay — Rs.260\nT3. Mushroom Tikka — Rs.250\n\n🫘 DAL WAAL\nD1. Dal Tadka — Rs.140\nD2. Rajma — Rs.120\nD3. Dal Langar — Rs.140\n\n🍜 CHINESE\nC1. Chilly Mushroom — Rs.240\nC2. Kurkuri Chaap — Rs.160\nC3. Spring Roll — Rs.120\nC4. Chilli Potato — Rs.120\n\nType item code to add!\nExample: S1 for Talumein Soup\n\nType cart to view cart\nType order to checkout`;

    // ── Add Item ──
    } else if (menu[msg.toUpperCase()]) {
        const itemId = msg.toUpperCase();
        const item = menu[itemId];
        cart[itemId] = (cart[itemId] || 0) + 1;
        session.step = 'ordering';
        return `✅ ${item.name} added! Rs.${item.price}\n\n${getCartSummary(cart)}\n\nType more codes to add\nType remove ${itemId} to remove\nType cart to view\nType order to checkout`;

    // ── View Cart ──
    } else if (msg === 'cart' || msg === 'view cart' || msg === 'my cart') {
        if (Object.keys(cart).length === 0) {
            return 'Your cart is empty!\n\nType menu to see our menu!';
        }
        return `${getCartSummary(cart)}\n\nType item code to add more\nType remove [code] to remove\nType clear to clear cart\nType order to checkout`;

    // ── Remove Item ──
    } else if (msg.startsWith('remove')) {
        const parts = msg.split(' ');
        const itemId = parts[1] ? parts[1].toUpperCase() : '';
        if (itemId && cart[itemId]) {
            const itemName = menu[itemId].name;
            if (cart[itemId] > 1) {
                cart[itemId]--;
                return `✅ 1 ${itemName} removed!\n\n${getCartSummary(cart)}\n\nType order to checkout`;
            } else {
                delete cart[itemId];
                return `✅ ${itemName} removed!\n\n${getCartSummary(cart)}\n\nType menu to add more`;
            }
        } else {
            return `Type remove [item code]\n\nExample:\nremove S1 for Talumein Soup\nremove D1 for Dal Tadka\n\nType cart to see your cart!`;
        }

    // ── Clear Cart ──
    } else if (msg === 'clear' || msg === 'clear cart') {
        Object.keys(cart).forEach(key => delete cart[key]);
        return 'Cart cleared!\n\nType menu to start ordering again!';

    // ── Place Order ──
    } else if (msg === 'order' || msg === 'checkout' || msg === 'place order') {
        if (Object.keys(cart).length === 0) {
            return 'Your cart is empty!\n\nType menu to add items!';
        }
        const total = getCartTotal(cart);
        session.step = 'confirm';
        return `${getCartSummary(cart)}\n\n━━━━━━━━━━━━━━━\nOrder Type: ${session.orderType}\n${session.orderType === 'Home Delivery' ? 'Address: ' + session.address : 'Pickup from our kitchen'}\nTotal: Rs.${total}\n\nConfirm your order?\n\nType yes to confirm\nType no to cancel`;

    // ── Confirm Order ──
    } else if ((msg === 'yes' || msg === 'confirm' || msg === 'ok') && session.step === 'confirm') {
        const total = getCartTotal(cart);
        const summary = getCartSummary(cart);
        const orderType = session.orderType;
        const address = session.address;
        Object.keys(cart).forEach(key => delete cart[key]);
        session.step = 'ordering';
        return `🎉 Order Confirmed!\n\n${summary}\n\n━━━━━━━━━━━━━━━\nOrder Type: ${orderType}\n${orderType === 'Home Delivery' ? 'Address: ' + address : 'Pickup Ready'}\nTotal: Rs.${total}\n\n💳 Payment Options:\n1. Cash on Delivery\n2. UPI / GPay / PhonePe\n   UPI ID: chawla@upi\n\n━━━━━━━━━━━━━━━\n🙏 Thank you for ordering from\nChawla Veg Kitchen! 🌟\n\n⏰ Your order will be delivered in 30 minutes 🛵\n\nType menu to order again!`;

    // ── Cancel ──
    } else if ((msg === 'no' || msg === 'cancel') && session.step === 'confirm') {
        session.step = 'ordering';
        return `Order cancelled!\n\n${getCartSummary(cart)}\n\nType order to try again\nType menu to add more items`;

    // ── Help ──
    } else if (msg === 'help') {
        return `Help:\n\nmenu - See full menu\ncart - View cart\nS1,T1,D1,C1... - Add items\nremove S1 - Remove item\nclear - Clear cart\norder - Place order`;

    // ── Default ──
    } else {
        session.step = 'select_type';
        return `Hi User! 👋\n\n🌟 Welcome to Chawla Veg Kitchen 🌟\n\n🍔 Ab 200 ka khaana, Rs.300 mei kyu lena?\nWith us, you always get lower prices than Swiggy & Zomato 🚀\n\n🎉 FREE Home Delivery on all orders above Rs.300 🛵✨\n\nPlease select:\n\n1 - Home Delivery 🏠\n2 - Takeaway 🏃`;
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

// ── Website UI ─────────────────────────────────
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

Type hi or click Start to get started! 😊</div>
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
                const sendBtn = document.getElementById('sendBtn');
                const userInput = document.getElementById('userInput');

                sendBtn.addEventListener('click', sendMessage);
                userInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') sendMessage();
                });

                async function sendMessage() {
                    const chat = document.getElementById('chat');
                    const message = userInput.value.trim();
                    if (!message) return;

                    chat.innerHTML += '<div class="user-msg">' + message + '</div>';
                    userInput.value = '';
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
                        errDiv.textContent = 'Error! Please refresh the page.';
                        chat.appendChild(errDiv);
                    }
                }

                function sendQuick(msg) {
                    userInput.value = msg;
                    sendMessage();
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/restaurant-chat', (req, res) => {
    const { message, userId } = req.body;
    const reply = getBotResponse(message || 'hi', userId || 'default');
    res.json({ reply: reply });
});

app.listen(4000, () => {
    console.log('====================================');
    console.log("  Chawla Veg Kitchen Bot Running!");
    console.log('  Open: http://localhost:4000/restaurant');
    console.log('  Webhook: /webhook');
    console.log('====================================');
});