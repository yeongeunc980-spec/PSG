import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/web.css';

interface SaleItem {
  productName: string;
  quantity: number;
}

interface Sale {
  id: string;
  companyName: string;
  saleDate: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'transfer' | 'credit';
  signature: string;
}

interface MasterData {
  companies: string[];
  products: string[];
}

const WebApp: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeTab, setActiveTab] = useState<'입력' | '리스트' | '설정' | '마스터'>('리스트');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

  // 필터 상태
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterProduct, setFilterProduct] = useState('');

  // 입력 폼 상태
  const getToday = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    saleDate: getToday(),
    companyName: '',
    items: [{ productName: '', quantity: '' }],
    totalAmount: '',
    paymentMethod: 'cash' as const,
  });

  // 수정 모드
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // 서명 관련
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  // 거래명세서
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  // 마스터 데이터
  const [masterData, setMasterData] = useState<MasterData>({
    companies: ['의료용품점', '병원', '약국', '보건소'],
    products: ['산소통(대)', '산소통(중)', '산소통(소)', '산소 충전'],
  });

  const [masterText, setMasterText] = useState('');
  const [masterType, setMasterType] = useState<'판매처' | '품목'>('판매처');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mockData: Sale[] = [
        {
          id: '1',
          companyName: '의료용품점',
          saleDate: '2026-07-19',
          items: [{ productName: '산소통(대)', quantity: 5 }],
          totalAmount: 150000,
          paymentMethod: 'cash',
          signature: ''
        },
        {
          id: '2',
          companyName: '병원',
          saleDate: '2026-07-18',
          items: [{ productName: '산소통(중)', quantity: 10 }],
          totalAmount: 300000,
          paymentMethod: 'transfer',
          signature: ''
        },
        {
          id: '3',
          companyName: '약국',
          saleDate: '2026-07-17',
          items: [{ productName: '산소통(소)', quantity: 3 }],
          totalAmount: 90000,
          paymentMethod: 'cash',
          signature: ''
        },
      ];

      const saved = localStorage.getItem('sales');
      const savedMaster = localStorage.getItem('masterData');

      setSales(saved ? JSON.parse(saved) : mockData);
      if (savedMaster) {
        setMasterData(JSON.parse(savedMaster));
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    setSignatureData(canvasRef.current.toDataURL());
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setSignatureData('');
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || formData.items.length === 0 || !formData.totalAmount || !signatureData) {
      alert('모든 필드를 입력해주세요. (서명 포함)');
      return;
    }

    const validItems = formData.items.filter(item => item.productName && item.quantity);
    if (validItems.length === 0) {
      alert('최소 하나의 품목을 입력해주세요.');
      return;
    }

    if (editingId) {
      // 수정 모드
      const updated = sales.map(sale =>
        sale.id === editingId
          ? {
              ...sale,
              companyName: formData.companyName,
              saleDate: formData.saleDate,
              items: validItems,
              totalAmount: parseInt(formData.totalAmount) || 0,
              paymentMethod: formData.paymentMethod,
            }
          : sale
      );
      setSales(updated);
      localStorage.setItem('sales', JSON.stringify(updated));
      alert('판매 기록이 수정되었습니다.');
      setEditingId(null);
    } else {
      // 새로 추가
      const newSale: Sale = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        saleDate: formData.saleDate,
        items: validItems,
        totalAmount: parseInt(formData.totalAmount) || 0,
        paymentMethod: formData.paymentMethod,
        signature: signatureData
      };

      const updated = [newSale, ...sales];
      setSales(updated);
      localStorage.setItem('sales', JSON.stringify(updated));
      alert('판매 기록이 저장되었습니다.');
    }

    setFormData({
      saleDate: getToday(),
      companyName: '',
      items: [{ productName: '', quantity: '' }],
      totalAmount: '',
      paymentMethod: 'cash',
    });
  };

  const handleEditSale = (sale: Sale) => {
    setEditingId(sale.id);
    setFormData({
      companyName: sale.companyName,
      saleDate: sale.saleDate,
      items: sale.items,
      totalAmount: sale.totalAmount.toString(),
      paymentMethod: sale.paymentMethod,
    });
    setActiveTab('입력');
    window.scrollTo(0, 0);
  };

  const handleDeleteSale = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updated = sales.filter(sale => sale.id !== id);
      setSales(updated);
      localStorage.setItem('sales', JSON.stringify(updated));
      alert('판매 기록이 삭제되었습니다.');
      setShowDetail(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productName: '', quantity: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' ? (value ? parseInt(value) : '') : value
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleImportMaster = () => {
    if (!masterText.trim()) {
      alert('텍스트를 입력해주세요.');
      return;
    }

    const lines = masterText.split('\n').map(line => line.trim()).filter(line => line);

    if (masterType === '판매처') {
      const updated = {
        ...masterData,
        companies: [...new Set([...masterData.companies, ...lines])]
      };
      setMasterData(updated);
      localStorage.setItem('masterData', JSON.stringify(updated));
      alert(`${lines.length}개의 판매처가 추가되었습니다.`);
    } else {
      const updated = {
        ...masterData,
        products: [...new Set([...masterData.products, ...lines])]
      };
      setMasterData(updated);
      localStorage.setItem('masterData', JSON.stringify(updated));
      alert(`${lines.length}개의 품목이 추가되었습니다.`);
    }

    setMasterText('');
  };

  const handleExportMaster = () => {
    const data = masterType === '판매처' ? masterData.companies : masterData.products;
    const text = data.join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다.');
    }).catch(() => {
      alert('복사 실패. 수동으로 복사해주세요.');
    });
  };

  const handleDeleteCompany = (company: string) => {
    const updated = { ...masterData, companies: masterData.companies.filter(c => c !== company) };
    setMasterData(updated);
    localStorage.setItem('masterData', JSON.stringify(updated));
  };

  const handleDeleteProduct = (product: string) => {
    const updated = { ...masterData, products: masterData.products.filter(p => p !== product) };
    setMasterData(updated);
    localStorage.setItem('masterData', JSON.stringify(updated));
  };

  const downloadInvoiceImage = () => {
    if (!formData.companyName || !formData.totalAmount) {
      alert('필수 정보를 입력해주세요.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('거 래 명 세 서', canvas.width / 2, 60);

    ctx.textAlign = 'left';
    ctx.font = '14px Arial';
    let y = 120;
    ctx.fillText(`판매처: ${formData.companyName}`, 40, y);
    y += 30;
    ctx.fillText(`판매일: ${new Date(formData.saleDate).toLocaleDateString('ko-KR')}`, 40, y);
    y += 30;
    ctx.fillText(`결제수단: ${formData.paymentMethod === 'cash' ? '현금' : formData.paymentMethod === 'transfer' ? '계좌이체' : '미수금'}`, 40, y);
    y += 50;

    ctx.fillText('품목', 40, y);
    ctx.fillText('수량', 450, y);
    y += 20;
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(760, y);
    ctx.stroke();
    y += 30;

    formData.items.forEach(item => {
      if (item.productName && item.quantity) {
        ctx.fillText(item.productName, 40, y);
        ctx.fillText(item.quantity.toString(), 450, y);
        y += 25;
      }
    });

    y += 20;
    ctx.fillStyle = '#666';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`총 수금액: ₩${parseInt(formData.totalAmount).toLocaleString()}`, 720, y);

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `거래명세서_${formData.companyName}_${formData.saleDate}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  };

  const printInvoice = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow || !invoiceRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>거래명세서</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice { max-width: 800px; }
          h1 { text-align: center; margin-bottom: 40px; }
          .info { margin-bottom: 20px; line-height: 1.8; }
          .info p { margin: 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total { margin-top: 20px; font-size: 18px; font-weight: bold; text-align: right; }
          .signature { margin-top: 40px; text-align: center; }
          .signature img { max-width: 200px; height: auto; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <h1>거 래 명 세 서</h1>
          <div class="info">
            <p><strong>판매처:</strong> ${formData.companyName}</p>
            <p><strong>판매일:</strong> ${new Date(formData.saleDate).toLocaleDateString('ko-KR')}</p>
            <p><strong>결제수단:</strong> ${formData.paymentMethod === 'cash' ? '현금' : formData.paymentMethod === 'transfer' ? '계좌이체' : '미수금'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>품목</th>
                <th style="text-align: center; width: 100px;">수량</th>
              </tr>
            </thead>
            <tbody>
              ${formData.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            총 수금액: ₩${parseInt(formData.totalAmount).toLocaleString()}
          </div>
          ${signatureData ? `
            <div class="signature">
              <p><strong>서명:</strong></p>
              <img src="${signatureData}" alt="서명" />
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getFilteredSales = () => {
    return sales.filter(sale => {
      const dateOk = (!filterStartDate || sale.saleDate >= filterStartDate) &&
                     (!filterEndDate || sale.saleDate <= filterEndDate);
      const companyOk = !filterCompany || sale.companyName === filterCompany;
      const productOk = !filterProduct || sale.items.some(item => item.productName === filterProduct);
      return dateOk && companyOk && productOk;
    });
  };

  const downloadExcel = () => {
    const filteredSales = getFilteredSales();
    if (filteredSales.length === 0) {
      alert('조회된 데이터가 없습니다.');
      return;
    }

    // CSV 데이터 생성
    let csvContent = '판매처,품목,수량,판매일,결제수단,수금액\n';

    filteredSales.forEach(sale => {
      const paymentLabel = sale.paymentMethod === 'cash' ? '현금' :
                          sale.paymentMethod === 'transfer' ? '계좌이체' : '미수금';
      sale.items.forEach(item => {
        csvContent += `${sale.companyName},${item.productName},${item.quantity},${sale.saleDate},${paymentLabel},${sale.totalAmount}\n`;
      });
    });

    const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = filteredSales.reduce((sum, sale) =>
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    csvContent += `\n합계,,,,,${totalQuantity},${totalAmount}\n`;

    // Blob 생성 (UTF-8 BOM 포함)
    const BOM = '﻿';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });

    // 다운로드
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `판매기록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSales = getFilteredSales();
  const totalSales = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalQuantity = filteredSales.reduce((sum, sale) =>
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PSG') {
      setIsLoggedIn(true);
      setPassword('');
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    localStorage.removeItem('isLoggedIn');
  };

  useEffect(() => {
    const saved = localStorage.getItem('isLoggedIn');
    if (saved === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="web-app">
        <header className="app-header">
          <h1>🧴 산소통 판매 관리</h1>
        </header>
        <main className="app-content">
          <p>로딩 중...</p>
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="web-app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <h1>🧴 산소통 판매 관리</h1>
              <p className="header-subtitle">판매 기록을 효율적으로 관리하세요</p>
            </div>
          </div>
        </header>
        <main className="app-content">
          <div className="login-container">
            <div className="login-card">
              <h2>🔐 로그인</h2>
              <p className="login-description">접근 권한이 필요합니다</p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>비밀번호</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary">
                  로그인
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="web-app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-title">
              <h1>🧴 산소통 판매 관리</h1>
              <p className="header-subtitle">판매 기록을 효율적으로 관리하세요</p>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="app-content">
        {/* 입력 탭 */}
        {activeTab === '입력' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>✏️ {editingId ? '판매 기록 수정' : '판매 기록 입력'}</h2>
              {editingId && (
                <button onClick={() => {
                  setEditingId(null);
                  setFormData({
                    saleDate: getToday(),
                    companyName: '',
                    items: [{ productName: '', quantity: '' }],
                    totalAmount: '',
                    paymentMethod: 'cash',
                  });
                }} className="btn-cancel">
                  취소
                </button>
              )}
            </div>
            <form onSubmit={handleAddSale} className="input-form">
              <div className="form-group">
                <label>판매일 *</label>
                <input
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>판매처 *</label>
                <select
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                >
                  <option value="">판매처 선택</option>
                  {masterData.companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              <div className="items-section">
                <h3>품목 정보</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="form-group">
                      <label>품목</label>
                      <select
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                        required
                      >
                        <option value="">품목 선택</option>
                        {masterData.products.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>수량</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        placeholder="수량"
                        required
                      />
                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="btn-remove"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn-add-item"
                >
                  + 품목 추가
                </button>
              </div>

              <div className="form-group">
                <label>결제수단 *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                >
                  <option value="cash">현금</option>
                  <option value="transfer">계좌이체</option>
                  <option value="credit">미수금</option>
                </select>
              </div>

              <div className="form-group">
                <label>수금액 *</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  min="0"
                  placeholder="수금액 입력"
                  required
                />
              </div>

              <div className="signature-section">
                <h3>서명 *</h3>
                <div className="signature-canvas-wrapper">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    className="signature-canvas"
                  />
                </div>
                <div className="signature-buttons">
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    지우기
                  </button>
                </div>
                {!signatureData && <p className="signature-hint">캔버스에 서명을 그려주세요</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={printInvoice}
                  disabled={!formData.companyName || formData.items.length === 0 || !formData.totalAmount || !signatureData}
                  className="btn-secondary"
                  style={{ margin: '16px 0 0 0' }}
                >
                  🖨️ 거래명세서 인쇄
                </button>
                <button
                  type="button"
                  onClick={downloadInvoiceImage}
                  disabled={!formData.companyName || formData.items.length === 0 || !formData.totalAmount || !signatureData}
                  className="btn-secondary"
                  style={{ margin: '16px 0 0 0' }}
                >
                  📋 명세서 다운로드
                </button>
              </div>

              <button type="submit" className="btn-primary">
                {editingId ? '수정 완료' : '저장'}
              </button>
            </form>
          </div>
        )}

        {/* 리스트 탭 */}
        {activeTab === '리스트' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>📋 판매 리스트</h2>
            </div>

            <div className="filter-card">
              <h3>조회 필터</h3>
              <div className="filter-grid">
                <div className="filter-group">
                  <label>시작 날짜</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>종료 날짜</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>판매처</label>
                  <select
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                  >
                    <option value="">전체</option>
                    {masterData.companies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>품목</label>
                  <select
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                  >
                    <option value="">전체</option>
                    {masterData.products.map(product => (
                      <option key={product} value={product}>{product}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group filter-actions">
                  <button onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setFilterCompany('');
                    setFilterProduct('');
                  }} className="btn-filter-reset">
                    초기화
                  </button>
                  <button onClick={downloadExcel} className="btn-secondary">
                    📊 엑셀 다운로드
                  </button>
                </div>
              </div>
            </div>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">판매 건수</div>
                <div className="stat-value">{totalSales}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">수금액</div>
                <div className="stat-value">₩{totalAmount.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">판매량</div>
                <div className="stat-value">{totalQuantity}</div>
              </div>
            </div>

            {filteredSales.length === 0 ? (
              <p className="empty-message">조회된 판매 기록이 없습니다.</p>
            ) : (
              <div className="sales-list">
                {filteredSales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()).map((sale) => (
                  <div key={sale.id} className="sale-card" onClick={() => {
                    setSelectedSale(sale);
                    setShowDetail(true);
                  }}>
                    <div className="sale-header">
                      <div className="sale-date-company">
                        <div className="sale-date">{new Date(sale.saleDate).toLocaleDateString('ko-KR')}</div>
                        <div className="sale-company">{sale.companyName}</div>
                      </div>
                      <span className={`payment-badge payment-${sale.paymentMethod}`}>
                        {sale.paymentMethod === 'cash' && '현금'}
                        {sale.paymentMethod === 'transfer' && '계좌이체'}
                        {sale.paymentMethod === 'credit' && '미수금'}
                      </span>
                    </div>
                    <div className="sale-details">
                      {sale.items.map((item, idx) => (
                        <div key={idx} className="item-detail">
                          <span className="product-name">{item.productName}</span>
                          <span className="quantity">{item.quantity}개</span>
                        </div>
                      ))}
                    </div>
                    <div className="sale-footer">
                      <div className="total-amount">
                        <span>수금액</span>
                        <strong>₩{sale.totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 마스터 관리 탭 */}
        {activeTab === '마스터' && (
          <div className="tab-content">
            <h2>🔧 마스터 데이터 관리</h2>

            <div className="master-import-section">
              <h3>엑셀에서 복붙으로 업데이트</h3>
              <div className="form-group">
                <label>타입 선택</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="판매처"
                      checked={masterType === '판매처'}
                      onChange={(e) => setMasterType(e.target.value as '판매처' | '품목')}
                    />
                    판매처
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="품목"
                      checked={masterType === '품목'}
                      onChange={(e) => setMasterType(e.target.value as '판매처' | '품목')}
                    />
                    품목
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>데이터 입력 (줄 단위로 구분)</label>
                <textarea
                  value={masterText}
                  onChange={(e) => setMasterText(e.target.value)}
                  placeholder={`${masterType}를 한 줄에 하나씩 입력하세요.\n예시:\n의료용품점\n병원\n약국`}
                  className="master-textarea"
                />
              </div>

              <button onClick={handleImportMaster} className="btn-primary">추가하기</button>
            </div>

            <div className="master-list-section">
              <div className="master-header">
                <h3>{masterType === '판매처' ? '판매처' : '품목'} 목록</h3>
                <button onClick={handleExportMaster} className="btn-export">📋 복사하기</button>
              </div>

              <div className="master-list">
                {(masterType === '판매처' ? masterData.companies : masterData.products).map((item) => (
                  <div key={item} className="master-item">
                    <span>{item}</span>
                    <button
                      onClick={() => masterType === '판매처' ? handleDeleteCompany(item) : handleDeleteProduct(item)}
                      className="btn-delete"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === '설정' && (
          <div className="tab-content">
            <h2>⚙️ 설정</h2>
            <div className="settings-grid">
              <div className="setting-item">
                <label>총 판매 건수</label>
                <p className="setting-value">{sales.length}</p>
              </div>
              <div className="setting-item">
                <label>총 수금액</label>
                <p className="setting-value">₩{sales.reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}</p>
              </div>
              <div className="setting-item">
                <label>총 판매량</label>
                <p className="setting-value">{sales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}</p>
              </div>
              <div className="setting-item">
                <label>앱 버전</label>
                <p className="setting-value">2.1.0</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 상세 조회 모달 */}
      {showDetail && selectedSale && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>판매 기록 상세</h2>
              <button onClick={() => setShowDetail(false)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-item">
                  <label>판매처</label>
                  <p>{selectedSale.companyName}</p>
                </div>
                <div className="detail-item">
                  <label>판매일</label>
                  <p>{new Date(selectedSale.saleDate).toLocaleDateString('ko-KR')}</p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item full">
                  <label>품목 정보</label>
                  <div className="items-detail">
                    {selectedSale.items.map((item, idx) => (
                      <div key={idx} className="item-detail-row">
                        <span className="product">{item.productName}</span>
                        <span className="qty">{item.quantity}개</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>결제수단</label>
                  <p>
                    {selectedSale.paymentMethod === 'cash' && '현금'}
                    {selectedSale.paymentMethod === 'transfer' && '계좌이체'}
                    {selectedSale.paymentMethod === 'credit' && '미수금'}
                  </p>
                </div>
                <div className="detail-item">
                  <label>수금액</label>
                  <p className="amount">₩{selectedSale.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                handleEditSale(selectedSale);
                setShowDetail(false);
              }} className="btn-primary">
                수정
              </button>
              <button onClick={() => {
                handleDeleteSale(selectedSale.id);
              }} className="btn-danger">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <button
          className={`tab-button ${activeTab === '입력' ? 'active' : ''}`}
          onClick={() => setActiveTab('입력')}
        >
          ✏️
        </button>
        <button
          className={`tab-button ${activeTab === '리스트' ? 'active' : ''}`}
          onClick={() => setActiveTab('리스트')}
        >
          📋
        </button>
        <button
          className={`tab-button ${activeTab === '마스터' ? 'active' : ''}`}
          onClick={() => setActiveTab('마스터')}
        >
          🔧
        </button>
        <button
          className={`tab-button ${activeTab === '설정' ? 'active' : ''}`}
          onClick={() => setActiveTab('설정')}
        >
          ⚙️
        </button>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<WebApp />);
