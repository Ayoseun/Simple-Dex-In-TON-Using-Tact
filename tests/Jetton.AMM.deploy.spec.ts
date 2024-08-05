import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, toNano, fromNano, Cell, beginCell } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { TonkPumpJetton } from '../wrappers/TonkPump';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { TonkPumpDefaultWallet } from '../wrappers/TonkPumpWallet';
import { TonkPumpAMM } from '../wrappers/TonkPumpAMM';

describe('Jetton and AMM Deploy Test', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
    let user3: SandboxContract<TreasuryContract>;
    let tonkPumpFactory: SandboxContract<TonkPumpFactory>;
    let tonkPump: SandboxContract<TonkPumpJetton>;
    let tonkPumpAMM: SandboxContract<TonkPumpAMM>;

    const jettonParams = {
        name: 'Ayoseun Token',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'AYSN',
        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };

    const content = buildOnchainMetadata(jettonParams);

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        tonkPumpFactory = blockchain.openContract(await TonkPumpFactory.fromInit(1n));
        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');
        user3 = await blockchain.treasury('user3');

        const deployResult = await tonkPumpFactory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            deploy: true,
            success: true,
        });
    });

    it('should validate that Jetton was deployed', async () => {
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('1'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });
        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(1n);
        const jettonAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        tonkPump = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        expect(jettonAddress).toEqualAddress(await tonkPump.address)

    });
    it('should validate that AMM was deployed', async () => {
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('1'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(1n);

        const jettonAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);

        const jettonAMMAddress: Address | null = await tonkPumpFactory.getAmmContractAddress(jettonAddress!);
        expect(jettonAddress).not.toBeNull();


        tonkPump = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        tonkPumpAMM = blockchain.openContract(await TonkPumpAMM.fromAddress(jettonAMMAddress!));
        expect(jettonAMMAddress).toEqualAddress(tonkPumpAMM.address);

    });

    it('should validate that owner of every AMM is deployer address', async () => {
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),

            { value: toNano('2.3') },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        const createTokenResult2 = await tonkPumpFactory.send(
            user2.getSender(),

            { value: toNano('2.3') },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult2.transactions).toHaveTransaction({
            from: user2.address,
            to: tonkPumpFactory.address,
            success: true,
        });
        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(2n);

        const jettonAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        const jettonAddress2: Address | null = await tonkPumpFactory.getJettonAddress(1n);
        expect(jettonAddress).not.toBeNull();
        expect(jettonAddress2).not.toBeNull();
        let jetton1 = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        let jetton2 = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));


        const jetton1Owner = await jetton1.getOwner();
        const jetton2Owner = await jetton2.getOwner();
        expect(jetton2Owner).toEqualAddress(deployer.address);
        expect(jetton1Owner).toEqualAddress(deployer.address);
    });
    it('should validate that AMM was deployed with Ticker', async () => {
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),

            { value: toNano('2.3') },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(1n);

        const jettonAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);

        expect(jettonAddress).not.toBeNull();


        tonkPump = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        const jettonAMMDeployedAddress: Address | null = await tonkPumpFactory.getAmmContractAddress(jettonAddress!);

        tonkPumpAMM = blockchain.openContract(await TonkPumpAMM.fromAddress(jettonAMMDeployedAddress!));
        expect(jettonAMMDeployedAddress).toEqualAddress(tonkPumpAMM.address);

        const tonkPumpAMMTicker = await tonkPumpAMM.getTicker();
        const tokenOwner = await tonkPump.getOwner();
        expect(tonkPumpAMMTicker).toEqual('AYSN/TON');
        expect(tokenOwner).toEqualAddress(deployer.address);
    });

    it('should validate that deployed Jetton and AMM are linked', async () => {
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),

            { value: toNano('2.3') },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });

        const allContracts = await tonkPumpFactory.getAllContracts();
        expect(allContracts).toBe(1n);

        const jettonAddress: Address | null = await tonkPumpFactory.getJettonAddress(0n);
        expect(jettonAddress).not.toBeNull();

        tonkPump = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        const jettonAMMDeployedAddress: Address | null = await tonkPumpFactory.getAmmContractAddress(jettonAddress!);

        tonkPumpAMM = blockchain.openContract(await TonkPumpAMM.fromAddress(jettonAMMDeployedAddress!));
        expect(jettonAMMDeployedAddress).toEqualAddress(tonkPumpAMM.address);

        const tonkPumpAMMJetton = await tonkPumpAMM.getJettonAddress();

        expect(tonkPumpAMMJetton).toEqualAddress(jettonAddress!);
    });

    it('should validate that Jetton deployment must cost 0.5 TON', async () => {
        const createLowTokenResult = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('0.4'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createLowTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            aborted: true,
            success: false,
        });


        const createRealTokenResult = await tonkPumpFactory.send(
            user1.getSender(),
            {
                value: toNano('0.6'),
            },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );

        expect(createRealTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            aborted: false,
            success: true,
        });
    });
});

async function walletBalance(tonkPump: any, tonkPumpWallet: any, blockchain: any, userAddress: any) {
    const tonkPumpWalletAddress = await tonkPump.getGetWalletAddress(userAddress);
    tonkPumpWallet = blockchain.openContract(await TonkPumpDefaultWallet.fromAddress(tonkPumpWalletAddress));
    blockchain.now! + 60;
    const deployerBalance = await tonkPumpWallet.getGetWalletData();
    console.log('Deployer balance:', fromNano(deployerBalance.balance));
    return deployerBalance.balance;
}
