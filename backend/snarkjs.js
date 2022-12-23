const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
    const { proof, publicSignals } = await snarkjs.plonk.fullProve({x: 3}, "../build/circuits/circuit_js/circuit.wasm", "../circuits/circuit_final.zkey");

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("../circuits/verification_key.json"));

    const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

}

run().then(() => {
    process.exit(0);
});