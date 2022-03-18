import web3 from "./web3";
import Token from './build/newContract.json'

export default function getToken(address){
    return new web3.eth.Contract(Token.token.abi, address)
}