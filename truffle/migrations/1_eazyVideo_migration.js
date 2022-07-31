var eazyVideoNFTContract = artifacts.require('eazyVideoNFTContract');
var ERC4907 = artifacts.require('ERC4907');

module.exports = async (deployer) => {
  await deployer.deploy(ERC4907);
  let a = await ERC4907.deployed();
  console.log('ERC4907 address:', a.address);
  await deployer.deploy(eazyVideoNFTContract);
  let b = await eazyVideoNFTContract.deployed();
  console.log('nft address:', b.address);
};
