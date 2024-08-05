import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, toNano, fromNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { TonkPumpJetton } from '../wrappers/TonkPump';
import { TonkPumpDefaultWallet } from '../wrappers/TonkPumpWallet';
import { TonkPumpAMM } from '../wrappers/TonkPumpAMM'
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

describe('AMM Dev Token Allocation Test', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;
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
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');
        yciycWallet = await blockchain.treasury('yciycWallet');
        marketMakerwallet = await blockchain.treasury('marketMakerwallet');
        exchangeWallet = await blockchain.treasury('exchangeWallet');
        tonkPumpFactory = blockchain.openContract(await TonkPumpFactory.fromInit(1n));

        await deployContracts();
        await setupAMM();
    });

    it('should validate that dev can mint jetton allocation', async () => {
        const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
        expect(jettonAddress).not.toBeNull();
        console.log("Jetton Market Cap:", fromNano(await tonkPumpAMM.getPriceFromSupply()))
        await devMintTokens("8", user1)
        console.log("New Jetton balance of buyer:", fromNano(await getWalletBalance(user1.address)));
        console.log("New Jetton balance of yciyc:", fromNano(await getWalletBalance(yciycWallet.address)));
        console.log("New Jetton balance of marketMaker:", fromNano(await getWalletBalance(marketMakerwallet.address)));
        console.log("New Jetton balance of exchange:", fromNano(await getWalletBalance(exchangeWallet.address)));
        console.log("New AMM TON Balance:", fromNano(await tonkPumpAMM.getTonBalance()))

        console.log("New balance Jetton Supply:", fromNano(await tonkPumpAMM.getJettonTotalSupply()))
        console.log("New Jetton Market Cap:", fromNano(await tonkPumpAMM.getMarketCap()))
        const finalDevBalance = await getWalletBalance(user1.address);
        const finalAMMBalance = await await tonkPumpAMM.getJettonTotalSupply();
        expect(finalDevBalance).toEqual(toNano('2000000'));
        expect(finalAMMBalance).toEqual(toNano('15100000'));
    });

    it('should validate that dev cannot mint jetton allocation twice', async () => {
        const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
        expect(jettonAddress).not.toBeNull();
        console.log("Jetton Market Cap:", fromNano(await tonkPumpAMM.getPriceFromSupply()))
        await devMintTokens("8", user1)
        console.log("New Jetton balance of buyer:", fromNano(await getWalletBalance(user1.address)));
        console.log("New Jetton balance of yciyc:", fromNano(await getWalletBalance(yciycWallet.address)));
        console.log("New Jetton balance of marketMaker:", fromNano(await getWalletBalance(marketMakerwallet.address)));
        console.log("New Jetton balance of exchange:", fromNano(await getWalletBalance(exchangeWallet.address)));
        console.log("New AMM TON Balance:", fromNano(await tonkPumpAMM.getTonBalance()))

        console.log("New balance Jetton Supply:", fromNano(await tonkPumpAMM.getJettonTotalSupply()))
        console.log("New Jetton Market Cap:", fromNano(await tonkPumpAMM.getMarketCap()))
        const finalDevBalance = await getWalletBalance(user1.address);
        const finalAMMBalance = await await tonkPumpAMM.getJettonTotalSupply();
        expect(finalDevBalance).toEqual(toNano('2000000'));
        expect(finalAMMBalance).toEqual(toNano('15100000'));
        await failedDevMintTokens("8", user1)
    });

    it('should validate that only dev can mint allocation', async () => {
        const jettonAddress = await tonkPumpFactory.getJettonAddress(0n);
        expect(jettonAddress).not.toBeNull();
        await userToMintDevTokens("8", user2)

    });




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

        console.log("Factory Contract Balance", fromNano( factoryBalance))
        expect(factoryBalance).toBeGreaterThan(5041364n);
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
        console.log("AMM initial balance", fromNano(initialAmmBalance))
        expect(initialAmmBalance).toBeGreaterThanOrEqual(47081600n);


    }

    async function devMintTokens(amount: string, degen: any) {
        const buyResult = await tonkPumpAMM.send(
            degen.getSender(),
            { value: toNano(amount) },
            {
                $$type: 'DevMint', yciycWallet: yciycWallet.address,
                exchangeWallet: exchangeWallet.address,
                marketMakerWallet: marketMakerwallet.address,
               
            },
        );

        const userJettonAddress = await getWalletJettonAddress(degen.address);
        expect(buyResult.transactions).toHaveTransaction({
            from: tonkPumpJetton.address,
            to: userJettonAddress,
            success: true,
            aborted: false,
        });
    }

    async function userToMintDevTokens(amount: string, degen: any) {
        const buyResult = await tonkPumpAMM.send(
            degen.getSender(),
            { value: toNano(amount) },
            {
                $$type: 'DevMint', yciycWallet: yciycWallet.address,
                exchangeWallet: exchangeWallet.address,
                marketMakerWallet: marketMakerwallet.address,
               
            },
        );

     
        expect(buyResult.transactions).toHaveTransaction({
          
            success: false,
            aborted: true,
        });
    }

    async function failedDevMintTokens(amount: string, degen: any) {
        const buyResult = await tonkPumpAMM.send(
            degen.getSender(),
            { value: toNano(amount) },
            {
                $$type: 'DevMint', yciycWallet: yciycWallet.address,
                exchangeWallet: exchangeWallet.address,
                marketMakerWallet: marketMakerwallet.address,
               
            },
        );
        expect(buyResult.transactions).toHaveTransaction({
           
            success: false,
            aborted: true,
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
