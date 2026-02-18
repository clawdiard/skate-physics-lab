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

// Quiz questions per trick
const QUIZ_QUESTIONS = {
  ollie: [
    { q: 'What approximate upward force does the tail snap generate?', options: ['~400N', '~800N', '~1400N', '~2200N'], answer: 2, explain: 'The tail acts as a lever — the ground pushes up ~1400N on the nose through the rear-wheel fulcrum.' },
    { q: 'How long is a typical ollie airtime?', options: ['0.1–0.2s', '0.4–0.6s', '0.8–1.0s', '1.5–2.0s'], answer: 1, explain: 'An ollie typically keeps you airborne for 0.4–0.6 seconds — enough to clear a curb or small gap.' },
    { q: 'What force multiplier hits your legs on landing?', options: ['1–2×', '3–5×', '8–10×', '15×'], answer: 1, explain: 'Landing absorbs 3–5× your body weight, which is why bent knees are crucial for shock absorption.' },
    { q: 'What type of lever is the tail snap?', options: ['First-class', 'Second-class', 'Third-class', 'Not a lever'], answer: 2, explain: 'The tail is a third-class lever: fulcrum at the rear wheels, effort from your back foot, load at the nose.' }
  ],
  kickflip: [
    { q: 'How fast does the board spin during a kickflip?', options: ['~200°/s', '~400°/s', '~600°/s', '~1000°/s'], answer: 2, explain: 'The board rotates at roughly 600°/s along its longitudinal axis during a clean kickflip.' },
    { q: 'What lateral force does the flick apply?', options: ['~20N', '~50N', '~80N', '~150N'], answer: 2, explain: 'The front foot flicks off the heel-side edge with about 80N of lateral force to initiate the spin.' },
    { q: 'What keeps the flip rotation stable?', options: ['Air resistance', 'Gyroscopic stability', 'Grip tape', 'Truck weight'], answer: 1, explain: 'Once spinning, the board acts like a gyroscope — angular momentum resists wobble and keeps the flip clean.' }
  ],
  'pop-shuvit': [
    { q: 'How many degrees does the board rotate in a pop shove-it?', options: ['90°', '180°', '270°', '360°'], answer: 1, explain: 'A standard pop shove-it rotates the board 180° around the vertical (yaw) axis.' },
    { q: 'What is the approximate scoop force?', options: ['~50N', '~100N', '~200N', '~400N'], answer: 2, explain: 'The back foot scoops with about 200N to spin the board beneath you.' },
    { q: 'What axis does the board rotate around?', options: ['Roll (longitudinal)', 'Pitch (lateral)', 'Yaw (vertical)', 'All three'], answer: 2, explain: 'The shove-it is pure yaw rotation — the board spins horizontally with no flip.' }
  ],
  manual: [
    { q: 'What is the balance angle range for a manual?', options: ['5–10°', '15–25°', '35–45°', '50–60°'], answer: 1, explain: 'The sweet spot is 15–25° — too low and the front wheels touch, too high and you fall backward.' },
    { q: 'How tight is the center-of-gravity tolerance?', options: ['±10cm', '±5cm', '±2cm', '±0.5cm'], answer: 2, explain: 'Your center of gravity must stay within a ±2cm window above the rear axle — like an inverted pendulum.' },
    { q: 'A manual is equivalent to what physics problem?', options: ['Projectile motion', 'Inverted pendulum', 'Simple harmonic oscillator', 'Orbital mechanics'], answer: 1, explain: 'A manual is an inverted pendulum — inherently unstable, requiring constant micro-corrections.' }
  ],
  'drop-in': [
    { q: 'What speed do you reach dropping into a 6ft quarter?', options: ['~8 km/h', '~16 km/h', '~24 km/h', '~35 km/h'], answer: 2, explain: 'From v = √(2gh): about 6 m/s or ~24 km/h at the bottom of a 6ft (1.8m) quarter pipe.' },
    { q: 'What g-force do you feel at the bottom of the transition?', options: ['~1g', '~1.5g', '~2.5g', '~4g'], answer: 2, explain: 'Centripetal acceleration at the bottom of the curved transition adds to gravity, giving about 2.5g total.' },
    { q: 'What energy conversion occurs during a drop-in?', options: ['KE → PE', 'PE → KE', 'PE → Heat', 'KE → Heat'], answer: 1, explain: '100% potential energy (mgh) converts to kinetic energy (½mv²), minus small friction losses.' }
  ],
  heelflip: [
    { q: 'Compared to a kickflip, which direction does a heelflip spin?', options: ['Same direction', 'Opposite direction', 'Vertical', 'No spin'], answer: 1, explain: 'The heelflip is the mirror image of a kickflip — same roll axis, opposite (toe-side) rotation direction.' },
    { q: 'What is the approximate heelflip rotation rate?', options: ['~300°/s', '~550°/s', '~800°/s', '~1200°/s'], answer: 1, explain: 'Heelflips spin at about 550°/s — slightly slower than kickflips because the heel is less dexterous than the toe-side flick.' }
  ],
  grind: [
    { q: 'What keeps you locked onto the rail during a grind?', options: ['Magnetism', 'Gravity + truck geometry', 'Grip tape', 'Speed alone'], answer: 1, explain: 'The concave truck hanger locks onto the rail, and gravity keeps downward pressure. The truck geometry creates a natural channel that resists lateral movement.' },
    { q: 'What primarily slows you down during a grind?', options: ['Air drag', 'Kinetic friction', 'Rolling resistance', 'Gravity'], answer: 1, explain: 'Metal-on-metal (or metal-on-concrete) kinetic friction is the primary decelerating force during a grind, with a coefficient of ~0.3–0.5.' }
  ]
};

if (typeof module !== 'undefined') module.exports = { TRICKS, QUIZ_QUESTIONS };
