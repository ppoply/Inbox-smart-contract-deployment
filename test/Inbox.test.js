// Contract Testing file (using Mocha framework)

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

/*

-- Mocha Trial Test --

class Car{

	park(){
		return 'car parked';
	}

	drive(){
		return 'car moving';
	}
}

let car;

beforeEach(()=>{
	car = new Car();
});

describe('Car',()=>{
	
	it('can park',()=>{
		assert.equal(car.park(),'car parked');
	});

	it('can drive',()=>{
		assert.equal(car.drive(),'car moving');
	});

});

*/

let accounts;
let inbox;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	// Use one of those accounts to deploy the contract 

	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data : bytecode, arguments : ['Hi there !']})
		.send({ from : accounts[0], gas : '1000000'})
});

// Running tests 

describe('Inbox',() => {
	it('deploy contract test',() => {
		assert.ok(inbox.options.address);
	});

	it('default message test', async () => {
		const message = await inbox.methods.message().call();
		assert.equal(message,'Hi there !');
	});

	it('change message test', async () => {
		await inbox.methods.setMessage('bye there').send({ from : accounts[0]});
		const message = await inbox.methods.message().call();
		assert.equal(message,'bye there');
	});
});
