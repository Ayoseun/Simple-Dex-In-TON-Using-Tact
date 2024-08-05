import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    totalSupply: bigint;
    mintable: boolean;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.totalSupply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonData(slice: Slice) {
    let sc_0 = slice;
    let _totalSupply = sc_0.loadIntBig(257);
    let _mintable = sc_0.loadBit();
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _walletCode = sc_0.loadRef();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode };
}

function loadTupleJettonData(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _walletCode = source.readCell();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode };
}

function storeTupleJettonData(source: JettonData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.walletCode);
    return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _walletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function loadTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeCell(source.walletCode);
    return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type DeployContractAndAMM = {
    $$type: 'DeployContractAndAMM';
    content: Cell;
    ticker: string;
    v: bigint;
}

export function storeDeployContractAndAMM(src: DeployContractAndAMM) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2291209167, 32);
        b_0.storeRef(src.content);
        b_0.storeStringRefTail(src.ticker);
        b_0.storeInt(src.v, 257);
    };
}

export function loadDeployContractAndAMM(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2291209167) { throw Error('Invalid prefix'); }
    let _content = sc_0.loadRef();
    let _ticker = sc_0.loadStringRefTail();
    let _v = sc_0.loadIntBig(257);
    return { $$type: 'DeployContractAndAMM' as const, content: _content, ticker: _ticker, v: _v };
}

function loadTupleDeployContractAndAMM(source: TupleReader) {
    let _content = source.readCell();
    let _ticker = source.readString();
    let _v = source.readBigNumber();
    return { $$type: 'DeployContractAndAMM' as const, content: _content, ticker: _ticker, v: _v };
}

function storeTupleDeployContractAndAMM(source: DeployContractAndAMM) {
    let builder = new TupleBuilder();
    builder.writeCell(source.content);
    builder.writeString(source.ticker);
    builder.writeNumber(source.v);
    return builder.build();
}

function dictValueParserDeployContractAndAMM(): DictionaryValue<DeployContractAndAMM> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployContractAndAMM(src)).endCell());
        },
        parse: (src) => {
            return loadDeployContractAndAMM(src.loadRef().beginParse());
        }
    }
}

export type Buy = {
    $$type: 'Buy';
    tonInDollars: bigint;
    v: bigint;
}

export function storeBuy(src: Buy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1874558029, 32);
        b_0.storeUint(src.tonInDollars, 256);
        b_0.storeInt(src.v, 257);
    };
}

export function loadBuy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1874558029) { throw Error('Invalid prefix'); }
    let _tonInDollars = sc_0.loadUintBig(256);
    let _v = sc_0.loadIntBig(257);
    return { $$type: 'Buy' as const, tonInDollars: _tonInDollars, v: _v };
}

function loadTupleBuy(source: TupleReader) {
    let _tonInDollars = source.readBigNumber();
    let _v = source.readBigNumber();
    return { $$type: 'Buy' as const, tonInDollars: _tonInDollars, v: _v };
}

function storeTupleBuy(source: Buy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.tonInDollars);
    builder.writeNumber(source.v);
    return builder.build();
}

function dictValueParserBuy(): DictionaryValue<Buy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuy(src)).endCell());
        },
        parse: (src) => {
            return loadBuy(src.loadRef().beginParse());
        }
    }
}

export type Sell = {
    $$type: 'Sell';
    amount: bigint;
    tonInDollars: bigint;
}

export function storeSell(src: Sell) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1698813713, 32);
        b_0.storeUint(src.amount, 256);
        b_0.storeUint(src.tonInDollars, 256);
    };
}

export function loadSell(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1698813713) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadUintBig(256);
    let _tonInDollars = sc_0.loadUintBig(256);
    return { $$type: 'Sell' as const, amount: _amount, tonInDollars: _tonInDollars };
}

function loadTupleSell(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _tonInDollars = source.readBigNumber();
    return { $$type: 'Sell' as const, amount: _amount, tonInDollars: _tonInDollars };
}

function storeTupleSell(source: Sell) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeNumber(source.tonInDollars);
    return builder.build();
}

function dictValueParserSell(): DictionaryValue<Sell> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSell(src)).endCell());
        },
        parse: (src) => {
            return loadSell(src.loadRef().beginParse());
        }
    }
}

export type DevMint = {
    $$type: 'DevMint';
    yciycWallet: Address;
    marketMakerWallet: Address;
    exchangeWallet: Address;
}

export function storeDevMint(src: DevMint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1333855987, 32);
        b_0.storeAddress(src.yciycWallet);
        b_0.storeAddress(src.marketMakerWallet);
        b_0.storeAddress(src.exchangeWallet);
    };
}

export function loadDevMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1333855987) { throw Error('Invalid prefix'); }
    let _yciycWallet = sc_0.loadAddress();
    let _marketMakerWallet = sc_0.loadAddress();
    let _exchangeWallet = sc_0.loadAddress();
    return { $$type: 'DevMint' as const, yciycWallet: _yciycWallet, marketMakerWallet: _marketMakerWallet, exchangeWallet: _exchangeWallet };
}

function loadTupleDevMint(source: TupleReader) {
    let _yciycWallet = source.readAddress();
    let _marketMakerWallet = source.readAddress();
    let _exchangeWallet = source.readAddress();
    return { $$type: 'DevMint' as const, yciycWallet: _yciycWallet, marketMakerWallet: _marketMakerWallet, exchangeWallet: _exchangeWallet };
}

function storeTupleDevMint(source: DevMint) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.yciycWallet);
    builder.writeAddress(source.marketMakerWallet);
    builder.writeAddress(source.exchangeWallet);
    return builder.build();
}

function dictValueParserDevMint(): DictionaryValue<DevMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDevMint(src)).endCell());
        },
        parse: (src) => {
            return loadDevMint(src.loadRef().beginParse());
        }
    }
}

export type ContractDeployed = {
    $$type: 'ContractDeployed';
    jettonAddress: Address;
    AMMAddress: Address;
}

export function storeContractDeployed(src: ContractDeployed) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3112054787, 32);
        b_0.storeAddress(src.jettonAddress);
        b_0.storeAddress(src.AMMAddress);
    };
}

export function loadContractDeployed(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3112054787) { throw Error('Invalid prefix'); }
    let _jettonAddress = sc_0.loadAddress();
    let _AMMAddress = sc_0.loadAddress();
    return { $$type: 'ContractDeployed' as const, jettonAddress: _jettonAddress, AMMAddress: _AMMAddress };
}

function loadTupleContractDeployed(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _AMMAddress = source.readAddress();
    return { $$type: 'ContractDeployed' as const, jettonAddress: _jettonAddress, AMMAddress: _AMMAddress };
}

function storeTupleContractDeployed(source: ContractDeployed) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeAddress(source.AMMAddress);
    return builder.build();
}

function dictValueParserContractDeployed(): DictionaryValue<ContractDeployed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContractDeployed(src)).endCell());
        },
        parse: (src) => {
            return loadContractDeployed(src.loadRef().beginParse());
        }
    }
}

export type SafeWithdraw = {
    $$type: 'SafeWithdraw';
    amount: bigint;
}

export function storeSafeWithdraw(src: SafeWithdraw) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3694826077, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadSafeWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3694826077) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    return { $$type: 'SafeWithdraw' as const, amount: _amount };
}

function loadTupleSafeWithdraw(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'SafeWithdraw' as const, amount: _amount };
}

function storeTupleSafeWithdraw(source: SafeWithdraw) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserSafeWithdraw(): DictionaryValue<SafeWithdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSafeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadSafeWithdraw(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    amount: bigint;
    receiver: Address;
    minter: bigint;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2789447861, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
        b_0.storeInt(src.minter, 257);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2789447861) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadIntBig(257);
    let _receiver = sc_0.loadAddress();
    let _minter = sc_0.loadIntBig(257);
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver, minter: _minter };
}

function loadTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    let _minter = source.readBigNumber();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver, minter: _minter };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    builder.writeNumber(source.minter);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type MintPublic = {
    $$type: 'MintPublic';
    amount: bigint;
}

export function storeMintPublic(src: MintPublic) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(354453439, 32);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadMintPublic(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 354453439) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadIntBig(257);
    return { $$type: 'MintPublic' as const, amount: _amount };
}

function loadTupleMintPublic(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'MintPublic' as const, amount: _amount };
}

function storeTupleMintPublic(source: MintPublic) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserMintPublic(): DictionaryValue<MintPublic> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMintPublic(src)).endCell());
        },
        parse: (src) => {
            return loadMintPublic(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type TokenTransferInternal = {
    $$type: 'TokenTransferInternal';
    queryId: bigint;
    amount: bigint;
    from: Address;
    response_destination: Address;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeTokenTransferInternal(src: TokenTransferInternal) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.response_destination);
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransferInternal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenTransferInternal' as const, queryId: _queryId, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleTokenTransferInternal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_destination = source.readAddress();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenTransferInternal' as const, queryId: _queryId, amount: _amount, from: _from, response_destination: _response_destination, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleTokenTransferInternal(source: TokenTransferInternal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_destination);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenTransferInternal(): DictionaryValue<TokenTransferInternal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransferInternal(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransferInternal(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Cell;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forward_payload: _forward_payload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenBurn = {
    $$type: 'TokenBurn';
    queryId: bigint;
    amount: bigint;
    owner: Address;
    response_destination: Address;
}

export function storeTokenBurn(src: TokenBurn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadTupleTokenBurn(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function storeTupleTokenBurn(source: TokenBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenBurn(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurn(src.loadRef().beginParse());
        }
    }
}

export type TokenBurnNotification = {
    $$type: 'TokenBurnNotification';
    queryId: bigint;
    amount: bigint;
    owner: Address;
    response_destination: Address | null;
}

export function storeTokenBurnNotification(src: TokenBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadTokenBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadMaybeAddress();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    return { $$type: 'TokenBurnNotification' as const, queryId: _queryId, amount: _amount, owner: _owner, response_destination: _response_destination };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenExcesses = {
    $$type: 'TokenExcesses';
    queryId: bigint;
}

export function storeTokenExcesses(src: TokenExcesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadTokenExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'TokenExcesses' as const, queryId: _queryId };
}

function loadTupleTokenExcesses(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'TokenExcesses' as const, queryId: _queryId };
}

function storeTupleTokenExcesses(source: TokenExcesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserTokenExcesses(): DictionaryValue<TokenExcesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadTokenExcesses(src.loadRef().beginParse());
        }
    }
}

export type TokenUpdateContent = {
    $$type: 'TokenUpdateContent';
    content: Cell;
}

export function storeTokenUpdateContent(src: TokenUpdateContent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2937889386, 32);
        b_0.storeRef(src.content);
    };
}

export function loadTokenUpdateContent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2937889386) { throw Error('Invalid prefix'); }
    let _content = sc_0.loadRef();
    return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function loadTupleTokenUpdateContent(source: TupleReader) {
    let _content = source.readCell();
    return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function storeTupleTokenUpdateContent(source: TokenUpdateContent) {
    let builder = new TupleBuilder();
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserTokenUpdateContent(): DictionaryValue<TokenUpdateContent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenUpdateContent(src)).endCell());
        },
        parse: (src) => {
            return loadTokenUpdateContent(src.loadRef().beginParse());
        }
    }
}

export type UpdateAllocationPercentages = {
    $$type: 'UpdateAllocationPercentages';
    yciyAllocation: bigint;
    developerAllocation: bigint;
    marketMakerAllocation: bigint;
    exchangeAllocation: bigint;
}

export function storeUpdateAllocationPercentages(src: UpdateAllocationPercentages) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2155690333, 32);
        b_0.storeUint(src.yciyAllocation, 64);
        b_0.storeUint(src.developerAllocation, 64);
        b_0.storeUint(src.marketMakerAllocation, 64);
        b_0.storeUint(src.exchangeAllocation, 64);
    };
}

export function loadUpdateAllocationPercentages(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2155690333) { throw Error('Invalid prefix'); }
    let _yciyAllocation = sc_0.loadUintBig(64);
    let _developerAllocation = sc_0.loadUintBig(64);
    let _marketMakerAllocation = sc_0.loadUintBig(64);
    let _exchangeAllocation = sc_0.loadUintBig(64);
    return { $$type: 'UpdateAllocationPercentages' as const, yciyAllocation: _yciyAllocation, developerAllocation: _developerAllocation, marketMakerAllocation: _marketMakerAllocation, exchangeAllocation: _exchangeAllocation };
}

function loadTupleUpdateAllocationPercentages(source: TupleReader) {
    let _yciyAllocation = source.readBigNumber();
    let _developerAllocation = source.readBigNumber();
    let _marketMakerAllocation = source.readBigNumber();
    let _exchangeAllocation = source.readBigNumber();
    return { $$type: 'UpdateAllocationPercentages' as const, yciyAllocation: _yciyAllocation, developerAllocation: _developerAllocation, marketMakerAllocation: _marketMakerAllocation, exchangeAllocation: _exchangeAllocation };
}

function storeTupleUpdateAllocationPercentages(source: UpdateAllocationPercentages) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.yciyAllocation);
    builder.writeNumber(source.developerAllocation);
    builder.writeNumber(source.marketMakerAllocation);
    builder.writeNumber(source.exchangeAllocation);
    return builder.build();
}

function dictValueParserUpdateAllocationPercentages(): DictionaryValue<UpdateAllocationPercentages> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateAllocationPercentages(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateAllocationPercentages(src.loadRef().beginParse());
        }
    }
}

export type DeployedPair = {
    $$type: 'DeployedPair';
    jettonAddress: Address;
    ammAddress: Address;
}

export function storeDeployedPair(src: DeployedPair) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.jettonAddress);
        b_0.storeAddress(src.ammAddress);
    };
}

export function loadDeployedPair(slice: Slice) {
    let sc_0 = slice;
    let _jettonAddress = sc_0.loadAddress();
    let _ammAddress = sc_0.loadAddress();
    return { $$type: 'DeployedPair' as const, jettonAddress: _jettonAddress, ammAddress: _ammAddress };
}

function loadTupleDeployedPair(source: TupleReader) {
    let _jettonAddress = source.readAddress();
    let _ammAddress = source.readAddress();
    return { $$type: 'DeployedPair' as const, jettonAddress: _jettonAddress, ammAddress: _ammAddress };
}

function storeTupleDeployedPair(source: DeployedPair) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeAddress(source.ammAddress);
    return builder.build();
}

function dictValueParserDeployedPair(): DictionaryValue<DeployedPair> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployedPair(src)).endCell());
        },
        parse: (src) => {
            return loadDeployedPair(src.loadRef().beginParse());
        }
    }
}

 type TonkPumpFactory_init_args = {
    $$type: 'TonkPumpFactory_init_args';
    id: bigint;
}

function initTonkPumpFactory_init_args(src: TonkPumpFactory_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.id, 257);
    };
}

async function TonkPumpFactory_init(id: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initTonkPumpFactory_init_args({ $$type: 'TonkPumpFactory_init_args', id })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const TonkPumpFactory_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    3734: { message: `Not Owner` },
    4159: { message: `Invalid value!!` },
    4429: { message: `Invalid sender` },
    6898: { message: `The total supply will be overlapping.` },
    14796: { message: `Exceeds max supply` },
    18336: { message: `Insufficient funds for deployment` },
    18668: { message: `Can't Mint Anymore` },
    18720: { message: `Only dev can mint` },
    26785: { message: `Jetton deployment failed` },
    34030: { message: `Insufficient TON balance` },
    38006: { message: `Invalid deployment fee` },
    40368: { message: `Contract stopped` },
    42708: { message: `Invalid sender!` },
    42834: { message: `Insufficient balance for both Jetton and AMM deployment` },
    43103: { message: `Invalid withdrawal amount` },
    43422: { message: `Invalid value - Burn` },
    48516: { message: `Minting cannot start yet` },
    48673: { message: `Insufficient balance for withdrawal` },
    51687: { message: `Already minted` },
    53296: { message: `Contract not stopped` },
    54615: { message: `Insufficient balance` },
    54687: { message: `AMM deployment failed` },
    62972: { message: `Invalid balance` },
}

const TonkPumpFactory_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"DeployContractAndAMM","header":2291209167,"fields":[{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"ticker","type":{"kind":"simple","type":"string","optional":false}},{"name":"v","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Buy","header":1874558029,"fields":[{"name":"tonInDollars","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"v","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Sell","header":1698813713,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"tonInDollars","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"DevMint","header":1333855987,"fields":[{"name":"yciycWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"marketMakerWallet","type":{"kind":"simple","type":"address","optional":false}},{"name":"exchangeWallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ContractDeployed","header":3112054787,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"AMMAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SafeWithdraw","header":3694826077,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Mint","header":2789447861,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"minter","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"MintPublic","header":354453439,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenTransferInternal","header":395134233,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenBurn","header":1499400124,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenBurnNotification","header":2078119902,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"TokenExcesses","header":3576854235,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"TokenUpdateContent","header":2937889386,"fields":[{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"UpdateAllocationPercentages","header":2155690333,"fields":[{"name":"yciyAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"developerAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"marketMakerAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"exchangeAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployedPair","header":null,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"ammAddress","type":{"kind":"simple","type":"address","optional":false}}]},
]

const TonkPumpFactory_getters: ABIGetter[] = [
    {"name":"jettonAddress","arguments":[{"name":"tokenId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"ammContractAddress","arguments":[{"name":"tokenId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"allContracts","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"deployFee","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"myAddress","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"id","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"balance","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_contract_storage_fee","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"stopped","arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
]

const TonkPumpFactory_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"DeployContractAndAMM"}},
    {"receiver":"internal","message":{"kind":"text","text":"ChangeDeploymentFee"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ChangeOwner"}},
    {"receiver":"internal","message":{"kind":"text","text":"Withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SafeWithdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
    {"receiver":"internal","message":{"kind":"text","text":"Stop"}},
    {"receiver":"internal","message":{"kind":"text","text":"Resume"}},
]

export class TonkPumpFactory implements Contract {
    
    static async init(id: bigint) {
        return await TonkPumpFactory_init(id);
    }
    
    static async fromInit(id: bigint) {
        const init = await TonkPumpFactory_init(id);
        const address = contractAddress(0, init);
        return new TonkPumpFactory(address, init);
    }
    
    static fromAddress(address: Address) {
        return new TonkPumpFactory(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  TonkPumpFactory_types,
        getters: TonkPumpFactory_getters,
        receivers: TonkPumpFactory_receivers,
        errors: TonkPumpFactory_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | DeployContractAndAMM | 'ChangeDeploymentFee' | ChangeOwner | 'Withdraw' | SafeWithdraw | Deploy | 'Stop' | 'Resume') {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DeployContractAndAMM') {
            body = beginCell().store(storeDeployContractAndAMM(message)).endCell();
        }
        if (message === 'ChangeDeploymentFee') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ChangeOwner') {
            body = beginCell().store(storeChangeOwner(message)).endCell();
        }
        if (message === 'Withdraw') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SafeWithdraw') {
            body = beginCell().store(storeSafeWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (message === 'Stop') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'Resume') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getJettonAddress(provider: ContractProvider, tokenId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(tokenId);
        let source = (await provider.get('jettonAddress', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
    async getAmmContractAddress(provider: ContractProvider, tokenId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(tokenId);
        let source = (await provider.get('ammContractAddress', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
    async getAllContracts(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('allContracts', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getDeployFee(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('deployFee', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getMyAddress(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('myAddress', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('id', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGetContractStorageFee(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_contract_storage_fee', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getStopped(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('stopped', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
}