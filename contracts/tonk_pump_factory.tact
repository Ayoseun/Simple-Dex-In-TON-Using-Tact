// import "@stdlib/deploy";
// import "@stdlib/ownable";
// import "@stdlib/stoppable";
// import "./tonk_pump";
// import "./tonk_pump_amm";
// import "./message";

// contract TonkPumpFactory with Deployable, Ownable, Stoppable, Resumable {
//     const MinTonForStorage: Int = ton("0.1");
//     const DeploymentGas: Int = ton("0.05");
//     stopped: Bool; // Flag indicating if contract is stopped
//     id: Int;
//     owner: Address;
//     contractsCounter: Int as int256;
//     deployedContracts: map<Int, Address>;
//     deployedAMMContracts: map<Address, Address>;
//     DEPLOY_FEE: Int as coins;
//     init(id: Int){
//         self.id = id;
//         self.stopped = false;
//         self.owner = sender();
//         self.contractsCounter = -(1);
//         self.deployedContracts = emptyMap();
//         self.deployedAMMContracts = emptyMap();
//         self.DEPLOY_FEE = ton("0.5");
//     }

//     get fun jettonAddress(tokenId: Int): Address? {
//         return self.deployedContracts.get(tokenId);
//     }

//     get fun ammContractAddress(jettonAddress: Address): Address? {
//         return self.deployedAMMContracts.get(jettonAddress);
//     }

//     get fun allContracts(): Int {
//         return (self.contractsCounter + 1);
//     }

//     get fun deployFee(): Int {
//         return self.DEPLOY_FEE;
//     }

//     get fun myAddress(): Address {
//         return myAddress();
//     }

//     get fun id(): Int {
//         return self.id;
//     }

//     get fun balance(): Int {
//         return myBalance();
//     }

//     receive(){
//         // Accept incoming TON to maintain balance
//     }

//     receive(msg: DeployContractAndAMM){
//         self.requireNotStopped();
//         require(context().value > self.DEPLOY_FEE, "Insufficient funds for deployment");
//         // Calculate available balance for deployment
//         let availableBalance: Int = (myBalance() - self.MinTonForStorage);
//         require(availableBalance >= 2 * self.DeploymentGas, "Insufficient balance for deployment");
//         self.contractsCounter += 1;
//         // Deploy Jetton Contract
//         let jettonInit: StateInit = initOf TonkPumpJetton(self.owner, context().sender, msg.content, msg.minter);
//         let jettonAddress: Address = contractAddress(jettonInit);
//         send(SendParameters{
//                 to: jettonAddress,
//                 value: self.DeploymentGas,
//                 mode: SendIgnoreErrors | SendPayGasSeparately,
//                 code: jettonInit.code,
//                 data: jettonInit.data
//             }
//         );
//         // Deploy AMM Contract
//         let ammInit: StateInit = initOf TonkPumpAMM(self.contractsCounter,
//             self.owner,
//             context().sender,
//             jettonAddress,
//             msg.ticker
//         );
//         let ammAddress: Address = contractAddress(ammInit);
//         send(SendParameters{
//                 to: ammAddress,
//                 value: self.DeploymentGas,
//                 mode: SendIgnoreErrors | SendPayGasSeparately,
//                 code: ammInit.code,
//                 data: ammInit.data
//             }
//         );
//         // Return excess funds to sender
//         let excess: Int = ((context().value - 2 * self.DeploymentGas) - self.DEPLOY_FEE);
//         if (excess > 0) {
//             send(SendParameters{to: sender(), value: excess, mode: SendIgnoreErrors});
//         }
//         self.deployedContracts.set(self.contractsCounter, jettonAddress);
//         self.deployedAMMContracts.set(jettonAddress, ammAddress);
//         emit(ContractDeployed{jettonAddress: jettonAddress, AMMAddress: ammAddress}.toCell());
//     }

//     receive("ChangeDeploymentFee"){
//         self.requireNotStopped();
//         self.requireOwner();
//         require(context().value > 0, "Invalid deployment fee");
//         self.DEPLOY_FEE = context().value;
//     }

//     receive(msg: ChangeOwner){
//         self.requireNotStopped();
//         self.requireOwner();
//         self.owner = msg.newOwner;
//         self.reply(ChangeOwnerOk{queryId: msg.queryId, newOwner: msg.newOwner}.toCell());
//     }

//     receive("Withdraw"){
//         self.requireNotStopped();
//         self.requireOwner();
//         let withdrawAmount: Int = (myBalance() - self.MinTonForStorage);
//         require(withdrawAmount > 0, "Insufficient balance for withdrawal");
//         send(SendParameters{to: sender(), value: withdrawAmount, mode: SendIgnoreErrors});
//     }

//     receive(msg: SafeWithdraw){
//         self.requireNotStopped();
//         self.requireOwner();
//         let maxWithdraw: Int = (myBalance() - self.MinTonForStorage);
//         require(msg.amount > 0 && msg.amount <= maxWithdraw, "Invalid withdrawal amount");
//         send(SendParameters{to: sender(), value: msg.amount, mode: SendIgnoreErrors});
//     }

//     get fun get_contract_storage_fee(): Int {
//         return self.MinTonForStorage;
//     }
// }

import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
import "./tonk_pump";
import "./tonk_pump_amm";
import "./message";

// New struct for efficient storage
struct DeployedPair {
    jettonAddress: Address;
    ammAddress: Address;
}

contract TonkPumpFactory with Deployable, Ownable, Stoppable, Resumable {
    const MinTonForStorage: Int = ton("0.1");
    const DeploymentGas: Int = ton("0.05");
    stopped: Bool;
    id: Int;
    owner: Address;
    contractsCounter: Int as int256;
    DEPLOY_FEE: Int as coins;

    // Single mapping for both Jetton and AMM contracts
    deployedPairs: map<Int, DeployedPair>;
    init(id: Int){
        self.id = id;
        self.stopped = false;
        self.owner = sender();
        self.contractsCounter = -1;
        self.DEPLOY_FEE = ton("0.02");
        // Lazy initialization of deployedPairs
    }

get fun jettonAddress(tokenId: Int): Address? {
    let pair: DeployedPair? = self.deployedPairs.get(tokenId);
    if (pair != null) {
        return pair!!.jettonAddress;
    }
    return null;
}

get fun ammContractAddress(tokenId: Int): Address? {
    let pair: DeployedPair? = self.deployedPairs.get(tokenId);
    if (pair != null) {
        return pair!!.ammAddress;
    }
    return null;
}

    get fun allContracts(): Int {
        return (self.contractsCounter + 1);
    }

    get fun deployFee(): Int {
        return self.DEPLOY_FEE;
    }

    get fun myAddress(): Address {
        return myAddress();
    }

    get fun id(): Int {
        return self.id;
    }

    get fun balance(): Int {
        return myBalance();
    }

    receive(){
        // Accept incoming TON to maintain balance
    }

    receive(msg: DeployContractAndAMM){
        self.requireNotStopped();
        require(context().value > self.DEPLOY_FEE, "Insufficient funds for deployment");
        // Calculate available balance for deployment
        let availableBalance: Int = (myBalance() - self.MinTonForStorage);
        require(availableBalance >= 2 * self.DeploymentGas, "Insufficient balance for both Jetton and AMM deployment");
        self.contractsCounter += 1;
        // Combined deployment of Jetton and AMM contracts
        self.deployJettonAndAMM(msg);

        // Return excess funds to sender
        let excess: Int = ((context().value - 2 * self.DeploymentGas) - self.DEPLOY_FEE);
        if (excess > 0) {
            send(SendParameters{to: sender(), value: excess, mode: SendIgnoreErrors});
        }
      //  emit(ContractDeployed{jettonAddress: jettonAddress, AMMAddress: ammAddress}.toCell());
    }

    fun deployJettonAndAMM(msg: DeployContractAndAMM) {
        // Deploy Jetton Contract
        let jettonInit: StateInit = initOf TonkPumpJetton(self.owner, context().sender, msg.content, msg.v);
        let jettonAddress: Address = contractAddress(jettonInit);
        send(SendParameters{
                to: jettonAddress,
                value: self.DeploymentGas,
                mode: SendIgnoreErrors | SendPayGasSeparately,
                code: jettonInit.code,
                data: jettonInit.data
            }
        );
        require(jettonAddress != null, "Jetton deployment failed");
        // Deploy AMM Contract
        let ammInit: StateInit = initOf TonkPumpAMM(self.contractsCounter,
            self.owner,
            context().sender,
            jettonAddress,
            msg.ticker,
            msg.v
        );
        let ammAddress: Address = contractAddress(ammInit);
        send(SendParameters{
                to: ammAddress,
                value: self.DeploymentGas,
                mode: SendIgnoreErrors | SendPayGasSeparately,
                code: ammInit.code,
                data: ammInit.data
            }
        );
        require(ammAddress != null, "AMM deployment failed");
        // Store deployed pair
        self.deployedPairs.set(self.contractsCounter,
            DeployedPair{jettonAddress: jettonAddress, ammAddress: ammAddress}
        );
    }

    receive("ChangeDeploymentFee"){
        self.requireNotStopped();
        self.requireOwner();
        require(context().value > 0, "Invalid deployment fee");
        self.DEPLOY_FEE = context().value;
    }

    receive(msg: ChangeOwner){
        self.requireNotStopped();
        self.requireOwner();
        self.owner = msg.newOwner;
        self.reply(ChangeOwnerOk{queryId: msg.queryId, newOwner: msg.newOwner}.toCell());
    }

    receive("Withdraw"){
        self.requireNotStopped();
        self.requireOwner();
        let withdrawAmount: Int = (myBalance() - self.MinTonForStorage);
        require(withdrawAmount > 0, "Insufficient balance for withdrawal");
        send(SendParameters{to: sender(), value: withdrawAmount, mode: SendIgnoreErrors});
    }

    receive(msg: SafeWithdraw){
        self.requireNotStopped();
        self.requireOwner();
        let maxWithdraw: Int = (myBalance() - self.MinTonForStorage);
        require(msg.amount > 0 && msg.amount <= maxWithdraw, "Invalid withdrawal amount");
        send(SendParameters{to: sender(), value: msg.amount, mode: SendIgnoreErrors});
    }

    get fun get_contract_storage_fee(): Int {
        return self.MinTonForStorage;
    }
}