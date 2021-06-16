const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()
app.use(bodyParser.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

app.listen(config.get('api.porta'), () => console.log('A API está funcionando'))