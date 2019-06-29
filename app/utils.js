'use strict';

const RegisterService = require('./service/agent');
const service = new RegisterService();
const AgentModel = require('./models/agent');
const agentModel = new AgentModel();
const AgentController = require('./controller/agent');
const agentController = new AgentController();
const WalletService = require('./service/wallet');
const walletService = new WalletService();

module.exports = {
    service,
    agentModel,
    agentController,
    walletService
}