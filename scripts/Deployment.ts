import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

const ADDRESS = "0x58ebbf51dc43a0398d154c36c4de7c88fe36fe28";
async function main() {
  const args = process.argv;
  const proposals = args.slice(2);
  if (proposals.length < 1) throw new Error("Missing parameters: proposals");

  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );
  // const provider = ethers.getDefaultProvider("goerli");
  const pkey = process.env.PRIVATE_KEY;
  if (!pkey || pkey.length <= 0) throw new Error("Missing privte key");
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotFactory = new Ballot__factory(signer);
  console.log("Deploying contract ...");
  const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  const deployTx = await ballotContract.deployTransaction.wait();
  console.log(`The contract was deployed on the Goerli testnet at address: ${ballotContract.address} 
    at block ${deployTx.blockNumber}`);
  console.log(`Transaction hash: ${deployTx.transactionHash}`);
  const chairperson = await ballotContract.chairperson();
  console.log(`The chairperson is ${chairperson}`);

  console.log(`The voter address is ${ADDRESS}`);
  const giveRightToVoteTx = await ballotContract.giveRightToVote(ADDRESS);
  await giveRightToVoteTx.wait();
  console.log(`the transaction hash is ${giveRightToVoteTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
