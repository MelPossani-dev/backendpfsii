import Maquina from "../Modelo/maquina.js";
import Fabricante from "../Modelo/fabricante.js";

export default class MaquinaCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const modelo = dados.maq_modelo;
            const processador = dados.maq_processador;
            const memoria = dados.maq_memoria;
            const ssd = dados.maq_ssd;
            const precoCusto = dados.maq_precoCusto;
            const precoVenda = dados.maq_precoVenda;
            const qtdEstoque = dados.maq_qtdEstoque;
            const fab_codigo = dados.fab_codigo; 

            if (modelo && precoCusto > 0 && precoVenda > 0 
                && qtdEstoque >= 0 && fab_codigo > 0) {
                const fabricante = new Fabricante(fab_codigo);
                const maquina = new Maquina(0, modelo, processador, memoria, ssd, precoCusto, precoVenda, qtdEstoque, fabricante);
                // Resolver a promise
                maquina.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": maquina.maq_codigo, 
                        "mensagem": "Máquina incluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar a máquina: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, preencha todos os dados da máquina conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar uma máquina!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.maq_codigo; 
            const modelo = dados.maq_modelo;
            const processador = dados.maq_processador;
            const memoria = dados.maq_memoria;
            const ssd = dados.maq_ssd;
            const precoCusto = dados.maq_precoCusto;
            const precoVenda = dados.maq_precoVenda;
            const qtdEstoque = dados.maq_qtdEstoque;
            const fab_codigo = dados.fab_codigo;

            if (codigo && modelo && precoCusto > 0 && precoVenda > 0 
                && qtdEstoque >= 0 && fab_codigo > 0) {
                const fabricante = new Fabricante(fab_codigo);
                const maquina = new Maquina(codigo, modelo, processador, memoria, ssd, precoCusto, precoVenda, qtdEstoque, fabricante);
                // Resolver a promise
                maquina.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Máquina atualizada com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar a máquina: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da máquina conforme a documentação da API!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma máquina!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.maq_codigo; 
            if (codigo) {
                const maquina = new Maquina(codigo);
                // Resolver a promise
                maquina.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Máquina excluída com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir a máquina: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da máquina!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma máquina!"
            });
        }
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const maquina = new Maquina();
            maquina.consultar(termo).then((listaMaquinas) => { 
                resposta.json({
                    status: true,
                    listaMaquinas
                });
            })
            .catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter as máquinas: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar máquinas!"
            });
        }
    }
}