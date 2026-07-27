from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from werkzeug.security import generate_password_hash

app = Flask(__name__)
CORS(app) #para permitir que o front acessse o back localmente

#configurar a conexão com o banco postgree
def obter_conexao_banco():
    return psycopg2.connect(
        host="localhost",
        database="Organizador_tarefas",
        user="postgres",
        password="Mondler12."
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
    except psycopg2.erros.UniqueViolation:
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

if __name__ =='__main__':
    #roda servidor n porta
    app.run(debug=True, port=5000)

@app.route('/login', methods=['POST'])
def logar_usuario():
    #logica p verificar se email existe no banco
    return "login autorizado"