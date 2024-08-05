import "@stdlib/deploy";
import "@stdlib/ownable";
import "./tonk_pump"; // Local contract TonkPumpJetton
import "./message"; // Local contract message

message Buy {
    tonInDollars: Int as uint256;
}
message Sell {
    amount: Int as uint256;
}
message DevMint {
    yciycWallet: Address;
    marketMakerWallet: Address;
    exchangeWallet: Address;
    tonInDollars: Int as uint256;
}

contract TonkPumpAMsM with Deployable {
    i1: Int as uint128 = 3001;
    owner: Address;
    ticker: String;
    tonkPumpJettonAddress: Address;
    jettonReserve: Int as uint256 = 0;
    balance: Int as uint256 = 0;
    maxSupply: Int as uint256;
    id: Int as uint8;
    queryId: Int as uint256;
    // Bonding curve parameters
    k: Int as uint32; // scaling factor
    n: Int as uint32; // exponent
    dev: Address;
    // Dynamic supply
    jettonSupply: Int as uint256 = 0;
    init(_id: Int, _owner: Address, _dev: Address, _jettonAddress: Address, _ticker: String){
        self.id = _id;
        self.owner = _owner;
        self.dev = _dev;
        self.tonkPumpJettonAddress = _jettonAddress;
        self.jettonSupply = 2000000 * pow(10, 9); //should be 16,000,000
        self.maxSupply = 100000000 * pow(10, 9); //should be 800,000,000
        self.ticker = _ticker;
        self.queryId = 0;
        self.n = 95 * pow(10, 8); //should be 9.5
        self.k = 278; // should be 0.0000000278
    }

    receive(msg: Sell){
        let tonOut: Int = self.getTonOutForJettonsIn(msg.amount);
        require(tonOut <= self.balance, "Insufficient TON liquidity");
        self.balance = (self.balance - tonOut);
        let initContract: StateInit = self.getJettonWalletInit(context().sender);
        send(SendParameters{
                to: contractAddress(initContract),
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: false,
                body: TokenBurn{
                    queryId: self.queryId,
                    amount: msg.amount,
                    response_destination: myAddress(),
                    owner: context().sender
                }.toCell(),
                code: initContract.code,
                data: initContract.data
            }
        );
        self.queryId += 1;
        self.sendTon(tonOut);
    }

    receive(msg: Buy){
        let tonAmount: Int = context().value;
        let jettonsOut: Int = 2; // self.getTonInForJettonsOut(tonAmount, msg.tonInDollars);
        // Transfer tokens to the buyer
        dump(jettonsOut);
        send(SendParameters{
                to: self.tonkPumpJettonAddress, // Changed to send to the Jetton master contract
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: jettonsOut, receiver: context().sender, minter: 0}.toCell()
            }
        );
        self.jettonSupply = (self.jettonSupply + jettonsOut); // Changed subtraction to addition
    }

    receive(msg: DevMint){
        let tonAmount: Int = context().value;
        let devToken: Int = 16000000 * pow(10, 9);
        let jettonPrice: Int = devToken * self.priceFromSupply() / msg.tonInDollars;
        // require(tonAmount >= jettonPrice, "Insufficient TON balance");
        self.jettonSupply = 0;
        let yciycToken: Int = 800000 * pow(10, 9); //0.1%
        let exchangeToken: Int = 80000000 * pow(10, 9); //10%
        let marketMakerToken: Int = 24000000 * pow(10, 9); //3%
        send(SendParameters{
                to: self.tonkPumpJettonAddress, // Changed to send to the Jetton master contract
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: devToken, receiver: context().sender, minter: 0}.toCell()
            }
        );
        send(SendParameters{
                to: self.tonkPumpJettonAddress, // Changed to send to the Jetton master contract
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: yciycToken, receiver: msg.yciycWallet, minter: 0}.toCell()
            }
        );
        send(SendParameters{
                to: self.tonkPumpJettonAddress, // Changed to send to the Jetton master contract
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: exchangeToken, receiver: msg.exchangeWallet, minter: 0}.toCell()
            }
        );
        send(SendParameters{
                to: self.tonkPumpJettonAddress, // Changed to send to the Jetton master contract
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: marketMakerToken, receiver: msg.marketMakerWallet, minter: 0}.toCell()
            }
        );
        let total: Int = (((marketMakerToken + exchangeToken) + yciycToken) + devToken);
        self.jettonSupply = (self.jettonSupply + total);
    }

    get fun ticker(): String {
        return self.ticker;
    }

    get fun ammAddress(): Address {
        return myAddress();
    }

    get fun jettonAddress(): Address {
        return self.tonkPumpJettonAddress;
    }

    get fun jettonMaxSupply(): Int {
        return self.maxSupply;
    }
    //Market Cap = Total Supply of Tokens x Current Market Price per Token

    get fun MarketCap(): Int {
        return self.jettonSupply * self.priceFromSupply();
    }

    get fun jettonTotalSupply(): Int {
        return self.jettonSupply;
    }

    get fun id(): Int {
        return self.id;
    }

    get fun tonBalance(): Int {
        return myBalance();
    }

    get fun ammJettonWalletAddress(): Address {
        return contractAddress(self.getJettonWalletInit(myAddress()));
    }

    receive("Swap"){
        let tonAmount: Int = context().value;
        require(tonAmount > 0, "Sent value must be greater than 0");
        let jettonsOut: Int = self.getTonInForJettonsOut(tonAmount);
        require(jettonsOut > 0, "Not enough tokens to transfer");
        self.tonReserve = (self.tonReserve + tonAmount);
        self.jettonSupply = (self.jettonSupply - jettonsOut);
        // Transfer tokens to the buyer
        let user: Address = context().sender;
        let initContract: StateInit = initOf TonkPumpDefaultWallet(self.tonkPumpJettonAddress, myAddress());
        send(SendParameters{
                to: contractAddress(initContract),
                value: ton("0.1"),
                mode: SendIgnoreErrors,
                bounce: false,
                body: TokenTransfer{
                    queryId: self.queryId,
                    amount: jettonsOut,
                    destination: user,
                    response_destination: self.owner,
                    custom_payload: emptyCell(),
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: initContract.code,
                data: initContract.data
            }
        );
        self.queryId += 1;
    }

    fun getJettonWalletInit(address: Address): StateInit {
        return initOf TonkPumpDefaultWallet(self.tonkPumpJettonAddress, address);
    }

    fun sendTon(amount: Int) {
        require(amount > 0, "Insufficient TON balance");
        send(SendParameters{to: sender(), bounce: true, value: amount, mode: (SendRemainingValue + SendIgnoreErrors)});
    }

    get fun priceFromSupply(): Int {
        let m: Int = myBalance() * pow(10, 9) / self.jettonSupply;
        return self.jettonSupply;
    }
    // fun calculateJettonPrice(k: Int, n: Int, jtSupply: Int, mxSupply: Int): Int {
    //     let propMxSupply: Int = mxSupply / jtSupply;
    //     let scale: Int = pow(propMxSupply, n);
    //     let exp: Int = k * scale;
    //     return exp;
    // }

    // Calculate the TON out for a given number of tokens in

    fun getTonOutForJettonsIn(jettonsIn: Int): Int {
        let jettonPrice: Int = self.priceFromSupply();
        let tonOut: Int = jettonsIn * jettonPrice;
        return tonOut;
    }

    // Calculate the TON in for a given number of tokens out

    fun getTonInForJettonsOut(tonAmount: Int, tonPriceInDollars: Int): Int {
        let tokenPrice: Int = 278 / 10;
        let totalDollars: Int = tonAmount * tonPriceInDollars;
        let tokens: Int = totalDollars / tokenPrice;
        return tokens;
    }

    // Function to withdraw accumulated fees (only callable by owner)

    fun withdrawFees(amount: Int) {
        require(context().sender == self.owner, "Not Owner");
        require(amount <= self.balance, "Insufficient balance");
        self.sendTon(amount);
    }
}