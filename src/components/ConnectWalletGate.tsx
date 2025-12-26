import React from 'react';
import { BarChart3 } from 'lucide-react';

const ConnectWalletGate: React.FC = () => {
  // Detect whether Coinbase Wallet is injected
  function detectCoinbaseWallet(): boolean {
    const eth = (window as any).ethereum;
    if (!eth) return false;
    if (eth.isCoinbaseWallet) return true;
    if (Array.isArray(eth.providers)) {
      return eth.providers.some((p: any) => p.isCoinbaseWallet);
    }
    return false;
  }

  async function handleConnect() {
    const eth = (window as any).ethereum;

    if (detectCoinbaseWallet() && eth) {
      try {
        // Request wallet connection
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        alert(`Connected: ${accounts[0]}`);
      } catch (err: any) {
        console.error(err);
        alert('Connection rejected or failed.');
      }
    } else {
      // Open Coinbase Wallet site (may open app if installed on mobile)
      window.open('https://wallet.coinbase.com/', '_blank');
    }
  }

  return (
    <div className="bg-[#010117] text-white min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-8 text-blue-500 opacity-30">
        <BarChart3 size={150} />
      </div>

      <h1 className="text-2xl font-bold mb-3">Please connect wallet</h1>

      <p className="text-gray-400 mb-8 max-w-xs">
        This website only accepts access from decentralized wallet DApp browsers.
      </p>

      <button
        onClick={handleConnect}
        className="bg-blue-600 text-white font-semibold py-3 px-10 rounded-lg hover:bg-blue-500 transition-colors w-full max-w-xs"
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWalletGate;
