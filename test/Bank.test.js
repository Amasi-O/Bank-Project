const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledBank = require('../ethereum/build/Bank.json');

let bank;
let accounts;
console.log(compiledBank.evm.bytecode.object)
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    bank = await new web3.eth.Contract(compiledBank.abi)
        .deploy({ data: compiledBank.evm.bytecode.object, arguments: ['JAZZ', 'JAZ']  })
        .send({ from: accounts[0], gas: '1000000' });

});

describe('Bank Contract', () => {
    it('deploys my contract', () => {
        assert.ok(bank.options.address);
    });

    it('marks caller as the bank admin', async () => {
        const admin = await bank.methods.admin().call();
        assert.equal(accounts[0], admin);
    }); 

    it('allows people to pay money to create an account and marks them as approvedcusomers', async () => {

        await bank.methods.openAccount().send({
            from: accounts[1],
            gas: '1000000'
        });

        await bank.methods.acceptCustomers(accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await bank.methods.createAccount().send({
            from: accounts[1],
            value: web3.utils.toWei('6', 'ether')
        });

        const isCustomer = await bank.methods.acceptedCustomers(accounts[1]).call(); 
        console.log(isCustomer)
        assert(isCustomer);
    });

    it('requires caller to be admin', async () => {
        try{
            await bank.methods.mint().send({
                from: accounts[1]
            });
            assert(false);
        }   catch (err) {
            assert(err);
        }
    });

    it('processes requests', async () => {
        await bank.methods.openAccount().send({
            from: accounts[2],
            gas: '1000000'
        });

        await bank.methods.acceptCustomers(accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await bank.methods.createAccount().send({
            from: accounts[2],
            value: web3.utils.toWei('6', 'ether')
        });
    });
});
