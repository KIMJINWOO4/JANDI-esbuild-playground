// src/screens/HomeScreen.tsx

import React, {useState, useEffect} from 'react';
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
import {getMemberData, Member} from '../api/profile';
import {getBadges, Badge} from '../api/badge';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../utils/locationUtils';
import {SERVICE_AREA, isPointInPolygon, Coordinate} from '../utils/serviceArea';
import {getItem, setItem} from '../api/asyncStorage';
const HomeScreen = () => {
  // 모달 상태 관리
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [member, setMember] = useState<Member | null>(null);
  const [badges, setBadges] = useState<Badge[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const IMAGES = {
    profile: require('../../assets/images/illustration/typeThree.png'),
    logo: require('../../assets/images/illustration/logo.png'),
    self: require('../../assets/images/illustration/typeTwo.png'),
    together: require('../../assets/images/illustration/typeOne.png'),
    freeze: require('../../assets/images/illustration/freeze.png'),
    iIcon: require('../../assets/images/icons/iIcon.png'),
    moreIcon: require('../../assets/images/icons/moreIcon2.png'),
  };

  const BADGES = [
    require('../../assets/images/badge/badge1.png'),
    require('../../assets/images/badge/badge2.png'),
    require('../../assets/images/badge/badge3.png'),
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

      const isInside = isPointInPolygon(userCoordinate, SERVICE_AREA);

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

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const memberData = await getMemberData();
        if (memberData) {
          setMember(memberData);
          const badgesData = await getBadges(memberData.id); // 회원 ID로 뱃지 데이터 가져오기
          if (badgesData) {
            setBadges(badgesData);
          } else {
            setModalMessage('뱃지를 불러오는 데 실패했습니다.');
            setModalVisible(true);
          }
        } else {
          setModalMessage('프로필을 불러오는 데 실패했습니다.');
          setModalVisible(true);
        }
      } catch (error) {
        setModalMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        setModalVisible(true);
      }
    };

    fetchMember();
  }, []);

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

          {member && (
            <View>
              <View style={styles.upperSection}>
                <View style={styles.profileInfo}>
                  <Image
                    source={
                      member.profileImage
                        ? {uri: member.profileImage}
                        : IMAGES.profile
                    }
                    style={styles.profileImage}
                  />
                </View>
              </View>

              <View style={styles.profileTextContainer}>
                <Text style={styles.nickname}>{member.mainTitle}</Text>
                <Text style={styles.username}>{member.name}</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>보유 뱃지</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {badges && badges.length > 0 ? (
                      <>
                        {badges.slice(0, 3).map(badge => (
                          <Image
                            key={badge.id}
                            source={BADGES[badge.fileName]}
                            style={styles.badge}
                          />
                        ))}
                        {badges.length > 0 && (
                          <TouchableOpacity
                            onPress={() => {
                              console.log('... 버튼 클릭됨');

                              setShowModal(true);
                            }}
                            style={styles.moreButton}>
                            <Text style={styles.moreText}>...</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <Text>보유한 뱃지가 없습니다.</Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

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

          {/* 보유 프리즈 및 현재 일수 */}
          {member && (
            <View style={styles.frozenSection}>
              <Text style={styles.frozenTitle}>보유 프리즈</Text>
              <View style={styles.frozenDetailContainer}>
                <Text style={styles.frozenDetailText}>
                  현재 총{' '}
                  <Text style={styles.frozenCount}>{member.freezeCount}</Text>{' '}
                  개의 프리즈를 보유하고 있습니다.
                </Text>
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
                <Image source={IMAGES.iIcon} style={styles.setiIcon} /> 프리즈는
                잔디를 대신 채워줄 수 있는 잔디 채우기권입니다!
              </Text>
            </View>
          )}
          {/* 현재 일수 표시 */}

          {/* 달력 부분 */}
          <View>{member && <CalendarScreen userId={member.id} />}</View>
        </ScrollView>
        <BottomBar />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              {/* 모달 헤더 */}
              <View style={styles.modalHeaderContainer}>
                <Text style={styles.modalHeaderText}>프로필 뱃지 </Text>
                <Text style={styles.modalHeaderHighlight}>
                  총 {badges ? badges.length : 0}개 보유 중
                </Text>
              </View>
              <ScrollView style={styles.modalScrollView}>
                {badges &&
                  badges.map(badge => (
                    <View key={badge.id} style={styles.modalBadge}>
                      <Image
                        source={BADGES[badge.fileName]}
                        style={styles.modalBadgeImage}
                      />
                      <View style={styles.modalBadgeInfo}>
                        <Text style={styles.modalBadgeName}>{badge.name}</Text>
                        <Text style={styles.modalBadgeDescription}>
                          {badge.description}
                        </Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    fontWeight: '700',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: -10,
    fontFamily: 'NanumSquareNeo-Variable',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginLeft: width * 0.15,
    color: '#009499',
    position: 'relative',
  },
  badgeText: {
    fontSize: 13,
    color: '#777',
    flexDirection: 'row',
    marginTop: -30,
    position: 'absolute',
    fontFamily: 'NanumSquareNeo-Variable',
    fontWeight: 'bold',
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
  moreImage: {
    marginTop: 8,
    marginLeft: 15,
    marginRight: 5,
  },
  moreText: {
    fontSize: 20,
    color: '#009499',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.05,
  },
  certifyButton: {
    backgroundColor: '#86C0AE',
    width: width * 0.4,
    height: height * 0.15,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 3,
  },
  certifyButton2: {
    backgroundColor: '#1AA5AA',
    width: width * 0.4,
    height: height * 0.15,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 3,
  },
  buttonText: {
    marginTop: 10,
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  buttons: {
    width: width * 0.3,
    height: height * 0.08,
    resizeMode: 'contain',
    marginTop: 10,
  },
  frozenSection: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  frozenTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#838F8F',
    marginBottom: height * 0.005,
    fontFamily: 'NanumSquareNeo-Variable',
  },
  frozenDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderRadius: 3,
  },
  frozenDetailText: {
    flex: 1, // 텍스트가 남은 공간을 차지하도록 설정
    fontSize: width * 0.035,
    color: '#333',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  frozenCount: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#12A5B0',
  },
  useFrozenButton: {
    backgroundColor: '#1AA5AA',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.03,
  },
  frozenText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  useFrozenButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  freeze: {
    width: width * 0.05,
    height: width * 0.05,
    resizeMode: 'contain',
    marginRight: width * 0.01,
  },
  frozenNote: {
    fontSize: width * 0.03,
    color: '#009499',
    flexDirection: 'row', // 가로로 정렬
    alignItems: 'center',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  setiIcon: {
    width: width * 0.03,
    height: height * 0.03,
    resizeMode: 'contain',
    marginRight: width * 0.03,
  },

  // 모달 스타일
  modalHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.02,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: width * 0.8,
    maxHeight: height * 0.6,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: width * 0.05,
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
    marginBottom: height * 0.02,
    textAlign: 'left',
    fontSize: width * 0.04,
    fontWeight: '700',
    fontFamily: 'NanumSquareNeo-Variable',
  },
  closeButton: {
    backgroundColor: '#1AA5AA',
    borderRadius: 4,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#E0E0E0', // 회색 네모 배경
    borderRadius: 5,
    padding: 10,
  },
  modalBadgeImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: 'contain',
  },
  modalBadgeInfo: {
    flex: 1,
  },
  modalBadgeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalBadgeDescription: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
  },
  modalHeaderText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareNeo-Variable',
    color: '#000',
    textAlign: 'left',
  },

  modalHeaderHighlight: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareNeo-Variable',
    color: '#1AA5AA',
    paddingHorizontal: 5,
    borderRadius: 3,
    marginTop: 3,
  },
  modalScrollView: {
    width: '100%',
    marginBottom: height * 0.02,
  },
});
