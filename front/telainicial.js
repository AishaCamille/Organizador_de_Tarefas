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

//lista de tarefas
//caputurar os elemntos do front
const inputTarefa = document.getElementById("tarefa");
const listaDeTarefas = document.getElementById("listaDeTarefas");


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
//cria e exibe a tarefa
function criarNovaTarefa(texto){
    //cria elemtno de lista
    const novoItem = document.createElement("li");
    novoItem.classList.add("item-tarefa");

    //definir o texto dentro dele
    novoItem.innerText = texto;

    //risca para concluir a tarefa quando clicada
    novoItem.addEventListener("click", function() {
        novoItem.classList.toggle("concluida");
    });
    //colcoa novo item criado dentro da lista ul
    listaDeTarefas.appendChild(novoItem);
}
