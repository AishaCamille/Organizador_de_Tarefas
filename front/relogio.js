// ELEMENTOS DO POMODORO
const ponteiroHora = document.getElementById("ponteiroHora");
const ponteiroMinuto = document.getElementById("ponteiroMinuto");
const displayDigital = document.getElementById("displayDigital");
const inputHoras = document.getElementById("inputHoras");
const inputMinutos = document.getElementById("inputMinutos");
const btnStartPomodoro = document.getElementById("btnStartPomodoro");
const btnResetPomodoro = document.getElementById("btnResetPomodoro");

let timerPomodoro = null;
let totalSegundos = 0;
let tempoRestante = 0;
let rodandoPomodoro = false;

// Função para converter o tempo em graus para girar os ponteiros
function atualizarPonteiros(horas, minutos, segundos) {
    // Minutos: 360 graus / 60 min = 6 graus por minuto (+ ajuste fino dos segundos)
    const grausMinuto = (minutos * 6) + (segundos * 0.1);
    
    // Horas: 360 graus / 12 horas = 30 graus por hora (+ ajuste fino dos minutos)
    const grausHora = ((horas % 12) * 30) + (minutos * 0.5);

    ponteiroMinuto.style.transform = `rotate(${grausMinuto}deg)`;
    ponteiroHora.style.transform = `rotate(${grausHora}deg)`;
}

// Atualiza o visor digital (00:00:00)
function atualizarDisplayDigital(segundosTotais) {
    const h = Math.floor(segundosTotais / 3600);
    const m = Math.floor((segundosTotais % 3600) / 60);
    const s = segundosTotais % 60;

    const hFmt = h.toString().padStart(2, '0');
    const mFmt = m.toString().padStart(2, '0');
    const sFmt = s.toString().padStart(2, '0');

    displayDigital.innerText = `${hFmt}:${mFmt}:${sFmt}`;
    atualizarPonteiros(h, m, s);
}

// Iniciar ou Pausar o Pomodoro
btnStartPomodoro.addEventListener("click", function () {
    if (!rodandoPomodoro) {
        // Se estiver parado no zero, lê os valores digitados nos inputs
        if (tempoRestante === 0) {
            let h = parseInt(inputHoras.value) || 0;
            let m = parseInt(inputMinutos.value) || 0;

            // Limite máximo de 12 horas
            if (h > 12) h = 12;
            if (m > 59) m = 59;

            tempoRestante = (h * 3600) + (m * 60);
            totalSegundos = tempoRestante;
        }

        if (tempoRestante <= 0) return;

        rodandoPomodoro = true;
        btnStartPomodoro.innerText = "Pausar";
        btnStartPomodoro.style.backgroundColor = "#e46520";

        // Cronômetro regressivo
        timerPomodoro = setInterval(() => {
            tempoRestante--;
            atualizarDisplayDigital(tempoRestante);

            // Quando o tempo acabar
            if (tempoRestante <= 0) {
                clearInterval(timerPomodoro);
                rodandoPomodoro = false;
                btnStartPomodoro.innerText = "Iniciar";
                btnStartPomodoro.style.backgroundColor = "#2ed573";
                mostrarToast(); 
            }
        }, 1000);

    } else {
        // Pausar
        clearInterval(timerPomodoro);
        rodandoPomodoro = false;
        btnStartPomodoro.innerText = "Retomar";
        btnStartPomodoro.style.backgroundColor = "#2ed573";
    }
});

// Resetar o Pomodoro
btnResetPomodoro.addEventListener("click", function () {
    clearInterval(timerPomodoro);
    rodandoPomodoro = false;
    tempoRestante = 0;
    btnStartPomodoro.innerText = "Iniciar";
    btnStartPomodoro.style.backgroundColor = "#2ed573";
    
    // Volta para o estado zerado
    atualizarDisplayDigital(0);
});
// Função para mostrar o Pop-up elegante
function mostrarToast() {
    const toast = document.getElementById("toastNotification");
    toast.classList.add("mostrar");

    // Some automaticamente após 5 segundos
    setTimeout(() => {
        fecharToast();
    }, 5000);
}

// Função para fechar o Pop-up
function fecharToast() {
    const toast = document.getElementById("toastNotification");
    toast.classList.remove("mostrar");
}

