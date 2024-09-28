import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ProfileImage from './ProfileImage';
import StudyButton from './StudyButton';

interface ProfileCardProps {
  title: string;
  name: string;
  studyMessage: string;
  timerValue: string;
  totalTimeValue: string;
  isRecording: boolean;
  onStudyButtonPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  name,
  studyMessage,
  timerValue,
  totalTimeValue,
  isRecording,
  onStudyButtonPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <ProfileImage title={title} name={name} />
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{studyMessage}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.timerLabel}>현재 공부 시간</Text>
        <Text style={styles.timer}>{timerValue}</Text>
        <Text style={styles.totalTimeLabel}>전체 공부 시간</Text>
        <Text style={styles.totalTime}>{totalTimeValue}</Text>
        <StudyButton isRecording={isRecording} onPress={onStudyButtonPress} />
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  messageBubble: {
    backgroundColor: '#DEEFEA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'NanumSquareNeo-eHv',
  },
  rightSection: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  timerLabel: {
    fontSize: 14,
    color: '#454545',
    fontFamily: 'NanumSquareNeo-eHv',
  },
  timer: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14B8A6',
  },
  totalTimeLabel: {
    fontSize: 12,
    color: '#454545',
    fontFamily: 'NanumSquareNeo-eHv',
    marginTop: 10,
  },
  totalTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#14B8A6',
  },
});
