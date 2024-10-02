import ClienteDAO from "../Persistencia/clienteDAO.js";

export default class Cliente {
    #cli_codigo;
    #cli_nome;
    #cli_telefone;
    #cli_endereco;
    #cli_cpf;

    constructor(codigo = null, nome, telefone, endereco, cpf) {
        this.#cli_codigo = codigo;
        this.#cli_nome = nome;
        this.#cli_telefone = telefone;
        this.#cli_endereco = endereco;
        this.#cli_cpf = cpf;
    }

    // Métodos de acesso (get) e modificação (set)

    // Código
    get cli_codigo() {
        return this.#cli_codigo;
    }

    set cli_codigo(novoCodigo) {
        if (novoCodigo === null || typeof novoCodigo !== "number") {
            throw new Error("Formato de dado inválido para código.");
        }
        this.#cli_codigo = novoCodigo;
    }

    // Nome
    get cli_nome() {
        return this.#cli_nome;
    }

    set cli_nome(novoNome) {
        if (!novoNome || novoNome.trim() === "") {
            throw new Error("Nome não pode ser vazio.");
        }
        this.#cli_nome = novoNome;
    }

    // Telefone
    get cli_telefone() {
        return this.#cli_telefone;
    }

    set cli_telefone(novoTelefone) {
        if (!novoTelefone || novoTelefone.length !== 14) {
            throw new Error("Formato de telefone inválido. Exemplo: (XX) XXXXX-XXXX");
        }
        this.#cli_telefone = novoTelefone;
    }

    // Endereço
    get cli_endereco() {
        return this.#cli_endereco;
    }

    set cli_endereco(novoEndereco) {
        if (!novoEndereco || novoEndereco.trim() === "") {
            throw new Error("Endereço não pode ser vazio.");
        }
        this.#cli_endereco = novoEndereco;
    }

    // CPF
    get cli_cpf() {
        return this.#cli_cpf;
    }

    set cli_cpf(novoCpf) {
        if (!novoCpf || novoCpf.length !== 11 || isNaN(novoCpf)) {
            throw new Error("CPF deve ter 11 dígitos numéricos.");
        }
        this.#cli_cpf = novoCpf;
    }

    // JSON
    toJSON() {
        return {
            cli_codigo: this.#cli_codigo,
            cli_nome: this.#cli_nome,
            cli_telefone: this.#cli_telefone,
            cli_endereco: this.#cli_endereco,
            cli_cpf: this.#cli_cpf
        };
    }

    async gravar() {
        const clienteDAO = new ClienteDAO();
        try {
            const codigoGravado = await clienteDAO.gravar(this);
            this.cli_codigo = codigoGravado; // Atualiza o código após a gravação
        } catch (erro) {
            console.error("Erro ao gravar cliente:", erro.message);
            throw erro;  
        }
    }

    async atualizar() {
        const clienteDAO = new ClienteDAO();
        try {
            await clienteDAO.atualizar(this);
        } catch (erro) {
            console.error("Erro ao atualizar cliente:", erro.message);
            throw erro;  
        }
    }

    async excluir() {
        const clienteDAO = new ClienteDAO();
        try {
            await clienteDAO.excluir(this);
        } catch (erro) {
            console.error("Erro ao excluir cliente:", erro.message);
            throw erro; 
        }
    }

    async consultar(termo) {
        const clienteDAO = new ClienteDAO();
        try {
            const listaClientes = await clienteDAO.consultar(termo);
            return listaClientes;
        } catch (erro) {
            console.error("Erro ao consultar clientes:", erro.message);
            throw erro;  
        }
    }
}