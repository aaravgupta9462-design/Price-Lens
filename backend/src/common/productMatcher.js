/**
 * Product Matching Engine
 * Computes a weighted confidence score (0 - 100) between two products.
 * Prevents variant mismatching (e.g. 128GB vs 256GB, 55" vs 65").
 */

export const calculateMatchScore = (sourceProd, targetProd) => {
  if (!sourceProd || !targetProd) return 0;

  // 1. Direct ID / Identifier match (100% Exact)
  if (
    (sourceProd.sku && sourceProd.sku === targetProd.sku) ||
    (sourceProd.gtin && sourceProd.gtin === targetProd.gtin) ||
    (sourceProd.productId && sourceProd.productId === targetProd.productId)
  ) {
    return 100;
  }

  // 2. Strict Storage / Spec Mismatch Check (Disqualify if storage/RAM/size differ)
  if (sourceProd.storage && targetProd.storage && sourceProd.storage !== targetProd.storage) {
    return 30; // Storage mismatch (e.g., 128GB vs 256GB) -> Reject as exact match
  }

  if (sourceProd.ram && targetProd.ram && sourceProd.ram !== targetProd.ram) {
    return 35; // RAM mismatch
  }

  if (sourceProd.size && targetProd.size && sourceProd.size !== targetProd.size) {
    return 35; // Display size mismatch (e.g. 55" vs 65")
  }

  let score = 0;

  // Brand Match (25 Points)
  const sourceBrand = (sourceProd.brand || '').toLowerCase();
  const targetBrand = (targetProd.brand || '').toLowerCase();
  if (sourceBrand && targetBrand && (sourceBrand === targetBrand || sourceBrand.includes(targetBrand) || targetBrand.includes(sourceBrand))) {
    score += 25;
  }

  // Model Match (35 Points)
  const sourceModel = (sourceProd.model || '').toLowerCase();
  const targetModel = (targetProd.model || '').toLowerCase();
  if (sourceModel && targetModel && (sourceModel === targetModel || sourceModel.includes(targetModel) || targetModel.includes(sourceModel))) {
    score += 35;
  }

  // Variant / Specs Match (20 Points)
  const sourceVariant = (sourceProd.variant || '').toLowerCase();
  const targetVariant = (targetProd.variant || '').toLowerCase();
  if (sourceVariant && targetVariant && (sourceVariant === targetVariant || sourceVariant.includes(targetVariant))) {
    score += 20;
  } else if (!sourceVariant || !targetVariant) {
    score += 10;
  }

  // Title String Tokens Overlap (20 Points)
  const sourceTokens = tokenize(sourceProd.title);
  const targetTokens = tokenize(targetProd.title);
  const overlap = sourceTokens.filter((t) => targetTokens.includes(t)).length;
  const tokenRatio = overlap / Math.max(sourceTokens.length, targetTokens.length, 1);
  score += Math.round(tokenRatio * 20);

  return Math.min(Math.max(score, 0), 100);
};

export const classifyMatch = (score) => {
  if (score >= 95) return { type: 'EXACT_MATCH', label: 'Exact Match', color: '#10B981', badgeClass: 'best' };
  if (score >= 85) return { type: 'STRONG_MATCH', label: 'Very Strong Match', color: '#2563EB', badgeClass: 'strong' };
  if (score >= 70) return { type: 'POSSIBLE_MATCH', label: 'Possible Match', color: '#F59E0B', badgeClass: 'possible' };
  return { type: 'LOW_MATCH', label: 'Similar Product', color: '#64748B', badgeClass: 'similar' };
};

const tokenize = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
};
