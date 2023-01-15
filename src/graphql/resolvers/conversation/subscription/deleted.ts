import {
  ConversationDeletedSubscriptionData,
  GraphQLContext,
} from '@utils/types'
import { GraphQLError } from 'graphql'
import { subscriptionEvent } from '../'

export const deleted = {
  //////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //------------------------
    const { pubsub } = context
    //-------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationDeleted])
    //------------------------------------------------------------------
  },
  //////////////////////////////////////////////////////////////////////
  Filter: (
    payload: ConversationDeletedSubscriptionData,
    _: any,
    context: GraphQLContext
  ) => {
    //--------------------------
    const { session } = context
    //-----------------------------------------
    if (!session?.user) {
      throw new GraphQLError('Not authorized')
    }
    //--------------------------------------------------------------
    return !!payload.conversationDeleted.participants.find(
      (p) => p.userId === session.user?.id
    )

    //---------------------------------------
  },
}
