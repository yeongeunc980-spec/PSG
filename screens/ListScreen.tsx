import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useStore } from '../store/useStore';
import { getAllSales } from '../services/database';
import { exportToExcel } from '../services/excelService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Sale } from '../types/index';

interface ListScreenProps {
  navigation: any;
}

export const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const sales = useStore((state) => state.getAllSales());
  const setSales = useStore((state) => state.setSales);

  useFocusEffect(
    React.useCallback(() => {
      loadSales();
    }, [])
  );

  const loadSales = async () => {
    try {
      const dbSales = await getAllSales();
      setSales(dbSales);
    } catch (error) {
      console.error('Load sales error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSales();
    setRefreshing(false);
  };

  const handleExport = async () => {
    if (sales.length === 0) {
      Alert.alert('알림', '내보낼 데이터가 없습니다.');
      return;
    }

    setExporting(true);
    try {
      const result = await exportToExcel(sales);
      if (result) {
        Alert.alert('성공', 'Excel 파일로 내보내기가 완료되었습니다.');
      } else {
        Alert.alert('오류', 'Excel 내보내기에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '예상치 못한 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const renderSaleItem = ({ item }: { item: Sale }) => {
    const paymentMethods: Record<string, string> = {
      cash: '현금',
      transfer: '계좌이체',
      credit: '미수금',
    };

    const formattedDate = format(new Date(item.saleDate), 'MMM dd, yyyy', { locale: ko });

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Detail', {
            saleId: item.id,
          })
        }
      >
        <Card elevated>
          <View style={styles.itemHeader}>
            <View style={styles.dateSection}>
              <Text style={styles.saleDate}>{formattedDate}</Text>
              <Text style={styles.companyName}>{item.companyName}</Text>
            </View>
            <View style={styles.amountSection}>
              <Text style={styles.saleAmount}>
                ₩{item.saleAmount.toLocaleString('ko-KR')}
              </Text>
            </View>
          </View>

          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>품목:</Text>
              <Text style={styles.detailValue}>{item.productName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>수량:</Text>
              <Text style={styles.detailValue}>{item.quantity}개</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>결제:</Text>
              <Text style={[styles.detailValue, getPaymentMethodStyle(item.paymentMethod)]}>
                {paymentMethods[item.paymentMethod]}
              </Text>
            </View>
          </View>

          <View style={styles.itemFooter}>
            <Text style={styles.footerText}>상세보기 →</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>판매 내역 리스트</Text>
        <Text style={styles.headerSubtitle}>총 {sales.length}건</Text>
      </View>

      {sales.length > 0 ? (
        <>
          <FlatList
            data={sales}
            renderItem={renderSaleItem}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footerAction}>
            <Button
              title="Excel로 내보내기"
              onPress={handleExport}
              loading={exporting}
              size="large"
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>판매 내역이 없습니다</Text>
          <Text style={styles.emptyStateSubtitle}>새로운 판매 내역을 입력해주세요</Text>
        </View>
      )}
    </View>
  );
};

const getPaymentMethodStyle = (method: string) => {
  const styleMap: Record<string, any> = {
    cash: { color: '#059669' },
    transfer: { color: '#0891B2' },
    credit: { color: '#DC2626' },
  };
  return styleMap[method] || { color: '#6B7280' };
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateSection: {
    flex: 1,
  },
  saleDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  amountSection: {
    justifyContent: 'center',
  },
  saleAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  itemDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 50,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  itemFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  footerAction: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
