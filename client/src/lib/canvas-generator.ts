import { Fortune } from "@shared/schema";

export async function generateFortuneCard(fortune: Fortune, addressee: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size for social media sharing
  canvas.width = 800;
  canvas.height = 800;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1E3A8A'); // mystical-blue
  gradient.addColorStop(1, '#2D1B69'); // mystical-purple
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add mystical border
  ctx.strokeStyle = '#D4AF37'; // mystical-gold
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  // Add inner border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  
  // Draw mystical symbol at top
  ctx.fillStyle = '#D4AF37';
  ctx.save();
  ctx.translate(canvas.width / 2, 120);
  drawMysticalSymbol(ctx, 40);
  ctx.restore();
  
  // Add title
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 36px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  
  const periodTitle = {
    daily: '오늘의 예언',
    weekly: '이주의 예언', 
    monthly: '이달의 예언',
    yearly: '올해의 예언'
  }[fortune.period];
  
  ctx.fillText(periodTitle, canvas.width / 2, 220);
  
  // Add decorative line
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 100, 250);
  ctx.lineTo(canvas.width / 2 + 100, 250);
  ctx.stroke();
  
  // Add fortune text
  ctx.fillStyle = '#FCD34D'; // mystical-glow
  ctx.font = '28px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  
  // Word wrap the fortune text
  const words = fortune.text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > canvas.width - 120) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  const lineHeight = 40;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });
  
  // Add addressee
  if (addressee) {
    ctx.fillStyle = '#C0C0C0'; // mystical-silver
    ctx.font = '20px "Noto Sans KR", sans-serif';
    ctx.fillText(addressee, canvas.width / 2, canvas.height - 180);
  }
  
  // Add app name
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 24px "Noto Sans KR", sans-serif';
  ctx.fillText('한줄신탁', canvas.width / 2, canvas.height - 120);
  
  // Add timestamp
  ctx.fillStyle = '#C0C0C0';
  ctx.font = '16px "Noto Sans KR", sans-serif';
  const date = new Date(fortune.generatedAt).toLocaleDateString('ko-KR');
  ctx.fillText(date, canvas.width / 2, canvas.height - 80);
  
  return canvas;
}

function drawMysticalSymbol(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  
  // Draw 8-pointed star
  const centerX = 0;
  const centerY = 0;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  const points = 8;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, size * 0.15, 0, 2 * Math.PI);
  ctx.fill();
}
