import {
  IContractAddresses,
  INetworkSpecificAddresses,
  NetworkId,
} from 'src/shared/types/config'

const commonAddresses = {
  vouchersCustodyWalletAddress: '0x6e68ae2304e7d5eebb4b65a4b18f7d1839ad60c7',
  multicallAddress: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
}

export const networkAddressesMap: Record<
  NetworkId,
  INetworkSpecificAddresses
> = {
  1: {
    bPoolAddress: '0xF5FaDa32917350b91fbD9BbdE62e69bF483A960A',
    bPoolProxyAddress: '0x5321647F3c3769bc7bb9e10aB10d7F5C2E402c56',
    smtDistributorAddress: '0x6b0f858Ac88f13BB26081a8E86D3DD723c8031AC',
    vSmtAddress: '0x0C033bb39e67eB598D399C06A8A519498dA1Cec9',
    extraRewardAddress: '0x8ce7f3c64a7286379c74ed1a18a2afc021f96ce0',
    actionManagerAddress: '0x53FbFE5b1dFeA7923F4691f819cA6e278dE4E337',
  },
  4: {
    bPoolAddress: '0x3dA219C0CDF12F38Ca2993f4Db6d8BC62F6345EA',
    bPoolProxyAddress: '0x70575B99bAa084d279221249f5376Ea0556Aa8f2',
    smtDistributorAddress: '0x48092CF856246Eeb1Fe412CE9c86Ec19d172a565',
    vSmtAddress: '0x5badA3b0dF8c849b00CDE7790326Ddf8BB622ceE',
    extraRewardAddress: '0xa5e95a88fda960257ac327d023b56964758b7278',
    actionManagerAddress: '0x3Ca8f46B275B6BcD925a41CcDc3284F91BD19CFA',
  },
  137: {
    bPoolAddress: '0x0000000000000000000000000000000000000000',
    bPoolProxyAddress: '0x0000000000000000000000000000000000000000',
    smtDistributorAddress: '0x664f0D579109497e2eCEd75A9ad9314893aE27d2',
    vSmtAddress: '0x0000000000000000000000000000000000000000',
    extraRewardAddress: '0x0000000000000000000000000000000000000000',
    actionManagerAddress: '0x0000000000000000000000000000000000000000',
    multicallAddress: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  },
  80001: {
    bPoolAddress: '0x0000000000000000000000000000000000000000',
    bPoolProxyAddress: '0x78539816a7615818Fbf8529e1a90bDbb511C35f5',
    smtDistributorAddress: '0x2A2df4c9943B6a24E1bA21BED7ab5FB8c2f58e90',
    vSmtAddress: '0x0000000000000000000000000000000000000000',
    extraRewardAddress: '0x0000000000000000000000000000000000000000',
    actionManagerAddress: '0x0000000000000000000000000000000000000000',
    multicallAddress: '0xB1fF10607cad4ad353418F33ae1a40cccA82F6fF',
  },
}

export const getContractAddressesByNetworkId = (
  networkId: NetworkId,
): IContractAddresses => ({
  ...commonAddresses,
  ...networkAddressesMap[networkId],
})
