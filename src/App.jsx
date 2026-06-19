import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import DashboardInput from './components/DashboardInput';
import TimelineView from './components/TimelineView';
import FocusMode from './components/FocusMode';
import Muhasabah from './components/Muhasabah';
import QuranReader from './components/QuranReader';
import PrivacyBadge from './components/PrivacyBadge';

const MOCK_TASKS = [
  { id: 't1', title: 'Revisi Desain UI/UX Klien', time: '09:00 - 11:30', type: 'task', done: false },
  { id: 't2', title: 'Tugas Kuliah Sistem Informasi', time: '13:00 - 15:00', type: 'task', done: false },
  { id: 't3', title: 'Kelas Studi Independen Data Science', time: '16:00 - 17:45', type: 'task', done: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('perencanaan'); // 'perencanaan' | 'muhasabah' | 'quran'
  const [viewState, setViewState] = useState('dashboard'); // 'dashboard' | 'timeline' | 'focus'
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);

  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=11')
      .then(res => res.json())
      .then(data => {
        setPrayerTimes(data.data.timings);
      })
      .catch(err => console.error("Failed to fetch prayer times", err));
  }, []);

  const handlePlanSubmit = (input) => {
    let combinedTasks = [...MOCK_TASKS];
    
    if (prayerTimes) {
      const prayers = [
        { id: 'p1', title: 'Subuh', time: prayerTimes.Fajr, type: 'prayer' },
        { id: 'p2', title: 'Zuhur', time: prayerTimes.Dhuhr, type: 'prayer' },
        { id: 'p3', title: 'Asar', time: prayerTimes.Asr, type: 'prayer' },
        { id: 'p4', title: 'Magrib', time: prayerTimes.Maghrib, type: 'prayer' },
        { id: 'p5', title: 'Isya', time: prayerTimes.Isha, type: 'prayer' }
      ];
      combinedTasks = [...combinedTasks, ...prayers];
    }
    
    // Sort chronologically based on start time
    combinedTasks.sort((a, b) => {
      const timeA = a.time.split(' - ')[0]; // Extract start time e.g. "09:00"
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });

    setTasks(combinedTasks);
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
              prayerTimes={prayerTimes}
              onStartTask={handleStartTask}
              onMarkDone={handleMarkDone}
            />
          )}

          {activeTab === 'muhasabah' && viewState !== 'focus' && (
            <Muhasabah key="muhasabah" />
          )}

          {activeTab === 'quran' && viewState !== 'focus' && (
            <QuranReader key="quran" />
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
