import {
  ConversationDeletedSubscriptionData,
  GraphQLContext,
} from "../../../../utils/types";
import { subscriptionEvent } from "../../conversation";
import { validateToken } from "../../../../utils/validateToken";
import { decodeToken } from "../../../../utils/decodeToken";

export const deleted = {
  //////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //-----------------------------------------------------
    return context.pubsub.asyncIterator([
      subscriptionEvent.conversationDeleted,
    ]);
    //--------------------------------------
  },
  ////////////////////////////////////////////////
  Filter: async (
    payload: ConversationDeletedSubscriptionData,
    _: any,
    context: GraphQLContext
  ) => {
    //========================
    const { token } = context;
    //========================
    try {
      //-------------------------
      // authorized Token
      await validateToken(token);
      //---------------------------------
      const { id } = decodeToken(token);
      //------------------------------------------------------
      return !!payload.conversationDeleted.participants.find(
        (p) => p.userId === id
      );
      //------------------------------------------------------
    } catch (err) {
      console.log("Subscription error", err);
      return err;
    }
  },
  //////////////////////////////////////////////////////////
};
