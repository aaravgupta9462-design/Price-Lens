import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Share2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const ShareModal = () => {
  const { shareModal, closeShareModal } = useDashboard();
  const [copied, setCopied] = useState(false);

  if (!shareModal.open) return null;

  const { productName, platform, url } = shareModal;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} on ${platform} found via PriceLens!`,
          url: url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="db-overlay" onClick={closeShareModal}>
      <div className="db-modal" onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-head">
          <div>
            <div className="db-modal-title">Share Product Link</div>
            <div className="db-modal-subtitle">{productName} ({platform})</div>
          </div>
          <button className="db-modal-close-btn" onClick={closeShareModal} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="db-url-box">
          <span className="db-url-text">{url}</span>
          <button className={`db-copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy
              </>
            )}
          </button>
        </div>

        <div className="db-share-options">
          <button className="db-share-option-btn" onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
            <div className="db-share-option-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
              <ExternalLink size={18} />
            </div>
            <div className="db-share-option-text">
              <span className="db-share-opt-name">Open on {platform}</span>
              <span className="db-share-opt-sub">Visit original store page directly</span>
            </div>
          </button>

          <button className="db-share-option-btn" onClick={handleNativeShare}>
            <div className="db-share-option-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
              <Share2 size={18} />
            </div>
            <div className="db-share-option-text">
              <span className="db-share-opt-name">Share via Apps</span>
              <span className="db-share-opt-sub">Send to WhatsApp, Telegram, or Messages</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
