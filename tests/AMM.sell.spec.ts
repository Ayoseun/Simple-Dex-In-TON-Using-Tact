import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, toNano, fromNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { TonkPumpJetton } from '../wrappers/TonkPump';
import { TonkPumpDefaultWallet } from '../wrappers/TonkPumpWallet';
import { TonkPumpAMM } from '../wrappers/TonkPumpAMM'
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

describe('AMM Sell Token Test', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dev: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
    let user3: SandboxContract<TreasuryContract>;
    let yciycWallet: SandboxContract<TreasuryContract>;
    let exchangeWallet: SandboxContract<TreasuryContract>;
    let marketMakerwallet: SandboxContract<TreasuryContract>;
    let tonkPumpFactory: SandboxContract<TonkPumpFactory>;
    let tonkPumpJetton: SandboxContract<TonkPumpJetton>;
    let tonkPumpAMM: SandboxContract<TonkPumpAMM>;

    const jettonParams = {
        name: 'Ayoseun Token',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'AYSN',
        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        dev = await blockchain.treasury('dev');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');
        user3 = await blockchain.treasury('user3');
        yciycWallet = await blockchain.treasury('yciycWallet');
        marketMakerwallet = await blockchain.treasury('marketMakerwallet');
        exchangeWallet = await blockchain.treasury('exchangeWallet');
        tonkPumpFactory = blockchain.openContract(await TonkPumpFactory.fromInit(1n));

        await deployContracts();
        await setupAMM();
    });
    it('should validate that one User can sell their jetton', async () => {
        const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
        console.log("init price", fromNano(await tonkPumpAMM.getPriceFromSupply()))
        expect(jettonAddress).not.toBeNull();
        console.log("Intial balance Jetton Reserve:", fromNano(await tonkPumpAMM.getJettonTotalSupply()))
        await devMintTokens();
        console.log("after dev price", fromNano(await tonkPumpAMM.getPriceFromSupply()))
        await buyTokens('5', user2);
        await buyTokens('6', user3);
        console.log("after user buy price", fromNano(await tonkPumpAMM.getPriceFromSupply()))
        console.log("Reduced Ton balance of user2:", fromNano(await user2.getBalance()));
        console.log("New Jetton balance of buyer user2:", fromNano(await getWalletBalance(user2.address)));
        console.log("New Jetton balance of buyer user3:", fromNano(await getWalletBalance(user3.address)));
        console.log("New balance Jetton Reserve:", fromNano(await tonkPumpAMM.getJettonTotalSupply()))
        console.log("New balance TON/Jeton:", fromNano(await tonkPumpAMM.getTonBalance()))
        await sellTokens("2", user2)
        console.log("New Jetton balance of seller, user2:", fromNano(await getWalletBalance(user2.address)));
        console.log("New Jetton balance of buyer user3:", fromNano(await getWalletBalance(user3.address)));
        console.log("New balance TON:", fromNano(await tonkPumpAMM.getTonBalance()))
        console.log("Reduced balance Jetton Reserve:", fromNano(await tonkPumpAMM.getJettonTotalSupply()))
        console.log("Added Ton balance of user2:", fromNano(await user2.getBalance()));
        // console.log("New balance Jetton Reserve:",fromNano( await tonkPumpAMM.getJettonTotalSupply()))
        // console.log("New Jetton Market Cap:",fromNano( await tonkPumpAMM.getMarketCap()))
        // // const finalUserBalance = await getWalletBalance(user1.address);
        // expect(finalUserBalance).toEqual(toNano('749066.484346239'));
        // expect(finalAMMBalance).toEqual(toNano('7090933.515653761'));
    });
    // it('should validate that User can buy jetton', async () => {
    //     const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
    //     expect(jettonAddress).not.toBeNull();
    //     await devMintTokens();
    //     await buyTokens('1', deployer);
    //     console.log("New Jetton balance of buyer deployer:", fromNano(await getWalletBalance(deployer.address)));
    //     await buyTokens('0.432', user1);
    //     console.log("New Jetton balance of buyer user1:", fromNano(await getWalletBalance(user1.address)));
    //     await buyTokens('5', user2);
    //     console.log("New Jetton balance of buyer user2:", fromNano(await getWalletBalance(user2.address)));
    //     await buyTokens('6', user3);
    //     console.log("New Jetton balance of buyer user3:", fromNano(await getWalletBalance(user3.address)));

    //     console.log("New balance TON/Jeton:", fromNano(await tonkPumpAMM.getTonBalance()))

    //     // console.log("New balance Jetton Reserve:",fromNano( await tonkPumpAMM.getJettonTotalSupply()))
    //     // console.log("New Jetton Market Cap:",fromNano( await tonkPumpAMM.getMarketCap()))
    //     // // const finalUserBalance = await getWalletBalance(user1.address);
    //     // expect(finalUserBalance).toEqual(toNano('749066.484346239'));
    //     // expect(finalAMMBalance).toEqual(toNano('7090933.515653761'));
    // });

    async function deployContracts() {
        const deployResult = await tonkPumpFactory.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n },
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonkPumpFactory.address,
            deploy: true,
            success: true,
        });

        const content = buildOnchainMetadata(jettonParams);
        const createTokenResult = await tonkPumpFactory.send(
            user1.getSender(),

            { value: toNano('0.6') },
            { $$type: 'DeployContractAndAMM', content: content, ticker: 'AYSN/TON', minter: 0n },
        );
        expect(createTokenResult.transactions).toHaveTransaction({
            from: user1.address,
            to: tonkPumpFactory.address,
            success: true,
        });
        const factoryBalance = await tonkPumpFactory.getBalance();

   
        expect(factoryBalance).toBeGreaterThan(500n);
    }

    async function setupAMM() {
        const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
        const jettonAMMAddress = await tonkPumpFactory.getAmmContractAddress(jettonAddress!);
        tonkPumpJetton = blockchain.openContract(await TonkPumpJetton.fromAddress(jettonAddress!));
        tonkPumpAMM = blockchain.openContract(await TonkPumpAMM.fromAddress(jettonAMMAddress!));
        expect(jettonAMMAddress).toEqualAddress(tonkPumpAMM.address)
        const JettonAddressFromAMM = await tonkPumpAMM.getJettonAddress();
        expect(jettonAddress).toEqualAddress(JettonAddressFromAMM)
        await user1.send({ to: tonkPumpAMM.address, value: toNano('0.05'), bounce: false });
        const initialAmmBalance = await tonkPumpAMM.getTonBalance();
        expect(initialAmmBalance).toBeGreaterThanOrEqual(47081600n);
    }

    async function buyTokens(amount: string, degen: any) {

        const buyResult = await tonkPumpAMM.send(
            degen.getSender(),
            { value: toNano(amount) },
            { $$type: 'Buy', tonInDollars: toNano("16.64") },
        );

        const userJettonAddress = await getWalletJettonAddress(degen.address);


        expect(buyResult.transactions).toHaveTransaction({
            from: tonkPumpJetton.address,
            to: userJettonAddress,
            success: true,
            aborted: false,
        });
    }

    async function sellTokens(amount: string, degen: any) {

        const sellResult = await tonkPumpAMM.send(
            degen.getSender(),
            { value: toNano("0.05") },
            { $$type: 'Sell', amount: toNano(amount), tonInDollars: toNano("16.64") },
        );

        const userJettonAddress = await getWalletJettonAddress(degen.address);


        // expect(buyResult.transactions).toHaveTransaction({
        //     from: tonkPumpJetton.address,
        //     to: userJettonAddress,
        //     success: true,
        //     aborted: false,
        // });
    }
    async function devMintTokens() {
        const devResult = await tonkPumpAMM.send(
            user1.getSender(),
            { value: toNano("0.05") },
            {
                $$type: 'DevMint', yciycWallet: yciycWallet.address,
                exchangeWallet: exchangeWallet.address,
                marketMakerWallet: marketMakerwallet.address,

            },
        );

        const devJettonAddress = await getWalletJettonAddress(user1.address);
        expect(devResult.transactions).toHaveTransaction({
            from: tonkPumpJetton.address,
            to: devJettonAddress,
            success: true,
            aborted: false,
        });
    }
    async function getWalletBalance(address: Address): Promise<bigint> {
        const walletAddress = await tonkPumpJetton.getGetWalletAddress(address);
        const wallet = blockchain.openContract(await TonkPumpDefaultWallet.fromAddress(walletAddress));
        const walletData = await wallet.getGetWalletData();
        return walletData.balance;
    }

    async function getWalletJettonAddress(address: Address): Promise<Address> {
        const walletAddress = await tonkPumpJetton.getGetWalletAddress(address);
        const wallet = blockchain.openContract(await TonkPumpDefaultWallet.fromAddress(walletAddress));
        return wallet.address;
    }
});
