// Message for deploying a contract

message DeployContractAndAMM {
    content: Cell;
    ticker: String;
    v: Int;
}
message Buy {
    tonInDollars: Int as uint256;
    v:Int;
}
message Sell {
    amount: Int as uint256;
    tonInDollars: Int as uint256;
}
message DevMint {
    yciycWallet: Address;
    marketMakerWallet: Address;
    exchangeWallet: Address;
}
// Notification message indicating a contract has been deployed
message ContractDeployed {
    jettonAddress: Address; // Address of the deployed contract
    AMMAddress: Address; // Address of the deployed contract
}
// Message to withdraw an amount of coins
message SafeWithdraw {
    amount: Int as coins; // Amount of coins to withdraw
}
// Message to mint tokens and send them to a specific receiver
message Mint {
    amount: Int; // Amount of tokens to mint
    receiver: Address;
    minter: Int;
}
// Message to mint tokens with public visibility
message MintPublic {
    amount: Int; // Amount of tokens to mint
}
// Message for external token transfer (external contract communication)
message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64; // Unique query ID
    amount: Int as coins; // Amount of tokens to transfer
    destination: Address; // Destination address
    response_destination: Address; // Response destination address
    custom_payload: Cell?; // Optional custom payload
    forward_ton_amount: Int as coins; // Amount of TON (Terra Operating Network) to forward
    forward_payload: Slice as remaining; // Remaining payload for forwarding
    // Comment: Text message when transferring tokens
}
// Message for internal token transfer within the same contract
message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64; // Unique query ID
    amount: Int as coins; // Amount of tokens to transfer
    from: Address; // Sender's address
    response_destination: Address; // Response destination address
    forward_ton_amount: Int as coins; // Amount of TON (Terra Operating Network) to forward
    forward_payload: Slice as remaining; // Remaining payload for forwarding
    // Comment: Text message when transferring tokens internally
}
// Notification message for token transfer events
message(0x7362d09c) TokenNotification {
    queryId: Int as uint64; // Unique query ID
    amount: Int as coins; // Amount of tokens transferred
    from: Address; // Sender's address
    forward_payload: Slice as remaining; // Remaining payload for forwarding
    // Comment: Text message when notifying token transfer
}
// Message for burning tokens
message(0x595f07bc) TokenBurn {
    queryId: Int as uint64; // Unique query ID
    amount: Int as coins; // Amount of tokens to burn
    owner: Address; // Owner's address
    response_destination: Address; // Response destination address
}
// Notification message for token burn events
message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64; // Unique query ID
    amount: Int as coins; // Amount of tokens burned
    owner: Address; // Owner's address
    response_destination: Address?; // Optional response destination address
}
// Message for querying excess tokens
message(0xd53276db) TokenExcesses {
    queryId: Int as uint64; // Unique query ID
}
// Message for updating contract content
message TokenUpdateContent {
    content: Cell; // New content to update in the contract
}
message UpdateAllocationPercentages {
    yciyAllocation: Int as uint64;
    developerAllocation: Int as uint64;
    marketMakerAllocation: Int as uint64;
    exchangeAllocation: Int as uint64;
}