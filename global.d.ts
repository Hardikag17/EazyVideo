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
  image: string;
  description: string;
  planDuration: number;
  price: number;
  serviceProvider: string;
}
