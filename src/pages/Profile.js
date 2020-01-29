import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';


export default function Profile(props) {

    const github_username = props.navigation.getParam('github_username')
  return (
    <WebView style={{ flex: 1}} source={{ uri: `https://github.com/${github_username}`}} />
  );
}
