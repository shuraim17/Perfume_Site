import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1d1d1d', padding: '80px 48px 40px' }}>
      <div className="section-container">
        {/* Main Footer Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
          }}
        >
          {/* Brand Column */}
          <div>
            <h3
              className="text-2xl"
              style={{
                fontFamily: "'Newsreader', serif",
                color: '#ffffff',
              }}
            >
              AURA
            </h3>
            <p
              className="text-body"
              style={{ color: '#999999', marginTop: '16px' }}
            >
              Luxury fragrances, reimagined
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <p
              className="text-caption"
              style={{ color: '#999999', marginBottom: '24px' }}
            >
              SHOP
            </p>
            <ul className="flex flex-col gap-3">
              {['All Collections', 'New Arrivals', 'Bestsellers', 'Gift Sets'].map(
                (link) => (
                  <li key={link}>
                    <span
                      className="text-body cursor-pointer"
                      style={{
                        color: '#ffffff',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#999999')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = '#ffffff')
                      }
                    >
                      {link}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <p
              className="text-caption"
              style={{ color: '#999999', marginBottom: '24px' }}
            >
              COMPANY
            </p>
            <ul className="flex flex-col gap-3">
              {['About', 'Careers', 'Press', 'Contact'].map((link) => (
                <li key={link}>
                  <span
                    className="text-body cursor-pointer"
                    style={{
                      color: '#ffffff',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#999999')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = '#ffffff')
                    }
                  >
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <p
              className="text-caption"
              style={{ color: '#999999', marginBottom: '24px' }}
            >
              CONNECT
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'X (Twitter)' },
                { Icon: Facebook, label: 'Facebook' },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  className="cursor-pointer"
                  style={{ transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => {
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.style.color = '#ef1414';
                  }}
                  onMouseLeave={(e) => {
                    const svg = e.currentTarget.querySelector('svg');
                    if (svg) svg.style.color = '#ffffff';
                  }}
                  aria-label={label}
                >
                  <Icon
                    size={20}
                    color="#ffffff"
                    style={{ transition: 'color 0.3s ease' }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-wrap justify-between items-center"
          style={{
            marginTop: '64px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p className="text-caption" style={{ color: '#999999' }}>
            2026 AURA. All rights reserved.
          </p>
          <p className="text-caption" style={{ color: '#999999' }}>
            Privacy Policy &nbsp;&nbsp; Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
