/**
 * Kundli Matching Utility
 * Implements Ashtakoot Milan (8-point compatibility system)
 * Total: 36 points (18+ is considered good for marriage)
 */

interface KundliData {
  nakshatra?: string | null
  rashi?: string | null
  gana?: string | null
  nadi?: string | null
}

export interface KundliMatchResult {
  totalScore: number
  maxScore: number
  percentage: number
  isCompatible: boolean
  breakdown: {
    varna: { score: number; max: number; description: string }
    vashya: { score: number; max: number; description: string }
    tara: { score: number; max: number; description: string }
    yoni: { score: number; max: number; description: string }
    grahaMaitri: { score: number; max: number; description: string }
    gana: { score: number; max: number; description: string }
    bhakoot: { score: number; max: number; description: string }
    nadi: { score: number; max: number; description: string }
  }
}

// Nakshatra indices (0-26)
const NAKSHATRA_LIST = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
]

// Rashi indices (0-11)
const RASHI_LIST = [
  'Aries (Mesh)',
  'Taurus (Vrishabh)',
  'Gemini (Mithun)',
  'Cancer (Kark)',
  'Leo (Singh)',
  'Virgo (Kanya)',
  'Libra (Tula)',
  'Scorpio (Vrishchik)',
  'Sagittarius (Dhanu)',
  'Capricorn (Makar)',
  'Aquarius (Kumbh)',
  'Pisces (Meen)',
]

/**
 * Calculate Varna Kuta (Caste/Spiritual compatibility) - Max 1 point
 */
function calculateVarna(
  nakshatra1?: string | null,
  nakshatra2?: string | null,
): number {
  if (!nakshatra1 || !nakshatra2) return 0

  const getVarna = (nakshatra: string): number => {
    const index = NAKSHATRA_LIST.indexOf(nakshatra)
    if (index === -1) return 0
    // Brahmin: 0-6, Kshatriya: 7-13, Vaishya: 14-20, Shudra: 21-26
    if (index <= 6) return 4 // Brahmin
    if (index <= 13) return 3 // Kshatriya
    if (index <= 20) return 2 // Vaishya
    return 1 // Shudra
  }

  const varna1 = getVarna(nakshatra1)
  const varna2 = getVarna(nakshatra2)

  // Boy's varna should be equal or higher
  return varna1 >= varna2 ? 1 : 0
}

/**
 * Calculate Vashya Kuta (Dominance) - Max 2 points
 */
function calculateVashya(
  rashi1?: string | null,
  rashi2?: string | null,
): number {
  if (!rashi1 || !rashi2) return 0

  const vashyaMap: { [key: string]: string[] } = {
    'Aries (Mesh)': ['Leo (Singh)', 'Sagittarius (Dhanu)'],
    'Taurus (Vrishabh)': ['Cancer (Kark)', 'Libra (Tula)'],
    'Gemini (Mithun)': ['Virgo (Kanya)'],
    'Cancer (Kark)': ['Scorpio (Vrishchik)', 'Sagittarius (Dhanu)'],
    'Leo (Singh)': ['Libra (Tula)'],
    'Virgo (Kanya)': ['Gemini (Mithun)', 'Pisces (Meen)'],
    'Libra (Tula)': ['Capricorn (Makar)', 'Virgo (Kanya)'],
    'Scorpio (Vrishchik)': ['Cancer (Kark)'],
    'Sagittarius (Dhanu)': ['Pisces (Meen)'],
    'Capricorn (Makar)': ['Aries (Mesh)', 'Aquarius (Kumbh)'],
    'Aquarius (Kumbh)': ['Aries (Mesh)'],
    'Pisces (Meen)': ['Capricorn (Makar)'],
  }

  if (rashi1 === rashi2) return 2
  if (vashyaMap[rashi1]?.includes(rashi2)) return 2
  return 0
}

/**
 * Calculate Tara Kuta (Birth star compatibility) - Max 3 points
 */
function calculateTara(
  nakshatra1?: string | null,
  nakshatra2?: string | null,
): number {
  if (!nakshatra1 || !nakshatra2) return 0

  const index1 = NAKSHATRA_LIST.indexOf(nakshatra1)
  const index2 = NAKSHATRA_LIST.indexOf(nakshatra2)

  if (index1 === -1 || index2 === -1) return 0

  const diff = Math.abs(index2 - index1)
  const tara = (diff % 9) + 1

  // Favorable taras: 2, 4, 6, 8, 9
  if ([2, 4, 6, 8, 9].includes(tara)) return 3
  if ([1, 3, 5, 7].includes(tara)) return 1.5
  return 0
}

/**
 * Calculate Yoni Kuta (Sexual compatibility) - Max 4 points
 */
function calculateYoni(
  nakshatra1?: string | null,
  nakshatra2?: string | null,
): number {
  if (!nakshatra1 || !nakshatra2) return 0

  const yoniMap: { [key: string]: string } = {
    Ashwini: 'Horse',
    Bharani: 'Elephant',
    Krittika: 'Goat',
    Rohini: 'Serpent',
    Mrigashira: 'Serpent',
    Ardra: 'Dog',
    Punarvasu: 'Cat',
    Pushya: 'Goat',
    Ashlesha: 'Cat',
    Magha: 'Rat',
    'Purva Phalguni': 'Rat',
    'Uttara Phalguni': 'Cow',
    Hasta: 'Buffalo',
    Chitra: 'Tiger',
    Swati: 'Buffalo',
    Vishakha: 'Tiger',
    Anuradha: 'Deer',
    Jyeshtha: 'Deer',
    Mula: 'Dog',
    'Purva Ashadha': 'Monkey',
    'Uttara Ashadha': 'Mongoose',
    Shravana: 'Monkey',
    Dhanishta: 'Lion',
    Shatabhisha: 'Horse',
    'Purva Bhadrapada': 'Lion',
    'Uttara Bhadrapada': 'Cow',
    Revati: 'Elephant',
  }

  const yoni1 = yoniMap[nakshatra1]
  const yoni2 = yoniMap[nakshatra2]

  if (!yoni1 || !yoni2) return 0
  if (yoni1 === yoni2) return 4

  // Friendly pairs
  const friendlyPairs = [
    ['Horse', 'Elephant'],
    ['Goat', 'Monkey'],
    ['Serpent', 'Mongoose'],
    ['Dog', 'Deer'],
    ['Cat', 'Rat'],
    ['Tiger', 'Cow'],
    ['Buffalo', 'Lion'],
  ]

  for (const pair of friendlyPairs) {
    if (
      (pair[0] === yoni1 && pair[1] === yoni2) ||
      (pair[1] === yoni1 && pair[0] === yoni2)
    ) {
      return 2
    }
  }

  return 1
}

/**
 * Calculate Graha Maitri Kuta (Mental compatibility) - Max 5 points
 */
function calculateGrahaMaitri(
  rashi1?: string | null,
  rashi2?: string | null,
): number {
  if (!rashi1 || !rashi2) return 0

  const index1 = RASHI_LIST.indexOf(rashi1)
  const index2 = RASHI_LIST.indexOf(rashi2)

  if (index1 === -1 || index2 === -1) return 0

  const diff = Math.abs(index2 - index1)

  if (diff === 0) return 5 // Same sign
  if ([1, 11].includes(diff)) return 4 // Adjacent signs
  if ([5, 7].includes(diff)) return 5 // Trine (5th and 9th)
  if (diff === 6) return 0 // Opposition
  return 3
}

/**
 * Calculate Gana Kuta (Temperament) - Max 6 points
 */
function calculateGana(gana1?: string | null, gana2?: string | null): number {
  if (!gana1 || !gana2) return 0

  if (gana1 === gana2) return 6

  const ganaScore: { [key: string]: { [key: string]: number } } = {
    Dev: { Manushya: 5, Rakshasa: 0 },
    Manushya: { Dev: 5, Rakshasa: 3 },
    Rakshasa: { Dev: 0, Manushya: 3 },
  }

  return ganaScore[gana1]?.[gana2] || 0
}

/**
 * Calculate Bhakoot Kuta (Love & Affection) - Max 7 points
 */
function calculateBhakoot(
  rashi1?: string | null,
  rashi2?: string | null,
): number {
  if (!rashi1 || !rashi2) return 0

  const index1 = RASHI_LIST.indexOf(rashi1)
  const index2 = RASHI_LIST.indexOf(rashi2)

  if (index1 === -1 || index2 === -1) return 0

  const diff = Math.abs(index2 - index1)

  // Inauspicious positions: 2-12, 5-9, 6-8
  if (
    [1, 11].includes(diff) ||
    [4, 8].includes(diff) ||
    [5, 7].includes(diff)
  ) {
    return 0
  }

  return 7
}

/**
 * Calculate Nadi Kuta (Health & genes) - Max 8 points
 * CRITICAL: Same Nadi is considered inauspicious
 */
function calculateNadi(nadi1?: string | null, nadi2?: string | null): number {
  if (!nadi1 || !nadi2) return 0

  // Same Nadi is a major dosha (defect)
  if (nadi1 === nadi2) return 0

  return 8
}

/**
 * Main function to calculate Kundli match
 */
export function calculateKundliMatch(
  person1: KundliData,
  person2: KundliData,
): KundliMatchResult {
  const varna = calculateVarna(person1.nakshatra, person2.nakshatra)
  const vashya = calculateVashya(person1.rashi, person2.rashi)
  const tara = calculateTara(person1.nakshatra, person2.nakshatra)
  const yoni = calculateYoni(person1.nakshatra, person2.nakshatra)
  const grahaMaitri = calculateGrahaMaitri(person1.rashi, person2.rashi)
  const gana = calculateGana(person1.gana, person2.gana)
  const bhakoot = calculateBhakoot(person1.rashi, person2.rashi)
  const nadi = calculateNadi(person1.nadi, person2.nadi)

  const totalScore =
    varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi
  const maxScore = 36
  const percentage = Math.round((totalScore / maxScore) * 100)

  return {
    totalScore,
    maxScore,
    percentage,
    isCompatible: totalScore >= 18, // 18+ is considered acceptable
    breakdown: {
      varna: {
        score: varna,
        max: 1,
        description: 'Spiritual compatibility',
      },
      vashya: {
        score: vashya,
        max: 2,
        description: 'Dominance & attraction',
      },
      tara: {
        score: tara,
        max: 3,
        description: 'Birth star compatibility',
      },
      yoni: {
        score: yoni,
        max: 4,
        description: 'Sexual compatibility',
      },
      grahaMaitri: {
        score: grahaMaitri,
        max: 5,
        description: 'Mental compatibility',
      },
      gana: {
        score: gana,
        max: 6,
        description: 'Temperament',
      },
      bhakoot: {
        score: bhakoot,
        max: 7,
        description: 'Love & affection',
      },
      nadi: {
        score: nadi,
        max: 8,
        description: 'Health & genes (Critical)',
      },
    },
  }
}

// ─── DOB-Based Auto Calculation ───────────────────────────────────────────────

/**
 * Nakshatra sequence spans 360° of the zodiac.
 * Each Nakshatra = 13°20' (800 arcminutes).
 * We use the Moon's longitude derived from a simplified Vedic algorithm.
 */

const NAKSHATRA_GANA: Record<string, string> = {
  Ashwini: 'Deva',
  Bharani: 'Manushya',
  Krittika: 'Rakshasa',
  Rohini: 'Manushya',
  Mrigashira: 'Deva',
  Ardra: 'Manushya',
  Punarvasu: 'Deva',
  Pushya: 'Deva',
  Ashlesha: 'Rakshasa',
  Magha: 'Rakshasa',
  'Purva Phalguni': 'Manushya',
  'Uttara Phalguni': 'Manushya',
  Hasta: 'Deva',
  Chitra: 'Rakshasa',
  Swati: 'Deva',
  Vishakha: 'Rakshasa',
  Anuradha: 'Deva',
  Jyeshtha: 'Rakshasa',
  Mula: 'Rakshasa',
  'Purva Ashadha': 'Manushya',
  'Uttara Ashadha': 'Manushya',
  Shravana: 'Deva',
  Dhanishta: 'Rakshasa',
  Shatabhisha: 'Rakshasa',
  'Purva Bhadrapada': 'Manushya',
  'Uttara Bhadrapada': 'Manushya',
  Revati: 'Deva',
}

const NAKSHATRA_NADI: Record<string, string> = {
  Ashwini: 'Aadi',
  Bharani: 'Madhya',
  Krittika: 'Antya',
  Rohini: 'Antya',
  Mrigashira: 'Madhya',
  Ardra: 'Aadi',
  Punarvasu: 'Aadi',
  Pushya: 'Madhya',
  Ashlesha: 'Antya',
  Magha: 'Antya',
  'Purva Phalguni': 'Madhya',
  'Uttara Phalguni': 'Aadi',
  Hasta: 'Aadi',
  Chitra: 'Madhya',
  Swati: 'Antya',
  Vishakha: 'Antya',
  Anuradha: 'Madhya',
  Jyeshtha: 'Aadi',
  Mula: 'Aadi',
  'Purva Ashadha': 'Madhya',
  'Uttara Ashadha': 'Antya',
  Shravana: 'Antya',
  Dhanishta: 'Madhya',
  Shatabhisha: 'Aadi',
  'Purva Bhadrapada': 'Aadi',
  'Uttara Bhadrapada': 'Madhya',
  Revati: 'Antya',
}

// Each Nakshatra covers exactly 13°20' = 800 arcminutes of the Moon's longitude
// Nakshatra index 0 = Ashwini starts at 0°, ends at 13°20'
const NAKSHATRA_RASHI: Record<string, string> = {
  Ashwini: 'Aries (Mesh)',
  Bharani: 'Aries (Mesh)',
  Krittika: 'Taurus (Vrishabh)',
  Rohini: 'Taurus (Vrishabh)',
  Mrigashira: 'Gemini (Mithun)',
  Ardra: 'Gemini (Mithun)',
  Punarvasu: 'Cancer (Kark)',
  Pushya: 'Cancer (Kark)',
  Ashlesha: 'Cancer (Kark)',
  Magha: 'Leo (Simha)',
  'Purva Phalguni': 'Leo (Simha)',
  'Uttara Phalguni': 'Virgo (Kanya)',
  Hasta: 'Virgo (Kanya)',
  Chitra: 'Libra (Tula)',
  Swati: 'Libra (Tula)',
  Vishakha: 'Scorpio (Vrishchik)',
  Anuradha: 'Scorpio (Vrishchik)',
  Jyeshtha: 'Scorpio (Vrishchik)',
  Mula: 'Sagittarius (Dhanu)',
  'Purva Ashadha': 'Sagittarius (Dhanu)',
  'Uttara Ashadha': 'Capricorn (Makar)',
  Shravana: 'Capricorn (Makar)',
  Dhanishta: 'Aquarius (Kumbh)',
  Shatabhisha: 'Aquarius (Kumbh)',
  'Purva Bhadrapada': 'Pisces (Meen)',
  'Uttara Bhadrapada': 'Pisces (Meen)',
  Revati: 'Pisces (Meen)',
}

/**
 * Calculate Julian Day Number from a date
 */
function getJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1
    month += 12
  }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  )
}

/**
 * Simplified Moon longitude calculation (degrees)
 * Based on Jean Meeus "Astronomical Algorithms" simplified formula
 */
function getMoonLongitude(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
): number {
  const jd = getJulianDay(year, month, day) + hour / 24.0
  const T = (jd - 2451545.0) / 36525.0 // Julian centuries from J2000.0

  // Moon's mean longitude
  let L0 = 218.3164477 + 481267.88123421 * T
  // Moon's mean anomaly
  let M = 134.9633964 + 477198.8675055 * T
  // Sun's mean anomaly
  let Ms = 357.5291092 + 35999.0502909 * T
  // Moon's argument of latitude
  let F = 93.272095 + 483202.0175233 * T
  // Moon's mean elongation
  let D = 297.8501921 + 445267.1114034 * T

  // Convert to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180
  M = toRad(M)
  Ms = toRad(Ms)
  F = toRad(F)
  D = toRad(D)

  // Main corrections (degrees)
  const correction =
    6.288774 * Math.sin(M) +
    1.274027 * Math.sin(2 * D - M) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * M) -
    0.185116 * Math.sin(Ms) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * M) +
    0.057066 * Math.sin(2 * D - Ms - M) +
    0.053322 * Math.sin(2 * D + M) +
    0.045758 * Math.sin(2 * D - Ms) -
    0.040923 * Math.sin(Ms - M) -
    0.03472 * Math.sin(D) -
    0.030383 * Math.sin(Ms + M)

  // Add ayanamsa correction for Vedic (sidereal) system — Lahiri ayanamsa ~23.85° for ~2000
  const ayanamsa = 23.85 + (T * 50.3) / 3600

  let moonLong = (((L0 + correction - ayanamsa) % 360) + 360) % 360
  return moonLong
}

export interface AstroData {
  nakshatra: string
  rashi: string
  gana: string
  nadi: string
  nakshatraIndex: number
  moonLongitude: number
}

/**
 * Derive Nakshatra, Rashi, Gana, Nadi from Date of Birth and Birth Time
 * @param dateOfBirth - ISO date string or Date object
 * @param birthTime   - "HH:MM" format (optional, defaults to noon)
 * @param birthPlace  - used for future timezone adjustments (optional)
 */
export function calculateAstroFromDOB(
  dateOfBirth: string | Date | null | undefined,
  birthTime?: string | null,
  birthPlace?: string | null,
): AstroData | null {
  if (!dateOfBirth) return null

  try {
    const dob =
      typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
    if (isNaN(dob.getTime())) return null

    const year = dob.getFullYear()
    const month = dob.getMonth() + 1 // 1-indexed
    const day = dob.getDate()

    // Parse birth time (default to 12:00 noon if not provided)
    let hour = 12
    if (birthTime) {
      const parts = birthTime.split(':')
      if (parts.length >= 2) {
        hour = parseInt(parts[0]) + parseInt(parts[1]) / 60
      }
    }

    const moonLong = getMoonLongitude(year, month, day, hour)

    // Each Nakshatra = 360° / 27 = 13.333...°
    const nakshatraIndex = Math.floor(moonLong / (360 / 27))
    const clampedIndex = Math.min(nakshatraIndex, 26)
    const nakshatra = NAKSHATRA_LIST[clampedIndex]

    const rashi =
      NAKSHATRA_RASHI[nakshatra] ??
      RASHI_LIST[Math.floor((moonLong / 360) * 12)]
    const gana = NAKSHATRA_GANA[nakshatra] ?? 'Deva'
    const nadi = NAKSHATRA_NADI[nakshatra] ?? 'Aadi'

    return {
      nakshatra,
      rashi,
      gana,
      nadi,
      nakshatraIndex: clampedIndex,
      moonLongitude: moonLong,
    }
  } catch {
    return null
  }
}

/**
 * Calculate Kundli match directly from DOB + birth time
 * Falls back to manually entered nakshatra/rashi/gana/nadi if astro data not available
 */
export function calculateKundliMatchFromDOB(
  person1: KundliData & {
    dateOfBirth?: string | Date | null
    birthTime?: string | null
    birthPlace?: string | null
  },
  person2: KundliData & {
    dateOfBirth?: string | Date | null
    birthTime?: string | null
    birthPlace?: string | null
  },
): KundliMatchResult & {
  person1Astro: AstroData | null
  person2Astro: AstroData | null
} {
  // Try to derive astro data from DOB first
  const astro1 = calculateAstroFromDOB(
    person1.dateOfBirth,
    person1.birthTime,
    person1.birthPlace,
  )
  const astro2 = calculateAstroFromDOB(
    person2.dateOfBirth,
    person2.birthTime,
    person2.birthPlace,
  )

  // Build final kundli data — DOB-derived takes priority, falls back to manual
  const data1: KundliData = {
    nakshatra: astro1?.nakshatra ?? person1.nakshatra,
    rashi: astro1?.rashi ?? person1.rashi,
    gana: astro1?.gana ?? person1.gana,
    nadi: astro1?.nadi ?? person1.nadi,
  }
  const data2: KundliData = {
    nakshatra: astro2?.nakshatra ?? person2.nakshatra,
    rashi: astro2?.rashi ?? person2.rashi,
    gana: astro2?.gana ?? person2.gana,
    nadi: astro2?.nadi ?? person2.nadi,
  }

  const result = calculateKundliMatch(data1, data2)
  return { ...result, person1Astro: astro1, person2Astro: astro2 }
}

/**
 * Get compatibility level based on score
 */
export function getCompatibilityLevel(score: number): {
  level: string
  color: string
  description: string
} {
  if (score >= 28) {
    return {
      level: 'Excellent',
      color: 'green',
      description: 'Highly compatible match',
    }
  } else if (score >= 24) {
    return {
      level: 'Very Good',
      color: 'blue',
      description: 'Very good compatibility',
    }
  } else if (score >= 18) {
    return {
      level: 'Good',
      color: 'teal',
      description: 'Good compatibility',
    }
  } else if (score >= 12) {
    return {
      level: 'Average',
      color: 'yellow',
      description: 'Average compatibility',
    }
  } else {
    return {
      level: 'Poor',
      color: 'red',
      description: 'Low compatibility',
    }
  }
}
