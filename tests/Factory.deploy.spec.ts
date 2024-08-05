// Import necessary modules from TON SDK and test utilities
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, fromNano, toNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import '@ton/test-utils';

// Define a test suite for the TonkPumpFactory contract deployment
describe('TonkPumpFactory Deploy Test', () => {
    // Declare variables for blockchain, contracts, and addresses
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let tonkFactory: SandboxContract<TonkPumpFactory>;
    // Define a constant for zero address
    const ZERO_ADDRESS: Address = Address.parse('0:0000000000000000000000000000000000000000000000000000000000000000');

    // Set up the test environment before each test
    beforeEach(async () => {
        // Create a new blockchain instance
        blockchain = await Blockchain.create();

        // Initialize the TonkPumpFactory contract
        tonkFactory = blockchain.openContract(await TonkPumpFactory.fromInit(1n));

        // Create treasury contracts for deployer and user1
        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');

        // Deploy the TonkPumpFactory contract
        const deployResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'), // Send 0.05 TON for deployment
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        // Verify that the deployment transaction was successful
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            deploy: true,
            success: true,
        });
    });

    // Test case: Verify that the contract deploys successfully
    it('should deploy', async () => {
        // Check that the contract address is not the zero address
        expect(tonkFactory.address).not.toEqualAddress(ZERO_ADDRESS);
    });

    // Test case: Verify that the contract deploys successfully
    it('should confirm that the address deployed matches', async () => {
        // Get the factory address from the contract
        const factoryAddress = await tonkFactory.getMyAddress();
        // Check that the contract address is not the zero address
        expect(tonkFactory.address).toEqualAddress(factoryAddress);
    });

    // Test case: Verify that the owner of the contract is the deployer
    it('should validate that owner is deployer', async () => {
        // Get the owner address from the contract
        const owner = await tonkFactory.getOwner();

        // Check that the deployer's address matches the owner address
        expect(deployer.address).toEqualAddress(owner);
    });

    // Test case: Verify ownership transfer functionality
    it('should transfer contract ownership', async () => {
        // Attempt to transfer ownership to user1
        const transferResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'), // Send 0.05 TON for the transaction
            },
            {
                $$type: 'ChangeOwner',
                queryId: 0n,
                newOwner: user1.address,
            },
        );

        // Verify that the ownership transfer transaction was successful
        expect(transferResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Get the new owner address from the contract
        const owner = await tonkFactory.getOwner();

        // Check that user1's address matches the new owner address
        expect(user1.address).toEqualAddress(owner);
    });

    // Test case: Verify that only the owner can transfer ownership
    it('should only allow deployer to call transfer function', async () => {
        // Attempt to transfer ownership from non-owner (user1)
        const transferResult = await tonkFactory.send(
            user1.getSender(),
            {
                value: toNano('0.05'), // Send 0.05 TON for the transaction
            },
            {
                $$type: 'ChangeOwner',
                queryId: 0n,
                newOwner: user1.address,
            },
        );

        // Verify that the ownership transfer transaction failed
        expect(transferResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkFactory.address,
            success: false,
        });

        // Get the current owner address from the contract
        const owner = await tonkFactory.getOwner();

        // Check that user1's address does not match the owner address
        expect(user1.address).not.toEqualAddress(owner);
    });

    // Test case: Verify that only the owner can change the deployment fee
    it('should only allow deployer to change fee', async () => {
        // Attempt to change fee from non-owner (user1)
        const feeResult = await tonkFactory.send(
            user1.getSender(),
            {
                value: toNano('0.05'), // Send 0.05 TON for the transaction
            },
            'ChangeDeploymentFee',
        );

        // Verify that the fee change transaction failed
        expect(feeResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkFactory.address,
            success: false,
        });

        // Get the current deployment fee from the contract
        const fee = await tonkFactory.getDeployFee();

        // Check that the fee has not changed to 0.05
        expect(fee).not.toEqual('0.05');
    });

    // Test case: Verify that the owner can change the deployment fee
    it('should change deployment fee', async () => {
        // Attempt to change fee from owner (deployer)
        const feeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'), // Send 0.05 TON for the transaction
            },
            'ChangeDeploymentFee',
        );

        // Verify that the fee change transaction was successful
        expect(feeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Get the new deployment fee from the contract
        const fee = await tonkFactory.getDeployFee();

        // Check that the fee has changed to 0.05
        expect(fromNano(fee)).toEqual('0.05');
    });
});
