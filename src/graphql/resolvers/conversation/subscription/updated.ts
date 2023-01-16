import { ConversationUpdatedSubscriptionData, GraphQLContext } from "@utils/types";
import { GraphQLError } from "graphql";
import { subscriptionEvent } from "../";

export const updated = {
  ///////////////////////////////////////////////////////////
  Resolver: (_: any, __: any, context: GraphQLContext) => {
    //------------------------------------------------------
    const { pubsub } = context;
    //--------------------------------------------------------------------
    return pubsub.asyncIterator([subscriptionEvent.conversationUpdated]);
    //--------------------------------------------------------------------
  },
  ////////////////////////////////////////////////////////////////////////////////////////////////
  Filter: (payload: ConversationUpdatedSubscriptionData, args: any, context: GraphQLContext) => {
    //--------------------------
    const { session } = context;
    console.log("><><><><><><><><><><><><", payload);
    console.log("><><><><><><><><><><><><", payload.conversationUpdated.conversation.participants);
    //-----------------------------------------
    if (!session?.user) {
      throw new GraphQLError("Not authorized");
    }
    //-------------------------------------------------------------------------------
    const { conversation, addUserIds, removeUserIds } = payload.conversationUpdated;
    //------------------------------------------------------------------------------------------------
    const userIsParticipant = !!conversation.participants.find((p) => p.userId === session.user?.id);
    // //------------------------------------------------------------------------------------------------
    // const userSentLatestMsg = consversation.latestMsg?.senderId === session.user.id;
    // //---------------------------------------------------------------------------------------------------
    // const userIsRemoved = removeUserIds && Boolean(removeUserIds.find((id: any) => id === session?.user?.id));
    // //---------------------------------------------------------------------------------------------------
    // return (userIsParticipant && !userSentLatestMsg) || userSentLatestMsg || userIsRemoved;
    // //-------------------------------------------------------------------------------------
    return userIsParticipant;
  },
};
