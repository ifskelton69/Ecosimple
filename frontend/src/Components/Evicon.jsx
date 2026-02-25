import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EnvIcon = () => {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Space+Mono&display=swap');

        @keyframes envSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes envPulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(4px); }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        .env-wrapper {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Syne', sans-serif;
        }

        /* Tooltip */
        .env-tooltip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: rgba(5, 10, 6, 0.92);
          border: 1px solid rgba(23, 206, 60, 0.3);
          border-radius: 14px;
          backdrop-filter: blur(20px);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.5),
            0 0 0 1px rgba(23,206,60,0.08),
            inset 0 1px 0 rgba(255,255,255,0.05);
          white-space: nowrap;
          animation: tooltipIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
          cursor: pointer;
        }

        .env-tooltip-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #17ce3c;
          box-shadow: 0 0 8px #17ce3c;
          flex-shrink: 0;
        }

        .env-tooltip-text {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.2px;
        }

        .env-tooltip-text span {
          color: #17ce3c;
        }

        .env-tooltip-arrow {
          font-size: 14px;
          color: #17ce3c;
          animation: arrowBounce 1s infinite;
        }

        /* Icon button */
        .env-btn {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #0aad32 0%, #17ce3c 50%, #08a728 100%);
          box-shadow:
            0 4px 24px rgba(23,206,60,0.45),
            0 0 0 0 rgba(23,206,60,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: floatIcon 3s ease-in-out infinite;
        }

        .env-btn:hover {
          transform: scale(1.12);
          box-shadow:
            0 8px 36px rgba(23,206,60,0.65),
            0 0 0 0 rgba(23,206,60,0.3);
          animation: ;
        }

        .env-btn:active {
          transform: scale(0.96);
        }

        /* Pulse rings */
        .env-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(23,206,60,0.5);
          animation: envPulseRing 2s ease-out infinite;
        }
        .env-ring:nth-child(2) {
          animation-delay: 0.7s;
        }

        /* Globe SVG spin on hover */
        .env-icon-svg {
          width: 26px; height: 26px;
          color: #050a06;
          transition: transform 0.6s ease;
          position: relative; z-index: 1;
        }

        .env-btn:hover .env-icon-svg {
          animation: envSpin 4s linear infinite;
        }
      `}</style>

      <div className="env-wrapper">
        {/* Tooltip — shown on hover */}
        {hovered && (
          <div
            className="env-tooltip"
            onClick={() => navigate('/knowyourenv')}
          >
            <span className="env-tooltip-dot" />
            <span className="env-tooltip-text">
              Know Your <span>Environment</span>
            </span>
            <span className="env-tooltip-arrow">→</span>
          </div>
        )}

        {/* Icon Button */}
        <button
          className="env-btn"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => navigate('/knowyourenv')}
          aria-label="Know Your Environment"
        >
          <div className="env-ring" />
          <div className="env-ring" />

          {/* Globe / leaf icon */}
          <svg
            className="env-icon-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default EnvIcon