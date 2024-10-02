CREATE DATABASE techstore;

USE techstore;

CREATE TABLE fabricante (
    fab_codigo INT NOT NULL AUTO_INCREMENT,
    fab_empresa VARCHAR(100) NOT NULL,
    CONSTRAINT pk_fabricante PRIMARY KEY (fab_codigo)
);

CREATE TABLE maquina (
    maq_codigo INT NOT NULL AUTO_INCREMENT,
    maq_modelo VARCHAR(100) NOT NULL,
    maq_processador VARCHAR(50) NOT NULL,
    maq_memoria VARCHAR(20) NOT NULL,
    maq_ssd VARCHAR(20) NOT NULL,
    maq_precoCusto DECIMAL(10,2) NOT NULL DEFAULT 0,
    maq_precoVenda DECIMAL(10,2) NOT NULL DEFAULT 0,
    maq_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    fab_codigo INT NOT NULL,
    CONSTRAINT pk_maquina PRIMARY KEY (maq_codigo),
    CONSTRAINT fk_fabricante FOREIGN KEY (fab_codigo) REFERENCES fabricante(fab_codigo)
);

CREATE TABLE cliente (
    cli_codigo INT NOT NULL AUTO_INCREMENT,
    cli_nome VARCHAR(100) NOT NULL,
    cli_telefone VARCHAR(14) NOT NULL,
    cli_endereco VARCHAR(255) NOT NULL,
    cli_cpf VARCHAR(11) NOT NULL,
    CONSTRAINT pk_cliente PRIMARY KEY (cli_codigo)
);

CREATE TABLE pedido (
    codigo INT PRIMARY KEY AUTO_INCREMENT,
    cli_codigo INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_CLIENTE FOREIGN KEY (cli_codigo) REFERENCES cliente(cli_codigo)
);

CREATE TABLE item_pedido (
    pedido_codigo INT NOT NULL,
    maq_codigo INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (pedido_codigo, maq_codigo),
    CONSTRAINT FK_PEDIDO FOREIGN KEY (pedido_codigo) REFERENCES pedido(codigo),
    CONSTRAINT FK_MAQUINA FOREIGN KEY (maq_codigo) REFERENCES maquina(maq_codigo)
);