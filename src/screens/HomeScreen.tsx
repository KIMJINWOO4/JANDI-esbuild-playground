// src/screens/HomeScreen.tsx

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import BottomBar from '../components/BottomBar';
const {width, height} = Dimensions.get('window');
import CalendarScreen from '../components/calendar';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../utils/locationUtils';
import {SERVICE_AREA, isPointInPolygon, Coordinate} from '../utils/serviceArea';

const HomeScreen = () => {
  // 모달 상태 관리
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const IMAGES = {
    profile: require('../../assets/images/illustration/typeThree.png'),
    logo: require('../../assets/images/illustration/logo.png'),
    self: require('../../assets/images/illustration/typeTwo.png'),
    together: require('../../assets/images/illustration/typeOne.png'),
    badge1: require('../../assets/images/badge/badge1.png'),
    badge2: require('../../assets/images/badge/badge2.png'),
    badge3: require('../../assets/images/badge/badge3.png'),
    freeze: require('../../assets/images/illustration/freeze.png'),
  };

  // 프로필 데이터 배열
  const profiles = [
    {
      id: 1,
      name: '김태영',
      nickName: '새도의 신',
      image: null, // 이미지가 없을 경우 기본 이미지 사용
      badge: [
        {image: IMAGES.badge1},
        {image: IMAGES.badge2},
        {image: IMAGES.badge3},
      ],
    },
  ];

  const freezes = [
    {
      num: 12,
    },
  ];

  // "혼자 인증하기" 버튼 핸들러
  const handleSelfCertify = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setModalMessage('위치 권한이 필요합니다.');
      setModalVisible(true);
      return;
    }

    try {
      const location: {latitude: number; longitude: number} =
        await getCurrentLocation();
      const userCoordinate: Coordinate = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const isInside = isPointInPolygon(
        {latitude: 35.23559740400939, longitude: 129.0816297282198},
        SERVICE_AREA,
      );

      if (isInside) {
        setModalMessage('인증에 성공했습니다!');
      } else {
        setModalMessage('서비스 지역이 아닙니다.');
      }
      setModalVisible(true);
    } catch (error) {
      console.warn('위치 가져오기 실패:', error);
      setModalMessage('위치 가져오기에 실패했습니다.');
      setModalVisible(true);
    }
  };

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{paddingBottom: 80}}>
          {/* 상단 프로필 영역 */}
          <View style={styles.logoSection}>
            <View style={styles.logoInfo}>
              <Image source={IMAGES.logo} style={styles.logoImage} />
            </View>
          </View>

          <View>
            {profiles.map(profile => (
              <View key={profile.id}>
                <View style={styles.upperSection}>
                  <View style={styles.profileInfo}>
                    <Image
                      source={
                        profile.image ? {uri: profile.image} : IMAGES.profile
                      } // 프로필 이미지 URL 대체 가능
                      style={styles.profileImage}
                    />
                  </View>
                </View>

                <View style={styles.profileTextContainer}>
                  <Text style={styles.nickname}>{profile.nickName}</Text>
                  <Text style={styles.username}>{profile.name}</Text>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>보유 뱃지</Text>
                    {profile.badge.map((badge, index) => (
                      <Image
                        key={index}
                        source={badge.image}
                        style={styles.badge}
                      />
                    ))}
                  </View>
                <View style={styles.profileTextContainer}>
                  <Text style={styles.nickname}>{profile.nickName}</Text>
                  <Text style={styles.username}>{profile.name}</Text>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>보유 뱃지</Text>
                    {profile.badge.map((badge, index) => (
                      <Image
                        key={index}
                        source={badge.image}
                        style={styles.badge}
                      />
                    ))}
                  </View>

                  <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreText}>...</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
                  <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreText}>...</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* 인증하기 버튼들 */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.certifyButton}
              onPress={handleSelfCertify}>
              <Text style={styles.buttonText}>혼자 인증하기</Text>
              <Image source={IMAGES.self} style={styles.buttons} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.certifyButton2}>
              <Text style={styles.buttonText}>함께 인증하기</Text>
              <Image source={IMAGES.together} style={styles.buttons} />
            </TouchableOpacity>
          </View>

          {/* 보유 콘텐츠 및 현재 일수 */}
          <View style={styles.frozenSection}>
            <Text style={styles.frozenTitle}>보유 프리즈</Text>
            <View style={styles.frozenDetailContainer}>
              {freezes.map((freeze, index) => (
                <View key={index}>
                  <Text style={styles.frozenDetailText}>
                    현재 총 <Text style={styles.frozenCount}>{freeze.num}</Text>{' '}
                    개의 프리즈를 보유하고 있습니다.
                  </Text>
                </View>
              ))}
              <TouchableOpacity style={styles.useFrozenButton}>
                <View style={styles.frozenText}>
                  <Image source={IMAGES.freeze} style={styles.freeze} />
                  <Text style={styles.useFrozenButtonText}>
                    프리즈 사용하기
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.frozenNote}>
              ※ 프리즈는 잔다를 대신 채워줄 수 있는 잔디 채우기권입니다!
            </Text>
          </View>

          {/* 현재 일수 표시 */}
          <View style={styles.currentDaySection}>
            <Text style={styles.currentDayText}>
              현재<Text style={styles.dayCount}> 43</Text>일 째!
            </Text>
          </View>

          {/* 달력 부분 */}
          <View style={styles.calendarContainer}>
            <CalendarScreen />
          </View>
        </ScrollView>
        <BottomBar />

        {/* 인증 결과 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: width,
    height: height,
  },
  logoSection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoInfo: {
    flexDirection: 'row',
  },
  logoImage: {
    width: 80,
    height: 50,
    left: 20,
    resizeMode: 'contain',
  },
  upperSection: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#86C0AE',
  },
  profileInfo: {
    flexDirection: 'row',
    flex: 1,
    position: 'absolute',
  },
  profileImage: {
    width: 100,
    height: 100,
    marginTop: 50,
    left: 30,
  },
  profileTextContainer: {
    marginLeft: 15,
    marginTop: 50,
    flexDirection: 'row',
  },
  nickname: {
    fontSize: 12,
    color: '#009499',
    flexDirection: 'row',
    marginLeft: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: -10,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginLeft: 100,
    color: '#009499',
    position: 'relative',
  },
  badgeText: {
    fontSize: 14,
    color: '#777',
    flexDirection: 'row',
    marginTop: -30,
    position: 'absolute',
  },
  badge: {
    width: 35,
    height: 35,
    marginRight: 7,
    resizeMode: 'contain',
  },
  moreButton: {
    color: '#009499',
  },
  moreText: {
    fontSize: 20,
    color: '#009499',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  certifyButton: {
    backgroundColor: '#86C0AE',
    width: 150,
    height: 100,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 3,
    marginHorizontal: 10,
  },
  certifyButton2: {
    backgroundColor: '#1AA5AA',
    width: 150,
    height: 100,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 3,
    marginHorizontal: 10,
  },
  buttonText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14, // 텍스트 크기
    fontWeight: 'bold', // 텍스트 두께
  },
  buttons: {
    width: 130, // 이미지의 가로 크기
    height: 55, // 이미지의 세로 크기
    resizeMode: 'contain',
    marginTop: 10,
  },
  frozenSection: {
    padding: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    left: 30,
    marginBottom: 10,
  },
  frozenTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#838F8F',
    marginBottom: 5,
  },
  frozenDetailContainer: {
    flexDirection: 'row',
    width: 230,
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 3,
  },
  frozenDetailText: {
    fontSize: 10,
    color: '#333',
  },
  frozenCount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#12A5B0',
  },
  useFrozenButton: {
    backgroundColor: '#1AA5AA',
    paddingHorizontal: 15,
    borderRadius: 3,
    height: 50,
    left: 27,
    flexDirection: 'row',
    alignItems: 'center', // 중앙 정렬 추가
    justifyContent: 'center', // 중앙 정렬 추가
  },
  frozenText: {
    flexDirection: 'row',
    alignItems: 'center', // 중앙 정렬 추가
  },
  useFrozenButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  freeze: {
    right: 5,
  },
  frozenNote: {
    fontSize: 9,
    color: '#009499',
    marginTop: 5,
  },
  currentDaySection: {
    padding: 20,
    alignItems: 'flex-start',
  },
  dayCount: {
    fontSize: 24,
    color: '#009499',
  },
  currentDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#E0F7FA',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#333',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'NanumSquareNeo-aLt',
  },
  closeButton: {
    backgroundColor: '#1AA5AA',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
