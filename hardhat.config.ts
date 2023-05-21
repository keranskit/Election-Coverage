import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // Sepolia Testnet
    sepolia: {
      url: `https://sepolia.infura.io/v3/aa4e8063bd044a2bbfda80af0587cf38`,
      chainId: 11155111,
      accounts: [
        `0xafb63f2d9e1db8b96b60ee40855bc42dc399b35d4df5c0b6f6bf8d9e979b3633`,
      ],
    },
  },
};

export default config;
