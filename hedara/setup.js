const { PrivateKey, Client, AccountCreateTransaction, TransferTransaction, Hbar } = require("@hashgraph/sdk");

const treasuryAccount = PrivateKey.fromString("302e020100300506032b657004220420d6cc5faa05f6d8e5e82b9e0b2f3b7e2f7ba53a55e048aaf3cfd313d9d274d444");
const treasuryId = "0.0.4567439"

const treasuryClient = Client.forTestnet();
treasuryClient.setOperator(treasuryId, treasuryAccount).setDefaultMaxTransactionFee(new Hbar(10));

async function createAccount(n) {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
        .setKey(newAccountPrivateKey)
        .execute(treasuryClient);

    const accountId = (await tx.getReceipt(treasuryClient)).accountId;
    console.log(`- Acount ${n}`);
    console.log(`Private key: ${newAccountPrivateKey}`);
    console.log(`Account ID: ${accountId}\n`);
    return accountId
}

async function fundAccounts(accountIds) {
    console.log(accountIds)
    const tx = await new TransferTransaction()
        .addHbarTransfer(treasuryId, new Hbar(-4000))
        .addHbarTransfer(accountIds[0], new Hbar(800))
        .addHbarTransfer(accountIds[1], new Hbar(800))
        .addHbarTransfer(accountIds[2], new Hbar(800))
        .addHbarTransfer(accountIds[3], new Hbar(800))
        .addHbarTransfer(accountIds[4], new Hbar(800))
        .execute(treasuryClient)

    const txId = (await tx.getReceipt(treasuryClient));
    console.log(txId)

}

async function main() {
    const accounts = [];
    for (let i = 1; i <= 5; i++) {
        let id = await createAccount(i);
        accounts.push(id)
    }

    await fundAccounts(accounts)
    process.exit()
}

main();