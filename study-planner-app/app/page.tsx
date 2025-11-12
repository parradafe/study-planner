"use client";

import { useState } from "react";
import ListItem from "./components/ListItem";

interface DomainItem {
  id: number;
  time: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [domains, setDomains] = useState<DomainItem[]>([
    { id: 1, time: "18:00", title: "Call mom", completed: false },
    { id: 2, time: "14:30", title: "Review math concepts", completed: true },
    { id: 3, time: "10:00", title: "Finish project proposal", completed: false },
    { id: 4, time: "16:45", title: "Team meeting", completed: false },
  ]);

  const [topics, setTopics] = useState<DomainItem[]>([
    { id: 1, time: "09:15", title: "JavaScript basics", completed: false },
    { id: 2, time: "13:00", title: "React hooks", completed: true },
    { id: 3, time: "15:30", title: "TypeScript types", completed: false },
  ]);

  const [sessions, setSessions] = useState<DomainItem[]>([
    { id: 1, time: "08:00", title: "Morning study", completed: false },
    { id: 2, time: "14:00", title: "Practice exercises", completed: true },
  ]);

  const [lastStudied, setLastStudied] = useState<DomainItem[]>([
    { id: 1, time: "Yesterday", title: "Algorithm complexity", completed: true },
    { id: 2, time: "2 days ago", title: "Database design", completed: true },
    { id: 3, time: "1 week ago", title: "CSS Grid layout", completed: true },
  ]);

  const [newDomainTitle, setNewDomainTitle] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const generateRandomTime = () => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const addDomain = () => {
    if (newDomainTitle.trim() === "") return;

    const newDomain: DomainItem = {
      id: Date.now(),
      time: generateRandomTime(),
      title: newDomainTitle,
      completed: Math.random() > 0.5,
    };

    setDomains((prevDomains) => [...prevDomains, newDomain]);
    setNewDomainTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addDomain();
    }
  };

  const addTopic = () => {
    if (newTopicTitle.trim() === "") return;

    const newTopic: DomainItem = {
      id: Date.now(),
      time: generateRandomTime(),
      title: newTopicTitle,
      completed: Math.random() > 0.5,
    };

    setTopics((prevTopics) => [...prevTopics, newTopic]);
    setNewTopicTitle("");
  };

  const handleTopicKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTopic();
    }
  };

  const toggleCompletion = (id: number) => {
    setDomains((prevDomains) =>
      prevDomains.map((domain) =>
        domain.id === id ? { ...domain, completed: !domain.completed } : domain
      )
    );
  };

  const toggleTopicCompletion = (id: number) => {
    setTopics((prevTopics) =>
      prevTopics.map((topic) =>
        topic.id === id ? { ...topic, completed: !topic.completed } : topic
      )
    );
  };

  const toggleSessionCompletion = (id: number) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === id ? { ...session, completed: !session.completed } : session
      )
    );
  };

  const toggleLastStudiedCompletion = (id: number) => {
    setLastStudied((prevLastStudied) =>
      prevLastStudied.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-background p-6 font-sans">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20vw_37vw_37vw] min-h-[90vh]">
        {/* Domains Card */}
        <div className="flex flex-col rounded-lg border-2 border-card-border bg-card-bg p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-text-primary">Domains</h2>
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {domains.map((domain) => (
              <ListItem
                key={domain.id}
                time={domain.time}
                title={domain.title}
                completed={domain.completed}
                onToggle={() => toggleCompletion(domain.id)}
              />
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <input
              type="text"
              value={newDomainTitle}
              onChange={(e) => setNewDomainTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="New domain..."
              className="flex-1 h-12 px-4 rounded-sm border-2 border-card-border bg-card-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={addDomain}
              className="h-12 w-24 rounded-sm border-2 border-card-border bg-card-bg transition-all hover:bg-primary-light"
              aria-label="Add topic"
            >
              Add
            </button>
          </div>
        </div>

        {/* Middle Column - Random & Topics */}
        <div className="flex flex-col gap-6">
          {/* Random Card */}
          <div className="rounded-lg border-2 border-card-border bg-card-bg p-6 shadow-lg">
            <button className="w-full rounded-2xl border-2 border-card-border bg-card-bg px-6 py-4 text-xl font-semibold text-text-primary transition-all hover:bg-primary-light">
              Random
            </button>
          </div>

          {/* Topics Card */}
          <div className="flex flex-1 flex-col rounded-lg border-2 border-card-border bg-card-bg p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-text-primary">
              Topics
            </h2>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {topics.map((topic) => (
                <ListItem
                  key={topic.id}
                  time={topic.time}
                  title={topic.title}
                  completed={topic.completed}
                  onToggle={() => toggleTopicCompletion(topic.id)}
                />
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyPress={handleTopicKeyPress}
                placeholder="New topic..."
                className="flex-1 h-12 px-4 rounded-sm border-2 border-card-border bg-card-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={addTopic}
                className="h-12 w-24 rounded-sm border-2 border-card-border bg-card-bg transition-all hover:bg-primary-light"
                aria-label="Add topic"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Session & Last Studied */}
        <div className="flex flex-col gap-6">
          {/* Session Card */}
          <div className="flex flex-col rounded-lg border-2 border-card-border bg-card-bg p-6 shadow-lg h-6/12">
            <h2 className="mb-4 text-2xl font-bold text-text-primary">
              Session
            </h2>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {sessions.map((session) => (
                <ListItem
                  key={session.id}
                  time={session.time}
                  title={session.title}
                  completed={session.completed}
                  onToggle={() => toggleSessionCompletion(session.id)}
                />
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button
                className="h-12 w-24 rounded-sm border-2 border-card-border bg-card-bg transition-all hover:bg-primary-light"
                aria-label="Done session"
              >
                Done!
              </button>
            </div>
          </div>

          {/* Last Studied Card */}
          <div className="flex flex-1 flex-col rounded-lg border-2 border-card-border bg-card-bg p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-text-primary">
              Last studied
            </h2>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {lastStudied.map((item) => (
                <ListItem
                  key={item.id}
                  time={item.time}
                  title={item.title}
                  completed={item.completed}
                  onToggle={() => toggleLastStudiedCompletion(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
