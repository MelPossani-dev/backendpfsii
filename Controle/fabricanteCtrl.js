import Fabricante from "../Modelo/fabricante.js";

export default class FabricanteCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const empresa = dados.fab_empresa; 
            if (empresa) {
                const fabricante = new Fabricante(0, empresa);
                fabricante.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": fabricante.fab_codigo,
                        "mensagem": "Fabricante incluído com sucesso!"
                    });
                })
                .catch((erro) => {  
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o Fabricante: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome da empresa!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um Fabricante!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.fab_codigo; // Código do fabricante
            const empresa = dados.fab_empresa; // Nome da empresa
            if (codigo && empresa) {
                const fabricante = new Fabricante(codigo, empresa);
                fabricante.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Fabricante atualizado com sucesso!"
                    });
                })
                .catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o Fabricante: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código e o nome da empresa!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um Fabricante!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.fab_codigo; // Código do fabricante
            if (codigo) {
                const fabricante = new Fabricante(codigo);
                fabricante.possuiProdutos(respostaPossuiProdutos => {
                    if (respostaPossuiProdutos === false) {
                        fabricante.excluir().then(() => {
                            resposta.status(200).json({
                                "status": true,
                                "mensagem": "Fabricante excluído com sucesso!"
                            });
                        })
                        .catch((erro) => {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": "Erro ao excluir o Fabricante: " + erro.message
                            });
                        });
                    } else {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": "Esse Fabricante possui produtos e não pode ser excluído!"
                        });
                    }
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do Fabricante!"
                });
            }           
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um Fabricante!"
            });
        } 
    }

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === "GET") {
            const fabricante = new Fabricante();
            fabricante.consultar(termo).then((listaFabricantes) => {
                resposta.status(200).json({ // Adicionando status 200
                    status: true,
                    listaFabricantes
                });
            })
            .catch((erro) => {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Não foi possível obter os Fabricantes: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar Fabricantes!"
            });
        }
    }
}