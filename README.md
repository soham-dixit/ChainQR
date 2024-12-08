# ChainQR

## The Problem ChainQR Solves
ChainQR bridges the gap between traditional financial systems and decentralized finance (DeFi) by enabling seamless integration of cryptocurrencies with UPI transactions. Current UPI systems lack support for Web3 and crypto-based payments, making it challenging for users to integrate these technologies. ChainQR simplifies this, making crypto transactions as effortless as traditional UPI payments.

## Use Cases and Benefits
- **Effortless Crypto Payments**: Send and receive cryptocurrencies using existing UPI QR codes, eliminating the need for complex wallet integrations.
- **Micropayments**: Supports small-scale transactions like pay-per-use services, subscriptions, and donations with minimal transaction fees.
- **DeFi Accessibility**: Brings DeFi benefits to everyday users through familiar UPI infrastructure, reducing the learning curve.
- **Multi-Network Support**: Operates on reliable networks like Base, Supra, and Polygon for fast, secure, and scalable transactions.
- **Increased Safety**: Utilizes blockchain for transparency, security, and fraud prevention.
- **Enhanced Interoperability**: Bridges fiat and Web3 ecosystems, enabling participation in decentralized economies without technical barriers.

## Challenges We Ran Into
- **Authentication Flow Complexity**: Okto’s SDK lacked direct Firebase support, requiring custom integration.
- **Biometric Compatibility**: Ensuring consistent fingerprint authentication across devices.
- **Account Abstraction**: Integrating social logins with decentralized platform requirements.

## How We Solved It
- Developed a custom authentication flow bridging Okto and Firebase, securely handling biometric data.
- Implemented middleware to abstract social login information while maintaining decentralization.
- Tested and optimized integration across multiple devices for reliability and security.

## Additional Features
The concept of ChainQR was ideated before the hackathon, but its implementation and development were completed during the event, focusing on the integration of Web3 with UPI transactions.

## Deployed Addresses

1. BASE NETWORK: 0x8DD1bCFfF8E3Ac2459cB9f509F7aa91132F15800
URL: https://sepolia.basescan.org/address/0x8DD1bCFfF8E3Ac2459cB9f509F7aa91132F15800

2. Polygon Network: 0xE779b05b87Bf955aA02B846938E4be1BF239441c
URL: https://amoy.polygonscan.com/address/0xe779b05b87bf955aa02b846938e4be1bf239441c
