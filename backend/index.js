// import "../build/circuits/circuit_js/circuit.wasm";
// import "../circuits/circuit_final.zkey";
// import "../circuits/verification_key.json";

const snarkjs = require("snarkjs");
const fs = require("fs");

const wc = require('../build/circuits/circuit_js/witness_calculator.js')
const wasm = '../build/circuits/circuit_js/circuit.wasm'
const zkey = '../build/circuits/circuit_final.zkey'
const INPUTS_FILE = '/tmp/inputs'
const WITNESS_FILE = '/tmp/witness'

const generateWitness = async (inputs) => {
    const buffer = fs.readFileSync(wasm);
    const witnessCalculator = await wc(buffer)
    const buff = await witnessCalculator.calculateWTNSBin(inputs, 0);
    fs.writeFileSync(WITNESS_FILE, buff)
  }

async function run() {
    const { proof, publicSignals } = await snarkjs.plonk.prove({a: 10}, wasm, "../circuits/circuit_final.zkey");

    // const inputSignals = { a:10 } // replace with your signals
    // await generateWitness(inputSignals)
    // const { proof, publicSignals } = await snarkjs.plonk.prove(zkey, WITNESS_FILE);

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse(fs.readFileSync("../circuits/verification_key.json"));

    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }

}

run().then(() => {
    process.exit(0);
});