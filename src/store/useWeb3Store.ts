import { create } from 'zustand';
import { ethers } from 'ethers';
// BSC/FlexSmart Testnet constants
const BOOK_TOKEN_ADDRESS = "0x849868846635300B4413e85adcFD0a057c675B8e";
const REDEEM_VAULT = "0x1234567890123456789012345678901234567890"; // Target address for 1 BOOK
const TARGET_CHAIN_ID = "0x61"; // BSC Testnet (97)
// Minimal ERC20 ABI for balance and transfer
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function decimals() view returns (uint8)"
];
interface Web3State {
  isConnected: boolean;
  address: string | null;
  tokenBalance: string;
  isConnecting: boolean;
  error: string | null;
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  fetchBalance: () => Promise<void>;
  transferToken: (amount: string) => Promise<string | null>;
  checkNetwork: () => Promise<boolean>;
}
export const useWeb3Store = create<Web3State>((set, get) => ({
  isConnected: false,
  address: null,
  tokenBalance: "0.00",
  isConnecting: false,
  error: null,
  connect: async () => {
    if (typeof window.ethereum === 'undefined') {
      set({ error: "MetaMask not found" });
      return;
    }
    set({ isConnecting: true, error: null });
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      set({ 
        isConnected: true, 
        address: address,
        isConnecting: false 
      });
      // After connecting, check network and fetch balance
      await get().checkNetwork();
      await get().fetchBalance();
    } catch (err: any) {
      console.error("Connection error:", err);
      set({ error: err.message, isConnecting: false });
    }
  },
  disconnect: () => {
    set({ isConnected: false, address: null, tokenBalance: "0.00" });
  },
  checkNetwork: async () => {
    if (!window.ethereum) return false;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== TARGET_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TARGET_CHAIN_ID }],
        });
        return true;
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: TARGET_CHAIN_ID,
                chainName: 'Binance Smart Chain Testnet',
                nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/']
              }],
            });
            return true;
          } catch (addError) {
            console.error("Failed to add network:", addError);
          }
        }
        return false;
      }
    }
    return true;
  },
  fetchBalance: async () => {
    const { address, isConnected } = get();
    if (!isConnected || !address || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(BOOK_TOKEN_ADDRESS, ERC20_ABI, provider);
      const decimals = await contract.decimals();
      const balance = await contract.balanceOf(address);
      set({ tokenBalance: ethers.formatUnits(balance, decimals) });
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  },
  transferToken: async (amount: string) => {
    const { isConnected, checkNetwork } = get();
    if (!isConnected || !window.ethereum) throw new Error("Wallet not connected");
    const isCorrectNetwork = await checkNetwork();
    if (!isCorrectNetwork) throw new Error("Please switch to BSC Testnet");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(BOOK_TOKEN_ADDRESS, ERC20_ABI, signer);
      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);
      const tx = await contract.transfer(REDEEM_VAULT, parsedAmount);
      const receipt = await tx.wait();
      // Update balance after success
      await get().fetchBalance();
      return receipt.hash;
    } catch (err: any) {
      console.error("Transfer error:", err);
      throw err;
    }
  }
}));