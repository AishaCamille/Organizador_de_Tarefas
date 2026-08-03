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
        return jsonfy({"erro": "email e senha são obrigatorios"}), 400

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

    

if __name__ =='__main__':
    #roda servidor n porta
    app.run(debug=True, port=5501)