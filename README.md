# zkp-snarkjs-starter
a basic implementation of zero knowledge proof using snarkjs and circom

## How to run

`nodemon backend/snarkjs.js`

## General Steps

Refer https://github.com/iden3/snarkjs

In summary, zk-SNARK proofs are an specific type of zero-knowledge proofs that allow you to prove that you know a set of signals, witness, that match all the constraints of a circuit without revealing any of the signals except the public inputs and the outputs.

`npm install circom circomlib snarkjs websnark`

`mkdir contracts`

`mkdir circuits`

`mkdir -p build/circuits`

`touch circuits/circuit.circom`

1. write constraints in circom language and an input in input.json

2. `circom circuits/circuit.circom -o build/circuits --r1cs --sym --json --wasm`. This gives the contraints in r1cs format, sym format, json format and compiles the circuit to wasm and creates generate_witness.js and witness_calculator.js. The circom command takes one input (the circuit to compile, in our case circuit.circom) and three options:

    i. r1cs: generates circuit.r1cs (the r1cs constraint system of the circuit in binary format).

    ii. wasm: generates circuit.wasm (the wasm code to generate the witness – more on that later).

    iii. sym: generates circuit.sym (a symbols file required for debugging and printing the constraint system in an annotated mode).

3. View information about the circuit `snarkjs r1cs info circuit.r1cs`. Print the constraints `snarkjs r1cs print circuit.r1cs circuit.sym`

4. Create a trusted phase 2 ceremony: pot12_final.ptau file setup using random beacon. this file will be used to generate the circuit proving and verification keys. Then verify the .ptau file.

5. Generate zkey. The zkey is a zero-knowledge key that includes both the proving and verification keys as well as phase 2 contributions. Then, verify zkey `snarkjs plonk setup circuit.r1cs pot12_final.ptau circuit_final.zkey`

6. Export verification key `snarkjs zkey export verificationkey circuit_final.zkey verification_key.json`

7. Calculate the witness: First, we create a file with the inputs for our circuit. Now, we use the Javascript/WASM program created by circom in the directory circuit_js to create the witness (values of all the wires) for our inputs: `circuit_js$ node generate_witness.js circuit.wasm ../input.json ../witness.wtns`

8. Create proof. this command generates the files proof.json and public.json: proof.json contains the actual proof, whereas public.json contains the values of the public inputs and output. `snarkjs plonk prove circuit_final.zkey witness.wtns proof.json public.json`

Note that it's also possible to create the proof and calculate the witness in the same command by running: `snarkjs groth16 fullprove input.json circuit.wasm circuit_final.zkey proof.json public.json`

9. Verify proof>> `snarkjs groth16 verify verification_key.json public.json proof.json`

10. Verifier.sol >> `snarkjs zkey export solidityverifier circuit_final.zkey verifier.sol`

## Using Nodejs for verification:

1. write circuit.circom
2. generate circuit.wasm and circuit_final.zkey and verification_key
3. refer `backend/snarkjs.js` (this script takes input variables, generates proof and verifies it)





