# TACT Compilation Report
Contract: TonkPumpAMM
BOC Size: 2431 bytes

# Types
Total Types: 27

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## Deploy
TLB: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

## DeployOk
TLB: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

## FactoryDeploy
TLB: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

## ChangeOwner
TLB: `change_owner#819dbe99 queryId:uint64 newOwner:address = ChangeOwner`
Signature: `ChangeOwner{queryId:uint64,newOwner:address}`

## ChangeOwnerOk
TLB: `change_owner_ok#327b2b4a queryId:uint64 newOwner:address = ChangeOwnerOk`
Signature: `ChangeOwnerOk{queryId:uint64,newOwner:address}`

## JettonData
TLB: `_ totalSupply:int257 mintable:bool owner:address content:^cell walletCode:^cell = JettonData`
Signature: `JettonData{totalSupply:int257,mintable:bool,owner:address,content:^cell,walletCode:^cell}`

## JettonWalletData
TLB: `_ balance:int257 owner:address master:address walletCode:^cell = JettonWalletData`
Signature: `JettonWalletData{balance:int257,owner:address,master:address,walletCode:^cell}`

## DeployContractAndAMM
TLB: `deploy_contract_and_amm#889113cf content:^cell ticker:^string v:int257 = DeployContractAndAMM`
Signature: `DeployContractAndAMM{content:^cell,ticker:^string,v:int257}`

## Buy
TLB: `buy#6fbb7c4d tonInDollars:uint256 v:int257 = Buy`
Signature: `Buy{tonInDollars:uint256,v:int257}`

## Sell
TLB: `sell#6541d711 amount:uint256 tonInDollars:uint256 = Sell`
Signature: `Sell{amount:uint256,tonInDollars:uint256}`

## DevMint
TLB: `dev_mint#4f8106f3 yciycWallet:address marketMakerWallet:address exchangeWallet:address = DevMint`
Signature: `DevMint{yciycWallet:address,marketMakerWallet:address,exchangeWallet:address}`

## ContractDeployed
TLB: `contract_deployed#b97e3003 jettonAddress:address AMMAddress:address = ContractDeployed`
Signature: `ContractDeployed{jettonAddress:address,AMMAddress:address}`

## SafeWithdraw
TLB: `safe_withdraw#dc3a925d amount:coins = SafeWithdraw`
Signature: `SafeWithdraw{amount:coins}`

## Mint
TLB: `mint#a64398b5 amount:int257 receiver:address minter:int257 = Mint`
Signature: `Mint{amount:int257,receiver:address,minter:int257}`

## MintPublic
TLB: `mint_public#152087bf amount:int257 = MintPublic`
Signature: `MintPublic{amount:int257}`

## TokenTransfer
TLB: `token_transfer#0f8a7ea5 queryId:uint64 amount:coins destination:address response_destination:address custom_payload:Maybe ^cell forward_ton_amount:coins forward_payload:remainder<slice> = TokenTransfer`
Signature: `TokenTransfer{queryId:uint64,amount:coins,destination:address,response_destination:address,custom_payload:Maybe ^cell,forward_ton_amount:coins,forward_payload:remainder<slice>}`

## TokenTransferInternal
TLB: `token_transfer_internal#178d4519 queryId:uint64 amount:coins from:address response_destination:address forward_ton_amount:coins forward_payload:remainder<slice> = TokenTransferInternal`
Signature: `TokenTransferInternal{queryId:uint64,amount:coins,from:address,response_destination:address,forward_ton_amount:coins,forward_payload:remainder<slice>}`

## TokenNotification
TLB: `token_notification#7362d09c queryId:uint64 amount:coins from:address forward_payload:remainder<slice> = TokenNotification`
Signature: `TokenNotification{queryId:uint64,amount:coins,from:address,forward_payload:remainder<slice>}`

## TokenBurn
TLB: `token_burn#595f07bc queryId:uint64 amount:coins owner:address response_destination:address = TokenBurn`
Signature: `TokenBurn{queryId:uint64,amount:coins,owner:address,response_destination:address}`

## TokenBurnNotification
TLB: `token_burn_notification#7bdd97de queryId:uint64 amount:coins owner:address response_destination:Maybe address = TokenBurnNotification`
Signature: `TokenBurnNotification{queryId:uint64,amount:coins,owner:address,response_destination:Maybe address}`

## TokenExcesses
TLB: `token_excesses#d53276db queryId:uint64 = TokenExcesses`
Signature: `TokenExcesses{queryId:uint64}`

## TokenUpdateContent
TLB: `token_update_content#af1ca26a content:^cell = TokenUpdateContent`
Signature: `TokenUpdateContent{content:^cell}`

## UpdateAllocationPercentages
TLB: `update_allocation_percentages#807d395d yciyAllocation:uint64 developerAllocation:uint64 marketMakerAllocation:uint64 exchangeAllocation:uint64 = UpdateAllocationPercentages`
Signature: `UpdateAllocationPercentages{yciyAllocation:uint64,developerAllocation:uint64,marketMakerAllocation:uint64,exchangeAllocation:uint64}`

## DeployedPair
TLB: `_ jettonAddress:address ammAddress:address = DeployedPair`
Signature: `DeployedPair{jettonAddress:address,ammAddress:address}`

# Get Methods
Total Get Methods: 10

## ticker

## ammAddress

## jettonAddress

## jettonMaxSupply

## MarketCap

## jettonTotalSupply

## id

## tonBalance

## ammJettonWalletAddress

## priceFromSupply

# Error Codes
2: Stack underflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
3734: Not Owner
4159: Invalid value!!
4429: Invalid sender
6898: The total supply will be overlapping.
14796: Exceeds max supply
18336: Insufficient funds for deployment
18668: Can't Mint Anymore
18720: Only dev can mint
26785: Jetton deployment failed
34030: Insufficient TON balance
38006: Invalid deployment fee
40368: Contract stopped
42708: Invalid sender!
42834: Insufficient balance for both Jetton and AMM deployment
43103: Invalid withdrawal amount
43422: Invalid value - Burn
48516: Minting cannot start yet
48673: Insufficient balance for withdrawal
51687: Already minted
53296: Contract not stopped
54615: Insufficient balance
54687: AMM deployment failed
62972: Invalid balance