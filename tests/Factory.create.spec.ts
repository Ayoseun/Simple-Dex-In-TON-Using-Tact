// Import necessary modules from TON SDK and test utilities
import { Blockchain, ExternalOut, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, Dictionary, ExternalAddress, fromNano, Slice, toNano } from '@ton/core';
import { loadContractDeployed, TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { TonkPumpJetton } from '../wrappers/TonkPump';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { emit } from 'process';

// Define a test suite for the TonkPumpFactory contract
describe('TonkPumpFactory Create Token Test', () => {
    // Declare variables for blockchain, contracts, and addresses
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let tonkPumpFactory: SandboxContract<TonkPumpFactory>;
    let tonkPump: SandboxContract<TonkPumpJetton>;
    let tonkPump2: SandboxContract<TonkPumpJetton>;
    const jettonParams = {
        name: 'Ayoseun Token',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'AYSN',

        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };
    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);

    const jettonParams2 = {
        name: 'Eggie Token',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'EggieTN',

        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };
    let content2 = buildOnchainMetadata(jettonParams2);
    // Define a constant for zero address
    const ZERO_ADDRESS: Address = Address.parse('0:0000000000000000000000000000000000000000000000000000000000000000');
    // Set up the test environment before each test
    beforeEach(async () => {
        // Create a new blockchain instance
        blockchain = await Blockchain.create();

        // Initialize the TonkPumpFactory contract
        tonkPumpFactory = blockchain.openContract(await TonkPumpFactory.fromInit(1n));

        // Create treasury contracts for deployer and user1
        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');

        // Deploy the TonkPumpFactory contract
        const deployResult = await tonkPumpFactory.send(
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
            to: tonkPumpFactory.address,
            deploy: true,
            success: true,
        });
    });

    // Test case: Verify that the contract deploys successfully
    it('should deploy', async () => {
        // Check that the contract address is not the zero address
        expect(tonkPumpFactory.address).not.toEqualAddress(ZERO_ADDRESS);
    });

    // Test case: Verify token creation
    it('should create a token', async () => {
        // Attempt to create a token
        const createTokenResult = await tonkPumpFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.6'), // Send 0.05 TON for token creation
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the token creation transaction was successful
        expect(createTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            success: true,
        });

       // let emittedAddress = parseEvent(createTokenResult.externals);
//console.log(emittedAddress)
        // Get the address of the deployed token contract
        const deployedAddress: Address | null = await tonkPumpFactory.getJettonAddress(toNano(0));
        expect(deployedAddress).not.toBeNull();
    });

    // Test case: Verify that deployment fails if the fee is insufficient
    it('should abort if deployment fee is less than or equal 0.5 TON', async () => {
        // Attempt to create a token with insufficient fee
        const createTokenResult = await tonkPumpFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.4'), // Send only 0.005 TON (insufficient)
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the token creation transaction failed
        expect(createTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            aborted: true,
            success: false,
        });

        // Get all deployed contracts and verify the count
        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(Number(allContracts)).toEqual(0);
    });

    // Test case: Verify creation of multiple tokens
    it('should create multiple token', async () => {
        // Create the first token
        const createTokenResult = await tonkPumpFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.6'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Create the second token
        const createTokenResult2 = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('0.6'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Create the third token
        await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('0.6'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        // Verify that the first token creation was successful
        expect(createTokenResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        // Verify that the second token creation was successful
        expect(createTokenResult2.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        // Get the addresses of the first two deployed token contracts
        const deployedAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        const deployedAddress2: Address | null = await tonkPumpFactory.getJettonAddress(1n);
        expect(deployedAddress).not.toBeNull();
        expect(deployedAddress2).not.toBeNull();

        // Get all deployed contracts and verify the count
        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(3n);

        // Verify that the deployed addresses match the ones in the contract list
        const gottenAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        const gottenAddress2: Address | null = await tonkPumpFactory.getJettonAddress(1n);
        expect(deployedAddress!.toString()).toEqual(gottenAddress!.toString());
        expect(deployedAddress2!.toString()).toEqual(gottenAddress2!.toString());
    });

    it('should validate that all tokens is owned by deployer', async () => {
        // Attempt to create a token
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('0.6'), // Send 0.05 TON for token creation
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );
        const createTokenResult2 = await tonkPumpFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.6'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );
        // Verify that the token creation transaction was successful
        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });
        // Verify that the token creation transaction was successful
        expect(createTokenResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        // Get all deployed contracts and verify the count
        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(2n);

        // Verify that the deployed address matches the one in the contract list
        const gottenAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        const gottenAddress2: Address | null = await tonkPumpFactory.getJettonAddress(1n);
        // Initialize the TonkPumpFactory contract
        tonkPump = blockchain.openContract(await TonkPumpJetton.fromAddress(gottenAddress!));

        // Initialize the TonkPumpFactory contract
        tonkPump2 = blockchain.openContract(await TonkPumpJetton.fromAddress(gottenAddress2!));

        const tokenOwner = await tonkPump.getOwner();
        const tokenOwner2 = await tonkPump2.getOwner();

        expect(tokenOwner).toEqualAddress(deployer.address);
        expect(tokenOwner2).toEqualAddress(deployer.address);
    });
});

// function parseEvent(body: ExternalOut[]): any {
//     const emits: ExternalOut[] = body;
//     let slice = emits[0].body
//     let emmitedAddress = loadContractDeployed(slice.asSlice())

//     return emmitedAddress;
// }
function parseEvent(body: ExternalOut[]): string {
    const emits: ExternalOut[] = body;
    let slice = emits[0].body.beginParse();
    let emmitedAddress = slice.loadStringTail();

    return emmitedAddress;
}