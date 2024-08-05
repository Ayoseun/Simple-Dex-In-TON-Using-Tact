import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/tonk_pump_amm.tact',
    options: {
        debug: true,
    },
};
