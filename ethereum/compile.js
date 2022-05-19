/*const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const bankPath = path.resolve(__dirname, 'contracts', 'Bank.sol');
const source = fs.readFileSync(bankPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        contract: {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
                        }
                    }
                }
            };
            
            
            const output = JSON.parse(solc.compile(JSON.stringify(input)));
                

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}*/

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);



const tokenPath = path.resolve(__dirname, 'new', 'newContract.sol');
const bankPath = path.resolve(__dirname, 'contracts', 'Bank.sol');

const Tokensource = fs.readFileSync(tokenPath, 'utf8');
const Banksource = fs.readFileSync(bankPath, 'utf8');

//const output = solc.compile(source, 1).contracts;
var input = {
    language: 'Solidity',
    sources: {
        'newContract.sol' : {
            content: Tokensource
        },
        'Bank.sol': {
            content: Banksource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

console.log(JSON.parse(solc.compile(JSON.stringify(input))));
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace('.sol', '') + '.json' ),
        output[contract]
    );
}

 










   