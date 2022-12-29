#!/bin/sh

# npm install circom circomlib snarkjs websnark
# mkdir contracts
# mkdir circuits
# mkdir -p build/circuits
# touch circuits/circuit.circom
# mkdir snarkjs

circom circuits/circuit.circom -o build/circuits --r1cs --sym --json --wasm

# mkdir snarkjs
echo hi
cd snarkjs
pwd
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau contribute pot12_0001.ptau pot12_0002.ptau --name="Second contribution" -v -e="some random text"
snarkjs powersoftau verify pot12_0002.ptau
snarkjs powersoftau beacon pot12_0002.ptau pot12_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
snarkjs powersoftau prepare phase2 pot12_beacon.ptau pot12_final.ptau -v
snarkjs powersoftau verify pot12_final.ptau
cd ..

snarkjs plonk setup build/circuits/circuit.r1cs snarkjs/pot12_final.ptau circuits/circuit_final.zkey

# only with groth16:
# snarkjs zkey verify build/circuits/circuit.r1cs snarkjs/pot12_final.ptau circuits/circuit_final.zkey

snarkjs zkey export verificationkey circuits/circuit_final.zkey circuits/verification_key.json

# so you have 
# build/circuits/circuit_js/circuit.wasm
# circuits/circuit_final.zkey
# circuits/verification_key.json