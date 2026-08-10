const API_URL = "http://127.0.0.1:5501"

async function cadastrarTarefaNoBanco(nomeTopico, prioridade) {
    //recuperar id do usuario logado
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    //valida se usuario ta logado
    if(!usuarioSalvo){
        alert("Sessão expirada. Por favor, faça login novamente.");
        return null;
    }
    //  Transforma a string JSON de volta em um Objeto JavaScript
    const usuarioObj = JSON.parse(usuarioSalvo);

    //extrair id pessoa do objeto
    const idPessoa = usuarioObj.id;
    //montagem do objeto com dados exatos da rota
    const dadosTarefa = {
        nome_topico: nomeTopico,
        prioridade : prioridade,
        id_pessoa: parseInt(idPessoa)
    };

    try{
        //requisição post
        const resposta = await fetch(`${API_URL}/topicos`,{
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(dadosTarefa)
        });
        const dadosResposta = await resposta.json();

        //vericação se api retornou 201 criado com sucesso
        if(resposta.ok){
            console.log("Sucesso:", dadosResposta.mensagem);
            return dadosResposta.id_topicos; // Retorna a resposta para quem chamou a função
        } else {
            console.error("Erro da API:", dadosResposta.erro);
            alert(`Erro ao salvar: ${dadosResposta.erro}`);
            return null;
        }
        
    } catch(erro){
        console.error("Erro de conexão com o servidor:", erro);
        alert("Servidor indisponível no momento. Tente novamente mais tarde.");
        return null;
    }
    
}
async function buscarTarefasPendentesDoBanco() {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (!usuarioSalvo) return [];

    const usuarioObj = JSON.parse(usuarioSalvo);
    const idPessoa =  usuarioObj.id;

    try {
        const resposta = await fetch(`${API_URL}/topicos/${idPessoa}`);
        const tarefas = await resposta.json();

        if (resposta.ok) {
            return tarefas; // Retorna a lista vinda do banco
        } else {
            console.error("Erro ao buscar tarefas:", tarefas.erro);
            return [];
        }
    } catch (erro) {
        console.error("Erro de conexão ao carregar tarefas:", erro);
        return [];
    }
}
async function buscarTarefasConcluidas() {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (!usuarioSalvo) return [];

    const usuarioObj = JSON.parse(usuarioSalvo);
    const idPessoa = usuarioObj.id;

    try {
        const resposta = await fetch(`${API_URL}/topicosConcluidos/${idPessoa}`);
        const tarefas = await resposta.json();

        if (resposta.ok) {
            return tarefas; // Retorna a lista vinda do banco
        } else {
            console.error("Erro ao buscar tarefas:", tarefas.erro);
            return [];
        }
    } catch (erro) {
        console.error("Erro de conexão ao carregar tarefas:", erro);
        return [];
    }
}

async function atualizarTarefaNoBanco(idTopicos, concluida, tempoFormatada) {
    try{
        const resposta = await fetch(`${API_URL}/topicos/${idTopicos}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                concluida: concluida,
                tempo_tarefa: tempoFormatada 
            })
        });

        const dadosResposta = await resposta.json();

        if (resposta.ok){
            console.log("tarefa att")
        }else{
            console.error("erro api p atualizar:", dadosResposta.erro);
        }
    } catch(erro){
        console.error("erro de conexão ao atualizar: ", erro)
    }
    
}