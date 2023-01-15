import { ConversationCreatedSubscriptionData, GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const created = {
  /////////////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //--------------------------
    const { pubsub } = context;
    //-------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationCreated]);
    //-------------------------------------------------------------------
  },
  //////////////////////////////////////////////////////////////////
  Filter: (payload: ConversationCreatedSubscriptionData, _: any, context: GraphQLContext) => {
    //-------------------------
    const { session } = context;
    //----------------------------------------
    if (!session?.user) {
      throw new GraphQLError("Not authorized");
    }
    //---------------------------------------------------
    const { participants } = payload.conversationCreated;
    //----------------------------------------------------------------
    return !!participants.find((p) => p.user.id === session?.user?.id);
    //----------------------------------------------------------------
  },
};
