function loginpag(){
    window.location.href="login.html";
}
function homepage(){
    window.location.href="index.html";
}
 // Aguarda o DOM carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('closeBtn');

    // Abre a navbar lateral deslizando
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    // Função para fechar a navbar lateral
    const closeSidebar = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };

    // Fecha ao clicar no 'X' ou no fundo escuro escurecido
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
});

//logica mandar cadastro p banco
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede a página de recarregar

    // Coleta os valores dos inputs do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        // Faz a requisição HTTP POST para o backend em Python
        const resposta = await fetch('http://127.0.0.1:5000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.mensagem); 
            window.location.href = "login.html"; // Redireciona para a tela de login
        } else {
            alert(resultado.erro); // Exibe mensagens de validação ou e-mail duplicado
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor backend.");
    }
});