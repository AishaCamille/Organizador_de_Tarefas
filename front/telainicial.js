const container = document.querySelector(".container");
const navWrapper = document.getElementById("navWrapper");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");


function mudarPagina(indice){

    container.style.transform = `translateX(-${indice * 100}vw)`;

}

//rolagem horizontal
arrowRight.addEventListener("click", () => {
    //rola 200pz para direita a cada clique
    navWrapper.scrollLeft +=200;
});

arrowLeft.addEventListener("click", () => {
    //rola 200px para  a esquerda
    navWrapper.scrollLeft -=200;
});

//lista de tarefas, e manda para tarefas concluidas
// Captura dos elementos do front
const inputTarefa = document.getElementById("tarefa");
const selectPrioridade = document.getElementById("prioridade");
const listaConcluidas = document.getElementById("listaConcluidas");

// Mapeamento das listas por prioridade
const listasPrioridades = {
    "Urgente": document.getElementById("listaUrgente"),
    "Alta": document.getElementById("listaAlta"),
    "Média": document.getElementById("listaMedia"),
    "Baixa": document.getElementById("listaBaixa")
};

// Event listener quando o usuário apertar Enter no input
inputTarefa.addEventListener("keypress", function(event) {
    if (event.key == "Enter"){
        const textoTarefa = inputTarefa.value.trim();
        const prioridadeEscolhida = selectPrioridade.value;

        if (textoTarefa !== ""){
            criarNovaTarefa(textoTarefa, prioridadeEscolhida);
            inputTarefa.value = ""; // limpa o input
        }
    }
});

// Cria e exibe a tarefa na caixa da prioridade correspondente
function criarNovaTarefa(texto, prioridade){

    // Container que alinha a tarefa, etiqueta e os controles
    const containerTarefa = document.createElement("div");
    containerTarefa.classList.add("grupo-tarefa");

    // Elemento de lista
    const novoItem = document.createElement("li");
    novoItem.classList.add("item-tarefa");
    novoItem.innerText = texto;
    containerTarefa.appendChild(novoItem);
    // Display temporizador
    const tempSpan = document.createElement("span");
    tempSpan.classList.add("tempo-tarefa");
    tempSpan.innerText = "00:00";
    containerTarefa.appendChild(tempSpan);

    // Botão que inicia a tarefa
    const btnIniciar = document.createElement("button");
    btnIniciar.classList.add("btn-iniciar");
    btnIniciar.innerText = "Iniciar";
    containerTarefa.appendChild(btnIniciar);

    // Variáveis para controlar o tempo da tarefa
    let segundos = 0;
    let cronometro = null;
    let rodando = false;
    let timeoutConclusao = null;

    // Lógica botão iniciar/pausar
    btnIniciar.addEventListener("click", function(event) {
        event.stopPropagation(); // Impede o clique de ativar a conclusão

        if (!rodando){
            rodando = true;
            btnIniciar.innerText = "Pausar";
            btnIniciar.style.backgroundColor = "#ed1782";

            cronometro = setInterval(() =>{
                segundos++;
                let min = Math.floor(segundos/60).toString().padStart(2, '0');
                let seg = (segundos % 60).toString().padStart(2, '0');
                tempSpan.innerText = ` (${min}:${seg})`;
            }, 1000);
        } else {
            rodando = false;
            btnIniciar.innerText = "Retomar";
            btnIniciar.style.backgroundColor = "#41e16f";
            clearInterval(cronometro);
        }
    });

    // Identifica qual a lista destino com base na prioridade
    const listaAlvo = listasPrioridades[prioridade] || listasPrioridades["Média"];

    // Risca para concluir a tarefa quando clicada
    novoItem.addEventListener("click", function() {
        const jaConcluida = novoItem.classList.toggle("concluida");

        if(jaConcluida){
            clearInterval(cronometro);
            rodando = false;

            btnIniciar.style.display = "none";
            //badgePrioridade.style.display = "none";

            let min = Math.floor(segundos / 60).toString().padStart(2, '0');
            let seg = (segundos % 60).toString().padStart(2, '0');
            tempSpan.innerText = `Gastou: ${min}:${seg}`;
        
            timeoutConclusao = setTimeout(() => {
                listaAlvo.removeChild(containerTarefa); // Remove da caixa de pendentes específica
                containerTarefa.removeChild(novoItem);  // Limpa o li
                novoItem.classList.remove("concluida");
                listaConcluidas.appendChild(novoItem);   // Envia para tarefas concluídas
            }, 5000);
        } else {
            clearTimeout(timeoutConclusao); 
            btnIniciar.style.display = "inline-block"; 
            //badgePrioridade.style.display = "inline-block";
            btnIniciar.innerText = "Iniciar";
            btnIniciar.style.backgroundColor = ""; 
            segundos = 0; 
            tempSpan.innerText = "00:00";
        }
    });
    
    // Adiciona o container na lista da prioridade escolhida
    listaAlvo.appendChild(containerTarefa);
}