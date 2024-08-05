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
            value: toNano('0.1'),
        },
        { $$type: 'Buy', tonInDollars: toNano("16.64"),v:2444274701815932886817545822165884477550705390156034662149969727537430527267n },
          
        
    );
}
