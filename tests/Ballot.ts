import { expect } from "chai";
import { ethers } from "hardhat";

import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

describe("Ballot", () => {
  let ballotContract: Ballot;
  const converted1 = ethers.utils.formatBytes32String(PROPOSALS[0]);
  const converted2 = ethers.utils.formatBytes32String(PROPOSALS[1]);
  const converted3 = ethers.utils.formatBytes32String(PROPOSALS[2]);
  beforeEach(async () => {
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const bytes32prop = PROPOSALS.map((proposal) => {
      ethers.utils.formatBytes32String(proposal);
    });

    ballotContract = (await ballotContractFactory.deploy([
      converted1,
      converted2,
      converted3,
    ])) as Ballot;
    await ballotContract.deployed();
  });

  describe("when the conract is deployed", () => {
    it("has the provided proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it("sets the deployer address as chairpreson", async () => {
      const chairperson = await ballotContract.chairperson();
      const accounts = await ethers.getSigners();
      expect(chairperson).to.eq(accounts[0].address);
    });

    it("sets the voting weight for the chairperson as 1", async () => {
      const accounts = await ethers.getSigners();
      const voter = await ballotContract.voters(accounts[0].address);
      expect(voter.weight).to.eq(1);
    });
  });
});
