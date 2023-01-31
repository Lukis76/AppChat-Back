import {
  ConversationCreatedSubscriptionData,
  GraphQLContext,
} from "../../../../utils/types";
import { subscriptionEvent } from "../../conversation";
import { validateToken } from "../../../../utils/validateToken";
import { decodeToken } from "../../../../utils/decodeToken";

export const created = {
  //////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //--------------------------------------
    return context.pubsub.asyncIterator([
      subscriptionEvent.conversationCreated,
    ]);
    //--------------------------------------
  },
  /////////////////////////////////////////////////
  Filter: async (
    payload: ConversationCreatedSubscriptionData,
    _: any,
    context: GraphQLContext
  ) => {
    //=========================
    const { token } = context;
    //=========================
    try {
      //-------------------------
      // authorized Token
      await validateToken(token);
      //---------------------------------
      const { id } = decodeToken(token);
      //----------------------------------------------------
      return !!payload.conversationCreated.participants.find(
        (p) => p.user.id === id
      );
      //------------------------------------------------------
    } catch (err) {
      return err;
    }
  },
  //////////////////////////////////////////////////////////
};
