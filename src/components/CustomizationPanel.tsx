import React from 'react';
import './CustomizationPanel.css';

interface CustomizationPanelProps {
  screenshot: string;
  onBackClick: () => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ screenshot, onBackClick }) => {
  return (
    <div className="customization-panel" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="back-arrow" onClick={onBackClick}>
        &#8592; {/* Unicode for a left arrow */}
      </div>
      <div className="customization-content">
        <div className="section">
          <div className="section-header">SUPER</div>
          <div className="items-grid">
            {['Super 1'].map((item, index) => (
              <div key={index} className="item">
                {item}
                <div className="submenu-grid">
                  <div className="submenu-item">Option 1</div>
                  <div className="submenu-item">Option 2</div>
                  <div className="submenu-item">Option 3</div>
                  <div className="submenu-item">Option 4</div>
                  <div className="submenu-item">Option 5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          <div className="section" style={{ flexGrow: 1 }}>
            <div className="section-header">ABILITIES</div>
            <div className="items-grid four-items">
              {['Ability 1', 'Ability 2', 'Ability 3', 'Ability 4'].map((ability, index) => (
                <div key={index} className="item">
                  {ability}
                  <div className="submenu-grid">
                    <div className="submenu-item">Option 1</div>
                    <div className="submenu-item">Option 2</div>
                    <div className="submenu-item">Option 3</div>
                    <div className="submenu-item">Option 4</div>
                    <div className="submenu-item">Option 5</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="empty-space"></div>

          <div className="section" style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <div className="section-header">ASPECTS</div>
            <div className="items-grid two-items">
              {['Aspect 1', 'Aspect 2'].map((aspect, index) => (
                <div key={index} className="item">
                  {aspect}
                  <div className="submenu-grid">
                    <div className="submenu-item">Option 1</div>
                    <div className="submenu-item">Option 2</div>
                    <div className="submenu-item">Option 3</div>
                    <div className="submenu-item">Option 4</div>
                    <div className="submenu-item">Option 5</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">FRAGMENTS</div>
          <div className="items-grid six-items">
            {[
              'Fragment 1',
              'Fragment 2',
              'Fragment 3',
              'Fragment 4',
              'Fragment 5',
              'Fragment 6',
            ].map((fragment, index) => (
              <div key={index} className="item">
                {fragment}
                <div className="submenu-grid">
                  <div className="submenu-item">Option 1</div>
                  <div className="submenu-item">Option 2</div>
                  <div className="submenu-item">Option 3</div>
                  <div className="submenu-item">Option 4</div>
                  <div className="submenu-item">Option 5</div>
                </div>
              </div>
            ))}
            <div className="empty-space right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
