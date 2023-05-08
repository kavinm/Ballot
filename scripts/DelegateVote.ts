import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// run file from terminal with argument address of voter: yarn ts-node --files ./scripts/DelegateVote.ts <address>

const CONTRACT_ADDRESS = "0x58ebbf51dc43a0398d154c36c4de7c88fe36fe28";

async function main() {
  const delegatee = process.argv[2];
  console.log("Connecting to provider...");
  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    process.env.ALCHEMY_API_KEY
  );
  const pkey = process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(`${pkey}`);
  const signer = wallet.connect(provider);
  console.log(`Connected to ${provider.network.name}`);

  const ballotFactory = new Ballot__factory(signer);
  const ballotContract = ballotFactory.attach(CONTRACT_ADDRESS);
  console.log(
    `Contract factory created, attached to ballot at address ${ballotContract.address}`
  );

  console.log(`Delegating vote to ${delegatee}`);
  const delegateVotetoTX = await ballotContract.delegate(delegatee);
  await delegateVotetoTX.wait();

  if ((await ballotContract.voters(signer.address)).delegate == delegatee) {
    console.log(`voting rights delegated to ${delegatee}`);
  } else {
    throw new Error("Voter was not delegated");
  }
  console.log(`transaction hash: ${delegateVotetoTX.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
