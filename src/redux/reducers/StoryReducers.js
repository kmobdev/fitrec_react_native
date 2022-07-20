import { Actions } from "../../Constants";

const aInitialState = {
  stories: [],
  expand: false,
  id: null,
  image: null,
  profile: null,
  name: null,
  date: null,
  progress: 0,
  imagePreview: null,
  nextStory: false,
  nextStoryStories: false,
  previusStory: false,
  previusStoryStories: false,
  owner: false,
  stopStory: false,
  type: null,
  videoName: null,
  index: null,
  total: null,
};

export const reducerStory = (state = aInitialState, action) => {
  switch (action.type) {
    case Actions.GET_STORIES:
      return { ...state, stories: action.data.stories };
    case Actions.EXPAND_STORY:
      return {
        ...state,
        expand: true,
        id: action.data.id,
        image: action.data.image,
        profile: action.data.profile,
        name: action.data.name,
        date: action.data.date,
        level: action.data.level,
        owner: action.data.owner,
        type: action.data.type,
        index: action.data.index,
        total: action.data.total,
      };
    case Actions.DISMISS_IMAGE:
      return {
        ...state,
        expand: false,
        image: null,
        profile: null,
        name: null,
        date: null,
        level: null,
        progress: 0,
        imagePreview: null,
        videoName: null,
        type: null,
        index: null,
        total: null,
      };
    case Actions.UPDATE_PROGRESS_STORY:
      return { ...state, progress: action.data.progress };
    case Actions.PREVIEW_STORY:
      return {
        ...state,
        type: action.data.type,
        imagePreview: action.data.image,
        videoName: action.data.name,
      };
    case Actions.NEXT_STORY:
      return {
        ...state,
        nextStory: true,
        previusStory: false,
        stopStory: false,
        nextStoryStories: true,
        previusStoryStories: false,
      };
    case Actions.PREVIOUS_STORY:
      return {
        ...state,
        nextStory: false,
        previusStory: true,
        stopStory: false,
        nextStoryStories: false,
        previusStoryStories: true,
      };
    case Actions.RESET_CONTROLS:
      return {
        ...state,
        nextStory: false,
        previusStory: false,
        stopStory: false,
      };
    case Actions.STOP_STORY:
      return {
        ...state,
        nextStory: false,
        previusStory: false,
        stopStory: true,
        nextStoryStories: false,
        previusStoryStories: false,
      };
    default:
      return state;
  }
};

const aInitialStateActions = {
  view: false,
  upload: false,
  next: false,
  previous: false,
  stop: false,
};
export const reducerStoryActions = (state = aInitialStateActions, action) => {
  switch (action.type) {
    case Actions.STORY_ACTION_VIEW:
      return { ...state, view: true, upload: false };
    case Actions.STORY_ACTION_UPLOAD:
      return { ...state, view: false, upload: true };
    case Actions.NEXT_STORY:
      return { ...state, next: true, previous: false, stop: false };
    case Actions.PREVIOUS_STORY:
      return { ...state, next: false, previous: true, stop: false };
    case Actions.RESET_CONTROLS_STORIES:
      return { ...state, next: false, previous: false, stop: false };
    case Actions.STORY_ACTION_RESET:
      return aInitialStateActions;
    default:
      return state;
  }
};
