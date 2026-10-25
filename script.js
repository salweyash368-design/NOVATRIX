const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

document.getElementById("year").textContent =
    new Date().getFullYear();

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className = `message ${type}`;
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return message;
}

function getDemoResponse(text) {
    const query = text.toLowerCase();

    if (query.includes("website")) {
        return "I can help you plan a website. Start with its purpose, target audience, design and required features.";
    }

    if (query.includes("ai")) {
        return "AI can help automate tasks, answer questions and support content creation. What would you like your AI tool to do?";
    }

    if (
        query.includes("hello") ||
        query.includes("hi") ||
        query.includes("hey")
    ) {
        return "Hello! Welcome to NOVATRIX. I can help you explore AI, software and digital product ideas.";
    }

    if (
        query.includes("software") ||
        query.includes("app")
    ) {
        return "Let's plan your software project. Define the problem, identify users and list the features needed for the first version.";
    }

    return "Thanks for your question! I'm currently running in demo mode. Connect a real AI API to enable intelligent responses to a wider range of questions.";
}

chatForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = userInput.value.trim();

    if (!text) return;

    addMessage(text, "user-message");

    userInput.value = "";
    sendButton.disabled = true;
    sendButton.textContent = "...";

    const response = getDemoResponse(text);

    window.setTimeout(() => {
        addMessage(response, "bot-message");

        sendButton.disabled = false;
        sendButton.textContent = "Send ↗";

        userInput.focus();
    }, 350);
});