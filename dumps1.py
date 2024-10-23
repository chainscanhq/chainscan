import React, { useState, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

const AddProductPage = () => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [message, setMessage] = useState("");
  const programId = new PublicKey(
    "GRaTfb2uEsN6Mt588vhu8tSY3VcRNT4JZVgNHzPMjwSt"
  );

  // 1. Add a timestamp
  const addTimestamp = useCallback(async () => {
    if (!connected) {
      setMessage("Please connect your wallet first.");
      return;
    }

    try {
      // Get block time
      const slot = await connection.getSlot();
      const blockTime = await connection.getBlockTime(slot);

      if (!blockTime) {
        setMessage("Unable to fetch block time.");
        return;
      }

      // Serialize blockTime into 8 bytes (u64)
      const timestampBytes = new Uint8Array(
        new BigUint64Array([BigInt(blockTime)]).buffer
      );

      // Create transaction to add timestamp
      const transaction = new Transaction().add({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId,
        data: Buffer.concat([Buffer.from([0]), timestampBytes]), // [0] is the Add Timestamp instruction
      });

      // Using sendAndConfirmTransaction instead of sendTransaction
      // Example keypair (you'd get this from actual wallet credentials)
      const keypair = Keypair.fromSecretKey(
        Uint8Array.from([
          250, 9, 50, 218, 184, 26, 76, 248, 132, 0, 86, 223, 138, 245, 184, 58,
          247, 227, 150, 122, 135, 67, 19, 97, 97, 240, 3, 201, 116, 99, 182,
          215, 235, 91, 163, 130, 240, 152, 11, 123, 59, 250, 35, 65, 48, 126,
          7, 30, 115, 153, 247, 82, 231, 196, 92, 161, 247, 225, 168, 158, 215,
          78, 172, 122,
        ])
      );

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      // Using sendTransaction, which automatically handles signing
      // const signature = await sendTransaction(transaction, connection);

      setMessage("Timestamp added! Signature: " + signature);
    } catch (error) {
      console.error("Failed to add timestamp:", error);
      setMessage("Error adding timestamp.");
    }
  }, [connected, publicKey, connection]);

  // 2. Remove a timestamp
  const removeTimestamp = useCallback(
    async (timestampToRemove) => {
      if (!connected) {
        setMessage("Please connect your wallet first.");
        return;
      }

      try {
        // Serialize the timestamp to remove
        const timestampBytes = new Uint8Array(
          new BigUint64Array([BigInt(timestampToRemove)]).buffer
        );

        // Create transaction to remove timestamp
        const transaction = new Transaction().add({
          keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
          programId,
          data: Buffer.concat([Buffer.from([1]), timestampBytes]), // [1] is the Remove Timestamp instruction
        });

        // Send and confirm transaction
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [publicKey]
        );
        setMessage("Timestamp removed! Signature: " + signature);
      } catch (error) {
        console.error("Failed to remove timestamp:", error);
        setMessage("Error removing timestamp.");
      }
    },
    [connected, publicKey, connection]
  );

  // 3. Fetch all timestamps
  const fetchTimestamps = useCallback(async () => {
    try {
      // Instruction to fetch timestamps
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: false, isWritable: false }],
        programId,
        data: Buffer.from([2]), // Instruction 2 to fetch timestamps
      });

      // Simulate the transaction
      const transaction = new Transaction().add(instruction);
      const simulationResult = await connection.simulateTransaction(
        transaction
      );

      console.log("Fetched Timestamps:", simulationResult);
      setMessage(`Timestamps fetched: ${JSON.stringify(simulationResult)}`);
    } catch (error) {
      console.error("Failed to fetch timestamps:", error);
      setMessage("Error fetching timestamps.");
    }
  }, [connection, publicKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-blue">
      <header className="w-full p-4 border-b">
        <h1 className="text-2xl font-bold">Timestamp Manager</h1>
      </header>
      <button
        onClick={addTimestamp}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Timestamp
      </button>
      <button
        onClick={() => removeTimestamp(123456789)}
        className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Remove Timestamp
      </button>
      <button
        onClick={fetchTimestamps}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Timestamps
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default AddProductPage;
