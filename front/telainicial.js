const container = document.querySelector(".container");
const navWrapper = document.getElementById("navWrapper");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");


async function mudarPagina(indice) {

    container.style.transform = `translateX(-${indice * 100}vw)`;
    if (indice == 1) {
        listaConcluidas.innerHTML= ""; //limpar lista do local
        const tarefasConcluidas = await buscarTarefasConcluidas();

        if (Array.isArray(tarefasConcluidas)){
            tarefasConcluidas.forEach(tarefa => {
                listarTarefas(tarefa.nome_topico);
            });
        }
    }

}

//rolagem horizontal
arrowRight.addEventListener("click", () => {
    //rola 200pz para direita a cada clique
    navWrapper.scrollLeft += 200;
});

arrowLeft.addEventListener("click", () => {
    //rola 200px para  a esquerda
    navWrapper.scrollLeft -= 200;
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
inputTarefa.addEventListener("keypress", async function (event) {
    if (event.key == "Enter") {
        const textoTarefa = inputTarefa.value.trim();
        const prioridadeEscolhida = selectPrioridade.value;

        if (textoTarefa !== "") {
            //salvar no banco de dados
            const resultado = await cadastrarTarefaNoBanco(textoTarefa, prioridadeEscolhida);

            //se se sucesso, poe na tela
            if (resultado) {
                const idTopicos = resultado.id_topicos;
                
                criarNovaTarefa(textoTarefa, prioridadeEscolhida, idTopicos);
                inputTarefa.value = ""; // limpa o input
            }

        }
    }
});

// Cria e exibe a tarefa na caixa da prioridade correspondente
 function criarNovaTarefa(texto, prioridade, idTopicos) {

    // Container que alinha a tarefa, etiqueta e os controles
    const containerTarefa = document.createElement("div");
    containerTarefa.classList.add("grupo-tarefa");
    if(idTopicos){
    containerTarefa.dataset.id = idTopicos;
    }else{
        console.error("id topicos n retornado: ");
    }

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
    btnIniciar.addEventListener("click", function (event) {
        event.stopPropagation(); // Impede o clique de ativar a conclusão

        if (!rodando) {
            rodando = true;
            btnIniciar.innerText = "Pausar";
            btnIniciar.style.backgroundColor = "#ed1782";

            cronometro = setInterval(() => {
                segundos++;
                let min = Math.floor(segundos / 60).toString().padStart(2, '0');
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
    novoItem.addEventListener("click", function () {
        const jaConcluida = novoItem.classList.toggle("concluida");
        const idTopicos = containerTarefa.dataset.id;

        if (jaConcluida) {
            clearInterval(cronometro);
            rodando = false;

            btnIniciar.style.display = "none";

            let min = Math.floor(segundos / 60).toString().padStart(2, '0');
            let seg = (segundos % 60).toString().padStart(2, '0');
            let tempoFormatado = `00:${min}:${seg}`;
            tempSpan.innerText = `Gastou: ${min}:${seg}`;
            
            //atualiza tarefa concluida e o seu tempo no banco de dados
            if(idTopicos){
                 atualizarTarefaNoBanco(idTopicos, true, tempoFormatado);
            }

            timeoutConclusao = setTimeout(() => {
                listaAlvo.removeChild(containerTarefa); // Remove da caixa de pendentes específica
                //containerTarefa.removeChild(novoItem);  // Limpa o li
                //novoItem.classList.remove("concluida");
                //listaConcluidas.appendChild(novoItem);   // Envia para tarefas concluídas
                listarTarefas(texto);
            }, 5000);
        } else {//se a tarefa for desmarcada antes dos 5 segundos, desfaz a alteração
            clearTimeout(timeoutConclusao);
            btnIniciar.style.display = "inline-block";
            btnIniciar.innerText = "Iniciar";
            btnIniciar.style.backgroundColor = "";
            if(idTopicos){
                 atualizarTarefaNoBanco(idTopicos, false, "00:00:00");
            }
            segundos = 0;
            tempSpan.innerText = "00:00";
        }
    });

    // Adiciona o container na lista da prioridade escolhida
    listaAlvo.appendChild(containerTarefa);
}

function listarTarefas(texto) {
    const novoItem = document.createElement("li");
    novoItem.classList.add("item-tarefa");
    novoItem.innerText = texto;
    
    // Adiciona direto na UL sem criar um container intermediário
    listaConcluidas.appendChild(novoItem);
}
// Função que roda assim que a página é carregada
document.addEventListener("DOMContentLoaded", async function () {
    // Busca a lista de pendentes no Python
    const tarefasDoBanco = await buscarTarefasPendentesDoBanco();


    // Desenha cada tarefa que veio do banco na tela
    tarefasDoBanco.forEach(tarefa => {
        criarNovaTarefa(tarefa.nome_topico, tarefa.prioridade, tarefa.id_topicos);
    });


});