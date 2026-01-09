import { createContext, useContext } from 'react';

export interface User {
  id: string;
  balance: number;
  miningRate: number;
  referralCount: number;
  referralEarnings: number;
  totalWithdrawn: number;
  isBlocked: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'watch_ad' | 'join_channel' | 'visit_link' | 'adsgram';
  reward: number;
  completed: boolean;
  url?: string;
  channelId?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  address: string;
  amount: number;
  status: 'pending' | 'reviewing' | 'paid';
  createdAt: string;
}

export interface AppConfig {
  miningAmount: number;
  dailyBonus: number;
  minWithdrawal: number;
  referralProfit: number; // percentage
  telegramBotId: string;
  telegramUserId: string;
  adsgarmCode: string;
}

export interface AppContextType {
  // User Management
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  
  // Mining
  miningBalance: number;
  setMiningBalance: (balance: number) => void;
  
  // Tasks
  tasks: Task[];
  completeTask: (taskId: string) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  
  // Referrals
  referrals: User[];
  addReferral: (user: User) => void;
  
  // Withdrawals
  withdrawals: Withdrawal[];
  createWithdrawal: (address: string, amount: number) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: Withdrawal['status']) => void;
  
  // Admin Config
  adminConfig: AppConfig;
  updateAdminConfig: (updates: Partial<AppConfig>) => void;
  
  // User Management (Admin)
  allUsers: User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
  resetUserBalance: (userId: string) => void;
  addUserBalance: (userId: string, amount: number) => void;
  blockUser: (userId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
