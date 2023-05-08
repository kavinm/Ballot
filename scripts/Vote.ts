import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// run file from terminal with argument address of voter: yarn ts-node --files ./scripts/Vote.ts <vote> <address>

const CONTRACT_ADDRESS = "0x58ebbf51dc43a0398d154c36c4de7c88fe36fe28";

async function main() {
  const vote = process.argv[2];
  const voter = process.argv[3];
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

  console.log(`Casting vote of ${vote} to ballot...`);
  const castingVoteTX = await ballotContract.vote(vote);
  await castingVoteTX.wait();
  const hasVoted = (await ballotContract.voters(voter)).voted;
  hasVoted
    ? console.log("the vote has been casted")
    : console.log("vote has not been casted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
