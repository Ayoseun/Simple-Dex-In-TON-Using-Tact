import { Address, toNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { bigIntValue } from '../utils/hex_16';

export async function run(provider: NetworkProvider) {
    const jettonFactory = provider.open(await TonkPumpFactory.fromAddress(
        Address.parse("EQB1R7CzNjVvOxpnG1-yo6IZy7JeYxb3ABs8T_qAzKiIDuh3")));

    const jettonParams = {
        name: 'It will workToken',
        description: 'Full of faith; full of the spirit :)',
        symbol: 'It will',

        image: 'https://i.ibb.co/GthZ88P/b18069c3b2ac.jpg',
    };
    console.log(bigIntValue)
    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    await jettonFactory.send(
        provider.sender(),
        {
            value: toNano('0.6'),
        },
        {
            $$type: 'DeployContractAndAMM',
            content: content,
            ticker: "AYSN/TON",
            v: bigIntValue
        }
    );
    // await provider.waitForDeploy(jettonFactory.address);

    // run methods on `jettonFactory`
}
