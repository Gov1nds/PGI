import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Manufacturing Network for Hardware Products</h1>
        <p>Build Hardware Without Owning Factories</p>
        <p>Through a Distributed Manufacturing Network</p>
        <p>PGI is a manufacturing operating partner that helps product companies build hardware through a distributed network of electronics suppliers, precision machining partners, and assembly facilities.</p>
        <button>Start a Manufacturing Project</button>
      </div>
      <div className="right-panel">
        <h2>From Prototype To Production</h2>
        <p>Engineering coordination, supplier networks, and production oversight for modern hardware companies.</p>
        <div className="hero-metrics">
          <div>Components sourced: 4200+</div>
          <div>Manufacturing orders coordinated: 1800+</div>
          <div>Typical production cost improvement: 18%</div>
        </div>
      </div>
      <div className="chips">
        <ul>
          <li>Electronics sourcing</li>
          <li>PCB manufacturing</li>
          <li>Precision machining</li>
          <li>Assembly coordination</li>
          <li>Quality inspection</li>
          <li>Design for Manufacturing (DFM) review</li>
        </ul>
      </div>
      <section className="technical-expertise">
        <h2>Engineering Coordination for Hardware Manufacturing</h2>
        <p>We provide comprehensive engineering and manufacturing expertise to ensure quality and reliability in your hardware projects.</p>
        <div className="kpi">
          <div>Components sourced</div>
          <div>Manufacturing partners</div>
          <div>Production reliability</div>
        </div>
        <div className="expertise-cards">
          <div className="card">
            <h3>Electronics Manufacturing Coordination</h3>
            <p>Expertise in coordinating electronics manufacturing processes.</p>
          </div>
          <div className="card">
            <h3>Precision Machining & Fabrication</h3>
            <p>High-quality machining and fabrication services.</p>
          </div>
          <div className="card">
            <h3>Engineering Review & Quality Control</h3>
            <p>Ensuring product quality through expert reviews.</p>
          </div>
        </div>
      </section>
      <section className="services">
        <h2>Manufacturing Coordination Across the Production Lifecycle</h2>
        <p>From concept to production, we ensure a smooth manufacturing process.</p>
      </section>
      <section className="capabilities">
        <h2>Distributed Manufacturing Network</h2>
        <p>A network designed for efficient production across various partners.</p>
      </section>
      <section className="insights">
        <h2>Insights on Hardware Manufacturing</h2>
        <p>Stay updated with the latest trends and insights in hardware manufacturing.</p>
      </section>
      <div className="cta">
        <h2>Ready to Build Your Hardware Product?</h2>
        <p>Contact us for more information and start your project today!</p>
      </div>
    </div>
  );
};

export default Home;