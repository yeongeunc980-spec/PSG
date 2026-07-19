import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useStore } from '../store/useStore';
import { insertSale } from '../services/database';
import { Button } from '../components/Button';
import { SignaturePadComponent } from '../components/SignaturePad';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const InputScreen: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [saleDate, setSaleDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'credit'>('cash');
  const [signature, setSignature] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(false);

  const addSale = useStore((state) => state.addSale);

  const handleSignatureSave = (sig: string) => {
    setSignature(sig);
    setShowSignature(false);
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      Alert.alert('입력 오류', '업체명을 입력해주세요.');
      return;
    }
    if (!productName.trim()) {
      Alert.alert('입력 오류', '품목을 입력해주세요.');
      return;
    }
    if (!quantity || isNaN(Number(quantity))) {
      Alert.alert('입력 오류', '수량을 입력해주세요.');
      return;
    }
    if (!saleAmount || isNaN(Number(saleAmount))) {
      Alert.alert('입력 오류', '수금액을 입력해주세요.');
      return;
    }
    if (!signature) {
      Alert.alert('서명 필요', '서명을 진행해주세요.');
      return;
    }

    setLoading(true);
    try {
      const newSale = {
        companyName: companyName.trim(),
        saleDate,
        productName: productName.trim(),
        quantity: parseInt(quantity, 10),
        saleAmount: parseFloat(saleAmount),
        paymentMethod,
        signature,
      };

      addSale(newSale);

      const saleToInsert = {
        id: Date.now().toString(),
        ...newSale,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await insertSale(saleToInsert);

      if (result) {
        Alert.alert('성공', '판매 내역이 저장되었습니다.');
        setCompanyName('');
        setSaleDate(format(new Date(), 'yyyy-MM-dd'));
        setProductName('');
        setQuantity('');
        setSaleAmount('');
        setPaymentMethod('cash');
        setSignature('');
      } else {
        Alert.alert('오류', '데이터 저장에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '예상치 못한 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: '현금' },
    { value: 'transfer', label: '계좌이체' },
    { value: 'credit', label: '미수금' },
  ] as const;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>판매 내역 입력</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>업체명</Text>
            <TextInput
              style={styles.input}
              placeholder="업체명을 입력하세요"
              value={companyName}
              onChangeText={setCompanyName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>판매일</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={styles.dateButtonText}>{saleDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>품목</Text>
            <TextInput
              style={styles.input}
              placeholder="품목을 입력하세요"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>수량</Text>
            <TextInput
              style={styles.input}
              placeholder="수량을 입력하세요"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>수금액</Text>
            <TextInput
              style={styles.input}
              placeholder="수금액을 입력하세요"
              value={saleAmount}
              onChangeText={setSaleAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>결제수단</Text>
            <View style={styles.paymentMethodContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.value}
                  style={[
                    styles.paymentMethodButton,
                    paymentMethod === method.value && styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setPaymentMethod(method.value)}
                >
                  <Text
                    style={[
                      styles.paymentMethodButtonText,
                      paymentMethod === method.value && styles.paymentMethodButtonTextActive,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>서명</Text>
            <TouchableOpacity
              style={styles.signatureButton}
              onPress={() => setShowSignature(true)}
            >
              <Text style={styles.signatureButtonText}>
                {signature ? '✓ 서명 완료' : '서명 진행하기'}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="저장"
            onPress={handleSubmit}
            loading={loading}
            size="large"
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      <Modal visible={showCalendar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>판매일 선택</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Text style={styles.modalCloseButton}>완료</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              current={saleDate}
              onDayPress={(day) => setSaleDate(day.dateString)}
              markedDates={{
                [saleDate]: {
                  selected: true,
                  selectedColor: '#2563EB',
                },
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#2563EB',
                dayTextColor: '#2c3e50',
                textDisabledColor: '#d9e1e8',
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showSignature} animationType="slide">
        <SignaturePadComponent
          onSaved={handleSignatureSave}
          onCancel={() => setShowSignature(false)}
          loading={loading}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
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
  content: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentMethodButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  paymentMethodButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  paymentMethodButtonTextActive: {
    color: '#FFFFFF',
  },
  signatureButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
