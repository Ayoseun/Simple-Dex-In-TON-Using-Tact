import { Address, beginCell, toNano } from '@ton/core';
import { TonkPumpAMM } from '../wrappers/TonkPumpAMM';
import { NetworkProvider } from '@ton/blueprint';
import { TonkPumpJetton } from '../wrappers/TonkPump';
import { TonkPumpDefaultWallet } from '../wrappers/TonkPumpWallet';

export async function run(provider: NetworkProvider) {
    const tonkPumpwallet = provider.open(
        await TonkPumpDefaultWallet.fromInit(Address.parse("EQCP54xhWBGbT_5fRd-nf8vq8nyiw6UOKWAcRT_9flnyJoNg"), Address.parse(provider.sender().address?.toString()!)),
    );
    const body: any = beginCell()
        .storeUint(OPS.Transfer, 32)
        .storeUint(1, 64)
        .storeCoins(500000000000n)
        .storeAddress(Address.parse("EQDR2SdI5Tb7jxsDnxiEE9pn-SARq5asZb38G7uQtbGj5BJC"))
        .storeAddress(Address.parse(provider.sender().address?.toString()!))
        .storeBit(false)
        .storeCoins(toNano(0.001))
        .storeBit(false) // forward_payload in this slice, not separate cell
        .endCell();
    await provider.sender().send({
        value: toNano("0.05"),
        to: tonkPumpwallet.address,
        body
    }

    );
}

enum OPS {
    ChangeAdmin = 3,
    ReplaceMetadata = 4,
    Mint = 21,
    InternalTransfer = 0x178d4519,
    Transfer = 0xf8a7ea5,
    Burn = 0x595f07bc,
}