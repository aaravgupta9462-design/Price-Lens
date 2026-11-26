import React, { useState } from 'react';
import { Star, ArrowRight, ExternalLink, Tag, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PLATFORM_COMPARISONS, PRODUCTS, formatPrice } from '../../data/mockData';
import StoreLogo from './StoreLogo';
import { getAffiliateUrl } from '../../utils/affiliate';

export const CompareStoresCard = () => {
  const { selectedProductId, viewProductDetail, showToast, customStoreLink } = useDashboard();
  const [selectedBank, setSelectedBank] = useState('all');

  // Find selected or default product
  const product =
    PRODUCTS.find((p) => p.id === selectedProductId) ||
    PRODUCTS.find((p) => p.id === 'iphone-16-128');

  const baseComparisons =
    PLATFORM_COMPARISONS[selectedProductId] ||
    PLATFORM_COMPARISONS['iphone-16-128'] ||
    [];

  // Override with user's pasted link for that platform if active
  const comparisons = baseComparisons.map((row) => {
    if (
      customStoreLink &&
      customStoreLink.store &&
      customStoreLink.url &&
      (row.platform.toLowerCase().includes(customStoreLink.store.toLowerCase()) ||
        customStoreLink.store.toLowerCase().includes(row.platform.toLowerCase()))
    ) {
      return {
        ...row,
        url: customStoreLink.url,
        isCustomPasted: true,
      };
    }
    return row;
  });

  const calculateEffectivePrice = (row, bank) => {
    if (bank === 'all') return { price: row.price, discount: 0, label: null };
    const store = row.platform.toLowerCase();

    if (bank === 'hdfc') {
      if (store.includes('amazon') || store.includes('croma')) {
        return { price: row.price - 2000, discount: 2000, label: 'HDFC Instant -₹2,000' };
      }
    } else if (bank === 'icici') {
      if (store.includes('amazon')) {
        return { price: row.price - 2500, discount: 2500, label: 'ICICI Amazon Pay -₹2,500' };
      }
    } else if (bank === 'sbi') {
      if (store.includes('flipkart') || store.includes('reliance')) {
        return { price: row.price - 1500, discount: 1500, label: 'SBI Instant -₹1,500' };
      }
    } else if (bank === 'axis') {
      if (store.includes('flipkart')) {
        const discount = Math.min(3000, Math.round(row.price * 0.05));
        return { price: row.price - discount, discount, label: `Axis 5% (-₹${discount.toLocaleString('en-IN')})` };
      }
    }
    return { price: row.price, discount: 0, label: null };
  };

  const handleOpenStore = (storeUrl, storeName) => {
    if (storeUrl) {
      const affiliateUrl = getAffiliateUrl(storeUrl, storeName);
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      if (showToast) showToast(`Redirecting to verified checkout on ${storeName}...`, 'success');
    }
  };

  return (
    <div className="pl-compare-table-card">
      {/* Card Header: Product Summary & Action */}
      <div className="pl-compare-card-header">
        <div className="pl-compare-product-info">
          <div className="pl-compare-thumb-box">
            <img
              src={product.image || '/products/iphone-16.jpg'}
              alt={product.name}
              className="pl-compare-thumb-img"
            />
          </div>
          <div className="pl-compare-name-col">
            <span className="pl-compare-header-eyebrow">LIVE MULTI-STORE AUDIT</span>
            <h3 className="pl-compare-name">{product.name}</h3>
            <div className="pl-compare-rating-row">
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span className="pl-compare-rating-text">
                {product.rating || 4.6} ({product.reviewCount ? (typeof product.reviewCount === 'number' ? (product.reviewCount / 1000).toFixed(1) + 'K' : product.reviewCount) : '12.3K'} reviews)
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="pl-compare-view-product-btn"
          onClick={() => viewProductDetail(product.id)}
        >
          <span>Product Spec</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Interactive Bank Card & EMI Effective Price Selector */}
      <div className="pl-effective-price-bar">
        <div className="pl-effective-left">
          <CreditCard size={15} className="text-violet" />
          <span className="pl-effective-label">Calculate Effective Price with Card:</span>
        </div>
        <div className="pl-bank-select-pills">
          <button
            type="button"
            className={`pl-bank-pill ${selectedBank === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedBank('all')}
          >
            Standard MRP
          </button>
          <button
            type="button"
            className={`pl-bank-pill ${selectedBank === 'hdfc' ? 'active' : ''}`}
            onClick={() => setSelectedBank('hdfc')}
          >
            HDFC (-₹2,000)
          </button>
          <button
            type="button"
            className={`pl-bank-pill ${selectedBank === 'icici' ? 'active' : ''}`}
            onClick={() => setSelectedBank('icici')}
          >
            ICICI (-₹2,500)
          </button>
          <button
            type="button"
            className={`pl-bank-pill ${selectedBank === 'sbi' ? 'active' : ''}`}
            onClick={() => setSelectedBank('sbi')}
          >
            SBI (-₹1,500)
          </button>
          <button
            type="button"
            className={`pl-bank-pill ${selectedBank === 'axis' ? 'active' : ''}`}
            onClick={() => setSelectedBank('axis')}
          >
            Axis (5% Off)
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="pl-compare-table-wrapper">
        <table className="pl-compare-table">
          <thead>
            <tr>
              <th scope="col">Store</th>
              <th scope="col">Effective Live Price</th>
              <th scope="col">Bank Offers</th>
              <th scope="col">Delivery</th>
              <th scope="col">Checked</th>
              <th scope="col" className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, idx) => {
              const { price: effectivePrice, discount, label: discountLabel } = calculateEffectivePrice(row, selectedBank);
              const isLowest = row.isLowestPrice || idx === 0;

              return (
                <tr key={row.platform} className={isLowest ? 'pl-lowest-row' : ''}>
                  {/* Store Name & Logo */}
                  <td className="pl-td-store">
                    <div className="pl-store-td-group">
                      <StoreLogo store={row.platform} size="sm" />
                      {row.isCustomPasted && (
                        <span className="pl-custom-pasted-pill" title="This row is connected to your pasted product link">
                          Your Link
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price & Effective Calculation */}
                  <td className="pl-td-price">
                    <div className="pl-td-price-wrapper">
                      <span className="pl-td-price-val">{formatPrice(effectivePrice)}</span>
                      {discount > 0 && (
                        <span className="pl-bank-applied-badge">{discountLabel}</span>
                      )}
                      {isLowest && (
                        <span className="pl-lowest-price-badge">BEST PRICE</span>
                      )}
                    </div>
                  </td>

                  {/* Bank Offer */}
                  <td className="pl-td-bank">
                    {row.bankOffer ? (
                      <div className="pl-bank-offer-pill">
                        <Tag size={11} className="pl-bank-tag-icon" />
                        <span>{row.bankOffer}</span>
                      </div>
                    ) : (
                      <span className="pl-no-offer-text">—</span>
                    )}
                  </td>

                  {/* Delivery */}
                  <td className="pl-td-delivery">
                    <span className="pl-delivery-text">{row.delivery || '2-4 days'}</span>
                  </td>

                  {/* Last Checked */}
                  <td className="pl-td-checked">
                    <span className="pl-checked-text">{row.lastChecked || '10 mins ago'}</span>
                  </td>

                  {/* Action Button: Opens the retailer website to purchase with affiliate tracking */}
                  <td className="pl-td-action text-right">
                    <button
                      type="button"
                      className={`pl-store-view-btn ${isLowest ? 'primary' : ''}`}
                      onClick={() => handleOpenStore(row.url, row.platform)}
                      title={`Open and purchase on ${row.platform}`}
                    >
                      <span>Buy on {row.platform}</span>
                      <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareStoresCard;
