import { Address, toNano } from '@ton/core';
import { TonkPumpAMM } from '../wrappers/TonkPumpAMM';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tonkPumpAMM = provider.open(
        TonkPumpAMM.fromAddress
            (Address.parse("EQDR2SdI5Tb7jxsDnxiEE9pn-SARq5asZb38G7uQtbGj5BJC")),
    );

    await tonkPumpAMM.send(
        provider.sender(),
        {
            value: toNano('0.6'),
        },
        {
            $$type: 'DevMint', yciycWallet: provider.sender().address!,
            exchangeWallet: provider.sender().address!,
            marketMakerWallet: provider.sender().address!
     

        },

    );
}
