import Cliente from "../Modelo/Cliente.js";
import Pedido from "../Modelo/Pedido.js";
import Maquina from "../Modelo/maquina.js"; 
import ItemPedido from "../Modelo/ItemPedido.js";

export default class PedidoCtrl {
    async gravar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;

            const { cliente, totalPedido, itens } = dados;

            // Validações
            if (!cliente || !cliente.codigo) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Cliente inválido"
                });
            }

            if (typeof totalPedido !== 'number' || totalPedido < 0) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Total do pedido inválido"
                });
            }

            if (!Array.isArray(itens) || itens.length === 0) {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Itens do pedido inválidos"
                });
            }

            const objCliente = new Cliente(cliente.codigo);
            const itensMapeados = [];

            try {
                for (const item of itens) {
                    if (!item.codigo || typeof item.quantidade !== 'number' || typeof item.precoUnitario !== 'number') {
                        throw new Error("Item inválido: código, quantidade e preço unitário são obrigatórios");
                    }
                    const maquinaItem = new Maquina(item.codigo);
                    itensMapeados.push(new ItemPedido(maquinaItem, item.quantidade, item.precoUnitario));
                }

                const pedido = new Pedido(0, objCliente, new Date(), totalPedido, itensMapeados); // Usando a data atual
                await pedido.gravar();

                resposta.status(200).json({
                    "status": true,
                    "mensagem": "Pedido incluído com sucesso!",
                    "codigo": pedido.codigo
                });
            } catch (erro) {
                console.error("Erro ao gravar pedido:", erro);
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao incluir pedido: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === 'GET') {
            const termo = requisicao.params.termo;

            if (!isNaN(termo)) {
                const pedido = new Pedido(); // Instância de Pedido para consultas
                try {
                    const listaPedidos = await pedido.consultar(termo);
                    resposta.status(200).json({
                        "status": true,
                        "listaPedidos": listaPedidos
                    });
                } catch (erro) {
                    console.error("Erro ao consultar pedido:", erro);
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao consultar pedido: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código de pedido válido!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida"
            });
        }
    }
}