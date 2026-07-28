const container = document.querySelector(".container");

function mudarPagina(indice){

    container.style.transform = `translateX(-${indice * 100}vw)`;

}