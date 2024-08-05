import { Address, toNano } from '@ton/core';
import { TonkPumpFactory } from '../wrappers/TonkPumpFactory';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonFactory = provider.open(await TonkPumpFactory.fromInit(0n));
    try {
        await jettonFactory.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        await provider.waitForDeploy(jettonFactory.address);
    } catch (error: any) {
        console.log(error)
    }



    // run methods on `jettonFactory`
}
