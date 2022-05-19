const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledToken = require('./build/newContract.json');

const provider = new HDWalletProvider(
  'estate empower life unable toilet shrug fiber child monkey foam faculty ride',
  'https://rinkeby.infura.io/v3/306711e133c84933908207ac0cf64688'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledToken.token.abi)
    .deploy({ data: compiledToken.token.evm.bytecode.object, arguments: ['GAZE', 'GAZ'] })
    .send({ gas: '1000000', from: accounts[0] });

  
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy().catch(err => console.log(err));
