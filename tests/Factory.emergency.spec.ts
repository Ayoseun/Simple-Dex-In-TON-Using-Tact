// Import necessary modules from TON SDK and test utilities
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, fromNano, toNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

// Define a test suite for the TonkPumpFactory emergency functionality
describe('TonkPumpFactory Emergency Test', () => {
    // Declare variables for blockchain, contracts, and addresses
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let tonkFactory: SandboxContract<TonkPumpFactory>;

    const jettonParams = {
        name: 'Ayoseun Token',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'AYSN',

        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };
    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);

    // Set up the test environment before each test
    beforeEach(async () => {
        // Create a new blockchain instance for each test
        blockchain = await Blockchain.create();

        // Initialize the TonkPumpFactory contract
        tonkFactory = blockchain.openContract(await TonkPumpFactory.fromInit(100n));

        // Create test accounts
        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');

        // Deploy the TonkPumpFactory contract
        const deployResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        // Verify successful deployment
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            deploy: true,
            success: true,
        });
    });

    // Test case: Verify the contract can be stopped
    it('should stop contract', async () => {
        // Send a "Stop" message to the contract
        const stopResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the transaction was successful
        expect(stopResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);
    });

    // Test case: Verify the contract can be resumed after being stopped
    it('should resume contract', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Now, resume the contract
        const resumeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Resume',
        );

        // Verify the resume transaction was successful
        expect(resumeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is resumed (not stopped)
        const isResumed = await tonkFactory.getStopped();
        expect(isResumed).toEqual(false);
    });

    // Test case: Verify ownership transfer is not allowed when contract is stopped
    it('should not transfer ownership if contract is stopped', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to transfer ownership while the contract is stopped
        const transferResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'ChangeOwner',
                queryId: 0n,
                newOwner: user1.address,
            },
        );

        // Verify that the ownership transfer transaction failed
        expect(transferResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });

        // Get the current owner address from the contract
        const owner = await tonkFactory.getOwner();

        // Check that the owner hasn't changed to user1
        expect(user1.address).not.toEqualAddress(owner);
    });

    // Test case: Verify ownership transfer is allowed when contract is resumed
    it('should transfer ownership if contract is resumed', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to transfer ownership while the contract is stopped
        const transferResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'ChangeOwner',
                queryId: 0n,
                newOwner: user1.address,
            },
        );

        // Verify that the ownership transfer transaction failed
        expect(transferResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });

        // Get the current owner address from the contract
        const owner = await tonkFactory.getOwner();

        // Check that the owner hasn't changed to user1
        expect(user1.address).not.toEqualAddress(owner);

        // Now, resume the contract
        const resumeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Resume',
        );

        // Verify the resume transaction was successful
        expect(resumeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is resumed (not stopped)
        const isResumed = await tonkFactory.getStopped();
        expect(isResumed).toEqual(false);

        // Attempt to transfer ownership again after resuming the contract
        const newTransferResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'ChangeOwner',
                queryId: 0n,
                newOwner: user1.address,
            },
        );

        // Verify that the ownership transfer transaction succeeded
        expect(newTransferResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Get the new owner address from the contract
        const newOwner = await tonkFactory.getOwner();

        // Check that the owner has changed to user1
        expect(user1.address).toEqualAddress(newOwner);
    });

    // Test case: Verify token creation is not allowed when contract is stopped
    it('should not create token contracts if contract is stopped', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to create a token while the contract is stopped
        const createTokenResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the token creation transaction failed
        expect(createTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });
    });

    // Test case: Verify token creation is allowed when contract is resumed
    it('should create token contract if contract is resumed', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to create a token while the contract is stopped
        const createTokenResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.8'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the token creation transaction failed
        expect(createTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });

        // Now, resume the contract
        const resumeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Resume',
        );

        // Verify the resume transaction was successful
        expect(resumeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is resumed (not stopped)
        const isResumed = await tonkFactory.getStopped();
        expect(isResumed).toEqual(false);

        // Attempt to create a token again after resuming the contract
        const newCreateTokenResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.8'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the token creation transaction succeeded
        expect(newCreateTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });
    });

    // Test case: Verify fee change is not allowed when contract is stopped
    it('should not change fee if paused', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.15'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to change the deployment fee while the contract is stopped
        const feeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'ChangeDeploymentFee',
        );

        // Verify that the fee change transaction failed
        expect(feeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });

        // Check that the deployment fee hasn't changed
        const fee = await tonkFactory.getDeployFee();
        expect(fromNano(fee)).not.toEqual('0.15');
    });

    // Test case: Verify fee change is allowed when contract is resumed
    it('should change fee if contract is resumed', async () => {
        // First, stop the contract
        const stoppedResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Stop',
        );

        // Verify the stop transaction was successful
        expect(stoppedResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is stopped
        const isStopped = await tonkFactory.getStopped();
        expect(isStopped).toEqual(true);

        // Attempt to change the deployment fee while the contract is stopped
        const feeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.15'),
            },
            'ChangeDeploymentFee',
        );

        // Verify that the fee change transaction failed
        expect(feeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: false,
        });

        // Check that the deployment fee hasn't changed
        const fee = await tonkFactory.getDeployFee();
        expect(fromNano(fee)).not.toEqual('0.15');

        // Now, resume the contract
        const resumeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'Resume',
        );

        // Verify the resume transaction was successful
        expect(resumeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });

        // Check if the contract is resumed (not stopped)
        const isResumed = await tonkFactory.getStopped();
        expect(isResumed).toEqual(false);

        // Attempt to change the deployment fee again after resuming the contract
        const newFeeResult = await tonkFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.25'),
            },
            'ChangeDeploymentFee',
        );

        // Verify that the fee change transaction succeeded
        expect(newFeeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkFactory.address,
            success: true,
        });
        const newFee = await tonkFactory.getDeployFee();
        // Check that the new fee matches the set fee
        expect(fromNano(newFee)).toEqual('0.25');
    });
});
