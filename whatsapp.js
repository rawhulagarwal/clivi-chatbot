require('dotenv').config();
const axios = require('axios');

const TOKEN = process.env.ACCESS_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const TO_NUMBER = process.env.RECIPIENT_NUMBER;

async function sendMessage() {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: TO_NUMBER,
                type: "template",
                template: {
                    name: "hello_world",
                    language: {
                        code: "en_US"
                    }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("✅ Message sent successfully!");
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log("❌ Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

sendMessage();
