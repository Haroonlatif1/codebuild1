// Question banks. `a` is the index of the correct option.
export const GENERAL_ADULT = [
  { q: "Which shortcut copies the selected text or file?", o: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + P"], a: 1 },
  { q: "Which shortcut undoes your last action?", o: ["Ctrl + Y", "Ctrl + Z", "Ctrl + A", "Alt + F4"], a: 1 },
  { q: "Which shortcut switches between open windows on Windows?", o: ["Alt + Tab", "Ctrl + Tab", "Shift + Tab", "Win + D"], a: 0 },
  { q: "What does the term “URL” stand for?", o: ["Universal Resource Link", "Uniform Resource Locator", "Unified Routing Line", "User Request Layer"], a: 1 },
  { q: "Which of these is a web browser?", o: ["Google Chrome", "Windows Defender", "WinRAR", "Notepad"], a: 0 },
  { q: "What is “RAM” in a computer?", o: ["Permanent file storage", "Short-term working memory", "The internet connection", "The screen"], a: 1 },
  { q: "A file named “report.pdf” has which extension?", o: ["report", ".pdf", "pdf.report", "/pdf"], a: 1 },
  { q: "Which shortcut saves your current document?", o: ["Ctrl + S", "Ctrl + N", "Ctrl + W", "Ctrl + B"], a: 0 },
];

export const BY_CAT = {
  web: [
    { q: "What does HTML mainly describe?", o: ["The look and colours", "The structure and content of a web page", "Database records", "Server hardware"], a: 1 },
    { q: "Which language is used to style a web page?", o: ["CSS", "SQL", "Python", "Bash"], a: 0 },
    { q: "Which of these is a programming language that runs in the browser?", o: ["JavaScript", "Photoshop", "Excel", "Linux"], a: 0 },
  ],
  python: [
    { q: "Which function prints text on the screen in Python?", o: ["echo()", "print()", "say()", "write.screen()"], a: 1 },
    { q: "Which of these is a list in Python?", o: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"], a: 2 },
    { q: "What is a “variable”?", o: ["A named box that stores a value", "A type of error", "A keyboard key", "A web address"], a: 0 },
  ],
  cpp: [
    { q: "What does a “loop” do in a program?", o: ["Repeats instructions", "Deletes a file", "Draws a picture", "Connects to Wi-Fi"], a: 0 },
    { q: "Which of these is a data type for whole numbers?", o: ["int", "text", "bool-ean", "float-less"], a: 0 },
    { q: "What is an “algorithm”?", o: ["A step-by-step method to solve a problem", "A computer virus", "A kind of monitor", "A file format"], a: 0 },
  ],
  ai: [
    { q: "What is Artificial Intelligence?", o: ["Machines doing tasks that normally need human intelligence", "A very fast internet", "A type of keyboard", "A video game console"], a: 0 },
    { q: "Which of these is an example of AI you may have used?", o: ["Voice assistant / chatbot", "A calculator button", "A USB cable", "A printer tray"], a: 0 },
    { q: "In AI, a “prompt” is…", o: ["The instruction you give the model", "A power cable", "A type of virus", "A website colour"], a: 0 },
  ],
  office: [
    { q: "Which shortcut makes selected text bold in Word?", o: ["Ctrl + B", "Ctrl + I", "Ctrl + U", "Ctrl + K"], a: 0 },
    { q: "In Excel, which symbol starts a formula?", o: ["=", "#", "@", "&"], a: 0 },
    { q: "What does Ctrl + A do?", o: ["Selects everything", "Adds a row", "Opens a file", "Aligns text"], a: 0 },
  ],
  design: [
    { q: "Which colour mode is used for screens?", o: ["RGB", "CMYK", "Greyscale only", "Pantone"], a: 0 },
    { q: "A “vector” graphic is…", o: ["Made of paths that scale without losing quality", "Made only of pixels", "A video file", "A font"], a: 0 },
    { q: "Which format supports a transparent background?", o: ["PNG", "JPG", "MP3", "DOC"], a: 0 },
  ],
  business: [
    { q: "What does “SEO” stand for?", o: ["Search Engine Optimization", "Social Engine Output", "Secure Email Operation", "Site Entry Order"], a: 0 },
    { q: "A “target audience” is…", o: ["The people you want to reach", "Your office staff", "A type of ad budget", "A website theme"], a: 0 },
    { q: "Which is a social media platform?", o: ["Facebook", "Windows", "Excel", "Chrome"], a: 0 },
  ],
  mobile: [
    { q: "Which of these is a mobile operating system?", o: ["Android", "Photoshop", "Excel", "Chrome"], a: 0 },
    { q: "An “app” is…", o: ["A software program for a device", "A phone charger", "A SIM card", "A screen protector"], a: 0 },
    { q: "Which store distributes Android apps?", o: ["Google Play", "App Store only", "Steam only", "Windows Update"], a: 0 },
  ],
  security: [
    { q: "Which is the strongest password?", o: ["password123", "ali2008", "T7#kq!9Lm@2x", "qwerty"], a: 2 },
    { q: "“Phishing” is…", o: ["Tricking people into giving up private info", "A fast internet plan", "A type of keyboard", "A backup method"], a: 0 },
    { q: "What does a firewall do?", o: ["Filters network traffic", "Cools the CPU", "Speeds up Wi-Fi", "Stores photos"], a: 0 },
  ],
  emerging: [
    { q: "A “sensor” in electronics…", o: ["Detects something from the environment", "Stores files", "Prints pages", "Plays music only"], a: 0 },
    { q: "What does “IoT” stand for?", o: ["Internet of Things", "Input of Tools", "Internal Operating Test", "Index of Text"], a: 0 },
    { q: "A “robot” generally needs…", o: ["Instructions (a program)", "Only a battery label", "A printer", "A keyboard cover"], a: 0 },
  ],
  general: [
    { q: "Which of these is a programming language?", o: ["Python", "Chrome", "Windows", "Gmail"], a: 0 },
    { q: "What does “CPU” stand for?", o: ["Central Processing Unit", "Computer Personal Use", "Core Power Utility", "Control Panel Unit"], a: 0 },
    { q: "What is a “bug” in software?", o: ["An error in a program", "A new feature", "A computer insect", "A password"], a: 0 },
  ],
};

export const KIDS = [
  { q: "A robot follows exactly the steps you give it. What are those steps called?", o: ["Instructions (a program)", "Colours", "Batteries", "Stickers"], a: 0 },
  { q: "Which of these can use AI to understand your voice?", o: ["A smart speaker", "A pencil", "A chair", "A water bottle"], a: 0 },
  { q: "What comes next in the pattern?  ▲ ● ▲ ● ▲ …", o: ["●", "▲", "■", "★"], a: 0 },
  { q: "Which one is a computer input device (you use it to tell the computer something)?", o: ["Keyboard", "Speaker", "Monitor", "Printer"], a: 0 },
  { q: "If a game asks “Are you a robot?”, what is it checking?", o: ["That a real person is using it", "Your favourite colour", "Your age", "Your Wi-Fi speed"], a: 0 },
  { q: "Which keys do you press together to copy something?", o: ["Ctrl + C", "Ctrl + Q", "Alt + F4", "Shift + Z"], a: 0 },
  { q: "AI learns by looking at lots of…", o: ["Examples (data)", "Toys", "Shoes", "Clouds"], a: 0 },
];

export const QUALIFICATIONS = ["Matric / O-Level", "Intermediate / A-Level", "Bachelor’s (in progress)", "Bachelor’s (completed)", "Master’s or above", "Other"];
export const KIDS_EXPERIENCE = ["I have not used a computer much", "I play games / watch videos on a tablet or computer", "I have tried coding (Scratch, Code.org, etc.)"];

export const KIDS_DEVICE = ["Laptop or computer", "Tablet", "Phone only", "Not right now"];
export const KIDS_INTERNET = ["Yes, always", "Sometimes", "No"];
export const KIDS_TYPING = ["Not yet", "A little, slowly", "Yes, comfortably"];
