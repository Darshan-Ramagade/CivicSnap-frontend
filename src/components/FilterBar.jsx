function FilterBar({ filter, setFilter }) {
    return (
      <div className="filter-bar">
        <div className="filter-grid">
          <select
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
            className="form-select"
          >
            <option value="">All Categories</option>
            <option value="pothole">🕳️ Pothole</option>
            <option value="garbage">🗑️ Garbage</option>
            <option value="broken_light">💡 Broken Light</option>
            <option value="water_leakage">💧 Water Leakage</option>
            <option value="graffiti">🎨 Graffiti</option>
            <option value="other">❓ Other</option>
          </select>
  
          <select
            value={filter.severity}
            onChange={(e) => setFilter({...filter, severity: e.target.value})}
            className="form-select"
          >
            <option value="">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="moderate">🟡 Moderate</option>
            <option value="minor">🟢 Minor</option>
          </select>
  
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            className="form-select"
          >
            <option value="">All Statuses</option>
            <option value="reported">📋 Reported</option>
            <option value="in_progress">⏳ In Progress</option>
            <option value="resolved">✅ Resolved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>
      </div>
    );
  }
  
  export default FilterBar;