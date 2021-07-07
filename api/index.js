const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const { formatosAceitos } = require('./Serializador') //const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

const app = express()
app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
    let formatoRequisitado = requisicao.header('Accept')

    if(formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        resposta.status(406)
        resposta.end()
        return
    }

    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((requisicao, resposta, proximo) => {
    resposta.set('X-Powered-By', "Gatito Petshop")
    proximo()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

app.use((erro, requisicao, resposta, proximo) => {
    let status = 500

    if(erro instanceof NaoEncontrado) {
        status = 404
    }

    if(erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }

    if(erro instanceof ValorNaoSuportado){
        status = 406
    }
    
    const serializadorErro = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.status(status)
    resposta.send(
        serializadorErro.serializar({
            mensagem: erro.message,
            id: erro.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('A API está funcionando'))