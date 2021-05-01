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
        For original paper, see <a href='https://arxiv.org/abs/1908.10084'>arxiv.org</a>. &nbsp;
        <a href='https://www.kaggle.com/c/quora-question-pairs'>Quora Question Pairs</a> dataset
      </div>
    </div>
  );
}
