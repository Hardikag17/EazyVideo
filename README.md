# EazyVideo

> EazyVideo facilitates the user to buy or rent subscriptions of several online streaming platform (OTT’s) under one roof via NFT’s for a custom amount of time.

![image](https://user-images.githubusercontent.com/54525688/181534177-2dca1ea3-e51c-497a-be3e-75941c61f4e8.png)

<br />

## Problem statement

Usually whenever we take a subscription from any OTT platform we often use it only for 5-10% of time we subscribe for, but we end up paying for the whole lot of time. Also, often users keep sharing their subscriptions with their friends and a single screen subscription ends up running on multiple devices. It causes losses to service providers. So, a more smooth and efficient suscription system is needed and it would benefit both the parties - Customers and Service Providers.

## Our Solution

Using EazyVideo platform anyone can rent out their OTT subscriptions while they are not using it and monetize on it. User can take subscriptions for whatever time they like by making customised plans. All of this would be done by using decaying NFTs

# 🤔 Why NFTs?

✔️ NFT based subscription makes it easy for service providers to vaildate the user identity, otherwise users keep sharing their passwords with thier friends and family.

✔️ While the user is not using his/her subscription package, user can lend it to other users willing to rent/watch by sharing the time bounded decaying nft. This way user can make extensive use of the membership and also monetize on it if user is not using it personally by renting it on the platform.

## 💻 Track we have worked on

_NFT, Art & Gaming_

## 💻 Bouties we have worked on

_IPFS Filecoin Bounty:_ User's OTT services NFT is being uploaded on IPFS network

## ⬇️ Services provided by the project

**Buy:** Buy the OTT service directly from a service provider.

**Rent:** Rent the user's services for `x` amount of day by paying the `price per day` in BNB tokens

**Adding the OTT service:** To add your OTT service organization can verify few checks using their social profiles and register their service for user’s to buy.

## Snips

## Future Aspects

- Including a 5% commission to service providers and 2% commission to platform developers whenever users rent their subscription NFT’s between each others for the business aspect of the platform.
- Currently there is some work left with the renting options, in the coming future rental feature will be fully functional
- Using pinata services for IPFS node and option for users to view their NFT’s on Opensea.
- Making platform more interactive with UI-UX and including more customizable options for users and service providers like:
  1. Service providers get feature to give users option to renew the same subscription plan from at a discounted rate of 10% before the current plan ending period. Users get notifications in their wallets 2 days before ending period.
  2. Trending services page.
  3. Feature for users to review subscriptions by giving stars and comments.
  4. Showing total active users on each service etc.

<br/>

## Technology used

- IPFS, Truffle, Binance Testnet, Web3.js, Solidity, Nextjs, Tailwind css

<br/>

## ⬇️ How to run the project

## ☑️ Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### ☑️ Prerequisites

Please make sure you've already installed NPM & Yarn packages, Truffle and enabled MetaMask extension in your browser.

If you don't have `yarn` installed, run the following command:

```
npm install -g yarn
```

If you don't have Truffle installed, run the following command:

```
npm install -g truffle
```

Please make sure that the Metamask wallet is connected to the `Binance Testnet` and has some BNB tokens.

### ☑️ Installing

A step by step guide to locally run the DApp

- Clone this repository:

```
git clone https://github.com/Hardikag17/EazyVideo
```

- Install all the required packages using the following command

```
yarn
```

- Create a `.env` file and store the following contents in it and include API keys:

```
MNEMONIC="<Enter your metamask seed phrase here>"
```

- To launch the DApp, use the following command:

```
yarn run dev
```

## Smart Contracts

- ERC4907: (0x2971d8B4d6D481da0B731f3630483A47265fE1b3)[https://testnet.bscscan.com/address/0x2971d8B4d6D481da0B731f3630483A47265fE1b3]
- SubsNFT: (0x207Cde19b7E3472113C81131B7B7F818Df5e91b5)[https://testnet.bscscan.com/address/0x207Cde19b7E3472113C81131B7B7F818Df5e91b5]

## Video Explaination

### ⬇️ Some important versions of Frameworks and Libraries used in this project are

- **Truffle version** - ^5.3.14
- **Solidity version** - ^0.8.1
- **Node JS version** - ^16
- **@truffle/hdwallet-provider** - ^2.0.11
- **web3 version** - ^1.7.4
- **ipfs-http-client** - ^57.0.3

## 🙌 Team

- **Hardik Agarwal** [(@Hardikag17)](https://github.com/Hardikag17)
- **Preeti Sharma**
- **Hrishique Munshi**

<br/>
