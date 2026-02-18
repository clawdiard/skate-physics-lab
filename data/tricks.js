// Trick physics data
const TRICKS = [
  {
    id: 'ollie',
    name: 'Ollie',
    phases: [
      { name: 'Crouch & Load', duration: 0.2, desc: 'Knees bend, lowering center of gravity. Potential energy stored in legs.' },
      { name: 'Pop (Tail Snap)', duration: 0.08, desc: 'Back foot slams tail down. Tail acts as a lever — the ground exerts ~1400N upward on the nose via the fulcrum (rear wheels).' },
      { name: 'Slide & Level', duration: 0.15, desc: 'Front foot drags forward and up, using friction to pull the board higher. The board rotates to level in the air.' },
      { name: 'Peak', duration: 0.1, desc: 'Both feet pull up (tuck). Board and skater reach max height — momentarily weightless (freefall).' },
      { name: 'Descent & Land', duration: 0.2, desc: 'Gravity pulls everything down equally. Knees bend on impact to absorb ~3-5x bodyweight in force.' }
    ],
    stats: { peakHeight: '0.3–0.6m', popForce: '~1400N', airTime: '0.4–0.6s', impactForce: '3-5× body weight' },
    science: 'The ollie uses the tail as a <b>third-class lever</b>. The rear wheels are the fulcrum, your back foot is the effort, and the nose launches upward. Front foot friction (grip tape) then drags the board to level. Newton\'s 3rd law: you push the tail down, the ground pushes the board up.',
    draw: 'ollie'
  },
  {
    id: 'kickflip',
    name: 'Kickflip',
    phases: [
      { name: 'Setup & Pop', duration: 0.15, desc: 'Same ollie pop, but front foot is angled slightly toward the heel edge for the flick.' },
      { name: 'Flick', duration: 0.08, desc: 'Front foot slides off the heel-side corner of the nose, applying a torque that spins the board along its longitudinal axis (360° heelside flip).' },
      { name: 'Rotation', duration: 0.25, desc: 'Board spins at ~600°/sec. Angular momentum is conserved — the board flips with minimal wobble thanks to spin stability.' },
      { name: 'Catch & Land', duration: 0.15, desc: 'Feet re-contact the grip tape, stopping rotation via friction. Knees absorb landing.' }
    ],
    stats: { flipRate: '~600°/s', rotations: '1 full (360°)', flickForce: '~80N lateral', airTime: '0.5–0.7s' },
    science: 'The kickflip adds <b>angular momentum about the roll axis</b> to the ollie. The flick applies a <b>torque</b> perpendicular to the board\'s length. The board acts as a spinning disc — <b>gyroscopic stability</b> keeps the flip clean. Catching it requires timing the angular position precisely.',
    draw: 'kickflip'
  },
  {
    id: 'pop-shuvit',
    name: 'Pop Shove-it',
    phases: [
      { name: 'Scoop', duration: 0.1, desc: 'Back foot scoops the tail backward and slightly down, applying torque about the vertical (yaw) axis.' },
      { name: 'Board Spin', duration: 0.3, desc: 'Board rotates 180° horizontally beneath the skater. No flip — just yaw rotation. Skater stays facing forward.' },
      { name: 'Catch', duration: 0.1, desc: 'Feet land on the now-reversed board. Front truck is where the back truck was.' }
    ],
    stats: { yawRate: '~300°/s', rotation: '180° (half turn)', scoopForce: '~200N', airTime: '0.4–0.5s' },
    science: 'The shove-it is pure <b>yaw rotation</b> (spin around vertical axis). The scoop creates a <b>torque couple</b> — your back foot pushes backward while the front foot provides a subtle forward guide. The board\'s <b>moment of inertia</b> about the vertical axis is lower than the flip axis, so it spins easily.',
    draw: 'shuvit'
  },
  {
    id: 'manual',
    name: 'Manual (Wheelie)',
    phases: [
      { name: 'Shift Weight Back', duration: 0.2, desc: 'Center of gravity shifts behind the rear axle. Front wheels lift.' },
      { name: 'Balance Point', duration: 1.0, desc: 'Continuous micro-adjustments keep the center of gravity directly above the rear contact patch. Like an inverted pendulum.' },
      { name: 'Set Down', duration: 0.15, desc: 'Weight shifts forward to bring front wheels back down.' }
    ],
    stats: { balanceAngle: '15-25°', reactionTime: '~150ms', coG_tolerance: '±2cm', difficulty: 'Inverted pendulum' },
    science: 'A manual is an <b>inverted pendulum</b> problem — inherently unstable. Your center of gravity must stay within a ~4cm window above the rear axle. Your ankles and hips are the control system, making corrections every ~150ms. This is the same physics that makes balancing a broomstick on your palm difficult.',
    draw: 'manual'
  },
  {
    id: 'drop-in',
    name: 'Drop In',
    phases: [
      { name: 'Edge Stance', duration: 0.3, desc: 'Tail on coping, weight centered. Potential energy = mgh (height of ramp).' },
      { name: 'Commit & Lean', duration: 0.15, desc: 'Weight shifts forward over the front bolts. Center of gravity moves past the tipping point.' },
      { name: 'Acceleration', duration: 0.4, desc: 'Gravity accelerates you down the transition. On a 6ft quarter: you reach ~15 mph at the bottom. PE → KE conversion.' },
      { name: 'Bottom Turn', duration: 0.2, desc: 'At the bottom of the curve, you experience centripetal acceleration. Normal force on your feet exceeds body weight.' }
    ],
    stats: { height: '1.8m (6ft)', exitSpeed: '~24 km/h', gForceBottom: '~2.5g', energyConversion: '100% PE→KE' },
    science: 'Drop-ins are pure <b>energy conservation</b>: PE (mgh) converts to KE (½mv²). On a 6ft quarter pipe, v = √(2gh) ≈ 6 m/s (13 mph). At the curved bottom, you feel <b>centripetal force</b> pushing you into the board — this is why your legs feel heavy. The commitment required is overriding your brain\'s instinct to keep your weight uphill.',
    draw: 'dropin'
  },
  {
    id: 'heelflip',
    name: 'Heelflip',
    phases: [
      { name: 'Setup & Pop', duration: 0.15, desc: 'Ollie pop with front foot positioned toe-side, toes hanging slightly off the edge for the heel flick.' },
      { name: 'Heel Flick', duration: 0.1, desc: 'Front foot kicks outward off the toe-side edge of the nose. The heel applies a torque that spins the board toe-side (opposite direction to a kickflip).' },
      { name: 'Rotation', duration: 0.25, desc: 'Board flips 360° along its longitudinal axis in the toe-side direction at ~550°/s. Angular momentum keeps the flip stable.' },
      { name: 'Catch & Land', duration: 0.15, desc: 'Feet re-contact grip tape to stop rotation. Knees compress to absorb landing forces.' }
    ],
    stats: { flipRate: '~550°/s', rotations: '1 full (360°)', flickForce: '~70N lateral', airTime: '0.5–0.7s' },
    science: 'The heelflip is the <b>mirror image</b> of the kickflip — the board rotates about the same longitudinal (roll) axis but in the <b>opposite direction</b>. The heel pushes outward off the toe-side rail, creating a torque. Because the flick uses the heel (less dexterous), many skaters find heelflips slightly harder to control. The same <b>gyroscopic stability</b> principle applies — once spinning, the board resists wobble.',
    draw: 'heelflip'
  },
  {
    id: 'tre-flip',
    name: '360 Flip (Tre Flip)',
    phases: [
      { name: 'Scoop & Flick', duration: 0.12, desc: 'Back foot scoops the tail backward (like a shove-it) while simultaneously popping. Front foot flicks for a kickflip. Two torques applied at once.' },
      { name: 'Combined Rotation', duration: 0.35, desc: 'Board undergoes simultaneous 360° shove-it (yaw) and 360° kickflip (roll). The combined angular momentum creates a distinctive diagonal spinning motion.' },
      { name: 'Catch', duration: 0.12, desc: 'Board completes both full rotations and grip tape faces up. Feet catch and stop all rotation. Precision timing is critical.' }
    ],
    stats: { yawRate: '~1000°/s', flipRate: '~1000°/s', scoopForce: '~250N', airTime: '0.5–0.7s' },
    science: 'The 360 flip combines <b>two independent angular momenta</b>: a 360° yaw rotation (shove-it) and a 360° roll rotation (kickflip). The scoop provides yaw torque while the flick provides roll torque — both applied in ~0.1s. The board traces a complex <b>3D rotation path</b>. This is one of the hardest flat-ground tricks because both rotations must complete simultaneously and the catch window is tiny (~0.05s).',
    draw: 'treflip'
  },
  {
    id: 'fs180',
    name: 'Frontside 180',
    phases: [
      { name: 'Wind Up', duration: 0.15, desc: 'Shoulders rotate slightly backside (away from direction of travel) to store rotational energy. Arms coil.' },
      { name: 'Pop & Rotate', duration: 0.12, desc: 'Ollie pop while shoulders unwind frontside. Upper body leads the rotation, transferring angular momentum to the lower body and board.' },
      { name: 'Air Rotation', duration: 0.25, desc: 'Board and body rotate 180° together. Conservation of angular momentum — the system spins as one unit. You end up riding switch (fakie).' },
      { name: 'Land Switch', duration: 0.15, desc: 'Touch down riding backward (switch stance). Knees absorb impact. Weight shifts to maintain balance in unfamiliar stance.' }
    ],
    stats: { bodyYawRate: '~500°/s', rotation: '180°', windUpAngle: '~30°', airTime: '0.4–0.6s' },
    science: 'The frontside 180 demonstrates <b>conservation of angular momentum</b> beautifully. The wind-up stores angular momentum in the upper body. During the pop, this momentum transfers through the kinetic chain (shoulders → hips → legs → board). The entire system rotates as one rigid body. "Frontside" means your front (chest) faces the direction of travel during the rotation. Landing switch requires rapid adaptation to reversed foot positioning.',
    draw: 'fs180'
  },
  {
    id: 'grind-5050',
    name: '50-50 Grind',
    phases: [
      { name: 'Approach & Ollie', duration: 0.2, desc: 'Ollie up to ledge height. Horizontal velocity must be maintained — you need both vertical and horizontal momentum.' },
      { name: 'Lock In', duration: 0.05, desc: 'Both trucks land on the ledge/rail. Weight centered over the grind surface. Kinetic friction begins.' },
      { name: 'Grind', duration: 0.5, desc: 'Sliding friction (μk ≈ 0.15 for waxed steel on concrete) decelerates you. Longer grind = more speed lost.' },
      { name: 'Pop Off', duration: 0.15, desc: 'Small ollie off the end or side. Horizontal momentum carries you clear.' }
    ],
    stats: { frictionCoeff: 'μk ≈ 0.15', speedLoss: '~20-40%', lockAngle: '±5° tolerance', waxEffect: 'Reduces μ by ~50%' },
    science: 'Grinding is a <b>kinetic friction</b> problem. The friction force f = μk × N (normal force). Wax reduces the coefficient of friction dramatically. Your horizontal KE is gradually converted to heat and sound (that satisfying grind noise is energy dissipation). Balance requires keeping your center of gravity over the narrow rail — another inverted pendulum, but moving.',
    draw: 'grind'
  }
];

if (typeof module !== 'undefined') module.exports = TRICKS;
