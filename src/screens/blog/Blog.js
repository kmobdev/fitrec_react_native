import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { View, ScrollView, RefreshControl } from "react-native";
import { GreenFitrecColor } from "../../Styles";

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  hideLoading = () => {
    this.setState({
      loading: false,
      refreshing: false,
    });
  };

  onRefresh = (webViewRef) => {
    webViewRef && webViewRef.reload();
    this.setState({
      loading: false,
      refreshing: true,
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh(this.webViewRef)}
              tintColor={GreenFitrecColor}
              title="Pull to refresh..."
            />
          }
        >
          <WebView
            ref={(WEBVIEW_REF) => (this.webViewRef = WEBVIEW_REF)}
            onLoad={() => this.hideLoading()}
            source={{ uri: "https://fitrec.com/blog/" }}
            style={{ height: "100%", weidth: "100%" }}
          />
        </ScrollView>
        <LoadingSpinner visible={this.state.loading} />
      </View>
    );
  }
}
