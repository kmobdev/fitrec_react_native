import { StyleSheet, Dimensions } from "react-native";
import { normalize } from "react-native-elements";

export const GreenLightFitrecColor = "#20818C";
export const GreenFitrecColor = "#00454C";
export const WhiteColor = "#FFFFFF";
export const FacebookColor = "#3b5998";
export const SignUpColor = "#EA5856";
export const PlaceholderColor = "#9C9C9C";
export const BlackColor = "#000000";

export const GlobalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backIcon: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  fullImageGroups: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  fullImageWidht: {
    width: Dimensions.get("window").width,
    height: "100%",
  },
  photoProfileViewSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  photoProfileViewSectionPhotos: {
    borderBottomWidth: 0,
    flexDirection: "row",
    width: "100%",
  },
  photoProfileCoverPreviewPhoto: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    width: "100%",
  },
  photoProfileProfilePreviewPhoto: {
    borderRadius: 60,
    marginLeft: "1.5%",
    height: 120,
    width: 120,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PlaceholderColor,
  },
  photoProfileProfilePreviewPhotoPicker: {
    borderRadius: 60,
    height: 120,
    width: 120,
    borderWidth: 1,
    borderColor: PlaceholderColor,
  },
  photoProfileImagePerfil: {
    marginLeft: "10%",
    height: 120,
    width: 120,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 100,
  },
  photoProfileCardList: {
    height: 80,
    width: 80,
    borderRadius: 100,
  },
  viewSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  buttonCancel: {
    backgroundColor: SignUpColor,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonConfirm: {
    backgroundColor: GreenFitrecColor,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  textButton: {
    color: WhiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  gifImage: {
    height: 280,
    width: "100%",
  },
  gifImageSmall: {
    height: 120,
    width: "100%",
  },
  messageEmpty: {
    color: SignUpColor,
    fontSize: 24,
    textAlign: "center",
    marginTop: 30,
  },
  textMuted: {
    color: "gray",
  },
  textWhite: {
    color: WhiteColor,
  },
  giphyLogoPositionLeft: {
    position: "absolute",
    bottom: -8,
    left: -8,
  },
  giphyLogoPositionRight: {
    position: "absolute",
    bottom: -8,
    right: -8,
  },
  errorBorder: {
    borderBottomColor: "red",
    borderBottomWidth: 0.7,
  },
});

export const GlobalModal = StyleSheet.create({
  viewContent: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: WhiteColor,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: 10,
  },
  viewHead: {
    borderBottomWidth: 0.5,
    borderBottomColor: PlaceholderColor,
  },
  headTitle: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 15,
    fontSize: 16,
  },
  buttonClose: {
    position: "absolute",
    right: 10,
    padding: 15,
  },
  buttonLeft: {
    zIndex: 1,
    position: "absolute",
    left: 10,
    padding: 15,
  },
  titleClose: {
    fontSize: 18,
    color: SignUpColor,
  },
});

export const GlobalShowActivity = StyleSheet.create({
  viewActivity: {
    borderWidth: 0.5,
    borderColor: SignUpColor,
    padding: 5,
    borderRadius: 20,
    justifyContent: "center",
    marginRight: 5,
    marginBottom: 5,
  },
  textActivity: {
    color: SignUpColor,
    textAlign: "center",
    justifyContent: "center",
  },
});

export const GlobalMessages = StyleSheet.create({
  viewGlobalBubble: {
    alignItems: "center",
    marginTop: 10,
  },
  viewBubble: {
    backgroundColor: SignUpColor,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: WhiteColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  containerMessage: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#e0e2e4",
    borderColor: "#e0e2e4",
  },
  containerMessageRight: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#4eaa41",
    borderColor: "#4eaa41",
  },
});

export const GlobalTabs = StyleSheet.create({
  viewTabs: {
    width: "100%",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  tabLeft: {
    width: "50%",
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
    borderColor: PlaceholderColor,
    borderBottomLeftRadius: 10,
    backgroundColor: WhiteColor,
    borderWidth: 0.5,
    borderTopLeftRadius: 10,
  },
  tabRight: {
    width: "50%",
    backgroundColor: WhiteColor,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderColor: PlaceholderColor,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  tabActive: {
    backgroundColor: SignUpColor,
    borderColor: "transparent",
  },
  tabsTextActive: {
    color: WhiteColor,
    fontSize: 16,
  },
  tabsText: {
    fontSize: 16,
  },
});

export const ToastQuestionGenericStyles = StyleSheet.create({
  viewButtonOption: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: SignUpColor,
    borderRadius: 5,
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: "center",
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
  },
  viewButtonOptionText: {
    color: WhiteColor,
    marginLeft: 5,
    fontSize: 18,
    textAlign: "center",
  },
  contentToast: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  contentToastSimple: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 8,
  },
  containerInput: {
    minWidth: 250,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  contentToastConfirm: {
    position: "absolute",
    top: 240,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  viewToast: {
    width: 250,
    minWidth: 50,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textToast: {
    color: WhiteColor,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  titleToast: {
    color: WhiteColor,
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitleToast: {
    color: WhiteColor,
    textAlign: "center",
    marginTop: 10,
    fontSize: 17,
    fontStyle: "italic",
  },
  viewButtons: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: SignUpColor,
    margin: "2%",
    width: "46%",
    borderRadius: 5,
    alignItems: "center",
    padding: 5,
  },
  threeButtons: {
    backgroundColor: SignUpColor,
    margin: "1%",
    width: "32%",
    borderRadius: 5,
    alignItems: "center",
    padding: 5,
  },
  toastContainer: {
    padding: 10,
  },
  inputSimple: {
    backgroundColor: WhiteColor,
    width: "100%",
    height: "auto",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  inputLarge: {
    backgroundColor: WhiteColor,
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    height: 100,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: SignUpColor,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    marginRight: 10,
    borderRadius: 5,
  },
  buttonConfirm: {
    backgroundColor: GreenFitrecColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: WhiteColor,
    fontWeight: "bold",
  },
  buttonStory: {
    backgroundColor: SignUpColor,
    margin: "2%",
    width: "90%",
    borderRadius: 5,
    alignItems: "center",
    padding: 8,
    zIndex: 3,
  },
  viewToastStory: {
    alignSelf: "center",
    marginTop: 250,
    width: 180,
    zIndex: 3,
  },
});

export const GlobalBubble = StyleSheet.create({
  position: {
    position: "absolute",
    right: 20,
    bottom: 10,
    alignItems: "center",
  },
  viewBubble: {
    backgroundColor: SignUpColor,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 15,
  },
  viewBubbleSmall: {
    height: 50,
    width: 50,
  },
  viewBubbleBig: {
    height: 65,
    width: 65,
  },
  text: {
    color: WhiteColor,
    fontWeight: "bold",
  },
  touchable: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const ProfileStyles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  viewDetailsUser: {
    marginLeft: "1.5%",
    marginRight: 10,
    flex: 1,
    flexWrap: "wrap",
    marginTop: 10,
  },
  viewDetailsUserTextUserName: {
    color: WhiteColor,
    fontWeight: "bold",
    fontSize: 18,
  },
  containerDetails: {
    zIndex: 2,
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  shadowImage: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  viewDetailsUserTextTitle: {
    color: WhiteColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  viewDetailsUserText: {
    color: WhiteColor,
    fontSize: 12,
    width: "100%",
    fontWeight: "bold",
  },
  viewActivitiesSelected: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    paddingBottom: 20,
  },
  viewMoreDetails: {
    padding: 10,
    height: "100%",
    width: "100%",
  },
  viewJourney: {
    width: "100%",
    maxWidth: "100%",
    paddingTop: 10,
  },
  touchableJourney: {
    margin: 1,
    marginTop: 1,
  },
  viewLikes: {
    position: "absolute",
    bottom: 1,
    padding: 5,
    left: 5,
    flexDirection: "row",
    backgroundColor: WhiteColor,
    borderRadius: 100,
  },
  textLiked: {
    color: SignUpColor,
    fontSize: 16,
    marginLeft: 2,
    fontWeight: "bold",
  },
  shadowText: {
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  journeyImage: {
    height: 135,
    width: "100%",
  },
  journeyContainer: {
    width: "70%",
    borderTopWidth: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  fitnessLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const ToastQuestionStyles = StyleSheet.create({
  viewButtons: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: "50%",
    padding: 5,
    justifyContent: "center",
    borderRadius: 5,
  },
  textButton: {
    fontSize: 16,
    color: WhiteColor,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  containerImage: {
    width: "40%",
    height: 60,
    borderRadius: 100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    width: "20%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export const CarouselStyle = StyleSheet.create({
  carouselContainer: {
    padding: 0,
    margin: 0,
    width: "100%",
    height: "100%",
  },
  itemContainer: {
    width: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  paginationContainer: {
    position: "absolute",
    bottom: -55,
    width: "100%",
    marginHorizontal: "auto",
  },
  paginationActive: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: GreenFitrecColor,
    margin: -3,
    marginBottom: 0,
    marginTop: 0,
  },
  paginationInactive: {
    backgroundColor: "black",
    margin: -5,
    padding: 0,
  },
});

export const JourneyStyles = StyleSheet.create({
  containerMutedIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 33,
    height: 33,
    borderRadius: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mutedIcon: {
    alignSelf: "center",
    marginTop: 4,
  },
});

export const FollowersStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
    flex: 3,
    alignItems: "center",
  },
  counter: {
    color: WhiteColor,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: GreenFitrecColor,
    width: "80%",
  },
  label: {
    color: GreenFitrecColor,
    fontSize: normalize(9),
  },
  sectionInformation: {
    flex: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  counterProfileHome: {
    color: GreenFitrecColor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
