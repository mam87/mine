import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
} from 'remotion';

const NEON_GREEN = '#00ff41';
const NEON_BLUE = '#00f3ff';

// Inline SVG illustrations — no external network required
const AiSvg: React.FC = () => (
  <svg viewBox="0 0 400 250" width="100%" height="100%" style={{filter:'grayscale(1) contrast(1.5)',opacity:0.7}}>
    <rect width="400" height="250" fill="#0a0a0a"/>
    {/* Neural network nodes */}
    {[[60,60],[60,125],[60,190],[160,40],[160,95],[160,155],[160,210],[260,70],[260,130],[260,190],[340,100],[340,150]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r={8} fill="none" stroke={NEON_GREEN} strokeWidth={1.5} opacity={0.8}/>
    ))}
    {/* Connections */}
    {([[60,60,160,40],[60,60,160,95],[60,125,160,95],[60,125,160,155],[60,190,160,155],[60,190,160,210],
       [160,40,260,70],[160,95,260,70],[160,95,260,130],[160,155,260,130],[160,155,260,190],[160,210,260,190],
       [260,70,340,100],[260,130,340,100],[260,130,340,150],[260,190,340,150]] as number[][]).map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={NEON_GREEN} strokeWidth={0.6} opacity={0.4}/>
    ))}
    <text x="200" y="235" textAnchor="middle" fill={NEON_GREEN} fontSize={10} fontFamily="monospace" opacity={0.5}>NEURAL_NET_v9.1</text>
  </svg>
);

const MarsSvg: React.FC = () => (
  <svg viewBox="0 0 400 250" width="100%" height="100%" style={{filter:'grayscale(1) contrast(1.5)',opacity:0.7}}>
    <rect width="400" height="250" fill="#0a0a0a"/>
    {/* Planet */}
    <circle cx="200" cy="125" r="90" fill="none" stroke={NEON_GREEN} strokeWidth={1} opacity={0.3}/>
    <circle cx="200" cy="125" r="90" fill="#1a0a00" opacity={0.6}/>
    {/* Surface lines */}
    {[[-80,-30,80,20],[-70,30,70,-20],[-60,-10,60,40]].map(([dx1,dy1,dx2,dy2],i)=>(
      <line key={i} x1={200+dx1} y1={125+dy1} x2={200+dx2} y2={125+dy2} stroke={NEON_GREEN} strokeWidth={0.5} opacity={0.3}/>
    ))}
    {/* Craters */}
    {[[170,100,12],[230,140,18],[185,155,8],[220,105,6]].map(([cx,cy,r],i)=>(
      <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r*0.5} fill="none" stroke={NEON_GREEN} strokeWidth={0.8} opacity={0.5}/>
    ))}
    {/* Orbit ring */}
    <ellipse cx="200" cy="125" rx="110" ry="30" fill="none" stroke={NEON_BLUE} strokeWidth={0.6} opacity={0.3} strokeDasharray="4 4"/>
    <text x="200" y="235" textAnchor="middle" fill={NEON_GREEN} fontSize={10} fontFamily="monospace" opacity={0.5}>MARS_COLONY_SITE_7</text>
  </svg>
);

const CyberSvg: React.FC = () => (
  <svg viewBox="0 0 400 250" width="100%" height="100%" style={{filter:'grayscale(1) contrast(1.5)',opacity:0.7}}>
    <rect width="400" height="250" fill="#0a0a0a"/>
    {/* Circuit paths */}
    {([[20,60,380,60],[20,100,380,100],[20,150,380,150],[20,190,380,190],
       [60,20,60,230],[120,20,120,230],[200,20,200,230],[280,20,280,230],[340,20,340,230]] as number[][]).map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={NEON_GREEN} strokeWidth={0.4} opacity={0.2}/>
    ))}
    {/* Circuit nodes */}
    {[[60,60],[120,100],[200,60],[280,150],[340,100],[200,150],[120,190],[280,190]].map(([cx,cy],i)=>(
      <rect key={i} x={cx-5} y={cy-5} width={10} height={10} fill="#0a0a0a" stroke={NEON_GREEN} strokeWidth={1} opacity={0.7}/>
    ))}
    {/* Brain outline (simplified) */}
    <ellipse cx="200" cy="120" rx="70" ry="55" fill="none" stroke={NEON_BLUE} strokeWidth={1.5} opacity={0.5}/>
    <line x1="200" y1="65" x2="200" y2="175" stroke={NEON_BLUE} strokeWidth={0.8} opacity={0.3}/>
    {/* Signal dots */}
    {[[155,95],[245,95],[165,130],[235,130],[175,155],[225,155]].map(([cx,cy],i)=>(
      <circle key={i} cx={cx} cy={cy} r={3} fill={NEON_BLUE} opacity={0.6}/>
    ))}
    <text x="200" y="235" textAnchor="middle" fill={NEON_GREEN} fontSize={10} fontFamily="monospace" opacity={0.5}>BCI_INTEGRATION_ACTIVE</text>
  </svg>
);

interface Event {
  year: string;
  title: string;
  probability: number;
  Illustration: React.FC;
}

const EVENTS: Event[] = [
  {year: '2029', title: 'AI PASSES TURING TEST',          probability: 98, Illustration: AiSvg},
  {year: '2035', title: 'FIRST MARS COLONY',              probability: 65, Illustration: MarsSvg},
  {year: '2045', title: 'NEURALINK STANDARD INTEGRATION', probability: 82, Illustration: CyberSvg},
];

const EVENT_DURATION = 150; // 5s at 30fps

// Deterministic pseudo-random for stable frame-by-frame rendering
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const MatrixBg: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  // Shuffle every 3 frames
  const tick = Math.floor(frame / 3);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.15,
        pointerEvents: 'none',
      }}
    >
      {Array.from({length: 50}, (_, i) => (
        <circle
          key={i}
          cx={seededRandom(tick * 50 + i) * width}
          cy={seededRandom(tick * 50 + i + 1000) * height}
          r={1.5}
          fill={NEON_GREEN}
        />
      ))}
    </svg>
  );
};

const Scanner: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const SCAN_PERIOD = 90; // 3s at 30fps
  const top = ((frame % SCAN_PERIOD) / SCAN_PERIOD) * height;

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: 4,
        background: 'rgba(0, 255, 65, 0.2)',
        boxShadow: `0 0 15px ${NEON_GREEN}`,
        top,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  );
};

const HexData: React.FC = () => {
  const frame = useCurrentFrame();
  // Update every 5 frames (~6fps flicker)
  const seed = Math.floor(frame / 5);
  const hex = seededRandom(seed).toString(16).slice(2, 8).toUpperCase();
  return <>DATA: 0x{hex}</>;
};

const hudStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: 10,
  padding: 10,
  textTransform: 'uppercase',
  fontFamily: "'Courier New', Courier, monospace",
  zIndex: 20,
};

const EventCard: React.FC<{event: Event}> = ({event}) => {
  const frame = useCurrentFrame(); // relative to <Sequence> start

  const opacity = interpolate(frame, [0, 15, 120, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(frame, [0, 15, 120, 150], [20, 0, 0, -20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const barWidth = interpolate(frame, [15, 60], [0, event.probability], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(4)),
  });

  const counterVal = Math.ceil(
    interpolate(frame, [15, 60], [0, event.probability], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        width: '80%',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${translateX}px), -50%)`,
        textAlign: 'center',
        opacity,
        fontFamily: "'Courier New', Courier, monospace",
        color: NEON_GREEN,
        zIndex: 5,
      }}
    >
      {/* Illustration */}
      <div
        style={{
          width: '100%',
          height: 250,
          background: '#111',
          border: `1px solid ${NEON_GREEN}`,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        <event.Illustration />
      </div>

      {/* Year */}
      <p
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          textShadow: `0 0 10px ${NEON_GREEN}`,
          margin: 0,
          color: NEON_GREEN,
        }}
      >
        {event.year}
      </p>

      {/* Title */}
      <div
        style={{
          fontSize: 19,
          margin: '10px 0',
          minHeight: 50,
          color: NEON_GREEN,
          letterSpacing: '0.05em',
        }}
      >
        {event.title}
      </div>

      {/* Probability bar */}
      <div
        style={{
          width: '100%',
          height: 10,
          border: `1px solid ${NEON_BLUE}`,
          marginTop: 20,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            height: '100%',
            background: NEON_BLUE,
            width: `${barWidth}%`,
            boxShadow: `0 0 10px ${NEON_BLUE}`,
          }}
        />
      </div>

      {/* Counter */}
      <p style={{fontSize: 12, color: NEON_GREEN, marginTop: 8}}>
        PROBABILITY: {counterVal}%
      </p>
    </div>
  );
};

export const FutureTimeline: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle, #111 0%, #000 100%)',
        overflow: 'hidden',
      }}
    >
      <MatrixBg />
      <Scanner />

      {/* HUD corners */}
      <div style={{...hudStyle, top: 0, left: 0, color: NEON_GREEN}}>
        LAT: 31.95 | LONG: 35.91
      </div>
      <div
        style={{
          ...hudStyle,
          top: 0,
          right: 0,
          color: NEON_BLUE,
          textAlign: 'right',
        }}
      >
        SYSTEM: ACTIVE
        <br />
        AI_PREDICT_v.4.0
      </div>
      <div style={{...hudStyle, bottom: 0, left: 0, color: NEON_GREEN}}>
        <HexData />
      </div>

      {/* Event cards — each gets its own Sequence so useCurrentFrame() is local */}
      {EVENTS.map((event, index) => (
        <Sequence
          key={index}
          from={index * EVENT_DURATION}
          durationInFrames={EVENT_DURATION}
        >
          <EventCard event={event} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
