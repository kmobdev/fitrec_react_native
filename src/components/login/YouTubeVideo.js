import React, { Component, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import YouTube from "react-native-youtube";
import { BlackColor, WhiteColor, SignUpColor } from "../../Styles";

const YouTubeVideo = (props) => {

  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState();
  const [quality, setQuality] = useState();
  const [error, setError] = useState();

  return (
    props.visible && (
      <View style={styles.viewFullAbsolute}>
        <View
          style={[styles.head, props.noMargin && { paddingTop: 10 }]}
        >
          <Text style={styles.headTitle}>What is FITREC?</Text>
          <View style={[styles.headClose, props.noMargin && { top: 5 }]}>
            <Pressable onPress={props.close}>
              <Text style={styles.headCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.viewYoutube}>
          {Platform.OS === "android" ? (
            <WebView
              style={styles.webViewContainer}
              javaScriptEnabled={true}
              source={{ uri: props.url }}
            />
          ) : (
            <YouTube
              videoId={
                props.url.split("/")[
                props.url.split("/").length - 1
                ]
              }
              style={{ alignSelf: "stretch", height: 250, width: "100%" }}
              apiKey="AIzaSyDX3zlzsns9a8YyhcqFtz0fICAnX4RYn28"
              fullscreen={true}
              onReady={(e) => setIsReady(true)}
              onChangeState={(e) => setStatus(e.state)}
              onChangeQuality={(e) => setQuality(e.quality)}
              onError={(e) => setError(e.error)}
            />
          )}
        </View>
      </View>
    )
  );
}

export default YouTubeVideo;

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
  webViewContainer: {
    alignSelf: "stretch",
    width: "100%"
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
