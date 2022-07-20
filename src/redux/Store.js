import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  reducerSession,
  reducerForgotPassword,
  reducerDesactivateAccount,
  reducerProfilePal,
} from "./reducers/SessionReducers";
import { reducerRegister } from "./reducers/RegisterReducers";
import { reducerActivity } from "./reducers/ActivityReducers";
import { reducerHome } from "./reducers/HomeReducers";
import {
  reducerChat,
  reducerListMessages,
  reducerListFriends,
  reducerGiphy,
  reducerMessages,
} from "./reducers/ChatReducers";
import { reducerProfile } from "./reducers/ProfileReducers";
import { reducerMyPals, reducerRequests } from "./reducers/MyPalsReducers";
import {
  reducerGroup,
  reducerSendNotification,
  reducerInvitationsGroup,
  reducerUpdateGroup,
  reducerDetailsGroup,
} from "./reducers/GroupReducers";
import { reducerJourney, reducerShowJourney } from "./reducers/JourneyReducers";
import { reducerShared } from "./reducers/SharedReducers";
import { reducerNotification } from "./reducers/NotificationReducers";
import { reducerStory, reducerStoryActions } from "./reducers/StoryReducers";
import { reducerBlock } from "./reducers/BlockReducers";
import { reducerFollower } from "./reducers/FollowersReducers";

const reducers = combineReducers({
  reducerSession,
  reducerRegister,
  reducerActivity,
  reducerForgotPassword,
  reducerHome,
  reducerChat,
  reducerProfile,
  reducerListMessages,
  reducerListFriends,
  reducerMyPals,
  reducerGroup,
  reducerRequests,
  reducerDesactivateAccount,
  reducerJourney,
  reducerSendNotification,
  reducerInvitationsGroup,
  reducerUpdateGroup,
  reducerProfilePal,
  reducerShared,
  reducerGiphy,
  reducerNotification,
  reducerShowJourney,
  reducerStory,
  reducerStoryActions,
  reducerBlock,
  reducerFollower,
  reducerDetailsGroup,
  reducerMessages,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
