import { ConversationCreatedSubscriptionData, GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const created = {
  //////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //---------------------------------------------------------------------------
    return context.pubsub.asyncIterator([subscriptionEvent.conversationCreated]);
    //---------------------------------------------------------------------------
  },
  /////////////////////////////////////////////////////////////////////////////////////////////
  Filter: (payload: ConversationCreatedSubscriptionData, _: any, context: GraphQLContext) => {
    //----------------------------------------------------------------------------------------
    if (!context?.session?.user) {
      throw new GraphQLError("Not authorized");
    }
    //-----------------------------------------------------------------------------------------------------
    return !!payload.conversationCreated.participants.find((p) => p.user.id === context?.session?.user?.id);
    //-----------------------------------------------------------------------------------------------------
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
};
