from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app) #para permitir que o front acessse o back localmente

#configurar a conexão com o banco postgree
def obter_conexao_banco():
    return psycopg2.connect(
        host="localhost",
        database="Organizador_tarefas",
        user="postgres",
        password="Mondler12.",
        port="5432"
    )


@app.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    dados = request.get_json()

    #pegas dados do front
    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')

    #validação basica
    if not nome or not email or not senha:
        return jsonify({"erro":"preencha todos os campos"}), 400

    #criptografia de senha
    senha_criptografada = generate_password_hash(senha)

    conn = None
    cursor = None

    try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        #inserindo na tabela pessoa
        comando_sql = """
            INSERT INTO Pessoa (nome_sobrenome, email, senha)
            VALUES (%s, %s, %s);
        """
        cursor.execute(comando_sql, (nome, email, senha_criptografada))
        conn.commit() #salva a alteração no banco

        return jsonify({"mensagem":"ususario cadastrado!"}), 201
    except psycopg2.errors.UniqueViolation:
        #erro se usar email q ja existe
        if conn: conn.rollback()
        return jsonify({"erro": "email ja existe!"}), 409
    except Exception as e:
        if conn:conn.rollback()
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500
        
    finally:
        # Garante o fechamento das conexões
        if cursor: cursor.close()
        if conn: conn.close()



@app.route('/login', methods=['POST'])
def logar_usuario():
    dados = request.get_json()

    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({"erro": "email e senha são obrigatorios"}), 400

    conn = None
    cursor = None

    try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        #busca o usuario pelo email 
        comando_sql = "SELECT id_pessoa, nome_sobrenome, senha FROM Pessoa WHERE email = %s;"
        cursor.execute(comando_sql, (email,))
        usuario = cursor.fetchone() #para pegar o primeiro registro encontrado

        #verifica se email existe no banco
        if not usuario:
            return jsonify({"erro":"email ou senha incorretos"}), 401

        #desestrutura os dados vindos do banco 
        id_pessoa, nome, senha_criptografada_banco = usuario

        #verifica se a senha digitada bate com a senha criptografada do banco
        if check_password_hash(senha_criptografada_banco, senha):
            #sucesso
            return jsonify({
                "mensagem": f"Ben vindo de volta, {nome}!",
                "usuario": {
                    "id": id_pessoa,
                    "nome": nome
                }
            }), 200
        else:
            return jsonify({"erro": "E-mail ou senha incorretos!"}), 401
    except Exception as e:
        return jsonify({"erro": f"erro interno: {str(e)}"}), 500
    
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


#para topicos
@app.route('/topicos', methods=['POST'])
def cadastro_topicos():
    dados = request.get_json()

    nome_topico = dados.get('nome_topico')
    tempo_tarefa = dados.get('tempo_tarefa', '00:00:00')
    prioridade = dados.get('prioridade')
    concluida = dados.get('concluida', False)
    id_pessoa = dados.get('id_pessoa')

    if not nome_topico or not id_pessoa:
        return jsonify({"erro": "nome da terfa e id da pessoa sao obrigatorio"}), 400

    conn = None
    cursor = None

    try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        #buscar no banco
        comando_sql = """
                INSERT INTO Topicos (nome_topico, tempo_tarefa, prioridade, concluida, id_pessoa)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id_topicos;
            """
        cursor.execute(comando_sql, (nome_topico, tempo_tarefa, prioridade, concluida, id_pessoa))
        id_gerado = cursor.fetchone()[0]
        conn.commit() #salva alteração no banco

        return jsonify({
            "mensagem": "tarefa cadastrada no banco",
            "id_topicos": id_gerado
        }), 201
    except Exception as e:
            if conn:conn.rollback()
            return jsonify({"erro": f"Erro interno: {str(e)}"}), 500
    finally:
        # Garante o fechamento das conexões
                if cursor: cursor.close()
                if conn: conn.close()

@app.route('/topicos/<int:id_pessoa>', methods=['GET'])
def listar_pendentes(id_pessoa):
     conn = None
     cursor = None

     try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        comando_sql = """
            SELECT id_topicos, nome_topico, tempo_tarefa, prioridade, concluida, id_pessoa
            FROM Topicos
            WHERE id_pessoa = %s AND concluida = FALSE;
            """
        cursor.execute(comando_sql, (id_pessoa,))

        #pega todas as linhas retornadas do banco
        linhas = cursor.fetchall()

        #conversão das tuplas do postgre em uma lista de dicionarios
        tarefas_pendentes = []
        for linha in linhas:
             tarefas_pendentes.append({
                "id_topicos": linha[0],
                "nome_topico": linha[1],
                "tempo_tarefa": str(linha[2]), # Convertemos o tipo TIME para texto
                "prioridade": linha[3],
                "concluida": linha[4],
                "id_pessoa": linha[5]
             })
        return jsonify(tarefas_pendentes), 200
     except Exception as e:
          return jsonify({"erro":f"erro p buscar tarefas : {str(e)}"}), 500

     finally:
        if cursor: 
            cursor.close()
        if conn: 
            conn.close()


@app.route('/topicosConcluidos/<int:id_pessoa>', methods=['GET'])
def listar_concluida(id_pessoa):
     conn = None
     cursor = None

     try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        comando_sql = """
            SELECT id_topicos, nome_topico, concluida, id_pessoa
            FROM Topicos
            WHERE id_pessoa = %s AND concluida = TRUE;
            """
        cursor.execute(comando_sql, (id_pessoa,))

        #pega todas as linhas retornadas do banco
        linhas = cursor.fetchall()

        #conversão das tuplas do postgre em uma lista de dicionarios
        tarefas_concluida = []
        for linha in linhas:
             tarefas_concluida.append({
                "id_topicos": linha[0],
                "nome_topico": linha[1],
                "concluida": linha[2],
                "id_pessoa": linha[3]
             })
        return jsonify(tarefas_concluida), 200
     except Exception as e:
          return jsonify({"erro":f"erro p buscar tarefas : {str(e)}"}), 500

     finally:
        if cursor: 
            cursor.close()
        if conn: 
            conn.close()

@app.route('/topicos/<int:id_topicos>', methods=['PUT'])
def atualizar_topico(id_topicos):
    dados = request.get_json()

    concluida = dados.get('concluida', True)
    tempo_tarefa = dados.get('tempo_tarefa', '00:00:00')

    conn = None
    cursor = None

    try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        #sql para update
        comando_sql = """
                UPDATE Topicos
                SET concluida = %s, tempo_tarefa = %s
                WHERE id_topicos = %s;
                """
        cursor.execute(comando_sql, (concluida, tempo_tarefa, id_topicos))
        conn.commit()

        return jsonify({"mensagem": "tarefa atualizada com sucesso"}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"erro": f"error para atualizar tarefa: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#rota para devolver uma lista ordenada das tarefas do menor tempo até o maior
@app.route('/topicos/tempo/<int:id_pessoa>', methods=['GET'])
def listar_por_tempo(id_pessoa):
    conn= None
    cursor = None

    try:
        conn = obter_conexao_banco()
        cursor = conn.cursor()

        #order by do sql para devolver a lista ordenada
        comando_sql = """
                SELECT id_topicos, nome_topico, tempo_tarefa, prioridade, concluida
            FROM Topicos
            WHERE id_pessoa = %s
            ORDER BY tempo_tarefa ASC;
        """
        cursor.execute(comando_sql, (id_pessoa,))
        linhas = cursor.fetchall()

        tarefas_ordenadas = []
        for linha in linhas:
            tarefas_ordenadas.append({
                
                "id_topicos": linha[0],
                "nome_topico": linha[1],
                "tempo_tarefa": str(linha[2]), # Retorna no formato 'HH:MM:SS'
                "prioridade": linha[3],
                "concluida": linha[4]
            })
        return jsonify(tarefas_ordenadas), 200

    except Exception as e:
        return jsonify({"erro": f"Erro ao buscar tarefas por tempo: {str(e)}"}), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

if __name__ =='__main__':
    #roda servidor n porta
    app.run(debug=True, port=5501)