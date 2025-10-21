import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function ConnectWalletButton() {
  return (
    <ConnectButton
      accountStatus="address"
      showBalance={false}
      chainStatus="icon"
    />
  );
}
