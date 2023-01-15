import {
  ConversationUpdatedSubscriptionData,
  GraphQLContext,
} from '@utils/types'
import { GraphQLError } from 'graphql'
import { subscriptionEvent } from '../'

export const updated = {
  //////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //------------------------
    const { pubsub } = context
    console.log('><><><><><><><><><><><><> 👍 👍 👍 👍')
    //-------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationUpdated])
    //------------------------------------------------------------------
  },
  //////////////////////////////////////////////////////////////////////
  Filter: (
    payload: ConversationUpdatedSubscriptionData,
    args: any,
    context: GraphQLContext
  ) => {

    //--------------------------
    const { session } = context //
    //-----------------------------------------
    if (!session?.user) {
      throw new GraphQLError('Not authorized')
    }
    //--------------------------------------------------------------
    const { consversation, removeUserIds, addUserIds } =
      payload.conversationUpdated
    //--------------------------------------------------------------
    const userIsParticipant = !!consversation.participants.find(
      (p) => p.userId === session.user?.id
    )
    //-----------------------------------------------------------------
    const userSentLatestMsg =
      consversation.latestMsg?.senderId === session.user.id
    //-----------------------------------------------------------------
    const userIsRemoved =
      removeUserIds &&
      Boolean(removeUserIds.find((id) => id === session?.user?.id))
    //----------------------------------------------------------------------
    return (
      (userIsParticipant && !userSentLatestMsg) ||
      userSentLatestMsg ||
      userIsRemoved
    )
    //---------------------------------------
  },
}
