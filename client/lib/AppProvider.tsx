import React, { useState, useCallback } from 'react';
import { AppContext, AppContextType, User, Task, Withdrawal, AppConfig } from './appContext';

const DEFAULT_CONFIG: AppConfig = {
  miningAmount: 0.00000001,
  dailyBonus: 0.00000005,
  minWithdrawal: 0.0001,
  referralProfit: 10,
  telegramBotId: '',
  telegramUserId: '',
  adsgarmCode: '',
};

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Watch AdsGram Video',
    description: 'Watch a 30-second advertisement',
    type: 'adsgram',
    reward: 0.00000001,
    completed: false,
  },
  {
    id: '2',
    title: 'Join Our Telegram Channel',
    description: 'Join our official updates channel',
    type: 'join_channel',
    reward: 0.00000002,
    completed: false,
    channelId: '@mining_updates',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    balance: 0,
    miningRate: 0,
    referralCount: 0,
    referralEarnings: 0,
    totalWithdrawn: 0,
    isBlocked: false,
  });

  const [miningBalance, setMiningBalance] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [referrals, setReferrals] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [adminConfig, setAdminConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [allUsers, setAllUsers] = useState<User[]>(currentUser ? [currentUser] : []);

  const completeTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;
      
      if (currentUser) {
        const newBalance = currentUser.balance + task.reward;
        setCurrentUser({ ...currentUser, balance: newBalance });
        setMiningBalance(newBalance);
      }
      
      return prev.map(t => t.id === taskId ? { ...t, completed: true } : t);
    });
  }, [currentUser]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const addReferral = useCallback((user: User) => {
    setReferrals(prev => [...prev, user]);
    if (currentUser) {
      const referralBonus = user.balance * (adminConfig.referralProfit / 100);
      const newBalance = currentUser.balance + referralBonus;
      const newReferralEarnings = currentUser.referralEarnings + referralBonus;
      const updated = { 
        ...currentUser, 
        balance: newBalance, 
        referralEarnings: newReferralEarnings,
        referralCount: currentUser.referralCount + 1 
      };
      setCurrentUser(updated);
      setMiningBalance(newBalance);
    }
  }, [currentUser, adminConfig]);

  const createWithdrawal = useCallback((address: string, amount: number) => {
    const withdrawal: Withdrawal = {
      id: Date.now().toString(),
      userId: currentUser?.id || '1',
      address,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setWithdrawals(prev => [...prev, withdrawal]);
    if (currentUser) {
      setCurrentUser({ ...currentUser, totalWithdrawn: currentUser.totalWithdrawn + amount });
    }
  }, [currentUser]);

  const updateWithdrawalStatus = useCallback((withdrawalId: string, status: Withdrawal['status']) => {
    setWithdrawals(prev => 
      prev.map(w => w.id === withdrawalId ? { ...w, status } : w)
    );
  }, []);

  const updateAdminConfig = useCallback((updates: Partial<AppConfig>) => {
    setAdminConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setAllUsers(prev => 
      prev.map(u => u.id === userId ? { ...u, ...updates } : u)
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser]);

  const resetUserBalance = useCallback((userId: string) => {
    updateUser(userId, { balance: 0, miningRate: 0 });
  }, [updateUser]);

  const addUserBalance = useCallback((userId: string, amount: number) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { balance: user.balance + amount });
    }
  }, [allUsers, updateUser]);

  const blockUser = useCallback((userId: string) => {
    updateUser(userId, { isBlocked: true });
  }, [updateUser]);

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    miningBalance,
    setMiningBalance,
    tasks,
    completeTask,
    addTask,
    updateTask,
    removeTask,
    referrals,
    addReferral,
    withdrawals,
    createWithdrawal,
    updateWithdrawalStatus,
    adminConfig,
    updateAdminConfig,
    allUsers,
    updateUser,
    resetUserBalance,
    addUserBalance,
    blockUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
