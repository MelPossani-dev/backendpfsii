export default class ItemPedido {
    #maquina;
    #quantidade;
    #precoUnitario;

    constructor(maquina, quantidade, precoUnitario) {
        this.maquina = maquina; 
        this.quantidade = quantidade; 
        this.precoUnitario = precoUnitario; 
    }

    get maquina() {
        return this.#maquina;
    }

    set maquina(novaMaquina) {
        if (!novaMaquina || typeof novaMaquina.maq_codigo !== "number") {
            throw new Error("Máquina inválida: deve ser um objeto com um código.");
        }
        this.#maquina = novaMaquina;
    }

    get quantidade() {
        return this.#quantidade;
    }

    set quantidade(novaQuantidade) {
        if (typeof novaQuantidade !== "number" || novaQuantidade < 0) {
            throw new Error("Quantidade não pode ser negativa e deve ser um número.");
        }
        this.#quantidade = novaQuantidade;
    }

    get precoUnitario() {
        return this.#precoUnitario;
    }

    set precoUnitario(novoPrecoUnitario) {
        if (typeof novoPrecoUnitario !== "number" || novoPrecoUnitario < 0) {
            throw new Error("Preço unitário não pode ser negativo e deve ser um número.");
        }
        this.#precoUnitario = novoPrecoUnitario;
    }

    get subtotal() {
        return this.#quantidade * this.#precoUnitario;
    }

    // JSON
    toJSON() {
        return {
            maquina: {
                codigo: this.#maquina.maq_codigo, 
                modelo: this.#maquina.maq_modelo,
                processador: this.#maquina.maq_processador,
                memoria: this.#maquina.maq_memoria,
                ssd: this.#maquina.maq_ssd,
            },
            quantidade: this.#quantidade,
            precoUnitario: this.#precoUnitario,
            subtotal: this.subtotal
        };
    }
}