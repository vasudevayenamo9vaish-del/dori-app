// Curated, 100% Gender-Accurate Avatar Catalog for Dori
// Handcrafted with explicit hair, beard, and styling parameters to guarantee
// no cross-gender avatar mismatches.

const buildUrl = ({ seed, hair, beard, glasses }) => {
  let url = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=F8F4ED`;
  if (hair) url += `&hair=${hair}`;
  if (beard) {
    url += `&beard=${beard}&beardProbability=100`;
  } else {
    url += `&beardProbability=0`;
  }
  if (glasses) {
    url += `&glasses=${glasses}&glassesProbability=100`;
  } else {
    url += `&glassesProbability=0`;
  }
  return url;
};

const RAW_CATALOG = [
  // --- MALE: YOUNG (18 - 28) ---
  // Guaranteed short cuts, fades, modern crops, clean-shaven
  { id: 'm-y-lucas', gender: 'Male', ageGroup: 'young', label: 'Lucas', seed: 'Lucas', hair: 'variant12', beard: null, glasses: null },
  { id: 'm-y-leo', gender: 'Male', ageGroup: 'young', label: 'Leo', seed: 'Leo', hair: 'variant55', beard: null, glasses: null },
  { id: 'm-y-liam', gender: 'Male', ageGroup: 'young', label: 'Liam', seed: 'Liam', hair: 'variant15', beard: null, glasses: null },
  { id: 'm-y-jack', gender: 'Male', ageGroup: 'young', label: 'Jack', seed: 'Jack', hair: 'variant27', beard: null, glasses: null },
  { id: 'm-y-milo', gender: 'Male', ageGroup: 'young', label: 'Milo', seed: 'Milo', hair: 'variant29', beard: null, glasses: null },
  { id: 'm-y-oliver', gender: 'Male', ageGroup: 'young', label: 'Oliver', seed: 'Oliver', hair: 'variant33', beard: null, glasses: null },
  { id: 'm-y-kai', gender: 'Male', ageGroup: 'young', label: 'Kai', seed: 'Kai', hair: 'variant35', beard: null, glasses: null },
  { id: 'm-y-julian', gender: 'Male', ageGroup: 'young', label: 'Julian', seed: 'Julian', hair: 'variant03', beard: null, glasses: null },

  // --- MALE: MID / PRIME (29 - 42) ---
  // Refined beards, glasses, sharp styled hair
  { id: 'm-m-felix', gender: 'Male', ageGroup: 'mid', label: 'Felix', seed: 'Felix', hair: 'variant12', beard: 'variant09', glasses: 'variant08' },
  { id: 'm-m-marcus', gender: 'Male', ageGroup: 'mid', label: 'Marcus', seed: 'Marcus', hair: 'variant13', beard: 'variant01', glasses: null },
  { id: 'm-m-arthur', gender: 'Male', ageGroup: 'mid', label: 'Arthur', seed: 'Arthur', hair: 'variant01', beard: 'variant02', glasses: null },
  { id: 'm-m-daniel', gender: 'Male', ageGroup: 'mid', label: 'Daniel', seed: 'Daniel', hair: 'variant04', beard: 'variant04', glasses: null },
  { id: 'm-m-mateo', gender: 'Male', ageGroup: 'mid', label: 'Mateo', seed: 'Mateo', hair: 'variant06', beard: 'variant05', glasses: null },
  { id: 'm-m-gabriel', gender: 'Male', ageGroup: 'mid', label: 'Gabriel', seed: 'Gabriel', hair: 'variant27', beard: 'variant06', glasses: null },
  { id: 'm-m-henry', gender: 'Male', ageGroup: 'mid', label: 'Henry', seed: 'Henry', hair: 'variant33', beard: 'variant07', glasses: null },
  { id: 'm-m-alexander', gender: 'Male', ageGroup: 'mid', label: 'Alexander', seed: 'Alexander', hair: 'variant35', beard: 'variant08', glasses: null },

  // --- MALE: MATURE (43+) ---
  // Distinguished mature beards, classic side-part hair, refined glasses
  { id: 'm-o-victor', gender: 'Male', ageGroup: 'mature', label: 'Victor', seed: 'Victor', hair: 'variant01', beard: 'variant09', glasses: 'variant11' },
  { id: 'm-o-harrison', gender: 'Male', ageGroup: 'mature', label: 'Harrison', seed: 'Harrison', hair: 'variant04', beard: 'variant10', glasses: null },
  { id: 'm-o-winston', gender: 'Male', ageGroup: 'mature', label: 'Winston', seed: 'Winston', hair: 'variant06', beard: 'variant11', glasses: null },
  { id: 'm-o-edward', gender: 'Male', ageGroup: 'mature', label: 'Edward', seed: 'Edward', hair: 'variant13', beard: 'variant12', glasses: null },
  { id: 'm-o-george', gender: 'Male', ageGroup: 'mature', label: 'George', seed: 'George', hair: 'variant27', beard: 'variant01', glasses: 'variant08' },
  { id: 'm-o-thomas', gender: 'Male', ageGroup: 'mature', label: 'Thomas', seed: 'Thomas', hair: 'variant33', beard: 'variant02', glasses: null },
  { id: 'm-o-robert', gender: 'Male', ageGroup: 'mature', label: 'Robert', seed: 'Robert', hair: 'variant35', beard: 'variant05', glasses: 'variant07' },
  { id: 'm-o-richard', gender: 'Male', ageGroup: 'mature', label: 'Richard', seed: 'Richard', hair: 'variant55', beard: 'variant06', glasses: null },

  // --- FEMALE: YOUNG (18 - 28) ---
  // Ponytails, scrunchies, headbands, bobs, cute buns (strictly NO beards)
  { id: 'f-y-chloe', gender: 'Female', ageGroup: 'young', label: 'Chloe', seed: 'Chloe', hair: 'variant10', beard: null, glasses: null },
  { id: 'f-y-zoe', gender: 'Female', ageGroup: 'young', label: 'Zoe', seed: 'Zoe', hair: 'variant28', beard: null, glasses: null },
  { id: 'f-y-aria', gender: 'Female', ageGroup: 'young', label: 'Aria', seed: 'Aria', hair: 'variant56', beard: null, glasses: null },
  { id: 'f-y-luna', gender: 'Female', ageGroup: 'young', label: 'Luna', seed: 'Luna', hair: 'variant48', beard: null, glasses: null },
  { id: 'f-y-mia', gender: 'Female', ageGroup: 'young', label: 'Mia', seed: 'Mia', hair: 'variant46', beard: null, glasses: null },
  { id: 'f-y-lily', gender: 'Female', ageGroup: 'young', label: 'Lily', seed: 'Lily', hair: 'variant07', beard: null, glasses: null },
  { id: 'f-y-maya', gender: 'Female', ageGroup: 'young', label: 'Maya', seed: 'Maya', hair: 'variant18', beard: null, glasses: null },
  { id: 'f-y-ava', gender: 'Female', ageGroup: 'young', label: 'Ava', seed: 'Ava', hair: 'variant08', beard: null, glasses: null },

  // --- FEMALE: MID / PRIME (29 - 42) ---
  // Long parted waves, shoulder curls, voluminous chic styles
  { id: 'f-m-sophia', gender: 'Female', ageGroup: 'mid', label: 'Sophia', seed: 'Sophia', hair: 'variant41', beard: null, glasses: 'variant08' },
  { id: 'f-m-emma', gender: 'Female', ageGroup: 'mid', label: 'Emma', seed: 'Emma', hair: 'variant43', beard: null, glasses: null },
  { id: 'f-m-olivia', gender: 'Female', ageGroup: 'mid', label: 'Olivia', seed: 'Olivia', hair: 'variant50', beard: null, glasses: null },
  { id: 'f-m-elena', gender: 'Female', ageGroup: 'mid', label: 'Elena', seed: 'Elena', hair: 'variant51', beard: null, glasses: null },
  { id: 'f-m-amara', gender: 'Female', ageGroup: 'mid', label: 'Amara', seed: 'Amara', hair: 'variant57', beard: null, glasses: null },
  { id: 'f-m-nora', gender: 'Female', ageGroup: 'mid', label: 'Nora', seed: 'Nora', hair: 'variant58', beard: null, glasses: null },
  { id: 'f-m-zara', gender: 'Female', ageGroup: 'mid', label: 'Zara', seed: 'Zara', hair: 'variant63', beard: null, glasses: null },
  { id: 'f-m-hannah', gender: 'Female', ageGroup: 'mid', label: 'Hannah', seed: 'Hannah', hair: 'variant14', beard: null, glasses: null },

  // --- FEMALE: MATURE (43+) ---
  // Elegant waves, graceful classic cuts, sophisticated glasses
  { id: 'f-o-grace', gender: 'Female', ageGroup: 'mature', label: 'Grace', seed: 'Grace', hair: 'variant62', beard: null, glasses: 'variant11' },
  { id: 'f-o-eleanor', gender: 'Female', ageGroup: 'mature', label: 'Eleanor', seed: 'Eleanor', hair: 'variant47', beard: null, glasses: null },
  { id: 'f-o-claire', gender: 'Female', ageGroup: 'mature', label: 'Claire', seed: 'Claire', hair: 'variant49', beard: null, glasses: 'variant07' },
  { id: 'f-o-victoria', gender: 'Female', ageGroup: 'mature', label: 'Victoria', seed: 'Victoria', hair: 'variant36', beard: null, glasses: null },
  { id: 'f-o-beatrice', gender: 'Female', ageGroup: 'mature', label: 'Beatrice', seed: 'Beatrice', hair: 'variant30', beard: null, glasses: null },
  { id: 'f-o-diana', gender: 'Female', ageGroup: 'mature', label: 'Diana', seed: 'Diana', hair: 'variant22', beard: null, glasses: 'variant04' },
  { id: 'f-o-margaret', gender: 'Female', ageGroup: 'mature', label: 'Margaret', seed: 'Margaret', hair: 'variant05', beard: null, glasses: null },
  { id: 'f-o-catherine', gender: 'Female', ageGroup: 'mature', label: 'Catherine', seed: 'Catherine', hair: 'variant02', beard: null, glasses: null },

  // --- NON-BINARY / NEUTRAL / ARTISTIC ---
  // Expressive, stylish hats, unisex creative vibes
  { id: 'n-all-sunny', gender: 'Non-binary', ageGroup: 'all', label: 'Sunny', seed: 'Sunny', hair: 'hat', beard: null, glasses: null },
  { id: 'n-all-river', gender: 'Non-binary', ageGroup: 'all', label: 'River', seed: 'River', hair: 'variant45', beard: null, glasses: null },
  { id: 'n-all-sage', gender: 'Non-binary', ageGroup: 'all', label: 'Sage', seed: 'Sage', hair: 'variant39', beard: null, glasses: null },
  { id: 'n-all-echo', gender: 'Non-binary', ageGroup: 'all', label: 'Echo', seed: 'Echo', hair: 'variant53', beard: null, glasses: null },
  { id: 'n-all-sky', gender: 'Non-binary', ageGroup: 'all', label: 'Sky', seed: 'Sky', hair: 'variant20', beard: null, glasses: null },
  { id: 'n-all-indigo', gender: 'Non-binary', ageGroup: 'all', label: 'Indigo', seed: 'Indigo', hair: 'variant25', beard: null, glasses: null },
  { id: 'n-all-rowan', gender: 'Non-binary', ageGroup: 'all', label: 'Rowan', seed: 'Rowan', hair: 'variant32', beard: null, glasses: null },
  { id: 'n-all-robin', gender: 'Non-binary', ageGroup: 'all', label: 'Robin', seed: 'Robin', hair: 'variant44', beard: null, glasses: null }
];

export const AVATAR_CATALOG = RAW_CATALOG.map(item => ({
  ...item,
  url: buildUrl(item)
}));

// Helper to determine age group from numeric age
export const getAgeGroup = (age) => {
  if (!age || isNaN(age)) return 'mid';
  if (age < 29) return 'young';
  if (age <= 42) return 'mid';
  return 'mature';
};

// Helper to calculate age from Date of Birth string (YYYY-MM-DD)
export const calculateAgeFromDob = (dobString) => {
  if (!dobString) return 25;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return isNaN(age) ? 25 : age;
};

// Get the perfect default avatar based on gender and age
export const getDefaultAvatar = ({ gender, age, dob }) => {
  const resolvedAge = age || (dob ? calculateAgeFromDob(dob) : 28);
  const targetAgeGroup = getAgeGroup(resolvedAge);
  
  let filtered = [];
  
  if (gender === 'Male') {
    filtered = AVATAR_CATALOG.filter(a => a.gender === 'Male' && a.ageGroup === targetAgeGroup);
    if (!filtered.length) filtered = AVATAR_CATALOG.filter(a => a.gender === 'Male');
  } else if (gender === 'Female') {
    filtered = AVATAR_CATALOG.filter(a => a.gender === 'Female' && a.ageGroup === targetAgeGroup);
    if (!filtered.length) filtered = AVATAR_CATALOG.filter(a => a.gender === 'Female');
  } else {
    filtered = AVATAR_CATALOG.filter(a => a.gender === 'Non-binary' || a.ageGroup === 'all');
  }
  
  // Return the first matching avatar
  return filtered[0] || AVATAR_CATALOG[0];
};
