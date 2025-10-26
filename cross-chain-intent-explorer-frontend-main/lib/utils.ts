import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const CHAIN_NAMES: Record<string, string> = {
  "11155111": "Ethereum Sepolia",
  "421614": "Arbitrum Sepolia",
  "84532": "Base Sepolia",
  "11155420": "Optimism Sepolia",
  "80002": "Polygon Amoy"
};

const EXPLORER_URLS: Record<string, string> = {
  "11155111": "https://sepolia.etherscan.io/tx/",       // Ethereum Sepolia
  "421614":  "https://sepolia.arbiscan.io/tx/",        // Arbitrum Sepolia
  "84532":   "https://sepolia.basescan.org/tx/",       // Base Sepolia
  "11155420":"https://sepolia-optimism.etherscan.io/tx/", // Optimism Sepolia
  "80002":   "https://amoy.polygonscan.com/tx/"        // Polygon Amoy
};


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatAmount = (raw: string | number | undefined) => {
  if (!raw) return undefined
  // Assuming raw is a Base64 or number string, first convert to BigInt
  const value = BigInt(raw) // or parseInt(raw) if it's decimal
  return Number(value) / 1e18
}

export const getChainName = (chainId: string | number) => {
  const id = String(chainId)
  return CHAIN_NAMES[id] || `Chain ${id}`
}

export function getExplorerUrl(chainId: string | number, txHash: string) {
  const key = String(chainId);
  const baseUrl = EXPLORER_URLS[key];
  if (!baseUrl) {
    return null;
  }
  return `${baseUrl}${txHash}`;
}
