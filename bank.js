import web3 from './web3';
import Bank from './build/Bank.json';

const instance = new web3.eth.Contract(
    Bank.Bank.abi,
    '0x8715385942e8dE8A694478dDeF75D565Eb8fACA8'
);

export default instance;