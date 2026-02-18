// Skate Physics Lab — Main App
(function() {
  const canvas = document.getElementById('labCanvas');
  const ctx = canvas.getContext('2d');
  const nav = document.getElementById('trickNav');
  const statsGrid = document.getElementById('statsGrid');
  const infoPanel = document.getElementById('infoPanel');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const slowMoBtn = document.getElementById('slowMoBtn');
  const stepBackBtn = document.getElementById('stepBackBtn');
  const stepFwdBtn = document.getElementById('stepFwdBtn');
  const frameIndicator = document.getElementById('frameIndicator');
  const speedSlider = document.getElementById('speedSlider');
  const massSlider = document.getElementById('massSlider');

  let currentTrick = TRICKS[0];
  let animating = false;
  let animTime = 0;
  let animFrame = null;
  let lastTimestamp = 0;
  let slowMo = false;
  const SLOW_MO_FACTOR = 0.2;
  const FRAME_STEP = 1 / 60; // ~16.7ms per frame step

  // Hi-DPI
  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  // Build nav
  TRICKS.forEach(t => {
    const btn = document.createElement('button');
    btn.textContent = t.name;
    btn.onclick = () => selectTrick(t);
    nav.appendChild(btn);
  });

  function selectTrick(t) {
    currentTrick = t;
    animTime = 0;
    animating = false;
    playBtn.textContent = '▶ Play';
    nav.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', TRICKS[i].id === t.id));
    renderStats();
    renderInfo();
    drawFrame();
  }

  function renderStats() {
    statsGrid.innerHTML = '';
    Object.entries(currentTrick.stats).forEach(([k, v]) => {
      const d = document.createElement('div');
      d.className = 'stat';
      d.innerHTML = `<div class="val">${v}</div><div class="lbl">${k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</div>`;
      statsGrid.appendChild(d);
    });
  }

  function renderInfo() {
    let phasesHtml = currentTrick.phases.map((p, i) =>
      `<li><b>${p.name}</b> (${(p.duration * 1000).toFixed(0)}ms) — ${p.desc}</li>`
    ).join('');
    infoPanel.innerHTML = `
      <h2>${currentTrick.name} — The Physics</h2>
      <p>${currentTrick.science}</p>
      <h3>Phases</h3>
      <ul>${phasesHtml}</ul>
    `;
  }

  // --- Drawing ---
  const W = 880, H = 440;
  const colors = { board: '#00e5ff', wheels: '#7c4dff', body: '#e0e0e0', force: '#ff5252', ground: '#1e1e2e', accent: '#00e5ff', dim: '#444' };

  function drawGround(y) {
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, y, W, H - y);
    ctx.strokeStyle = '#2a2a3a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  function drawBoard(x, y, angle, flipAngle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    // Board perspective with flip
    const bw = 80, bh = 8;
    const scaleY = Math.cos(flipAngle || 0);
    ctx.scale(1, scaleY || 0.05);
    ctx.fillStyle = colors.board;
    ctx.beginPath();
    ctx.roundRect(-bw/2, -bh/2, bw, bh, 4);
    ctx.fill();
    // Wheels
    ctx.fillStyle = colors.wheels;
    ctx.beginPath(); ctx.arc(-28, bh/2 + 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(28, bh/2 + 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawStickFigure(x, y, crouch, tilt) {
    const c = crouch || 0; // 0 = standing, 1 = crouched
    const headR = 10;
    const bodyLen = 40 * (1 - c * 0.35);
    const legLen = 35 * (1 - c * 0.4);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt || 0);
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Legs
    const kneeAngle = c * 0.8;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-10 - Math.sin(kneeAngle) * legLen * 0.5, -legLen * 0.5 * Math.cos(kneeAngle));
    ctx.lineTo(-10, -legLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10 + Math.sin(kneeAngle) * legLen * 0.5, -legLen * 0.5 * Math.cos(kneeAngle));
    ctx.lineTo(10, -legLen);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -legLen);
    ctx.lineTo(0, -legLen - bodyLen);
    ctx.stroke();

    // Arms
    const armY = -legLen - bodyLen * 0.7;
    ctx.beginPath();
    ctx.moveTo(0, armY);
    ctx.lineTo(-20, armY + 10 - c * 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, armY);
    ctx.lineTo(20, armY + 10 - c * 10);
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(0, -legLen - bodyLen - headR, headR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawForceArrow(x, y, dx, dy, label) {
    ctx.save();
    ctx.strokeStyle = colors.force;
    ctx.fillStyle = colors.force;
    ctx.lineWidth = 2;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();

    // Arrowhead
    ctx.save();
    ctx.translate(x + dx, y + dy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (label) {
      ctx.font = '11px system-ui';
      ctx.fillText(label, x + dx + 5, y + dy - 5);
    }
    ctx.restore();
  }

  function drawLabel(x, y, text) {
    ctx.font = 'bold 13px system-ui';
    ctx.fillStyle = colors.accent;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
    ctx.textAlign = 'left';
  }

  function getPhaseAt(t) {
    let elapsed = 0;
    for (let i = 0; i < currentTrick.phases.length; i++) {
      elapsed += currentTrick.phases[i].duration;
      if (t <= elapsed) return { index: i, progress: 1 - (elapsed - t) / currentTrick.phases[i].duration, phase: currentTrick.phases[i] };
    }
    return { index: currentTrick.phases.length - 1, progress: 1, phase: currentTrick.phases[currentTrick.phases.length - 1] };
  }

  function totalDuration() {
    return currentTrick.phases.reduce((s, p) => s + p.duration, 0);
  }

  // Trick-specific renderers
  const renderers = {
    ollie(t) {
      const groundY = 340;
      drawGround(groundY);
      const { index, progress } = getPhaseAt(t);
      const cx = W / 2;
      let boardY = groundY - 15, boardAngle = 0, crouch = 0, figY = boardY;
      let forces = [];

      if (index === 0) { // Crouch
        crouch = progress * 0.8;
        figY = boardY;
      } else if (index === 1) { // Pop
        boardAngle = -progress * 0.4;
        crouch = 0.8 - progress * 0.3;
        const lift = progress * 30;
        boardY -= lift;
        figY = boardY;
        forces.push({ x: cx + 30, y: groundY - 10, dx: 0, dy: -50 * progress, label: `Pop ~1400N` });
        forces.push({ x: cx + 30, y: groundY, dx: 0, dy: 20, label: 'Ground reaction' });
      } else if (index === 2) { // Slide & level
        const height = 30 + progress * 80;
        boardY = groundY - 15 - height;
        boardAngle = -0.4 * (1 - progress);
        crouch = 0.5 + progress * 0.3;
        figY = boardY;
        forces.push({ x: cx - 20, y: boardY - 5, dx: 20 * progress, dy: -20, label: 'Foot drag' });
      } else if (index === 3) { // Peak
        boardY = groundY - 15 - 110;
        boardAngle = 0;
        crouch = 0.8;
        figY = boardY;
        drawLabel(cx, boardY - 100, '✦ PEAK — Weightless!');
      } else { // Descend
        const height = 110 * (1 - progress);
        boardY = groundY - 15 - height;
        crouch = 0.8 - progress * 0.5;
        figY = boardY;
        forces.push({ x: cx, y: boardY - 80, dx: 0, dy: 30, label: `mg = ${massSlider.value * 9.8 | 0}N` });
      }

      drawBoard(cx, boardY, boardAngle);
      drawStickFigure(cx, figY, crouch);
      forces.forEach(f => drawForceArrow(f.x, f.y, f.dx, f.dy, f.label));
      drawLabel(cx, 30, currentTrick.phases[index].name);
    },

    kickflip(t) {
      const groundY = 340;
      drawGround(groundY);
      const { index, progress } = getPhaseAt(t);
      const cx = W / 2;
      let boardY = groundY - 15, boardAngle = 0, flipAngle = 0, crouch = 0;

      if (index === 0) { // Pop
        crouch = 0.6 * (1 - progress);
        const lift = progress * 40;
        boardY -= lift;
        boardAngle = -progress * 0.3;
      } else if (index === 1) { // Flick
        boardY = groundY - 55 - progress * 40;
        boardAngle = -0.3 * (1 - progress);
        flipAngle = progress * Math.PI;
        crouch = 0.6;
        drawForceArrow(cx - 20, boardY, -30, -15, 'Flick ~80N');
      } else if (index === 2) { // Rotation
        boardY = groundY - 95 - Math.sin(progress * Math.PI) * 20;
        flipAngle = Math.PI + progress * Math.PI;
        crouch = 0.7;
        // Rotation arc
        ctx.strokeStyle = '#7c4dff44';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, boardY, 30, 0, Math.PI * 2 * progress);
        ctx.stroke();
        drawLabel(cx + 45, boardY, `${(flipAngle * 180 / Math.PI) | 0}°`);
      } else { // Catch
        boardY = groundY - 95 + progress * 80;
        flipAngle = Math.PI * 2;
        crouch = 0.7 - progress * 0.4;
      }

      drawBoard(cx, boardY, boardAngle, flipAngle);
      drawStickFigure(cx, boardY, crouch);
      drawLabel(cx, 30, currentTrick.phases[index].name);
    },

    shuvit(t) {
      const groundY = 340;
      drawGround(groundY);
      const { index, progress } = getPhaseAt(t);
      const cx = W / 2;
      let boardY = groundY - 15, yawAngle = 0, crouch = 0;

      if (index === 0) { // Scoop
        boardY -= progress * 30;
        yawAngle = progress * 0.5;
        crouch = 0.3;
        drawForceArrow(cx + 25, boardY + 5, 20, 15, 'Scoop');
      } else if (index === 1) { // Spin
        boardY = groundY - 45 - Math.sin(progress * Math.PI) * 15;
        yawAngle = 0.5 + progress * (Math.PI - 0.5);
        crouch = 0.6;
        drawLabel(cx + 50, boardY, `${(yawAngle * 180 / Math.PI) | 0}° yaw`);
      } else { // Catch
        boardY = groundY - 45 + progress * 30;
        yawAngle = Math.PI;
        crouch = 0.6 - progress * 0.4;
      }

      // Draw board with perspective yaw (scale X by cos)
      ctx.save();
      ctx.translate(cx, boardY);
      const scaleX = Math.cos(yawAngle);
      ctx.scale(scaleX || 0.05, 1);
      drawBoard(0, 0, 0);
      ctx.restore();

      drawStickFigure(cx, boardY, crouch);
      drawLabel(cx, 30, currentTrick.phases[index].name);
    },

    manual(t) {
      const groundY = 340;
      drawGround(groundY);
      const { index, progress } = getPhaseAt(t);
      const cx = W / 2;
      let boardAngle = 0, crouch = 0;

      if (index === 0) {
        boardAngle = -progress * 0.35;
        crouch = progress * 0.2;
      } else if (index === 1) {
        boardAngle = -0.35 + Math.sin(progress * Math.PI * 8) * 0.04; // wobble
        crouch = 0.2 + Math.sin(progress * Math.PI * 6) * 0.05;
        // Balance indicator
        const off = Math.sin(progress * Math.PI * 8) * 15;
        ctx.fillStyle = Math.abs(off) > 10 ? '#ff5252' : '#4caf50';
        ctx.fillRect(cx - 30, 380, 60, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(cx + off - 2, 378, 4, 10);
        drawLabel(cx, 400, 'Center of Gravity');
      } else {
        boardAngle = -0.35 * (1 - progress);
        crouch = 0.2 * (1 - progress);
      }

      drawBoard(cx, groundY - 15, boardAngle);
      drawStickFigure(cx + 5, groundY - 15, crouch, boardAngle * 0.3);
      if (index === 1) {
        drawForceArrow(cx, groundY - 60, 0, 30, `mg = ${massSlider.value * 9.8 | 0}N`);
        drawForceArrow(cx + 25, groundY - 10, 0, -25, 'Normal');
      }
      drawLabel(cx, 30, currentTrick.phases[index].name);
    },

    dropin(t) {
      const groundY = 340;
      const { index, progress } = getPhaseAt(t);
      const cx = W / 2;
      const rampTop = 100, rampBottom = groundY;
      const rampW = 250;

      // Draw ramp
      ctx.fillStyle = colors.ground;
      ctx.beginPath();
      ctx.moveTo(cx - rampW, rampBottom);
      ctx.quadraticCurveTo(cx - rampW, rampTop, cx, rampTop);
      ctx.lineTo(cx + rampW, rampTop);
      ctx.lineTo(cx + rampW, rampBottom);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#2a2a3a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flat ground
      drawGround(rampBottom);

      let bx, by, angle = 0, crouch = 0;

      if (index === 0) { // Edge
        bx = cx;
        by = rampTop - 10;
        crouch = 0.3;
      } else if (index === 1) { // Commit
        const a = progress * Math.PI / 3;
        bx = cx - Math.sin(a) * 20;
        by = rampTop - 10 + progress * 20;
        angle = progress * 0.5;
        crouch = 0.3;
        drawForceArrow(bx, by - 60, 0, 30, 'Lean forward!');
      } else if (index === 2) { // Acceleration
        const t2 = progress;
        bx = cx - rampW * 0.8 * t2;
        by = rampTop + (rampBottom - rampTop - 15) * Math.pow(t2, 0.6);
        angle = (1 - t2) * 0.8;
        crouch = 0.3 + t2 * 0.2;
        const speed = (Math.sqrt(2 * 9.8 * (by - rampTop) / 50) * 3.6) | 0;
        drawLabel(bx, by - 100, `${speed} km/h`);
        drawForceArrow(bx, by - 80, 0, 25, 'Gravity');
      } else { // Bottom turn
        bx = cx - rampW * 0.8 - progress * 100;
        by = rampBottom - 15;
        crouch = 0.5 - progress * 0.3;
        const g = 2.5 - progress * 1.5;
        drawLabel(bx, by - 100, `${g.toFixed(1)}g`);
      }

      drawBoard(bx, by, angle);
      drawStickFigure(bx, by, crouch, angle * 0.5);
      drawLabel(cx, 30, currentTrick.phases[index].name);
    },

    grind(t) {
      const groundY = 340;
      const { index, progress } = getPhaseAt(t);
      const ledgeY = 280, ledgeX = 300, ledgeW = 280;

      // Ground & ledge
      drawGround(groundY);
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(ledgeX, ledgeY, ledgeW, groundY - ledgeY);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ledgeX, ledgeY);
      ctx.lineTo(ledgeX + ledgeW, ledgeY);
      ctx.stroke();

      let bx, by, angle = 0, crouch = 0;

      if (index === 0) { // Approach + ollie
        bx = 150 + progress * 150;
        by = groundY - 15 - progress * (groundY - ledgeY - 15);
        angle = -progress * 0.2;
        crouch = 0.4;
      } else if (index === 1) { // Lock in
        bx = ledgeX + 10;
        by = ledgeY - 15;
        crouch = 0.5;
        drawLabel(bx + 40, ledgeY - 30, 'LOCK!');
      } else if (index === 2) { // Grind
        bx = ledgeX + 10 + progress * (ledgeW - 20);
        by = ledgeY - 15;
        crouch = 0.3;
        // Sparks
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(255,${200 + Math.random() * 55 | 0},0,${Math.random()})`;
          ctx.fillRect(bx - 30 - Math.random() * 20, ledgeY - Math.random() * 8, 2, 2);
        }
        drawForceArrow(bx, by + 20, -30, 0, `f = μN ≈ ${(0.15 * massSlider.value * 9.8) | 0}N`);
        const speedPct = 100 - progress * 35 | 0;
        drawLabel(bx, by - 80, `Speed: ${speedPct}%`);
      } else { // Pop off
        bx = ledgeX + ledgeW + progress * 60;
        by = ledgeY - 15 - Math.sin(progress * Math.PI) * 40;
        crouch = 0.5 * (1 - progress);
      }

      drawBoard(bx, by, angle);
      drawStickFigure(bx, by, crouch);
      drawLabel(W / 2, 30, currentTrick.phases[index].name);
    }
  };

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    const renderer = renderers[currentTrick.draw];
    if (renderer) renderer(animTime);
    // Phase timeline
    drawTimeline();
    updateFrameIndicator();
  }

  function drawTimeline() {
    const y = H - 25, pad = 40, w = W - pad * 2;
    let x = pad;
    const total = totalDuration();
    const phaseColors = ['#00e5ff', '#7c4dff', '#ff5252', '#4caf50', '#ffab00', '#e040fb'];
    currentTrick.phases.forEach((p, i) => {
      const pw = (p.duration / total) * w;
      ctx.fillStyle = phaseColors[i % phaseColors.length] + '33';
      ctx.fillRect(x, y - 8, pw, 16);
      ctx.fillStyle = phaseColors[i % phaseColors.length];
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, x + pw / 2, y + 3);
      ctx.textAlign = 'left';
      x += pw;
    });
    // Playhead
    const px = pad + (animTime / total) * w;
    ctx.fillStyle = '#fff';
    ctx.fillRect(px - 1, y - 10, 2, 20);
  }

  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000 * parseFloat(speedSlider.value) * (slowMo ? SLOW_MO_FACTOR : 1);
    lastTimestamp = timestamp;
    animTime += dt;
    const total = totalDuration();
    if (animTime >= total) {
      animTime = total;
      animating = false;
      playBtn.textContent = '▶ Play';
    }
    drawFrame();
    updateFrameIndicator();
    if (animating) animFrame = requestAnimationFrame(animate);
  }

  function updateFrameIndicator() {
    const total = totalDuration();
    const frame = Math.round(animTime * 60);
    const totalFrames = Math.round(total * 60);
    const pct = total > 0 ? ((animTime / total) * 100).toFixed(1) : '0.0';
    frameIndicator.textContent = `${frame}/${totalFrames}f · ${pct}%${slowMo ? ' 🐢' : ''}`;
  }

  function stepFrame(direction) {
    if (animating) {
      animating = false;
      playBtn.textContent = '▶ Play';
      cancelAnimationFrame(animFrame);
    }
    const total = totalDuration();
    animTime = Math.max(0, Math.min(total, animTime + direction * FRAME_STEP));
    drawFrame();
    updateFrameIndicator();
  }

  slowMoBtn.onclick = () => {
    slowMo = !slowMo;
    slowMoBtn.classList.toggle('slow-mo-active', slowMo);
    updateFrameIndicator();
  };

  stepBackBtn.onclick = () => stepFrame(-1);
  stepFwdBtn.onclick = () => stepFrame(1);

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepFrame(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepFrame(1); }
    else if (e.key === 's' || e.key === 'S') { slowMoBtn.click(); }
    else if (e.key === ' ') { e.preventDefault(); playBtn.click(); }
  });

  playBtn.onclick = () => {
    if (animating) {
      animating = false;
      playBtn.textContent = '▶ Play';
      cancelAnimationFrame(animFrame);
    } else {
      if (animTime >= totalDuration()) animTime = 0;
      animating = true;
      lastTimestamp = 0;
      playBtn.textContent = '⏸ Pause';
      animFrame = requestAnimationFrame(animate);
    }
  };

  resetBtn.onclick = () => {
    animating = false;
    animTime = 0;
    lastTimestamp = 0;
    playBtn.textContent = '▶ Play';
    cancelAnimationFrame(animFrame);
    drawFrame();
  };

  // Init
  window.addEventListener('resize', () => { setupCanvas(); drawFrame(); });
  setupCanvas();
  selectTrick(TRICKS[0]);
})();
