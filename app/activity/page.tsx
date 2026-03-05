'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ActivityPage() {
  const { user, isLoaded } = useUser();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Simple mock data for now - we'll add real events later
      setActivities([
        { id: '1', type: 'login', message: 'You logged in', createdAt: new Date().toISOString() },
      ]);
    }
  }, [user]);

  if (!isLoaded) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!user) return <div style={{padding: '2rem'}}>Please sign in</div>;

  return (
    <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
      <h1>Activity Log</h1>
      {activities.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} style={{padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem', borderRadius: '8px'}}>
            <p>{activity.message}</p>
            <small>{new Date(activity.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}