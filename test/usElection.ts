import { USElection } from "./../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("USElection", function () {
  let usElectionFactory;
  let usElection: USElection;

  before(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");

    usElection = await usElectionFactory.deploy();

    await usElection.deployed();
  });

  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it('Should not allow empty seats and equal votes', async function() {
    const stateResultOne = ["Texas", 200, 100, 0];
    const stateResultTwo = ["Texas", 100, 100, 10];

    await expect(usElection.submitStateResult(stateResultOne)).to.be.revertedWith(
        "States must have at least 1 seat"
    );
    await expect(usElection.submitStateResult(stateResultTwo)).to.be.revertedWith(
        "There cannot be a tie"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["California", 1000, 900, 32];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults = ["California", 1000, 900, 32];

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["Ohaio", 800, 1200, 33];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  it("Should throw on trying to submit results with not the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const stateResults = ["Florida", 800, 1200, 33];

    await expect(usElection.connect(addr1).submitStateResult(stateResults)).to.be.revertedWith(
        "Not invoked by the owner"
    );
  });

  it("Should throw on trying to end election with not the owner", async function () {
    const [owner, addr1] = await ethers.getSigners();

    await expect(usElection.connect(addr1).endElection()).to.be.revertedWith('Not invoked by the owner');
  });

  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();

    await endElectionTx.wait();

    // const stateResults = ["Florida", 800, 1200, 33];
    const stateResults = {
      name: "Florida",
      votesBiden: 800,
      votesTrump: 1200,
      stateSeats: 33
    }; //todo ask for this

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP

    expect(await usElection.electionEnded()).to.equal(true); // Ended

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
        "The election has ended already"
    );
    await expect(usElection.endElection()).to.be.revertedWith(
        "The election has ended already"
    );
  });

  //TODO: ADD YOUR TESTS
});
