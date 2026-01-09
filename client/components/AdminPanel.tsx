import { useState, useEffect } from "react";
import { useAppContext } from "@/lib/appContext";
import {
  X,
  Save,
  Settings,
  DollarSign,
  ListTodo,
  Users,
  CreditCard,
} from "lucide-react";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const {
    adminConfig,
    updateAdminConfig,
    tasks,
    addTask,
    removeTask,
    updateTask,
    withdrawals,
    updateWithdrawalStatus,
    allUsers,
    updateUser,
    blockUser,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<
    "finance" | "tasks" | "withdrawals" | "users"
  >("finance");
  const [localConfig, setLocalConfig] = useState(adminConfig);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "adsgram" as const,
    reward: 0,
  });
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    setLocalConfig(adminConfig);
  }, [adminConfig]);

  const handleSaveConfig = () => {
    updateAdminConfig(localConfig);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      addTask({
        id: Date.now().toString(),
        ...newTask,
        completed: false,
      });
      setNewTask({ title: "", description: "", type: "adsgram", reward: 0 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex overflow-x-auto sticky top-16 bg-white">
          {[
            { id: "finance" as const, label: "Finance", icon: DollarSign },
            { id: "tasks" as const, label: "Tasks", icon: ListTodo },
            {
              id: "withdrawals" as const,
              label: "Withdrawals",
              icon: CreditCard,
            },
            { id: "users" as const, label: "Users", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 border-b-2 border-transparent"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Finance Tab */}
          {activeTab === "finance" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                Finance Settings
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Mining Amount Per Second
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={localConfig.miningAmount}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      miningAmount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Daily Bonus Amount
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={localConfig.dailyBonus}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      dailyBonus: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Minimum Withdrawal Amount
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={localConfig.minWithdrawal}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      minWithdrawal: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Referral Profit Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localConfig.referralProfit}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      referralProfit: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Telegram Bot ID
                </label>
                <input
                  type="text"
                  value={localConfig.telegramBotId}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      telegramBotId: e.target.value,
                    })
                  }
                  placeholder="@BotUsername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Telegram User ID (for notifications)
                </label>
                <input
                  type="text"
                  value={localConfig.telegramUserId}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      telegramUserId: e.target.value,
                    })
                  }
                  placeholder="Your Telegram User ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  AdsGram Ad Code
                </label>
                <textarea
                  value={localConfig.adsgarmCode}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      adsgarmCode: e.target.value,
                    })
                  }
                  placeholder="Paste your AdsGram ad code here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Settings
              </button>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Manage Tasks</h3>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Add New Task</h4>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-16"
                />
                <select
                  value={newTask.type}
                  onChange={(e) =>
                    setNewTask({ ...newTask, type: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="adsgram">AdsGram</option>
                  <option value="watch_ad">Watch Video</option>
                  <option value="join_channel">Join Channel</option>
                  <option value="visit_link">Visit Link</option>
                </select>
                <input
                  type="number"
                  step="0.00000001"
                  placeholder="Reward amount"
                  value={newTask.reward}
                  onChange={(e) =>
                    setNewTask({ ...newTask, reward: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleAddTask}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Add Task
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Current Tasks</h4>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 rounded-lg p-3 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {task.title}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {task.description}
                      </p>
                      <p className="text-blue-600 text-xs mt-1">
                        Reward: {task.reward.toFixed(8)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === "withdrawals" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                Withdrawal Management
              </h3>

              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No withdrawals
                  </p>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-mono text-sm text-gray-900 break-all">
                            {withdrawal.address}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {withdrawal.amount.toFixed(8)}
                          </p>
                        </div>
                        <select
                          value={withdrawal.status}
                          onChange={(e) =>
                            updateWithdrawalStatus(
                              withdrawal.id,
                              e.target.value as any,
                            )
                          }
                          className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {new Date(withdrawal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                User Management
              </h3>

              <div className="space-y-3">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() =>
                      setSelectedUser(selectedUser === user.id ? null : user.id)
                    }
                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-900">
                        User {user.id}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Balance: {user.balance.toFixed(8)}
                    </p>

                    {selectedUser === user.id && (
                      <div className="mt-3 space-y-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newBalance = prompt(
                              "Enter new balance:",
                              user.balance.toString(),
                            );
                            if (newBalance) {
                              updateUser(user.id, {
                                balance: Number(newBalance),
                              });
                            }
                          }}
                          className="w-full text-left text-sm px-2 py-1 hover:bg-white rounded"
                        >
                          📝 Edit Balance
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resetUserBalance(user.id);
                          }}
                          className="w-full text-left text-sm px-2 py-1 hover:bg-white rounded text-orange-600"
                        >
                          🔄 Reset Balance
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            blockUser(user.id);
                          }}
                          className="w-full text-left text-sm px-2 py-1 hover:bg-white rounded text-red-600"
                        >
                          {user.isBlocked ? "✓ Unblock User" : "🚫 Block User"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
