/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  Box,
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import Icon from 'react-native-vector-icons/EvilIcons';
import {StyleSheet, useWindowDimensions} from 'react-native';
import useRequest from '../../hooks/useRequest';
import {fetchMyInfo} from '../../api/common';

const link_group1_list = [
  {
    name: '女生微信',
    icon: require('../../images/mine_link_icon1.png'),
  },
  {
    name: '我的礼物',
    icon: require('../../images/mine_link_icon2.png'),
  },
  {
    name: '帮助教程',
    icon: require('../../images/mine_link_icon3.png'),
  },
];
const link_group2_list = [
  {
    name: '钱包',
    icon: require('../../images/mine_link_icon4.png'),
  },
  {
    name: '联系客服',
    icon: require('../../images/mine_link_icon5.png'),
  },
  // {
  //   name: '黑名单',
  //   icon: require('../../images/mine_link_icon2.png'),
  // },
  {
    name: '设置',
    icon: require('../../images/mine_link_icon6.png'),
  },
];

const Home = () => {
  const {width} = useWindowDimensions();
  const {result: userInfo} = useRequest(
    fetchMyInfo.url,
    {},
    fetchMyInfo.options,
  );

  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      flex={1}
      showsVerticalScrollIndicator={false}>
      <Svg>
        <Defs>
          <LinearGradient id="g3" x1={0.5} y1={0.3} x2={0.5} y2={1}>
            <Stop offset={0} stopColor="#6950FB" stopOpacity={1} />
            <Stop offset={1} stopColor="#B83AF3" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={width / 2}
          cy={width / 2}
          x={0}
          y={-width / 1.2}
          r={width}
          fill="url(#g3)"
        />
      </Svg>
      <Box
        w={'full'}
        style={{position: 'absolute', top: 140, zIndex: 1}}
        px={4}>
        <Image
          mx={3}
          source={require('../../images/test.jpg')}
          alt="avatar"
          borderRadius={100}
          style={styles.avatar}
        />
        <Box
          alignItems={'center'}
          pt={12}
          pb={2}
          shadow={1}
          borderRadius={4}
          bg="white">
          <Text fontWeight={'bold'} mt={2} fontSize={'2xl'}>
            {userInfo?.nickName || '老大叔'}
          </Text>
          <Text color={'fontColors.gray'} fontSize={'md'}>
            ID: 64983274
          </Text>
          <Divider my={4} />
          <HStack justifyContent={'space-around'}>
            <VStack flex={1} alignItems={'center'}>
              <Text color={'fontColors.gray'} fontSize="xs">
                点赞
              </Text>
              <Text fontSize={'xl'}>218</Text>
            </VStack>
            <VStack flex={1} alignItems={'center'}>
              <Text color={'fontColors.gray'} fontSize="xs">
                评论
              </Text>
              <Text fontSize={'xl'}>218</Text>
            </VStack>
            <VStack flex={1} alignItems={'center'}>
              <Text color={'fontColors.gray'} fontSize="xs">
                关注
              </Text>
              <Text fontSize={'xl'}>218</Text>
            </VStack>
          </HStack>
        </Box>
        <Box mt={5} shadow={1} borderRadius={4} bg="white">
          {link_group1_list.map((item, index) => (
            <HStack
              borderBottomColor={'bg.f5'}
              borderBottomWidth={index < 2 ? 1 : 0}
              px={2}
              py={2}
              alignItems={'center'}
              key={`key${index}`}>
              <Image source={item.icon} alt="icon" style={styles.link_icon} />
              <Text ml={2} mr="auto" fontSize={'md'} color="fontColors.333">
                {item.name}
              </Text>
              <Icon name="chevron-right" color="#C5C6C7" size={32} />
            </HStack>
          ))}
        </Box>
        <Box mt={5} shadow={1} borderRadius={4} bg="white">
          {link_group2_list.map((item, index) => (
            <HStack
              borderBottomColor={'bg.f5'}
              borderBottomWidth={index < 3 ? 1 : 0}
              px={2}
              py={2}
              alignItems={'center'}
              key={`key${index}`}>
              <Image source={item.icon} alt="icon" style={styles.link_icon} />
              <Text ml={2} mr="auto" fontSize={'md'} color="fontColors.333">
                {item.name}
              </Text>
              <Icon name="chevron-right" color="#C5C6C7" size={32} />
            </HStack>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  avatar: {
    width: 96,
    height: 96,
    position: 'absolute',
    left: '50%',
    top: -48,
    zIndex: 2,
    transform: [
      {
        translateX: -48,
      },
    ],
  },
  link_icon: {
    width: 22,
    height: 22,
  },
});
