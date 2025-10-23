const adaptiveFN = document.getElementById('adaptiveFN');
const adaptiveLN = document.getElementById('adaptiveLN');
const adaptiveCN = document.getElementById('adaptiveCN');
const adaptiveCP = document.getElementById('adaptiveCP');
const adaptiveCO = document.getElementById('adaptiveCO');
const adaptiveSU = document.getElementById('adaptiveSU');
const adaptiveE = document.getElementById('adaptiveE');
const adaptive = {adaptiveFN: "First Name", adaptiveLN: "Last Name", adaptiveE: "E-Mail", adaptiveCN: "Company Name (Optional)", adaptiveCP: "Company Position (Optional)", adaptiveCO: "Country", adaptiveSU: "Subject (Optional)"};
const con_adaptive = list(adaptive);
let index = 0;
let typed = false;

function typeEffect() {
    if (index < con_adaptive.length) {
        let subject = con_adaptive[index];
        let text = adaptive[subject];
        index++;
        subject.style.fontFamily = "Pacifico";
        let i = 0;
        subject.textContent = '';
        const interval = setInterval(() => {
        subject.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            typing = false;
        }
        }, 90);
    }
}
/*
if (!typed) {
    for(let i = 0; i < con_adaptive.length; i++) {
        con_adaptive[i].textContent = '';
    }
    typed = true;
}
*/    
// typeEffect()