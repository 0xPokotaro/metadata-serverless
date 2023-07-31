import prisma from '../../libs/prisma'
import { getNFTContractMetadata } from '../../libs/moralis/nftApi/getNFTContractMetadata'
import { EVM_CHAIN } from '../../config'

const main = async (event: any) => {
  try {
    const evmChainNftCollection = await prisma.evmChainNftCollections.findFirst(
      {
        orderBy: {
          id: 'desc',
        },
      }
    )

    let evmChainTokenId

    if (!evmChainNftCollection) {
      evmChainTokenId = EVM_CHAIN.ETHEREUM.CHAIN_ID
    } else {
      evmChainTokenId = evmChainNftCollection.evmChainTokenId + 1
    }

    const evmChainToken = await prisma.evmChainTokens.findFirst({
      where: {
        id: evmChainTokenId,
        evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
      },
    })

    if (!evmChainToken) {
      throw new Error('No evmChainToken')
    }

    const nftContractMetadata: any = await getNFTContractMetadata(
      evmChainToken.address
    )

    if (!nftContractMetadata) {
      throw new Error('No nftContractMetadata')
    }

    let syncedAt = new Date()
    if (nftContractMetadata.synced_at !== undefined) {
      syncedAt = new Date(nftContractMetadata.synced_at)
    }

    await prisma.evmChainNftCollections.create({
      data: {
        evmChainTokenId,
        name: nftContractMetadata.name,
        symbol: nftContractMetadata.symbol,
        contractType: nftContractMetadata.contract_type,
        syncedAt,
        possibleSpam: nftContractMetadata.possible_spam,
        verifiedCollection: nftContractMetadata.verified_collection,
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello from saveNftTokenAddresses',
      }),
    }
  } catch (error: any) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

export const handler = main
