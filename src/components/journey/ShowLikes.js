import React, { Component } from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { GlobalModal, PlaceholderColor, GreenFitrecColor } from "../../Styles";
import { connect } from "react-redux";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import FastImage from "react-native-fast-image";
import { getFitnnesLevel } from "../shared/SharedFunctions";

class ShowLikes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.visible && (
        <View style={GlobalModal.viewContent}>
          <View style={GlobalModal.viewHead}>
            <Text style={GlobalModal.headTitle}>Users liked</Text>
            <Pressable
              style={GlobalModal.buttonClose}
              onPress={this.props.close}
            >
              <Text style={GlobalModal.titleClose}>Close</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            {this.props.journeyProps.usersLiked !== undefined &&
              this.props.journeyProps.usersLiked.length > 0 ? (
              <FlatList
                data={this.props.journeyProps.usersLiked}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      borderBottomWidth: 0.5,
                      borderBottomColor: PlaceholderColor,
                    }}
                  >
                    <Pressable
                      style={{
                        width: "100%",
                        padding: 10,
                        flexDirection: "row",
                      }}
                      onPress={() => this.props.redirectionViewProfile(item.id)}
                    >
                      {null === item.image ? (
                        <Image
                          style={{ height: 80, width: 80 }}
                          source={require("../../assets/imgProfileReadOnly.png")}
                        />
                      ) : (
                        <FastImage
                          style={{ height: 80, width: 80, borderRadius: 100 }}
                          source={{
                            uri: item.image,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      {this.props.session.account.id !== item.id ? (
                        <View
                          style={{
                            justifyContent: "center",
                            marginLeft: 10,
                            marginRight: 75,
                          }}
                        >
                          <Text style={styles.textUserReference}>
                            {item.name} @{item.username}
                          </Text>
                          <Text style={{ fontSize: 14 }}>
                            {getFitnnesLevel(item.level)}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            justifyContent: "center",
                            marginLeft: 10,
                            marginRight: 75,
                          }}
                        >
                          <Text style={styles.textUserReference}>You</Text>
                          <Text style={{ fontSize: 14 }}>
                            {getFitnnesLevel(item.level)}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                )}
              />
            ) : (
              <LoadingSpinner
                visible={!this.props.journeyProps.statusGetLikesResponse}
              />
            )}
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  textUserReference: {
    marginBottom: 5,
    fontSize: 18,
    color: GreenFitrecColor,
  },
});

const mapStateToProps = (state) => ({
  session: state.reducerSession,
  journeyProps: state.reducerJourney,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ShowLikes);
