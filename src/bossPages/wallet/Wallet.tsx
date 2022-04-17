import React, {useEffect, useState} from 'react';
import {Center, Text, Box, HStack, Pressable, Button} from 'native-base';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import useRequest from '../../hooks/useRequest';
import {fetchRechargeItems, rechargeApplyWX} from '../../api/wallet';
import * as wechat from 'react-native-wechat-lib';
import util from '../../util/util';

interface ItemProps {
  id: string;
  coinNum: string | number;
  rmbAmount: string | number;
}

const Bar = ({title = '充值项目'}) => {
  return (
    <Box pl={2}>
      <Box style={styles.bar} />
      <Text fontSize={'md'} color="fontColors.666">
        {title}
      </Text>
    </Box>
  );
};

const Index = () => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const ITEM_WIDTH = (width - 32 - 8) / 2;
  const [activeItem, setItem] = useState(''); // 选中的充值项目id
  const {result: chargeList} = useRequest(
    fetchRechargeItems.url,
    {
      platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    },
    fetchRechargeItems.options,
  );

  const {run: runChargeWx} = useRequest(rechargeApplyWX.url);

  const charge = async () => {
    try {
      const {data, success} = await runChargeWx({
        rechargeItemId: activeItem,
        tradeType: 'APP',
      });
      console.log('data', data);
      if (!success) {
        return;
      }
      const {prepayId, nonceStr, timeStamp, signType, partnerId} = data;
      wechat
        .pay({
          partnerId, // 商家向财付通申请的商家id
          prepayId, // 预支付订单
          nonceStr, // 随机串，防重发
          timeStamp, // 时间戳，防重发
          package: data.package, // 商家根据财付通文档填写的数据和签名
          sign: signType, // 商家根据微信开放平台文档对数据做的签名
        })
        .then(res => {
          console.log(res);
        })
        .catch(er => {
          console.log('er', er);
        });
    } catch (error) {}
  };

  return (
    <Box flex={1}>
      <Box
        bg={'white'}
        justifyContent="center"
        style={{paddingTop: insets.top}}>
        <Center w={'full'} style={{height: 52}}>
          <Text fontSize="lg" fontWeight={'bold'}>
            钱包
          </Text>
          <Pressable justifyContent={'center'} style={styles.header_right}>
            <Text fontWeight={'bold'} fontSize={'md'}>
              交易明细
            </Text>
          </Pressable>
        </Center>
      </Box>
      <Box style={styles.top_section}>
        <ImageBackground
          style={styles.top_inner}
          resizeMode="center"
          source={require('../../images/charge_bg.png')}>
          {/* <HStack> */}
          <Text fontSize={'2xl'} color="white">
            青贝：120
          </Text>
          {/* </HStack> */}
        </ImageBackground>
      </Box>
      <Box shadow={2} p={4} flex={1} bg={'white'} style={styles.main}>
        <Bar />
        <HStack flexWrap={'wrap'} mt={4}>
          {chargeList &&
            chargeList.map((item: ItemProps, index: number) => (
              <Pressable
                key={index}
                onPress={() => setItem(item.id)}
                borderRadius={5}
                py={2.5}
                mb={1.5}
                px={4}
                borderWidth={0.5}
                borderColor={
                  activeItem === item.id ? 'primary.100' : 'border.gray'
                }
                style={{
                  backgroundColor:
                    activeItem === item.id ? '#9650FF50' : 'white',
                  width: ITEM_WIDTH,
                  marginRight: index % 2 === 0 ? 8 : 0,
                }}>
                <HStack mb={1} alignItems={'center'}>
                  <Icon name="diamond" color={'#9650FF'} size={20} />
                  <Text
                    ml={1}
                    fontSize={'lg'}
                    color={
                      activeItem === item.id ? 'primary.100' : 'fontColors.333'
                    }
                    fontWeight="bold">
                    {item.coinNum}青贝
                  </Text>
                </HStack>
                <Text ml={7} fontSize={'md'} color="fontColors.gray">
                  ¥{item.rmbAmount}
                </Text>
              </Pressable>
            ))}
        </HStack>
        <Button
          onPress={() => util.throttle(charge(), 2000)}
          borderRadius={'full'}
          py={3}
          bg={'primary.100'}
          _text={{color: '#fff', fontSize: 'md'}}
          style={{marginTop: 'auto', marginBottom: 80}}>
          立即购买
        </Button>
      </Box>
    </Box>
  );
};

export default Index;

const styles = StyleSheet.create({
  header_right: {
    height: '100%',
    position: 'absolute',
    right: 16,
    top: 0,
  },
  top_section: {
    minHeight: 136,
    paddingHorizontal: 16,
    backgroundColor: '#fff4db',
  },
  top_inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  main: {
    marginTop: -30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bar: {
    position: 'absolute',
    backgroundColor: '#9650FF',
    width: 4,
    height: 14,
    borderRadius: 2,
    top: '50%',
    left: 0,
    transform: [{translateY: -7}],
  },
});