import { ethers } from "hardhat";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

const sampleAddress = "0xf228F1B867445c5cD36e8210aa6EA3608D3D4622";

const main = async () => {
  const ethersSigners = await ethers.getSigners();
  const signer = ethersSigners[0];
  const balance = await signer.getBalance();
  console.log(`Balance of ${signer.address} is ${balance} WEI`);

  const proposals = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((proposal: string, index: number) => {
    console.log(`Proposal Number# ${index}: ${proposal}`);
  });

  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
    PROPOSALS.map(ethers.utils.formatBytes32String)
  );
  const deployTx = await ballotContract.deployTransaction.wait();

  console.log(
    `The ballot contract was deployed at ${ballotContract.address} at block number ${deployTx.blockNumber}.`
  );

  const chairperson = await ballotContract.chairperson();
  console.log(`The chairperson for this contract is ${chairperson}`);

  const giveRightToVoteTx = await ballotContract.giveRightToVote(sampleAddress);
  const giveRightToVoteTxReceipt = giveRightToVoteTx.wait();
  console.log(
    `The transaction hash for giving the right to vote is ${
      (await giveRightToVoteTxReceipt).transactionHash
    } included at the block ${(await giveRightToVoteTxReceipt).blockNumber}`
  );
};
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
