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
//caputurar os elemntos do front
const inputTarefa = document.getElementById("tarefa");
const listaDeTarefas = document.getElementById("listaDeTarefas");
const listaConcluidas = document.getElementById("listaConcluidas");//lista para a pag de concluidas


//event listener quando usuario apertar o enter no input
inputTarefa.addEventListener("keypress", function(event) {
    //verificar se a tecla apertado foi o enter
    if (event.key == "Enter"){
        const textoTarefa = inputTarefa.value.trim() //remove espaço do texto

        if (textoTarefa !== ""){
            criarNovaTarefa(textoTarefa);
            inputTarefa.value = ""; //limpar o input
        }
    }
});
// cria e exibe a tarefa com o botão de iniciar e contador
function criarNovaTarefa(texto){

    //container que alinha a tarefa e os controles lado a lado
    const containerTarefa = document.createElement("div");
    containerTarefa.classList.add("grupo-tarefa");

    //cria elemento de lista
    const novoItem = document.createElement("li");
    novoItem.classList.add("item-tarefa");
    novoItem.innerText = texto;
    containerTarefa.appendChild(novoItem);

    //display temporizador
    // CORREÇÃO 1: Mudado de textoSpan para tempSpan para bater com o restante do código
    const tempSpan = document.createElement("span");
    tempSpan.classList.add("tempo-tarefa");
    tempSpan.innerText = "00:00";
    containerTarefa.appendChild(tempSpan);

    //botão que inicia a tarefa
    const btnIniciar = document.createElement("button");
    btnIniciar.classList.add("btn-iniciar");
    btnIniciar.innerText = "Iniciar";
    containerTarefa.appendChild(btnIniciar);

    //variaveis para controlar o tempo da tarefa
    let segundos = 0;
    let cronometro = null;
    let rodando = false;
    let timeoutConclusao = null;

    //logica botão iniciar/pausar
    btnIniciar.addEventListener("click", function(event) {
        event.stopPropagation(); //para impedir o clique de ativar a conclusão da tarefa

        if (!rodando){
            rodando = true;
            btnIniciar.innerText = "Pausar";
            btnIniciar.style.backgroundColor = "#ff6b6b"; // cor do botão quando estiver rodando

            // inicia contagem dos segundos
            cronometro = setInterval(() =>{
                segundos++;
                let min = Math.floor(segundos/60).toString().padStart(2, '0');
                let seg = (segundos % 60).toString().padStart(2, '0');
                tempSpan.innerText = ` (${min}:${seg})`;
            }, 1000);
        }else{
            // pausa o tempo se clicado novamente
            rodando = false;
            btnIniciar.innerText = "Retomar";
            btnIniciar.style.backgroundColor = "#218b29";
            clearInterval(cronometro);
        }
    });


    //risca para concluir a tarefa quando clicada
    novoItem.addEventListener("click", function() {
        const jaConcluida = novoItem.classList.toggle("concluida");

        if(jaConcluida){
            clearInterval(cronometro);
            rodando = false;

            //esconde botões q estão do lado
            btnIniciar.style.display = "none";

            //exibe o tempo gasto congelado por 5 segundos antes de sumir
            let min = Math.floor(segundos / 60).toString().padStart(2, '0');
            let seg = (segundos % 60).toString().padStart(2, '0');
            tempSpan.innerText = `Gastou: ${min}:${seg}`;
        
            // Adicionado "timeoutConclusao =" para possibilitar o cancelamento se desmarcado
            timeoutConclusao = setTimeout(() => {
                listaDeTarefas.removeChild(containerTarefa);//remove de pendentes
                containerTarefa.removeChild(novoItem);// Remove o <li> de dentro do container para limpar completamente
               novoItem.classList.remove("concluida");
                listaConcluidas.appendChild(novoItem); //adc na pag de concluidas
            }, 5000);
        }else{
            // Se desmarcar antes dos 5 segundos, cancela o envio e restaura os controles
            clearTimeout(timeoutConclusao); 
            btnIniciar.style.display = "inline-block"; 
            btnIniciar.innerText = "Iniciar";
            btnIniciar.style.backgroundColor = ""; 
            segundos = 0; 
            tempSpan.innerText = "00:00";
        }
    });
    
    // Adiciona o CONTAINER na lista com o li, timer e botão dentro e não apenas o li isolado
    listaDeTarefas.appendChild(containerTarefa);
}