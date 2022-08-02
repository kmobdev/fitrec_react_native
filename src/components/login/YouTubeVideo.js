import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import YouTube from "react-native-youtube";
import { BlackColor, WhiteColor, SignUpColor } from "../../Styles";

export default class YouTubeVideo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.visible && (
        <View style={styles.viewFullAbsolute}>
          <View
            style={[styles.head, this.props.noMargin && { paddingTop: 10 }]}
          >
            <Text style={styles.headTitle}>What is FITREC?</Text>
            <View style={[styles.headClose, this.props.noMargin && { top: 5 }]}>
              <Pressable onPress={this.props.close}>
                <Text style={styles.headCloseText}>Close</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.viewYoutube}>
            {Platform.OS === "android" ? (
              <WebView
                style={{ alignSelf: "stretch", width: "100%" }}
                javaScriptEnabled={true}
                source={{
                  uri: this.props.url,
                }}
              />
            ) : (
              <YouTube
                videoId={
                  this.props.url.split("/")[
                    this.props.url.split("/").length - 1
                  ]
                }
                style={{ alignSelf: "stretch", height: 250, width: "100%" }}
                apiKey="AIzaSyDX3zlzsns9a8YyhcqFtz0fICAnX4RYn28"
                fullscreen={true}
                onReady={(e) => this.setState({ isReady: true })}
                onChangeState={(e) => this.setState({ status: e.state })}
                onChangeQuality={(e) => this.setState({ quality: e.quality })}
                onError={(e) => this.setState({ error: e.error })}
              />
            )}
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  viewFullAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BlackColor,
  },
  head: {
    backgroundColor: WhiteColor,
    paddingTop: 50,
    padding: 10,
  },
  headTitle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  headClose: {
    position: "absolute",
    right: 10,
    top: 35,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headCloseText: {
    color: SignUpColor,
    fontWeight: "bold",
    fontSize: 18,
  },
  viewYoutube: {
    marginTop: "10%",
    height: 300,
  },
});
