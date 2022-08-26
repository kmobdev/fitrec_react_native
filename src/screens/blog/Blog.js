import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import { View, ScrollView, RefreshControl } from "react-native";
import { GreenFitrecColor } from "../../Styles";

const Blog = () => {
  const webViewRef = useRef();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const hideLoading = () => {
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    webViewRef.current.reload();
    setLoading(false);
    setRefreshing(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={GreenFitrecColor}
            title="Pull to refresh..."
          />
        }>
        <WebView
          ref={webViewRef}
          onLoad={hideLoading}
          source={{ uri: "https://fitrec.com/blog/" }}
          style={{ height: "100%", weidth: "100%" }}
        />
      </ScrollView>
      <LoadingSpinner visible={loading} />
    </View>
  );
};

export default Blog;
