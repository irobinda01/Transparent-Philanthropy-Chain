/// <reference types="vitest" />
/* global simnet, Tx */
import { describe, it } from "vitest";

// Clarinet globals provided by the test environment
declare const simnet: any;
declare const Tx: any;

// Tests expect the clarinet environment (vitest-environment-clarinet) which
// provides globals like `simnet` and `Tx` similar to Clarinet's test harness.
const CONTRACT = "tpc";

describe("tpc contract flow", () => {
  it("Register charity, create campaign, donate, submit proof, release funds", () => {
    const accounts = simnet.getAccounts();
    const charity = accounts.get("wallet_1")!;
    const donor = accounts.get("wallet_2")!;
    const verifier = accounts.get("wallet_3")!;

    // register as charity
    let block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "register-charity", ['"Charity One"', '"QmIPFScharityMeta"'], charity.address),
    ]);
    block.receipts[0].result.expectOk();

    // create campaign
    const future = simnet.blockHeight + 50;
    block = simnet.mineBlock([
      Tx.contractCall(
        CONTRACT,
        "create-campaign",
        ["u1000000", `u${future}`, '"Clean water for village"', verifier.address],
        charity.address,
      ),
    ]);
    const id = Number(block.receipts[0].result.expectOk().toString().replace("u", ""));

    // donate 0.6 STX: contract now expects amt param AND an STX transfer; pass amount arg and transfer value
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "donate", [`u${id}`, `u600000`], donor.address, "600000"),
    ]);
    block.receipts[0].result.expectOk();

    // submit proof
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "submit-proof", [`u${id}`, '"QmIPFSevidenceHash"'], charity.address),
    ]);
    block.receipts[0].result.expectOk();

    // release (should transfer raised to charity)
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "verify-and-release", [`u${id}`], verifier.address),
    ]);
    block.receipts[0].result.expectOk();

    // refund should now fail (already released)
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "refund", [`u${id}`], donor.address),
    ]);
    block.receipts[0].result.expectErr();
  });

  it("Refund path when deadline passes and not released", () => {
    const accounts = simnet.getAccounts();
    const deployer = accounts.get("deployer")!;
    const charity = accounts.get("wallet_4")!;
    const donor = accounts.get("wallet_5")!;

    // register charity and create short campaign
    let block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "register-charity", ['"C2"', '"QmMeta"'], charity.address),
    ]);
    block.receipts[0].result.expectOk();

    const deadline = simnet.blockHeight + 2;
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "create-campaign", ["u500000", `u${deadline}`, '"Small goal"', deployer.address], charity.address),
    ]);
    const id = Number(block.receipts[0].result.expectOk().toString().replace("u", ""));

    // donate 0.1 STX
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "donate", [`u${id}`, `u100000`], donor.address, "100000"),
    ]);
    block.receipts[0].result.expectOk();

    // advance blocks to pass deadline
    simnet.mineEmptyBlockUntil(deadline + 1);

    // donor can refund
    block = simnet.mineBlock([
      Tx.contractCall(CONTRACT, "refund", [`u${id}`], donor.address),
    ]);
    block.receipts[0].result.expectOk();
  });
});
