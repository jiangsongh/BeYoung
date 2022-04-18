import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, Modal, ActivityIndicator} from 'react-native';
import {Box, Text, Pressable, View, Button, ScrollView} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import CFastImage from '../../../components/CFastImage';
import {openPicker} from '../../../util/openPicker';
import {upload} from '../../../util/upload';
import {addDynamic} from '../../../api/daily';
import {
  fetchCase,
  fetchAddMedia,
  fetchDelMedia,
} from '../../../api/photoSelect';
import useRequest from '../../../hooks/useRequest';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {BASE_DOWN_URL} from '../../../util/config';

import Layout from '../../../components/Layout';

const Index = ({...props}) => {
  const navigation = useNavigation();
  const {item, caseImgList} = props.route.params;
  console.log('--item--', item, caseImgList);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const {run: runAddMedia} = useRequest(fetchAddMedia.url);
  const {run: runFetchCase, result} = useRequest(fetchCase.url);
  const {run: runFetchDelMedia} = useRequest(fetchDelMedia.url); // 删除媒体信息
  const [caseList, setCaseList] = useState([]);

  useEffect(() => {
    runFetchCase({scene: item.code});
    if (caseImgList.length) {
      setList(caseImgList);
    }
  }, []);

  useEffect(() => {
    if (result) {
      console.log('result', result);
      if (result.length && result[0].imgs) {
        const temp = JSON.parse(result[0].imgs);
        setCaseList(JSON.parse(JSON.stringify(temp)));
        console.log('---result---', caseList);
      }
    }
  }, [result]);

  const chooseImg = async () => {
    try {
      const images = await openPicker(9 - list.length);
      const currentLength = images.length + list.length;
      if (currentLength > 9) {
        images.length = 9 - list.length;
      }
      let arr = [];
      images.forEach((item1): any => {
        let par = {
          mediaType: 'MEDIA_TYPE_IMAGE',
          name: '',
          scene: item.code,
          url: item1.path,
        };
        arr.push(par);
      });
      setList(JSON.parse(JSON.stringify(list.concat(arr))));
      checkSubmit(list.concat(arr));
    } catch (err) {
      console.log('--err--', err);
    }
  };

  const checkSubmit = imgList => {
    try {
      const filterUploadFiles = imgList.filter(
        item1 => item1.url.substr(0, 3) !== 'img',
      );
      setLoading(true);
      if (filterUploadFiles.length > 0) {
        uploadDynamic(filterUploadFiles, imgList);
      } else {
        // runAddMedia({
        //   content: textAreaValue,
        // });
      }
    } catch (err) {}
  };

  const uploadDynamic = async (files, imgList) => {
    multiUpload(files).then(async res => {
      console.log('---res---', res);
      // const filterFiles = imgList.filter(
      //   item1 => item1.url.substr(0, 3) === 'img',
      // );
      // let arr = filterFiles.concat(res);
      // console.log('----a---a--', arr);
      const {data, success} = await runAddMedia({
        userId: null,
        medias: res,
      });
      console.log('---d-a--a--a', data);
      if (success) {
        setLoading(false);
      }
    });
  };

  const multiUpload = files => {
    if (files.length <= 0) {
      return Promise.resolve([]);
    }
    return new Promise((reslove, reject) => {
      let arr = [];
      files.forEach((item1, index) => {
        upload(item1.url)
          .then(res => {
            let par = {
              mediaType: 'MEDIA_TYPE_IMAGE',
              name: '',
              scene: item.code,
              url: res,
            };
            arr.push(par);
            if (arr.length == files.length) {
              reslove(arr);
            }
          })
          .catch(() => {
            reject(new Errow('上传失败'));
          });
      });
    });
  };

  const delMedia = async mediaId => {
    let mediaIds = [];
    mediaIds.push(mediaId);
    await runFetchDelMedia({
      mediaIds: mediaIds,
    });
  };

  return (
    <Box flex={1} bg="white">
      <ScrollView>
        <Modal animationType="fade" transparent visible={loading}>
          <View style={styles.toastViewer}>
            <View style={styles.iconView}>
              <ActivityIndicator size="large" color={'#fff'} />
            </View>
            <Text style={styles.toastText}>正在上传...</Text>
          </View>
        </Modal>
        <Box px={4} py={4}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>我的{item.name}照片</Text>
            <Button onPress={() => checkSubmit()}>上传</Button>
          </View>
          <View
            style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 30}}>
            {list &&
              list.map((item1, index) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <CFastImage
                      url={item1.url}
                      styles={{
                        width: 60,
                        height: 60,
                        margin: 8,
                      }}
                    />
                    <Pressable
                      style={{
                        width: 14,
                        height: 14,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                      }}
                      onPress={() => {
                        setList(
                          JSON.parse(JSON.stringify(list.splice(index, 1))),
                        );
                        console.log('--', item1);
                        delMedia(item1.id);
                      }}>
                      <Icon name="closecircle" size={14} color="#B2B2B2" />
                    </Pressable>
                  </View>
                );
              })}
            <Pressable
              onPress={() => {
                chooseImg();
              }}
              style={styles.img_item}>
              <Image
                source={require('../../assets/album_add_icon.png')}
                style={{
                  width: 60,
                  height: 60,
                }}
                resizeMode="cover"
              />
            </Pressable>
          </View>
          {caseList && caseList.length ? (
            <View>
              <Text style={styles.title}>参考案例</Text>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 10,
                }}>
                {caseList &&
                  caseList.map((item1, index) => (
                    <FastImage
                      style={{
                        width: Layout.width - 30,
                        height: 400,
                      }}
                      source={{
                        uri: BASE_DOWN_URL + item1,
                        headers: {Authorization: 'someAuthToken'},
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ))}
              </View>
            </View>
          ) : null}
        </Box>
      </ScrollView>
    </Box>
  );
};
export default Index;

const styles = StyleSheet.create({
  img_item: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  toastViewer: {
    width: 120,
    minHeight: 120,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  iconView: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  toastText: {
    flex: 0.3,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  linearGradient: {
    position: 'absolute',
    bottom: 10,
    width: '90%',
    marginLeft: '5%',
    marginVertical: 20,
    borderRadius: 28,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    height: 56,
    lineHeight: 56,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
