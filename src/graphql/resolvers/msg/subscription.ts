import { GraphQLContext, SendMsgSubscriptionPayload } from '@utils/types'
import { subscriptionEvent } from '.'

////////// Subscription Msg //////////
export const send = {
  //////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    const { pubsub } = context
    //------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.msgSend])
    //------------------------------------------------------
  },
  ////////////////////////////////////////////////////////////
  Filter: (
    payload: SendMsgSubscriptionPayload,
    args: { conversationId: string },
    _: GraphQLContext
  ) => {
    //------------------------------------------------------------
    return payload.msgSend.conversationId === args.conversationId
    //-----------------------------------------------------------
  },
  ////////////////////////////////////////////////////////////////
}
