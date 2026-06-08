// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://qiescore-backend.onrender.com';

export interface ScoreResponse {
  totalScore: number;
  grade: string;
  factors: {
    stakingHistory: number;
    repaymentHistory: number;
    walletAge: number;
    liquidationRecord: number;
    assetDiversity: number;
    kycStatus: number;
  };
  history: Array<{
    date: string;
    score: number;
  }>;
  qiePassVerified: boolean;
}

export interface BorrowingPower {
  ltv: string;
  previous: string;
  maxBorrow: string;
  apr: string;
}

/**
 * Calculate credit score for a wallet address
 */
export async function calculateScore(walletAddress: string): Promise<ScoreResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/score/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to calculate score:', error);
    throw error;
  }
}

/**
 * Get score for a wallet address
 */
export async function getScore(walletAddress: string): Promise<ScoreResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/score/${walletAddress}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch score:', error);
    throw error;
  }
}

/**
 * Get borrowing power for a score
 */
export async function getBorrowingPower(score: number): Promise<BorrowingPower> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/borrowing-power`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch borrowing power:', error);
    throw error;
  }
}

/**
 * Health check for backend
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
