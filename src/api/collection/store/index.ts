import prisma from '../../../libs/prisma'

const main = async (event: any) => {
  try {
    const { body } = event
    const request = JSON.parse(body)

    const inputData = {
      name: request.name,
    }

    const response = await prisma.collections.create({
      data: inputData,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(response),
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
