const web3 = require('web3') 
const busdAbi = require('./abi.json')

const w3 = new web3("http://localhost:8545")
const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
const busd = new w3.eth.Contract(busdAbi , busdAddress);


// Values to Change
const receiver = pkToAddress('0xdf2d862c2e77df8bc9edeef39ddf66c7abe23bec647d03891c52f92ee02a4c7f'); // create .env file and save the PRIVATE_KEY copy from ganache
const unlockedAddress = '0xd6faf697504075a358524996b132b532cc5D0F14';




 const sendFunds = async (fund, getBalance) => {
	Promise.all([
		busd.methods.balanceOf(unlockedAddress).call(),
		busd.methods.balanceOf(receiver).call()
	]).then(async ([unlockedBal, receiverBal]) => {
		// const prev = { unlocked: unlockedBal, receiver: receiverBal }
		// console.table(prev)


		const amount = BigInt(fund) * BigInt(Math.pow(10, 18))
		await busd.methods.transfer(receiver, amount.toString()).send({ from: unlockedAddress })
		console.log('* sent *\n')


		Promise.all([
			busd.methods.balanceOf(unlockedAddress).call(),
			busd.methods.balanceOf(receiver).call()
		]).then(([unlockedBal, receiverBal]) => {
			// const after = { unlocked: unlockedBal, receiver: receiverBal }
			// console.table(after)
			getBalance()
		})



	})


}


function pkToAddress(pk) {
	console.log(pk)
	const account = w3.eth.accounts.privateKeyToAccount(pk)
	return account.address;
}
sendFunds('4000',function(){})