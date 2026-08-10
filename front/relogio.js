// Variáveis de controle
let tempoTotalSegundo = 0;
let tempoRestante = 0;
let timerId = null;
let modoAtual = 'foco'; // 'foco' ou 'descanso'
let rodando = false;

// Elementos HTML
const displayDigital = document.getElementById('displayDigital');
const statusPomodoro = document.getElementById('statusPomodoro');
const inputFoco = document.getElementById('inputFoco');
const inputDescanso = document.getElementById('inputDescanso');
const btnStart = document.getElementById('btnStartPomodoro');
const btnReset = document.getElementById('btnResetPomodoro');

const ponteiroMinuto = document.getElementById('ponteiroMinuto');
const ponteiroHora = document.getElementById('ponteiroHora');

// Inicializa o tempo de acordo com a fase atual
function inicializarTempo() {
    if (!rodando) {
        let minutos = 25;
        if (modoAtual === 'foco') {
            minutos = parseInt(inputFoco.value) || 25;
        } else {
            minutos = parseInt(inputDescanso.value) || 5;
        }
        
        tempoTotalSegundo = minutos * 60;
        tempoRestante = tempoTotalSegundo;
        atualizarDisplay();
    }
}

// Atualiza o display digital e a rotação dos ponteiros no relógio redondo
function atualizarDisplay() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    
    // Atualiza texto digital
    const minStr = String(minutos).padStart(2, '0');
    const segStr = String(segundos).padStart(2, '0');
    displayDigital.textContent = `${minStr}:${segStr}`;

    // Ângulo dos ponteiros (baseado em 360 graus)
    // Ponteiro dos minutos dá 1 volta completa a cada hora (60 min)
    const grausMinutos = ((360 / 60) * minutos) + ((360 / 3600) * segundos);
    // Ponteiro da hora dá 1 volta completa em 12 horas
    const grausHoras = (360 / 12) * (minutos / 60);

    if (ponteiroMinuto) ponteiroMinuto.style.transform = `rotate(${grausMinutos}deg)`;
    if (ponteiroHora) ponteiroHora.style.transform = `rotate(${grausHoras}deg)`;
}

// Inicia ou Pausa a contagem
function alternarStartPausa() {
    if (rodando) {
        // Pausar
        clearInterval(timerId);
        rodando = false;
        btnStart.textContent = 'Continuar';
    } else {
        // Iniciar / Continuar
        if (tempoRestante <= 0) inicializarTempo();
        
        rodando = true;
        btnStart.textContent = 'Pausar';
        
        timerId = setInterval(() => {
            tempoRestante--;
            atualizarDisplay();

            // Quando o tempo do ciclo esgota
            if (tempoRestante <= 0) {
                clearInterval(timerId);
                rodando = false;
                trocarModo(); // Alterna automaticamente para o próximo ciclo
            }
        }, 1000);
    }
}

// Troca o ciclo Foco -> Descanso
function trocarModo() {
    if (modoAtual === 'foco') {
        modoAtual = 'descanso';
        statusPomodoro.textContent = '☕ Descanso';
        statusPomodoro.className = 'status-pomodoro descanso';
        exibirNotificacao('Tempo de Foco Finalizado!', 'Hora do seu intervalo de descanso.');
    } else {
        modoAtual = 'foco';
        statusPomodoro.textContent = '🎯 Foco';
        statusPomodoro.className = 'status-pomodoro foco';
        exibirNotificacao('Intervalo Finalizado!', 'Hora de voltar ao trabalho focado.');
    }

    inicializarTempo();
    // Inicia o novo ciclo automaticamente
    alternarStartPausa();
}

// Resetar para o estado inicial
function resetarPomodoro() {
    clearInterval(timerId);
    rodando = false;
    modoAtual = 'foco';
    
    btnStart.textContent = 'Iniciar';
    statusPomodoro.textContent = '🎯 Foco';
    statusPomodoro.className = 'status-pomodoro foco';
    
    inicializarTempo();
}

// Notificação Pop-up (Toast)
function fecharToast() {
    const toast = document.getElementById('toastNotification');
    if (toast) toast.classList.remove('mostrar');
}

function exibirNotificacao(titulo, mensagem) {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.querySelector('strong').textContent = titulo;
        toast.querySelector('p').textContent = mensagem;
        toast.classList.add('mostrar');
        
        // Auto-fecha em 5 segundos
        setTimeout(() => {
            fecharToast();
        }, 5000);
    }
}

// Listeners dos Botões e Inputs
btnStart.addEventListener('click', alternarStartPausa);
btnReset.addEventListener('click', resetarPomodoro);

inputFoco.addEventListener('change', () => {
    if (modoAtual === 'foco' && !rodando) inicializarTempo();
});

inputDescanso.addEventListener('change', () => {
    if (modoAtual === 'descanso' && !rodando) inicializarTempo();
});

// Inicialização
inicializarTempo();