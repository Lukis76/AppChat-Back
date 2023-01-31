import {
  ConversationUpdatedSubscriptionData,
  GraphQLContext,
} from "../../../../utils/types";
import { subscriptionEvent } from "../../conversation";
import { validateToken } from "../../../../utils/validateToken";
import { decodeToken } from "../../../../utils/decodeToken";

export const updated = {
  ///////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //------------------------------------------------------
    const { pubsub } = context;
    //--------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationUpdated]);
    //--------------------------------------------------------------------
  },
  ///////////////////////////////////////////////////////////////////////
  Filter: async (
    payload: ConversationUpdatedSubscriptionData,
    args: any,
    context: GraphQLContext
  ) => {
    //--------------------------
    const { token } = context;
    try {
      //-------------------------
      // authorized Token
      await validateToken(token);
      //---------------------------------
      const { id } = decodeToken(token);
      //------------------------------------------------------
      const { conversation, addUserIds, removeUserIds } =
        payload.conversationUpdated;
      //------------------------------------------------------------
      return !!conversation.participants.find((p) => p.userId === id);
      // //--------------------------------------------------------------
      // const userSentLatestMsg = consversation.latestMsg?.senderId === session.user.id;
      // //------------------------------------------------------------------
      // const userIsRemoved = removeUserIds && Boolean(removeUserIds.find((id: any) => id === session?.user?.id));
      // //----------------------------------------------------------------------
      // return (userIsParticipant && !userSentLatestMsg) || userSentLatestMsg || userIsRemoved;
      // //------------------------------------------------------------------
    } catch (err) {
      return err;
    }
  },
};
