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

document.addEventListener("DOMContentLoaded", () => {
    const formLogin= document.querySelector('form');

    if(formLogin){
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault(); //impedir recarregamento

            //pegar valores que user digita

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try{
                const resposta = await fetch('http://127.0.0.1:5501/login', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, senha})
                });
                const resultado = await resposta.json();

                if (resposta.ok){
                    console.log(resultado.mensage);

                    //guardar id e nome do usuario p saber qm ta usando a pag
                    localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));

                    //redireciona para a tela do site
                    window.location.href = "telainicial.html";
                }else{
                    alert(resultado.erro);
                }
            } catch (erro){
                console.error("erro ao conectar o servidor", erro);
                alert("Não foi possível conectar ao servidor backend.")
            }
        });
    }
});

