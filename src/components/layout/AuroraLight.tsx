'use client';

export default function AuroraLight() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-1 absolute rounded-full" style={{
        width: '80vw', height: '80vw',
        top: '10%', left: '10%',
        background: 'radial-gradient(ellipse, rgba(255,235,160,0.18) 0%, rgba(255,215,110,0.08) 40%, transparent 70%)',
      }} />
      <div className="aurora-2 absolute rounded-full" style={{
        width: '70vw', height: '70vw',
        top: '20%', left: '15%',
        background: 'radial-gradient(ellipse, rgba(255,250,210,0.14) 0%, rgba(255,225,140,0.06) 40%, transparent 70%)',
      }} />
      <div className="aurora-3 absolute rounded-full" style={{
        width: '60vw', height: '60vw',
        top: '15%', left: '20%',
        background: 'radial-gradient(ellipse, rgba(255,255,230,0.12) 0%, rgba(255,240,170,0.05) 40%, transparent 70%)',
      }} />
    </div>
  );
}
