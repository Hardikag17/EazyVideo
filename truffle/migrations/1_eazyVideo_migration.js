var eazyVideo = artifacts.require('eazyVideo');
var nft = artifacts.require('eazyVideoNFTContract');
var ERC4907 = artifacts.require('ERC4907');

module.exports = async (deployer) => {
  await deployer.deploy(ERC4907);
  let a = await ERC4907.deployed();
  console.log('ERC4907 address:', a.address);
  await deployer.deploy(nft);
  let b = await nft.deployed();
  console.log('nft address:', b.address);
  await deployer.deploy(eazyVideo);
  let c = await eazyVideo.deployed();
  console.log('eazyVideo address:', c.address);
};
