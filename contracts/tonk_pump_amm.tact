import "@stdlib/deploy";
import "@stdlib/ownable";
import "./tonk_pump"; // Local contract TonkPumpJetton
import "./message"; // Local contract message



contract TonkPumpAMM with Deployable {
    owner: Address;
    ticker: String;
    isDevMint: Bool;
    tonkPumpJettonAddress: Address;
    jettonReserve: Int as uint256 = 0;
    balance: Int as uint256 = 0;
    maxSupply: Int as uint256;
    id: Int as uint8;
    v: Int as uint256;
    queryId: Int as uint256;
    // Bonding curve parameters
    basePrice: Int as uint256; // Base price 'b' in the formula
    priceIncrement: Int as uint256; // Price increment 'i' in the formula

    dev: Address;
    jettonSupply: Int as uint256 = 0;
    init(_id: Int, _owner: Address, _dev: Address, _jettonAddress: Address, _ticker: String,v:Int){
        self.id = _id;
        self.owner = _owner;
        self.dev = _dev;
        self.tonkPumpJettonAddress = _jettonAddress;
        self.jettonSupply = 0; // 2,000,000 tokens with 9 decimal places
        self.maxSupply = 100000000 * pow(10, 9); // 100,000,000 tokens with 9 decimal places
        self.ticker = _ticker;
        self.queryId = 0;
        self.basePrice = 24; // 0.0000000278 * 10^18
        self.priceIncrement = 1 * pow(10, 9);
        self.isDevMint = false;
        self.v=v;
    }


    /**
    * The curve described by the formula p(s) = b + (s * i) / 10^9
    * Linear Proportional Bonding Curve
    * 1.Linear: The relationship between price and supply is linear.
    * As supply increases, the price increases at a constant rate.
    * 2.Proportional: The price increase is proportional to the supply. 
    * Each additional token increases the price by a fixed fraction of the price increment.
    * 3. Arithmetic: It follows an arithmetic progression,
    * where the difference between successive prices is constant (when considering large enough supply changes).
    */
    fun calculateCurrentPrice(): Int {
        return ((self.basePrice + (self.jettonSupply * self.priceIncrement)) / pow(10, 9));
    }


    receive(msg: TokenNotification) {
        if (msg.from == self.tonkPumpJettonAddress) {
            self.on_jetton_sell( msg.forward_payload);
        } else {
            // any jetton received 
          
        }
    }

    fun on_jetton_sell( payload: Slice) {
        // // twab timestamp + twab amount + pool owner
        // let twab_timestamp: Int = payload.loadTimestamp();
        let amount: Int = payload.loadUint(128);
        let receiver: Address = payload.loadAddress();
        payload.endParse();

      self.sendTon(amount,receiver);
    }

    receive(msg: Buy){
        require(self.isDevMint, "Minting cannot start yet");
            require(self.v == msg.v, "Already minted");
        let tonAmount: Int = context().value;
        let currentPrice: Int = self.calculateCurrentPrice();
  
      let jettonsOut: Int = tonAmount * pow(10, 9) / currentPrice;
       require((self.jettonSupply + jettonsOut) <= self.maxSupply, "Exceeds max supply");
        // Transfer tokens to the buyer
        send(SendParameters{
                to: self.tonkPumpJettonAddress,
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: 500 * pow(10,9), receiver: context().sender, minter: 0}.toCell()
            }
        );
       self.jettonSupply = (self.jettonSupply + jettonsOut);
    }

    receive(msg: DevMint){
        require(context().sender == self.dev, "Only dev can mint");
       require(!(self.isDevMint), "Already minted");
        let devToken: Int = 2000000 * pow(10, 9);
        let yciycToken: Int = 100000 * pow(10, 9);
        let exchangeToken: Int = 10000000 * pow(10, 9);
        let marketMakerToken: Int = 3000000 * pow(10, 9);
        // Mint tokens for different recipients
        self.mintTokens(devToken, context().sender);
        self.mintTokens(yciycToken, msg.yciycWallet);
        self.mintTokens(exchangeToken, msg.exchangeWallet);
        self.mintTokens(marketMakerToken, msg.marketMakerWallet);
        let total: Int = (((devToken + yciycToken) + exchangeToken) + marketMakerToken);
        self.jettonSupply = (self.jettonSupply + total);
        self.isDevMint = true;

    }

    fun mintTokens(amount: Int, receiver: Address) {
        send(SendParameters{
                to: self.tonkPumpJettonAddress,
                value: ton("0.05"),
                mode: SendIgnoreErrors,
                bounce: true,
                body: Mint{amount: amount, receiver: receiver, minter: 0}.toCell()
            }
        );
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

    get fun MarketCap(): Int {
        return (self.jettonSupply * self.calculateCurrentPrice()) / pow(10, 9);
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

    get fun priceFromSupply(): Int {
        return self.priceIncrement;
    }

    fun getJettonWalletInit(address: Address): StateInit {
        return initOf TonkPumpDefaultWallet(self.tonkPumpJettonAddress, address);
    }

    fun sendTon(amount: Int,receiver: Address) {
        require(amount > 0, "Insufficient TON balance");
        send(SendParameters{to: receiver, bounce: true, value: amount, mode: (SendRemainingValue + SendIgnoreErrors)});
    }

    // Function to withdraw accumulated fees (only callable by owner)

    fun withdrawFees(amount: Int) {
        require(sender() == self.owner, "Not Owner");
        require(amount <= self.balance, "Insufficient balance");
        self.sendTon(amount,sender());
    }
}