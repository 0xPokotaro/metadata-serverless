import prisma from '../../../libs/prisma'

const main = async (event: any) => {
  try {
    const { body } = event
    console.log(body)
    // const outputData = []

    return {
      statusCode: 200,
      body: JSON.stringify({
        // data: outputData,
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
