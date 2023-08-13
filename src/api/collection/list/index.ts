import prisma from '../../../libs/prisma'

const main = async () => {
  try {
    const outputData = await prisma.collections.findMany()

    return {
      statusCode: 200,
      body: JSON.stringify(outputData),
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
