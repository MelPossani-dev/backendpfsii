import Cliente from "../Modelo/Cliente.js";
import conectar from "../Persistencia/conexao.js";

export default class ClienteDAO {
    constructor() {
        this.init();
    }
    
    async init() {
        try {
            const conexao = await conectar(); // Retorna uma conexão
            const sql = `
                CREATE TABLE IF NOT EXISTS cliente(
                    cli_codigo INT NOT NULL AUTO_INCREMENT,
                    cli_nome VARCHAR(100) NOT NULL,
                    cli_telefone VARCHAR(14),
                    cli_endereco VARCHAR(100),
                    cli_cpf VARCHAR(14) UNIQUE,
                    CONSTRAINT pk_cliente PRIMARY KEY(cli_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.error("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(cliente) {
        if (cliente instanceof Cliente) {
            const sql = "INSERT INTO cliente(cli_nome, cli_telefone, cli_endereco, cli_cpf) VALUES(?,?,?,?)"; 
            const parametros = [cliente.cli_nome, cliente.cli_telefone, cliente.cli_endereco, cliente.cli_cpf];
            const conexao = await conectar(); // Retorna uma conexão
            try {
                const retorno = await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
                cliente.cli_codigo = retorno[0].insertId; // Atualiza o código do cliente
            } catch (erro) {
                console.error("Erro ao gravar cliente:", erro);
                throw erro; // Re-lança erro para tratamento superior
            } finally {
                conexao.release(); // Libera a conexão
            }
        }
    }

    async atualizar(cliente) {
        if (cliente instanceof Cliente) {
            const sql = "UPDATE cliente SET cli_nome = ?, cli_telefone = ?, cli_endereco = ?, cli_cpf = ? WHERE cli_codigo = ?"; 
            const parametros = [cliente.cli_nome, cliente.cli_telefone, cliente.cli_endereco, cliente.cli_cpf, cliente.cli_codigo];
            const conexao = await conectar(); // Retorna uma conexão
            try {
                await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
            } catch (erro) {
                console.error("Erro ao atualizar cliente:", erro);
                throw erro; // Re-lança erro para tratamento superior
            } finally {
                conexao.release(); // Libera a conexão
            }
        }
    }

    async excluir(cliente) {
        if (cliente instanceof Cliente) {
            const sql = "DELETE FROM cliente WHERE cli_codigo = ?"; 
            const parametros = [cliente.cli_codigo];
            const conexao = await conectar(); // Retorna uma conexão
            try {
                await conexao.execute(sql, parametros); // Prepara a SQL e depois executa
            } catch (erro) {
                console.error("Erro ao excluir cliente:", erro);
                throw erro; // Re-lança erro para tratamento superior
            } finally {
                conexao.release(); // Libera a conexão
            }
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        
        // Verifica se parametroConsulta é um número
        if (!isNaN(parseInt(parametroConsulta))) {
            // Consultar pelo código do cliente
            sql = 'SELECT * FROM cliente WHERE cli_codigo = ? ORDER BY cli_codigo';
            parametros = [parseInt(parametroConsulta)];
        } else {
            // Consultar pelo telefone ou CPF
            sql = "SELECT * FROM cliente WHERE cli_telefone LIKE ? OR cli_cpf LIKE ? ORDER BY cli_nome";
            parametros = ['%' + (parametroConsulta || '') + '%', '%' + (parametroConsulta || '') + '%'];
        }

        const conexao = await conectar();
        try {
            const [registros] = await conexao.execute(sql, parametros);
            const listaClientes = registros.map(registro => new Cliente(
                registro.cli_codigo,
                registro.cli_nome,
                registro.cli_telefone,
                registro.cli_endereco,
                registro.cli_cpf
            ));
            return listaClientes;
        } catch (erro) {
            console.error("Erro ao consultar clientes:", erro);
            throw erro; // Re-lança erro para tratamento superior
        } finally {
            conexao.release(); // Libera a conexão
        }
    }
}