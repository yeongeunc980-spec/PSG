import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const sales = useStore((state) => state.getAllSales());

  const handleClearAll = () => {
    Alert.alert(
      '모두 삭제',
      '정말로 모든 판매 내역을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', onPress: () => {} },
        {
          text: '삭제',
          onPress: () => {
            Alert.alert('성공', '모든 데이터가 삭제되었습니다.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>통계</Text>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>전체 판매 건수</Text>
            <Text style={styles.statValue}>{sales.length}건</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 판매액</Text>
            <Text style={styles.statValue}>
              ₩{sales.reduce((sum, s) => sum + s.saleAmount, 0).toLocaleString('ko-KR')}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 판매 수량</Text>
            <Text style={styles.statValue}>
              {sales.reduce((sum, s) => sum + s.quantity, 0)}개
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>애플리케이션 버전</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>
      </Card>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={handleClearAll}
        >
          <Text style={styles.dangerButtonText}>모든 데이터 삭제</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
