import prisma from '../../../libs/prisma'

const main = async (event: any) => {
  try {
    const evmChainNftCollection = await prisma.evmChainNftCollections.findMany({
      select: {
        id: true,
        name: true,
        symbol: true,
        contractType: true,
        syncedAt: true,
        possibleSpam: true,
        verifiedCollection: true,
        evmChainTokens: {
          select: {
            id: true,
            address: true,
          },
        },
      },
    })

    const outputData = []
    for (const item of evmChainNftCollection) {
      outputData.push({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        tokenAddress: item.evmChainTokens.address,
        contractType: item.contractType,
        syncedAt: item.syncedAt,
        possibleSpam: item.possibleSpam,
        verifiedCollection: item.verifiedCollection,
      })
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: outputData,
      }),
    }
  } catch (error: any) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    }
  }
}

export const handler = main
