import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import DashboardInput from './components/DashboardInput';
import TimelineView from './components/TimelineView';
import FocusMode from './components/FocusMode';
import Muhasabah from './components/Muhasabah';
import PrivacyBadge from './components/PrivacyBadge';

const MOCK_TASKS = [
  { id: 1, title: 'Revisi Desain UI/UX Klien', time: '09:00 - 11:30', type: 'task', done: false },
  { id: 2, title: 'Zuhur', time: '12:00', type: 'prayer' },
  { id: 3, title: 'Tugas Kuliah Sistem Informasi', time: '13:00 - 15:00', type: 'task', done: false },
  { id: 4, title: 'Asar', time: '15:20', type: 'prayer' },
  { id: 5, title: 'Kelas Studi Independen Data Science', time: '16:00 - 17:45', type: 'task', done: false },
  { id: 6, title: 'Magrib', time: '18:00', type: 'prayer' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('perencanaan'); // 'perencanaan' | 'muhasabah'
  const [viewState, setViewState] = useState('dashboard'); // 'dashboard' | 'timeline' | 'focus'
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const handlePlanSubmit = (input) => {
    // In a real app, this would send the input to an AI to parse into tasks.
    // Here we use the mock data.
    setTasks(MOCK_TASKS);
    setViewState('timeline');
  };

  const handleStartTask = (task) => {
    setActiveTask(task);
    setViewState('focus');
  };

  const handleStopFocus = () => {
    setActiveTask(null);
    setViewState('timeline');
  };

  const handleMarkDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-sakina-bg text-sakina-text selection:bg-sakina-primary/30 selection:text-sakina-text">
      {viewState !== 'focus' && (
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'perencanaan' && viewState === 'dashboard' && (
            <DashboardInput 
              key="dashboard"
              initialInput="Saya harus menyelesaikan revisi desain UI/UX klien freelance, mengerjakan tugas kuliah Sistem Informasi semester enam, dan mengikuti kelas sore Studi Independen Data Science."
              onSubmit={handlePlanSubmit} 
            />
          )}
          
          {activeTab === 'perencanaan' && viewState === 'timeline' && (
            <TimelineView 
              key="timeline"
              tasks={tasks}
              onStartTask={handleStartTask}
              onMarkDone={handleMarkDone}
            />
          )}

          {activeTab === 'muhasabah' && viewState !== 'focus' && (
            <Muhasabah key="muhasabah" />
          )}
        </AnimatePresence>

        {/* Focus Mode is an overlay */}
        <AnimatePresence>
          {viewState === 'focus' && (
            <FocusMode 
              key="focus"
              task={activeTask}
              onStop={handleStopFocus}
            />
          )}
        </AnimatePresence>
      </main>

      {viewState !== 'focus' && (
        <footer className="mt-auto">
          <PrivacyBadge />
        </footer>
      )}
    </div>
  );
}
