import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/tonk_pump.tact',
    options: {
        debug: true,
    },
};
        