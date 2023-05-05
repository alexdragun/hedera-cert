const {
    TransferTransaction,
    Client,
    ScheduleCreateTransaction,
    ScheduleDeleteTransaction,
    PrivateKey,
    Hbar, ScheduleInfoQuery
} = require("@hashgraph/sdk");


const myAccountId = "0.0.4567439";
const myPrivateKey = PrivateKey.fromString("302e020100300506032b657004220420d6cc5faa05f6d8e5e82b9e0b2f3b7e2f7ba53a55e048aaf3cfd313d9d274d444");

const otherAccountId = "0.0.4569636";
const otherAccountId2 = "0.0.4569637";

const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {

    //Create a transaction to schedule
    const transferTransaction = new TransferTransaction()
        .addHbarTransfer(otherAccountId, Hbar.fromTinybars(-101))
        .addHbarTransfer(otherAccountId2, Hbar.fromTinybars(101));

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transferTransaction)
        .setAdminKey(myPrivateKey)
        .execute(client);

    //Get the receipt of the transaction
    const scheduledTxReceipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = scheduledTxReceipt.scheduleId;
    console.log("The schedule ID is " + scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = scheduledTxReceipt.scheduledTransactionId;
    console.log("The scheduled transaction ID is " + scheduledTxId);

    //Create the transaction and sign with the admin key
    const transaction = await new ScheduleDeleteTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(client)
        .sign(myPrivateKey);

    //Sign with the operator key and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the transaction receipt
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " + transactionStatus);

    process.exit();
}

main();