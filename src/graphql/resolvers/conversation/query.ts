import { ConversationFE, GraphQLContext } from '../../../utils/types'
import { GraphQLError } from 'graphql'
import { validateToken } from '../../../utils/validateToken'
import { decodeToken } from '../../../utils/decodeToken'

///////////// Query //////////////////
export const conversations = async (
  _: any,
  args: any,
  context: GraphQLContext
): Promise<Array<ConversationFE>> => {
  //----------------------------------
  const { token } = args
  const { prisma } = context
  console.log('🚀 ~ file: query.ts:14 ~ token', token)
  //------------------------------------------
  // authorized Token
  const validate = await validateToken(token)
  //--------------------------------
  const { id } = await decodeToken(token)
  //-----------------------------------------------------------
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        latestMsg: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    })
    console.log('🚀 ~ file: query.ts:45 ~ conversations', conversations)
    console.log('🚀 ~ file: query.ts:19 ~ id', id)
    //-----------------------------------------------------
    const result = conversations.filter((c: any) =>
      c.participants.find((p: any) => p.userId === id)
    )
    console.log('🚀 ~ file: query.ts:50 ~ result', result)
    return result
    //-----------------------------------------------------
  } catch (err) {
    console.log('Conversations Error', err)
    throw new GraphQLError('Conversations Error')
  }
}
