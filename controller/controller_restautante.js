/***************************************************************************************************************************************************
 * Objetivo: Responsavel pela regra de negocio referente ao CRUD do RESTAURANTE
 * (GET, POST, PUT, DELETE)
 * Data: 31/08/2023
 * Autor: Caroline Portela
 * Versão: 1.0
 ***************************************************************************************************************************************************/

//Import do arquivo de configuração das variaveis, constantes e funções globais
var message = require('./modulo/config.js')

var restauranteDAO = require('../model/DAO/restauranteDAO.js')

//crud basico
const inserirRestaurante = async function (dadosRestaurante) {

    if (
        dadosRestaurante.nome_proprietario == '' || dadosRestaurante.nome_proprietario == undefined || dadosRestaurante.nome_proprietario.length > 150 ||
        dadosRestaurante.nome_fantasia == '' || dadosRestaurante.nome_fantasia == undefined || dadosRestaurante.nome_fantasia.length > 150 ||
        dadosRestaurante.razao_social == '' || dadosRestaurante.razao_social == undefined || dadosRestaurante.razao_social > 150 ||
        dadosRestaurante.email == '' || dadosRestaurante.email == undefined || dadosRestaurante.email > 255 ||
        dadosRestaurante.senha == '' || dadosRestaurante.senha == undefined || dadosRestaurante.senha > 150 ||
        dadosRestaurante.id_categoria_restaurante == '' || dadosRestaurante.id_categoria_restaurante == undefined || isNaN(dadosRestaurante.id_categoria_restaurante) ||
        dadosRestaurante.id_endereco_restaurante == '' || dadosRestaurante.id_endereco_restaurante == undefined || isNaN(dadosRestaurante.id_endereco_restaurante) ||
        dadosRestaurante.cnpj == '' || dadosRestaurante.cnpj == undefined ||
        dadosRestaurante.token_recuperar_senha == '' || dadosRestaurante.token_recuperar_senha == undefined ||
        dadosRestaurante.tempo_expiracao == '' || dadosRestaurante.tempo_expiracao == undefined  

    ){
        return message.ERROR_REQUIRED_FIELDS
    }else {
        //Envia os dados para a model inserir no banco de dados
        let resultDados = await restauranteDAO.insertRestaurante(dadosRestaurante)

        //Import do JWT
         const jwt = require("../middleware/middlewareJWT.js");

        //Valida se o banco de dados inseriu corretamente os dados
        if (resultDados) {

            //let tokenUser = await jwt.createJWT(dadosRestaurante[0].id)

            let novoRestaurante = await restauranteDAO.selectLastId()

            let dadosRestauranteJSON = {}

            dadosRestauranteJSON.status = message.SUCESS_CREATED_ITEM.status
           // dadosRestauranteJSON.token = tokenUser
            dadosRestauranteJSON.restaurantes = novoRestaurante

            return dadosRestauranteJSON
        }
        else {
            return message.ERROR_INTERNAL_SERVER
        }

    }

}

const deletarRestaurante = async function (idRestaurante) {
    let statusId = await restauranteDAO.selectRestauranteByID(idRestaurante);

    if (statusId) {
        if (idRestaurante == '' || idRestaurante == undefined || isNaN(idRestaurante)) {
            return message.ERROR_INVALID_ID; //Status code 400
        } else {
            let resultDados = await restauranteDAO.deleteRestaurante(idRestaurante)

            if (resultDados) {
                return message.SUCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const atualizarRestaurante = async function (dadosRestaurante, idRestaurante) {

    if (
        dadosRestaurante.nome_proprietario == '' || dadosRestaurante.nome_proprietario == undefined || dadosRestaurante.nome_proprietario.length > 150 ||
        dadosRestaurante.nome_fantasia == '' || dadosRestaurante.nome_fantasia == undefined || dadosRestaurante.nome_fantasia.length > 150 ||
        dadosRestaurante.razao_social == '' || dadosRestaurante.razao_social == undefined || dadosRestaurante.razao_social > 150 ||
        dadosRestaurante.email == '' || dadosRestaurante.email == undefined || dadosRestaurante.email > 255 ||
        dadosRestaurante.senha == '' || dadosRestaurante.senha == undefined || dadosRestaurante.senha > 150 ||
        dadosRestaurante.id_categoria_restaurante == '' || dadosRestaurante.id_categoria_restaurante == undefined || isNaN(dadosRestaurante.id_categoria_restaurante) ||
        dadosRestaurante.id_endereco_restaurante == '' || dadosRestaurante.id_endereco_restaurante == undefined || isNaN(dadosRestaurante.id_endereco_restaurante) ||
        dadosRestaurante.cnpj == '' || dadosRestaurante.cnpj == undefined ||
        dadosRestaurante.token == '' || dadosRestaurante.token == undefined ||
        dadosRestaurante.tempo_expiracao == '' || dadosRestaurante.tempo_expiracao == undefined  

        ){
            return message.ERROR_INTERNAL_SERVER.ERROR_REQUIRED_FIELDS
    
        } else if (idRestaurante == '' || idRestaurante == undefined || idRestaurante == isNaN(idRestaurante)) {
    
            return message.message.ERROR_INVALID_ID
        } else {
            dadosRestaurante.id = idRestaurante;
    
            let statusId = await restauranteDAO.selectRestauranteByID(idRestaurante);
    
            if (statusId) {
                //Encaminha os dados para a model 
                let resultDadosRestaurante = await restauranteDAO.updateRestaurante(dadosRestaurante);
    
                if (resultDadosRestaurante) {
    
                    let dadosJSON = {}
                    dadosJSON.status = message.SUCESS_UPDATED_ITEM.status
                    dadosJSON.message = message.SUCESS_UPDATED_ITEM.message
                    dadosJSON.restaurante = dadosRestaurante
                    return dadosJSON
                } else
                    return message.ERROR_INTERNAL_SERVER
    
            } else {
                return message.ERROR_NOT_FOUND
            }
        }
}

const getRestaurantes = async function () {
    let dadosRestaurantesJSON = {};

    let dadosRestaurante = await restauranteDAO.selectAllRestaurante();

    if (dadosRestaurante) {

        dadosRestaurantesJSON.status = message.SUCESS_REQUEST.status
        dadosRestaurantesJSON.message = message.SUCESS_REQUEST.message
        dadosRestaurantesJSON.quantidade = dadosRestaurante.length;
        dadosRestaurantesJSON.restaurantes = dadosRestaurante
        return dadosRestaurantesJSON
    } else {
        return message.ERROR_NOT_FOUND
    }

}

const getRestauranteByEmailSenha = async function (email, password) {
    
    if (
        email == '' || email == undefined || email.length > 255 ||
        password == '' || password == undefined || password.length > 150
    ) {
        return message.ERROR_REQUIRED_FIELDS

    } else {

        // Import do JWT
        const jwt = require("../middleware/middlewareJWT.js");

        let RestauranteJsonEmailpassword = {}

        let dadosRestaurante = await restauranteDAO.selectRestauranteByEmailPassword(email, password)

        if (dadosRestaurante != null && dadosRestaurante != undefined) {

            let tokenUser = await jwt.createJWT(dadosRestaurante[0].id);
            
            // Inclua o token no objeto dadosRestaurante
            dadosRestaurante[0].token = tokenUser;

            RestauranteJsonEmailpassword.status = message.SUCESS_REQUEST.status
            RestauranteJsonEmailpassword.Restaurante = dadosRestaurante;

            return RestauranteJsonEmailpassword

        } else {
            return message.ERROR_INVALID_EMAIL_PASSWORD
        }
    }
}


const getRestaurantePorID = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosJSON = {}

        let dados = await restauranteDAO.selectRestauranteByID(id)

        if (dados) {
            dadosJSON.status = message.SUCESS_REQUEST.status
            dadosJSON.message = message.SUCESS_REQUEST.message
            dadosJSON.restaurantes = dados
            return dadosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const autenticarLoginRestauranteEmailSenha = async function (email, password) {
    
    if (
        email == '' || email == undefined || email.length > 255 ||
        password == '' || password == undefined || password.length > 150
    ) {
        return message.ERROR_REQUIRED_FIELDS

    } else {

        // Import do JWT
        const jwt = require("../middleware/middlewareJWT.js");

        let restauranteJSONEmailpassword = {}

        let dadosRestaurante = await restauranteDAO.selectRestauranteByEmailPassword(email, password)

        if (dadosRestaurante) {

            let tokenUser = await jwt.createJWT(dadosRestaurante[0].id);
            
            // Inclua o token no objeto dadosRestaurante
            dadosRestaurante[0].token = tokenUser;

            restauranteJSONEmailpassword.status = message.SUCESS_REQUEST.status
            restauranteJSONEmailpassword.restaurante = dadosRestaurante;

            return restauranteJSONEmailpassword

        } else {
            return message.ERROR_INVALID_EMAIL_PASSWORD
        }
    }
}

const getFiltrarRestauranteNome = async function (nome) {

    let nomeRestaurante = nome

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectByNameRestaurante(nomeRestaurante)

    if (dadosRestaurante) {
        dadosRestauranteJSON.restaurante = dadosRestaurante
        return dadosRestauranteJSON
    } else {
        return false;
    }
}

const getCategoriasRestaurantePeloNomeFantasia = async function (nome) {
    let nomeRestaurante = nome;

    let dadosRestaurante = await restauranteDAO.selectCategoriasDoRestaurantePeloNomeFantasia(nomeRestaurante);

    return { categorias_do_restaurante : dadosRestaurante || [] }; // Retorna um objeto JSON com a chave "categorias"
}


const getProdutosRestaurantePeloNomeFantasia = async function (nome) {

    let nomeRestaurante = nome

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectProdutosDoRestaurantePeloNomeFantasia(nomeRestaurante)

    if (dadosRestaurante) {
        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        dadosRestauranteJSON.quantidade = dadosRestaurante.length
        dadosRestauranteJSON.produtos_do_restaurante = dadosRestaurante
        return dadosRestauranteJSON
    } else {
        return false;
    }
}

const getProdutosRestaurantePeloIdRestaurante = async function (idRestaurante,produtoRestaurante) {

    let idDoRestaurante = idRestaurante

    let produtoDoRestaurante = produtoRestaurante

    let dadosJSON = {}

    let dadosProdutoRestaurante = await restauranteDAO.selectProdutoByIDRestaurante(idDoRestaurante,produtoDoRestaurante)

    if (dadosProdutoRestaurante) {
        dadosJSON.produtos_do_restaurante = dadosProdutoRestaurante
        return dadosJSON
    } else {
        return message.ERROR_INVALID_EMAIL_PASSWORD
    }
}

//Home
const getProdutosPausadosDoRestaurantePeloIdDoRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectProdutosPausadosDeUmRestaurante(idDoRestaurante)

    if (dadosRestaurante) {
        let quantidadePedidosPausados = dadosRestaurante.length;
        dadosRestauranteJSON.produtos_pausado_do_restaurante = quantidadePedidosPausados

        dadosRestauranteJSON.pedidos_pausados_do_restaurante = dadosRestaurante;

        return dadosRestauranteJSON
    } else {
        return false;
    }
}

//Home
const getPedidosCanceladosPeloIdDoRestaurante = async function (idRestaurante) {
    try {
        let idDoRestaurante = idRestaurante;
        let dadosRestauranteJSON = {};

        // detalhes dos pedidos cancelados do restaurante
        let dadosRestaurante = await restauranteDAO.selectPedidosCanceladosDeUmRestaurante(idDoRestaurante);

        if (dadosRestaurante) {
    
            let quantidadePedidosCancelados = dadosRestaurante.length;
            dadosRestauranteJSON.quantidade_pedidos_cancelados = quantidadePedidosCancelados;

            dadosRestauranteJSON.pedidos_cancelados_do_restaurante = dadosRestaurante;
            

            return dadosRestauranteJSON;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro ao obter pedidos cancelados:", error);
        return false;
    }
};

const getFormaPagamentoPeloIdDoRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectFormaPagamentoByIDRestaurante(idDoRestaurante)

    if (dadosRestaurante) {

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        
        let quantidadeFormasDePagamento = dadosRestaurante.length;
        dadosRestauranteJSON.formas_de_pagamento_do_restaurante = quantidadeFormasDePagamento
        dadosRestauranteJSON.formas_de_pagamento_do_restaurante = dadosRestaurante;


        return dadosRestauranteJSON
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getFreteAreaEntregaIdDoRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectFreteAreaEntregaByIDRestaurante(idDoRestaurante)

    if (dadosRestaurante) {

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        dadosRestauranteJSON.quantidade = dadosRestaurante.length
        dadosRestauranteJSON.frete_area_entrega_do_restaurante = dadosRestaurante;

        return dadosRestauranteJSON

    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getFreteAreaEntregaIdDoRestaurante2 = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectFreteAreaEntregaByIDRestaurante(idDoRestaurante)

    if (dadosRestaurante) {

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        dadosRestauranteJSON.quantidade = dadosRestaurante.length
        dadosRestauranteJSON.frete_area_entrega_do_restaurante = dadosRestaurante[0];

        return dadosRestauranteJSON

    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getRaioEntregaByIdDoRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectRaioEntregaByIdRestaurant(idDoRestaurante)

    if (dadosRestaurante) {

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        dadosRestauranteJSON.raio_entrega_do_restaurante = dadosRestaurante;


        return dadosRestauranteJSON
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}

const atualizarRaioEntregaByIdDoRestaurante = async function (dadosRaioEntrega) {

    if (
        dadosRaioEntrega.id_restaurante == '' || dadosRaioEntrega.id_restaurante == undefined || isNaN(dadosRaioEntrega.id_restaurante) ||
        dadosRaioEntrega.raio_entrega == '' || dadosRaioEntrega.raio_entrega == undefined

    ) {
        return message.ERROR_INTERNAL_SERVER.ERROR_REQUIRED_FIELDS

    } else {
        let statusId = await restauranteDAO.selectLastId();

        if (statusId) {
            let dadosRestaurante = await restauranteDAO.updateRaioEntregaByIdRestaurant(dadosRaioEntrega)
            if (dadosRestaurante) {

                let dadosRestauranteJSON = {}

                dadosRestauranteJSON.status = message.SUCESS_UPDATED_ITEM.status
                dadosRestauranteJSON.message = message.SUCESS_UPDATED_ITEM.message
                dadosRestauranteJSON.raio_entrega_do_restaurante = dadosRaioEntrega
                return dadosRestauranteJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}


const getDiaHorarioFuncionamentoByIdRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante

    let dadosRestauranteJSON = {}

    let dadosRestaurante = await restauranteDAO.selectDiaHorarioFuncionamentoByIdRestaurante(idDoRestaurante)

    if (dadosRestaurante) {

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message
        dadosRestauranteJSON.dias_horarios_funcionamento = dadosRestaurante;


        return dadosRestauranteJSON
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}


const getAvaliacoesByIdRestaurante = async function (idRestaurante) {

    let idDoRestaurante = idRestaurante;
    let dadosRestaurante = await restauranteDAO.selectAvaliacoesByIdRestaurante(idDoRestaurante);

    // Inicialize as variáveis com valores padrão
    let quantidadeAvaliacoes = 0;
    let mediaEstrelas = "0,0";
    let contagemAvaliacoesPorEstrela = [0, 0, 0, 0, 0];

    if (dadosRestaurante && Array.isArray(dadosRestaurante) && dadosRestaurante.length > 0) {
        quantidadeAvaliacoes = dadosRestaurante.length;

        dadosRestaurante.forEach((avaliacao) => {
            const quantidadeEstrela = avaliacao.quantidade_estrela;
            contagemAvaliacoesPorEstrela[quantidadeEstrela - 1]++;
        });

        const somaEstrelas = dadosRestaurante.reduce((total, avaliacao) => total + avaliacao.quantidade_estrela, 0);
        mediaEstrelas = (somaEstrelas / quantidadeAvaliacoes).toFixed(1).replace('.', ',');
    }

    const dadosRestauranteJSON = {
                "status": message.SUCESS_REQUEST.status,
                "message": message.SUCESS_REQUEST.message,
                "quantidade_avaliacoes": quantidadeAvaliacoes,
                "media_estrelas": mediaEstrelas,
                "contagem_avaliacoes_por_estrela": contagemAvaliacoesPorEstrela,
                "avaliacoes_do_restaurante": dadosRestaurante && Array.isArray(dadosRestaurante)
                ? dadosRestaurante.map((avaliacao) => ({
                "avaliacao_id": avaliacao.avaliacao_id,
                "nome_restaurante": avaliacao.nome_restaurante,
                "quantidade_estrela": avaliacao.quantidade_estrela,
                "avaliacao_descricao": avaliacao.avaliacao_descricao,
                "data_avaliacao": avaliacao.data_avaliacao,
                "recomendacao_id": avaliacao.recomendacao_id,
                "recomendacao": avaliacao.recomendacao,
                "nome_cliente": avaliacao.nome_cliente,
                "foto_cliente": avaliacao.foto_cliente,
            }))
            : [],
    };

    return dadosRestauranteJSON;
};
const getValorTotalComissaoValorLiquidoByIdRestaurante = async function (idRestaurante) {

    if (idRestaurante === '' || idRestaurante === undefined || isNaN(idRestaurante)) {

        return message.ERROR_INVALID_ID;

    } else {
        let dadosJSON = {};
        let dados = await restauranteDAO.selectValorTotalComissaoValorLiquidoByIDRestaurante(idRestaurante);

        if (dados) {
            const formatarNumeros = (numero) => {
                return numero.toFixed(2).replace('.', ',');
            };

            const dadosFormatados = dados.map((item) => ({
                total_pedidos: formatarNumeros(item.total_pedidos),
                comissao_save_eats: formatarNumeros(item.comissao_save_eats),
                valor_liquido: formatarNumeros(item.valor_liquido),
            }));

            dadosJSON.status = message.SUCESS_REQUEST.status;
            dadosJSON.message = message.SUCESS_REQUEST.message;
            dadosJSON.dados_financeiro = dadosFormatados;
            return dadosJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    }
}


const getAcompanhamentoDesempenhoByIDRestaurante = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {

        return message.ERROR_INVALID_ID

    } else {
        let dadosJSON = {}

        let dados = await restauranteDAO.selectAcompanhamentoDesempenhoByIDRestaurante(id)

        if (dados) {
                dadosJSON.status = message.SUCESS_REQUEST.status
                dadosJSON.message = message.SUCESS_REQUEST.message
                dadosJSON.acompanhamento_desempenho_data_atual = dados.map(item => ({
                quantidade_pedidos_data_atual: Number(item.quantidade_pedidos_data_atual),
                valor_total_pedidos_data_atual: Number(item.valor_total_pedidos_data_atual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                quantidade_pedidos_concluido_data_atual: Number(item.quantidade_pedidos_concluido_data_atual),
            }));
            
            return dadosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}


const getAcompanhamentoDesempenhoMensalByIDRestaurante = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {

        return message.ERROR_INVALID_ID

    } else {
        let dadosJSON = {}

        let dados = await restauranteDAO.selectAcompanhamentoDesempenhoMensalByIDRestaurante(id)

        if (dados) {
                dadosJSON.status = message.SUCESS_REQUEST.status
                dadosJSON.message = message.SUCESS_REQUEST.message
                dadosJSON.acompanhamento_desempenho_mes_atual = dados.map(item => ({
                quantidade_pedidos_mes_atual: Number(item.quantidade_pedidos_mes_atual),
                valor_total_pedidos_mes_atual: Number(item.valor_total_pedidos_mes_atual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                valor_liquido_mes_atual: Number(item.valor_liquido_mes_atual).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            }));
            
            return dadosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

//pedidos entregues e cancelados de um restaurante
const getPedidosEntreguesECanceladosByIDRestaurante = async function (idRestaurante) {
    let idDoRestaurante = idRestaurante
    let dadosRestauranteJSON = {}

    let dadosPedidos = await restauranteDAO.selectPedidosEntreguesECanceladosByIDRestaurante(idDoRestaurante)

    if (dadosPedidos) {
        // Filtrar pedidos entregues e cancelados
        const pedidosEntregues = dadosPedidos.filter(pedido => pedido.status_pedido === 'Pedido entregue');
        const pedidosCancelados = dadosPedidos.filter(pedido => pedido.status_pedido === 'Cancelado');

        // Contar a quantidade de pedidos entregues e cancelados
        const quantidadePedidosEntregues = pedidosEntregues.length;
        const quantidadePedidosCancelados = pedidosCancelados.length;

        // Adicionar informações ao objeto JSON

        dadosRestauranteJSON.status = message.SUCESS_REQUEST.status;
        dadosRestauranteJSON.message = message.SUCESS_REQUEST.message;
        dadosRestauranteJSON.quantidade_pedidos_entregues = quantidadePedidosEntregues;
        dadosRestauranteJSON.quantidade_pedidos_cancelados = quantidadePedidosCancelados;
        dadosRestauranteJSON.pedidos_entregues = pedidosEntregues;
        dadosRestauranteJSON.pedidos_cancelados = pedidosCancelados;


        return dadosRestauranteJSON;
    } else {
        return message.ERROR_INTERNAL_SERVER;
    }
}










module.exports = {
    deletarRestaurante,
    atualizarRestaurante,
    getRestaurantes,
    getRestaurantePorID,
    getRestauranteByEmailSenha,
    autenticarLoginRestauranteEmailSenha,
    getFiltrarRestauranteNome,
    getCategoriasRestaurantePeloNomeFantasia,
    getProdutosRestaurantePeloNomeFantasia,
    getProdutosRestaurantePeloIdRestaurante,
    getProdutosPausadosDoRestaurantePeloIdDoRestaurante,
    getPedidosCanceladosPeloIdDoRestaurante,
    getFormaPagamentoPeloIdDoRestaurante,
    getFreteAreaEntregaIdDoRestaurante,
    getRaioEntregaByIdDoRestaurante,
    atualizarRaioEntregaByIdDoRestaurante,
    getDiaHorarioFuncionamentoByIdRestaurante,
    getAvaliacoesByIdRestaurante,
    getValorTotalComissaoValorLiquidoByIdRestaurante,
    getAcompanhamentoDesempenhoByIDRestaurante,
    getAcompanhamentoDesempenhoMensalByIDRestaurante,
    getPedidosEntreguesECanceladosByIDRestaurante,
    getFreteAreaEntregaIdDoRestaurante2
}