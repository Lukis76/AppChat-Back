import {
  ConversationUpdatedSubscriptionData,
  GraphQLContext,
} from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const updated = {
  //////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //------------------------
    const { pubsub } = context;
    //-------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationUpdated]);
    //------------------------------------------------------------------
  },
  //////////////////////////////////////////////////////////////////////
  Filter: (
    payload: ConversationUpdatedSubscriptionData,
    _: any,
    context: GraphQLContext
  ) => {
    //--------------------------
    const { session } = context;
    //-----------------------------------------
    if (!session?.user) {
      throw new GraphQLError("Not authorized");
    }
    //--------------------------------------------------------
    const { participants, latestMsg } = payload.conversationUpdated;
    //---------------------------------------------------------------------------------
    const userIsParticipant = !!participants.find(
      (p) => p.user.id === session.user?.id
    );
    //---------------------------------------------------------------------------------
    const userSentLatestMsg = latestMsg?.senderId === session.user.id;
    //-------------------------------------------------------------------
    return (userIsParticipant && !userSentLatestMsg) || userSentLatestMsg;
    //-------------------------------------------------------------------
  },
};
