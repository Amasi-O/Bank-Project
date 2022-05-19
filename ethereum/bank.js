import web3 from './web3';
import Bank from './build/Bank.json';

const instance = new web3.eth.Contract(
    Bank.Bank.abi,
    '0x99465378926C8549C20E47530dB81D203458CF38'
);

export default instance;