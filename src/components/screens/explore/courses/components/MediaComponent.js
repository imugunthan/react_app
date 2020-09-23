import React, {useState} from 'react';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import color from '../../../../../assets/styles/color';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import VideoPlayer from './VideoPlayer';

const MediaComponent = ({data, fullScreenHandler, isfullscreenMode}) => {
  const [youtubeFullScreen, setYoutubeFullScreen] = useState(false);
  return data.type == 'image' && !isfullscreenMode ? (
    <View style={{marginBottom: 10}}>
      {data.hideTitle ? null : (
        <Text style={style.sectionTitle}>{data.title}</Text>
      )}
      <View
        style={{
          width: '100%',
          height: 172,
        }}>
        <Image
          source={{uri: data.image_url}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  ) : data.type == 'vimeo_link' ? (
    <View style={{marginBottom: isfullscreenMode ? 0 : 10}}>
      {!data.hideTitle && !isfullscreenMode ? (
        <Text style={style.sectionTitle}>{data.title}</Text>
      ) : null}
      <View
        style={{
          position: 'relative',
          width: isfullscreenMode ? Dimensions.get('window').height : '100%',
          height: isfullscreenMode ? Dimensions.get('window').width : 200,
        }}>
        {Platform.OS == 'ios' ? (
          <Video
            volume={1}
            paused
            controls
            source={{uri: data.videoUrl}}
            resizeMode="contain"
            style={style.backgroundVideo}
          />
        ) : Platform.OS == 'android' ? (
          <VideoPlayer
            videoUrl={data.videoUrl}
            fullScreenHandler={fullScreenHandler}
          />
        ) : null}
      </View>
    </View>
  ) : data.type == 'youtube_link' && !isfullscreenMode ? (
    <View style={{marginBottom: 10}}>
      {data.hideTitle && !isfullscreenMode ? null : (
        <Text style={style.sectionTitle}>{data.title}</Text>
      )}
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: 200,
        }}>
        <YouTube
          videoId={data.key.split('v=')[1].substring(0, 11)}
          apiKey="AIzaSyAY7XFeWXYfIuMeFdEKCxh-mYRUDr8f2QY"
          play={false}
          fullscreen={youtubeFullScreen}
          resumePlayAndroid={false}
          onChangeFullscreen={() => setYoutubeFullScreen(!youtubeFullScreen)}
          style={{width: '100%', height: '100%'}}
          resizeMode="containe"
        />
      </View>
    </View>
  ) : null;
};

const style = StyleSheet.create({
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    lineHeight: 19,
    color: color.primaryTextColor,
    marginBottom: 15,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default MediaComponent;
