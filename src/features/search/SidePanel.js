import React from 'react';
import { Link } from 'react-router-dom';

export default function SidePanel() {
  return (
    <div className="search-side-panel">
      <ul>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      <div className="memo">
        This is a Rekit feature that contains some questions for you to quick learn how Rekit works.
        To remove it just delete the feature.
      </div>
    </div>
  );
}
