// import prisma from '../../../../libs/prisma'

const main = async () => {
  try {
    // TODO: 認証機能を追加
    return {
      statusCode: 200,
      body: JSON.stringify({}),
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
