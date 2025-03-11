"use client";

import { useEffect } from "react";
import { ethers } from "ethers";
import { useState } from "react";
import dotenv from "dotenv";
dotenv.config();

const provider =  new  ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY!);
const wsProvider = new ethers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET_URL!);

wsProvider.on("block", (blockNumber) => {
  console.log("Новый блок:", blockNumber);
});

wsProvider.on("pending", async (txHash) => {
  const tx = await wsProvider.getTransaction(txHash);
  if (tx?.to === process.env.PUBLIC_ADDRESS) {
    console.log("Тебе отправляют ETH! 🎉", tx);
  }
});

const contractAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

export default function Home() {

  const [blockNumber, setBlockNumber] = useState<number>(0);
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  async function sendEth(to: string, amount: string) {
    if (!wallet) {
      console.log("Wallet not found");
      return;
    }
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    })

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
  }

  async function getBlockNumber() {
    const blockNumber = await provider.getBlockNumber();
    setBlockNumber(blockNumber);
  }

  async function getTokenBalance() {
    if (!contract) {
      console.log("Contract not found");
      return;
    }
    console.log("contract", contract);
    const balance = await contract.balanceOf(contract.target);
    console.log("balance", balance);
    setTokenBalance(balance);
  }

  useEffect(() => {
    if (process.env.PRIVATE_KEY) {
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      setWallet(wallet);
    }
  }, []);

  useEffect(() => {
    if (process.env.CONTRACT_ADDRESS) {
      const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractAbi, provider);
      setContract(contract);
    }
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-5 m-5 border-2 border-gray-300 rounded-md">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Block Number: {blockNumber}</p>
        <p className="text-lg font-bold">Wallet: {wallet?.address}</p>
        <p className="text-lg font-bold">Token Balance: {tokenBalance}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={getBlockNumber} className="bg-blue-500 text-white p-2 rounded-md">Get Block Number</button>
        <button onClick={() => sendEth("0xReceiverAddress", "0")} className="bg-blue-500 text-white p-2 rounded-md">Send ETH</button>
        <button onClick={() => getTokenBalance()} className="bg-blue-500 text-white p-2 rounded-md">Get Token Balance</button>
      </div>
    </div>
  );
}
