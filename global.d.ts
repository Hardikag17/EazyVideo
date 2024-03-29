interface Window {
  ethereum: any;
}

interface IMetadata {
  name: string;
  description: string;
  attributes: IAttribute[];
  image: string;
}

interface EazyVideoContextInterface {
  account: string;
  walletConnected: boolean;
  web3: string;
  SubsNFTContract: Contract;
  accountType: number;
}

interface ServiceMetadata {
  name: string;
  ImageUri: string;
  description: string;
  planDuration: number;
  price: number;
  serviceProvider: string;
  serviceid: number;
}

interface IPFSMetadata {
  name: string;
  description: string;
  perDayPrice: string;
  duration: string;
  image: string;
}

interface NFTMetadata {
  serviceid: number;
  serviceName: string;
  ImageUri: string;
  description: string;
  duration: number;
  endTime: string;
  price: number;
  owner: string;
  serviceProvider: string;
}

interface LendMetadata {
  tokenId: number;
  price: number;
  duration: number;
  renter: string;
  NFT: NFTMetadata;
}

//IPFSMetadata
//{"name":"net","description":"sdfg","perDayPrice":"1","duration":"90","image":"https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7"}
