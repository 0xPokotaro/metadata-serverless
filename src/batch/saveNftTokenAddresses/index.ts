import prisma from '../../libs/prisma'
import { getNFTTransfersByBlock } from '../../libs/moralis/nftApi/getNFTTransfersByBlock'
import { EVM_CHAIN } from '../../config'

const main = async (event: any) => {
  try {
    const lastProcessedBlock =
      await prisma.evmChainLastProcessedBlocks.findFirst({
        orderBy: {
          id: 'desc',
        },
      })

    if (!lastProcessedBlock) {
      throw new Error('No last processed block found')
    }

    const transfers = await getNFTTransfersByBlock(
      Number(lastProcessedBlock.latestBlockNo),
      lastProcessedBlock.lastCursor
    )

    if (transfers.cursor === undefined) {
      throw new Error('No cursor')
    }

    const savedTokenAddresses: Set<string> = new Set()

    for (const transfer of transfers.result) {
      const tokenAddress = transfer.token_address

      const existingToken = await prisma.evmChainTokens.findFirst({
        where: {
          evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
          address: tokenAddress,
        },
      })

      if (existingToken !== null) {
        continue
      }

      if (savedTokenAddresses.has(tokenAddress)) {
        continue
      }

      savedTokenAddresses.add(tokenAddress)
    }

    const tokenAddressesToCreate = Array.from(savedTokenAddresses).map(
      (address) => ({
        evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
        address,
      })
    )

    await prisma.evmChainTokens.createMany({
      data: tokenAddressesToCreate,
    })

    if (transfers.cursor === null) {
      const nextBlockNo = Number(lastProcessedBlock.latestBlockNo) + 1
      await prisma.evmChainLastProcessedBlocks.create({
        data: {
          evmChainId: EVM_CHAIN.ETHEREUM.CHAIN_ID,
          latestBlockNo: nextBlockNo,
          lastCursor: '',
        },
      })
    } else {
      await prisma.evmChainLastProcessedBlocks.update({
        where: {
          id: lastProcessedBlock.id,
        },
        data: {
          lastCursor: transfers.cursor,
        },
      })
    }

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
