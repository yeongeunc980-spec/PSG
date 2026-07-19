import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useStore } from '../store/useStore';
import { getSaleById, deleteSale } from '../services/database';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Sale } from '../types/index';

interface DetailScreenProps {
  route: any;
  navigation: any;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  const storeDeleteSale = useStore((state) => state.deleteSale);

  const saleId = route.params?.saleId;

  useEffect(() => {
    loadSaleDetail();
  }, [saleId]);

  const loadSaleDetail = async () => {
    try {
      setLoading(true);
      const result = await getSaleById(saleId);
      setSale(result);
    } catch (error) {
      console.error('Load detail error:', error);
      Alert.alert('오류', '판매 내역을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('삭제', '이 판매 내역을 삭제하시겠습니까?', [
      { text: '취소', onPress: () => {} },
      {
        text: '삭제',
        onPress: async () => {
          try {
            const result = await deleteSale(saleId);
            if (result) {
              storeDeleteSale(saleId);
              Alert.alert('성공', '판매 내역이 삭제되었습니다.');
              navigation.goBack();
            } else {
              Alert.alert('오류', '삭제에 실패했습니다.');
            }
          } catch (error) {
            Alert.alert('오류', '예상치 못한 오류가 발생했습니다.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!sale) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>판매 내역을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const paymentMethods: Record<string, string> = {
    cash: '현금',
    transfer: '계좌이체',
    credit: '미수금',
  };

  const formattedDate = format(new Date(sale.saleDate), 'yyyy년 MM월 dd일', {
    locale: ko,
  });

  const createdDate = format(new Date(sale.createdAt), 'PPP p', { locale: ko });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
      </View>

      <Card elevated>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>업체명</Text>
            <Text style={styles.infoValue}>{sale.companyName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>판매일</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>품목</Text>
            <Text style={styles.infoValue}>{sale.productName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>수량</Text>
            <Text style={styles.infoValue}>{sale.quantity}개</Text>
          </View>
        </View>
      </Card>

      <Card elevated>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제 정보</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>수금액</Text>
            <Text style={styles.infoValueAmount}>
              ₩{sale.saleAmount.toLocaleString('ko-KR')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제수단</Text>
            <Text
              style={[
                styles.infoValue,
                getPaymentMethodStyle(sale.paymentMethod),
              ]}
            >
              {paymentMethods[sale.paymentMethod]}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>기록 시간</Text>
            <Text style={styles.infoValue}>{createdDate}</Text>
          </View>
        </View>
      </Card>

      {sale.signature && (
        <Card elevated>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>서명</Text>
            <Image
              source={{ uri: sale.signature }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
            <Text style={styles.signatureNote}>가게에서 산소통을 받았음을 확인하는 서명</Text>
          </View>
        </Card>
      )}

      <View style={styles.actionContainer}>
        <Button
          title="삭제"
          onPress={handleDelete}
          variant="danger"
          size="large"
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const getPaymentMethodStyle = (method: string) => {
  const styleMap: Record<string, any> = {
    cash: { color: '#059669', fontWeight: '700' },
    transfer: { color: '#0891B2', fontWeight: '700' },
    credit: { color: '#DC2626', fontWeight: '700' },
  };
  return styleMap[method] || { color: '#6B7280' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  infoValueAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
    flex: 1,
    textAlign: 'right',
  },
  signatureImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 12,
  },
  signatureNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});
