import PedidoDAO from "../Persistencia/pedidoDAO.js";

export default class Pedido {
    #codigo;
    #cliente;
    #data;
    #total;
    #itens;
    #pedidoDAO;

    constructor(codigo = null, cliente, data = new Date(), total = 0.00, itens = []) {
        this.#pedidoDAO = new PedidoDAO();
        this.#codigo = codigo; 
        this.cliente = cliente; 
        this.data = data;
        this.total = total;
        this.itens = itens;
    }

    // Métodos de acesso (get) e modificação (set)

    // Código
    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        if (typeof novoCodigo !== "number" || novoCodigo <= 0) {
            throw new Error("Formato de dado inválido: o código deve ser um número positivo.");
        }
        this.#codigo = novoCodigo;
    }

    // Código do Cliente
    get cliente() {
        return this.#cliente;
    }

    set cliente(novoCliente) {
        if (!novoCliente || typeof novoCliente.cli_codigo !== "number") {
            throw new Error("Cliente inválido: deve ser um objeto com um código de cliente.");
        }
        this.#cliente = novoCliente;
    }

    // Data
    get data() {
        return this.#data;
    }

    set data(novaData) {
        if (!(novaData instanceof Date)) {
            throw new Error("Data inválida: deve ser um objeto Date.");
        }
        this.#data = novaData;
    }

    // Total do Pedido
    get total() {
        return this.#total;
    }

    set total(novoTotal) {
        if (typeof novoTotal !== "number" || novoTotal < 0) {
            throw new Error("Total inválido: deve ser um número não negativo.");
        }
        this.#total = novoTotal;
    }

    // Itens
    get itens() {
        return this.#itens;
    }

    set itens(novosItens) {
        if (!Array.isArray(novosItens)) {
            throw new Error("Itens inválidos: deve ser um array.");
        }
        this.#itens = novosItens;
    }

    // JSON
    toJSON() {
        return {
            codigo: this.#codigo,
            cliente: this.#cliente.cli_codigo,
            clienteNome: this.#cliente.cli_nome,
            clienteTelefone: this.#cliente.cli_telefone,
            clienteEndereco: this.#cliente.cli_endereco,
            clienteCpf: this.#cliente.cli_cpf,
            data: this.#data.toISOString(),
            total: this.#total,
            itens: this.#itens,
        };
    }

    async gravar() {
        try {
            this.codigo = await this.#pedidoDAO.gravar(this);
        } catch (erro) {
            console.error("Erro ao gravar pedido:", erro.message);
            throw erro;  
        }
    }

    async atualizar() {
        try {
            await this.#pedidoDAO.atualizar(this);
        } catch (erro) {
            console.error("Erro ao atualizar pedido:", erro.message);
            throw erro;  
        }
    }

    async excluir() {
        try {
            await this.#pedidoDAO.excluir(this);
        } catch (erro) {
            console.error("Erro ao excluir pedido:", erro.message);
            throw erro; 
        }
    }

    async consultar(termoBusca) {
        try {
            return await this.#pedidoDAO.consultar(termoBusca);
        } catch (erro) {
            console.error("Erro ao consultar pedidos:", erro.message);
            throw erro;  
        }
    }
}