import { useState } from "react";
import { useAppContext } from "@/lib/appContext";
import {
  CheckCircle,
  PlayCircle,
  Users,
  Link2,
  ExternalLink,
} from "lucide-react";

export default function Tasks() {
  const { tasks, completeTask } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "watch_ad":
      case "adsgram":
        return <PlayCircle className="w-5 h-5" />;
      case "join_channel":
        return <Users className="w-5 h-5" />;
      case "visit_link":
        return <ExternalLink className="w-5 h-5" />;
      default:
        return <Link2 className="w-5 h-5" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "adsgram":
        return "Watch AdsGram";
      case "watch_ad":
        return "Watch Video";
      case "join_channel":
        return "Join Channel";
      case "visit_link":
        return "Visit Link";
      default:
        return type;
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    setTimeout(() => setSelectedTask(null), 500);
  };

  const handleTaskAction = (task: any) => {
    if (task.url) {
      window.open(task.url, "_blank");
    } else if (task.channelId) {
      window.open(`https://t.me/${task.channelId.replace("@", "")}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 px-4 pt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Tasks</h1>
        <p className="text-gray-600 text-sm mt-1">
          Earn rewards by completing tasks
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <button
              onClick={() => setSelectedTask(task.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              disabled={task.completed}
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-600 flex-shrink-0 mt-1">
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    getTaskIcon(task.type)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                      {getTaskTypeLabel(task.type)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green-600">
                    +{task.reward.toFixed(8)}
                  </p>
                  <p className="text-xs text-gray-500">Reward</p>
                </div>
              </div>
            </button>

            {/* Task Action */}
            {selectedTask === task.id && !task.completed && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {task.type === "adsgram" ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900">
                      <p>
                        Watch the AdsGram advertisement below to complete this
                        task.
                      </p>
                    </div>
                    <div className="bg-gray-300 rounded-lg h-40 flex items-center justify-center">
                      <p className="text-gray-600 text-sm">
                        AdsGram Ad Placeholder
                      </p>
                    </div>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Complete & Claim Reward
                    </button>
                  </div>
                ) : task.url || task.channelId ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleTaskAction(task)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      {task.type === "join_channel"
                        ? "Join Channel"
                        : "Visit Link"}
                    </button>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      ✓ I've Completed
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Complete Task
                  </button>
                )}
              </div>
            )}

            {/* Completed */}
            {task.completed && (
              <div className="border-t border-gray-200 p-4 bg-green-50">
                <p className="text-green-700 text-sm font-semibold">
                  ✓ Task Completed
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center mt-6">
        <p className="text-orange-900 text-sm">
          📺 <strong>More tasks coming soon!</strong> Check back regularly for
          new earning opportunities.
        </p>
      </div>
    </div>
  );
}
