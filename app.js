const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Menu items with prices
const menu = {
    "burger": 150,
    "pizza": 300,
    "pasta": 200,
    "sandwich": 120,
    "coffee": 80
};

// Customer order storage
let customerName = "";
let customerOrder = "";
let customerTotal = 0;

function showMenu() {
    console.log("--------------------------------");
    console.log("        OUR MENU");
    console.log("--------------------------------");
    console.log("  Burger     - Rs. 150");
    console.log("  Pizza      - Rs. 300");
    console.log("  Pasta      - Rs. 200");
    console.log("  Sandwich   - Rs. 120");
    console.log("  Coffee     - Rs. 80");
    console.log("--------------------------------");
}

function askQuestion() {
    rl.question("You: ", function(input) {
        const user_message = input.trim().toLowerCase();

        if (user_message.includes("bye")) {
            console.log("Bot: Goodbye! Thank you for visiting Clivi!");
            rl.close();
            return;

        } else if (user_message.includes("hello") || user_message.includes("hi")) {
            console.log("Bot: Hello! Welcome to Clivi Food!");
            console.log("Bot: Type 'menu' to see our menu.");
            console.log("Bot: Type 'order' to place an order.");

        } else if (user_message.includes("menu")) {
            console.log("Bot: Here is our menu:");
            showMenu();

        } else if (user_message.includes("order")) {
            console.log("Bot: Great! What is your name?");
            rl.question("You: ", function(name) {
                customerName = name.trim();
                console.log("Bot: Hello " + customerName + "! What would you like to order?");
                console.log("Bot: (burger / pizza / pasta / sandwich / coffee)");
                rl.question("You: ", function(item) {
                    customerOrder = item.trim().toLowerCase();
                    if (menu[customerOrder]) {
                        customerTotal = menu[customerOrder];
                        console.log("Bot: Great choice! " + customerOrder + " costs Rs. " + customerTotal);
                        console.log("Bot: Confirm your order? (yes/no)");
                        rl.question("You: ", function(confirm) {
                            if (confirm.trim().toLowerCase() === "yes") {
                                console.log("Bot: ✅ Order Confirmed!");
                                console.log("Bot: Thank you " + customerName + "!");
                                console.log("Bot: Your order: " + customerOrder + " - Rs. " + customerTotal);
                                console.log("Bot: We will deliver it soon!");
                            } else {
                                console.log("Bot: Order cancelled. Type 'order' to try again!");
                            }
                            askQuestion();
                        });
                    } else {
                        console.log("Bot: Sorry, that item is not available!");
                        console.log("Bot: Type 'menu' to see available items.");
                        askQuestion();
                    }
                });
            });
            return;

        } else if (user_message.includes("price")) {
            console.log("Bot: Please check our menu for prices!");
            showMenu();

        } else if (user_message.includes("help")) {
            console.log("Bot: You can type:");
            console.log("     'hello' - to greet");
            console.log("     'menu'  - to see menu");
            console.log("     'order' - to place order");
            console.log("     'bye'   - to exit");

        } else {
            console.log("Bot: Sorry, I did not understand!");
            console.log("Bot: Type 'help' to see what I can do!");
        }

        askQuestion();
    });
}

console.log("================================");
console.log("   Welcome to Clivi Chatbot!   ");
console.log("  Type 'help' to get started   ");
console.log("================================");

askQuestion();
