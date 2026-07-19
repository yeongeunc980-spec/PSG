import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

interface SignaturePadComponentProps {
  onSaved: (signature: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const SignaturePadComponent: React.FC<SignaturePadComponentProps> = ({
  onSaved,
  onCancel,
  loading = false,
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    signatureRef.current?.readSignature();
  };

  const handleOK = (signature: string) => {
    onSaved(signature);
  };

  const handleEmpty = () => {
    Alert.alert('서명이 필요합니다', '서명을 그려주세요.');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>서명</Text>
        <Text style={styles.subtitle}>손가락으로 서명을 그려주세요</Text>
      </View>

      <SignatureCanvas
        ref={signatureRef}
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText=""
        clearText="초기화"
        confirmText="저장"
        webStyle={`.m-signature-pad--footer
          .button {
            background-color: #2563EB;
            color: white;
          }
          .m-signature-pad {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }`}
        style={styles.canvas}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClear}
          disabled={loading}
        >
          <Text style={styles.clearButtonText}>초기화</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>서명 저장</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  canvas: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  clearButtonText: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
