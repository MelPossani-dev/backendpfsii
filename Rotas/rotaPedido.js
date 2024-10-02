import { Router } from "express";
import PedidoCtrl from "../Controle/pedidoCtrl.js";

const rotaPedido = new Router();
const pedidoCtrl = new PedidoCtrl();

rotaPedido
.get('/', pedidoCtrl.consultar)
.get('/:termo', pedidoCtrl.consultar)
.post('/', pedidoCtrl.gravar);

export default rotaPedido;

