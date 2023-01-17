import { ConversationDeletedSubscriptionData, GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const deleted = {
  //////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //---------------------------------------------------------------------------
    return context.pubsub.asyncIterator([subscriptionEvent.conversationDeleted]);
    //---------------------------------------------------------------------------
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  Filter: (payload: ConversationDeletedSubscriptionData, _: any, context: GraphQLContext) => {
    //----------------------------------------------------------------------------------------
    if (!context?.session?.user) {
      throw new GraphQLError("Not authorized");
    }
    //-----------------------------------------------------------------------------------------------------
    return !!payload.conversationDeleted.participants.find((p) => p.userId === context?.session?.user?.id);
    //-----------------------------------------------------------------------------------------------------
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
};
