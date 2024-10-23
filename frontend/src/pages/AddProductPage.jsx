import React, { useState } from "react";
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as borsh from "borsh";

// TailwindCSS styles
const containerStyles =
  "flex flex-col items-center justify-center h-screen bg-black text-white";
const inputStyles = "mb-4 p-2 border border-white bg-black text-white";
const buttonStyles = "bg-white text-black p-2 hover:bg-gray-300";
const listStyles = "mt-4";

const SOLANA_DEVNET = "https://api.devnet.solana.com";

// Define the data structure of the account (as per the Rust contract)
class NumberAccount {
  constructor(fields = { numbers: [] }) {
    this.numbers = fields.numbers;
  }
}

// Borsh schema for serialization/deserialization
const NumberAccountSchema = new Map([
  [NumberAccount, { kind: "struct", fields: [["numbers", ["u64"]]] }],
]);

const PROGRAM_ID = new PublicKey(
  "GRaTfb2uEsN6Mt588vhu8tSY3VcRNT4JZVgNHzPMjwSt"
); // Replace with actual program ID
const ACCOUNT_PUBLIC_KEY = new PublicKey(
  "GqjraH352MTcfxRm4MVwmRfbp2xX9h8hkgE6M1hiTz97"
); // Replace with actual account public key RwhLHqy9rujSLheH4kh8jLafqt4V6166aEjVhz3b3wPeCfxmd9vK2ddJgNY1Pp8xz67HdFVv4KdQ4vjxnCN8Ku6

const App = () => {
  const [number, setNumber] = useState("");
  const [storedNumbers, setStoredNumbers] = useState([]);
  const [privateKey, setPrivateKey] = useState("");

  // Connect to Solana Devnet
  const connection = new Connection(SOLANA_DEVNET);

  // Handle submitting a new number to the contract
  const handleSubmit = async () => {
    try {
      const keypair = Keypair.fromSecretKey(
        Uint8Array.from([
          250, 9, 50, 218, 184, 26, 76, 248, 132, 0, 86, 223, 138, 245, 184, 58,
          247, 227, 150, 122, 135, 67, 19, 97, 97, 240, 3, 201, 116, 99, 182,
          215, 235, 91, 163, 130, 240, 152, 11, 123, 59, 250, 35, 65, 48, 126,
          7, 30, 115, 153, 247, 82, 231, 196, 92, 161, 247, 225, 168, 158, 215,
          78, 172, 122,
        ])
      );

      const SIZE_OF_U64 = 8; // Size of u64 in bytes
      const INITIAL_CAPACITY = 10; // Initial capacity for the vector (or however many you expect to store)
      const ACCOUNT_SIZE = 4 + INITIAL_CAPACITY * SIZE_OF_U64; // 4 bytes for the length + size for initial capacity

      const accountInfo = await connection.getAccountInfo(keypair.publicKey);

      // const createAccountTransaction = new Transaction().add(
      //   SystemProgram.createAccount({
      //     fromPubkey: keypair.publicKey,
      //     newAccountPubkey: ACCOUNT_PUBLIC_KEY,
      //     lamports: await connection.getMinimumBalanceForRentExemption(
      //       ACCOUNT_SIZE
      //     ),
      //     space: ACCOUNT_SIZE,
      //     programId: PROGRAM_ID,
      //   })
      // );

      // const createSig = await sendAndConfirmTransaction(
      //   connection,
      //   createAccountTransaction,
      //   [keypair]
      // );

      // const ass = new Transaction().add(
      //   SystemProgram.assign({
      //     accountPubkey: ACCOUNT_PUBLIC_KEY, // The existing account public key
      //     programId: PROGRAM_ID, // The program to which you're assigning ownership
      //   })
      // );

      // // Send the transaction
      // const createSig = await sendAndConfirmTransaction(connection, ass, [
      //   keypair,
      // ]);
      // console.log("Created Account!:" + createSig);

      const instructionData = new Uint8Array(
        new BigUint64Array([BigInt(number)]).buffer
      );

      const transaction = new Transaction().add({
        keys: [
          { pubkey: keypair.publicKey, isSigner: false, isWritable: true },
        ],
        programId: PROGRAM_ID,
        data: instructionData, // Sending number as instruction data
      });

      // Specify the fee payer for the transaction
      transaction.feePayer = keypair.publicKey;

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair],
        { commitment: "finalized" }
      );
      // const signature = await connection.sendTransaction(transaction, [
      //   keypair,
      // ]);
      // await connection.confirmTransaction(signature);
      console.log("Number submitted successfully!" + signature);
      setNumber(""); // Clear input after submission
    } catch (error) {
      console.error("Error submitting number:", error);
    }
  };

  // Fetch stored numbers from the smart contract
  const fetchNumbers = async () => {
    try {
      const accountInfo = await connection.getAccountInfo(ACCOUNT_PUBLIC_KEY);
      if (accountInfo) {
        const numberAccount = borsh.deserialize(
          NumberAccountSchema,
          NumberAccount,
          accountInfo.data
        );
        setStoredNumbers(numberAccount.numbers);
      }
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };

  return (
    <div className={containerStyles}>
      <h1 className="text-3xl mb-4">Solana Number Storage</h1>

      {/* Input for number */}
      <input
        type="number"
        placeholder="Enter a number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className={inputStyles}
      />

      {/* Input for private key */}
      <input
        type="text"
        placeholder="Enter private key (comma separated)"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        className={inputStyles}
      />

      {/* Submit button */}
      <button onClick={handleSubmit} className={buttonStyles}>
        Submit Number
      </button>

      {/* Fetch numbers button */}
      <button onClick={fetchNumbers} className={`${buttonStyles} mt-2`}>
        Fetch Stored Numbers
      </button>

      {/* Display stored numbers */}
      {storedNumbers.length > 0 && (
        <ul className={listStyles}>
          {storedNumbers.map((num, index) => (
            <li key={index}>Stored Number: {num.toString()}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
