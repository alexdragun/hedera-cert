const { AccountCreateTransaction, Hbar, Client, PrivateKey, KeyList, TransferTransaction } = require("@hashgraph/sdk")

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b6570042204201875a4769f39c606abd8139fb39c02cf69beeac79903ec1a73666fd12c948572")
const account1Id = "0.0.4569636"

// Acount 2
const account2 = PrivateKey.fromString("302e020100300506032b65700422042019c1afdd73bce863a00ccf67e7a10bf76aebc732ce8a913c7d7c2e7eea51b06c")
const account2Id = "0.0.4569637"

// Acount 3
const account3 = PrivateKey.fromString("302e020100300506032b657004220420df408e94739f9d34095d9137de7358a68c4847865ce970e52f534788d6a575d1")
const account3Id = "0.0.4569638"

// Acount 4
const account4 = PrivateKey.fromString("302e020100300506032b657004220420bf3c44ab010c8d5383bbdccbc0c13af0673bd1b52067005b4f6d8995c57d9397")
const account4Id = "0.0.4569639"

const client = Client.forTestnet();
client.setOperator(account1Id, account1);

const publicKeys = [
    account1.publicKey,
    account2.publicKey,
    account3.publicKey
]

const newKey = new KeyList(publicKeys, 2)

async function createWallet() {
    let tx = await new AccountCreateTransaction()
        .setKey(newKey)
        .setInitialBalance(new Hbar(20))
        .execute(client);

    return (await tx.getReceipt(client)).accountId

}

async function spendFail(accId) {
    const tx = await new TransferTransaction()
        .addHbarTransfer(accId, new Hbar(-10))
        .addHbarTransfer(account4Id, new Hbar(10))
        .freezeWith(client)
        .sign(account1);

    const executed = await (await tx.execute(client)).getReceipt(client);
    return executed
}

async function spend(accId) {
    const tx = await (await new TransferTransaction()
        .addHbarTransfer(accId, new Hbar(-10))
        .addHbarTransfer(account4Id, new Hbar(10))
        .freezeWith(client)
        .sign(account1)).sign(account2);

    const executed = await (await tx.execute(client)).getReceipt(client);
    return executed
}

async function main() {
    const accountId = await createWallet();
    console.log(accountId)
    await spendFail(accountId).catch((err) => console.error(`Error: ${err}`))
    const tx = await spend(accountId);
    console.log(tx)
    process.exit()
}


main()