import React, { useState } from 'react';
import AirQualityPage from './pages/AirQualityPage';
import WaterQualityPage from './pages/WaterQualityPage';
import AnomalyDetectionPage from './pages/AnomalyDetectionPage';
import Header from './components/ui/Header/Header';
import TabButton from './components/ui/TabButton/TabButton';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('air');

  return (
    <div className="app">
      <Header title="Система моніторингу екологічних показників">
        <TabButton 
          active={activeTab === 'air'}
          onClick={() => setActiveTab('air')}
        >
          Якість повітря
        </TabButton>
        <TabButton 
          active={activeTab === 'water'}
          onClick={() => setActiveTab('water')}
        >
          Якість води
        </TabButton>
        <TabButton 
          active={activeTab === 'anomaly'}
          onClick={() => setActiveTab('anomaly')}
        >
          Виявлення аномалій
        </TabButton>
      </Header>
      
      <main className="main-content">
        {activeTab === 'air' && <AirQualityPage />}
        {activeTab === 'water' && <WaterQualityPage />}
        {activeTab === 'anomaly' && <AnomalyDetectionPage />}
      </main>
    </div>
  );
}

export default App;
