const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const kundliData = [
  { nakshatra: 'Ashwini', rashi: 'Aries (Mesh)', gana: 'Deva', nadi: 'Aadi' },
  {
    nakshatra: 'Bharani',
    rashi: 'Taurus (Vrishabh)',
    gana: 'Manushya',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Krittika',
    rashi: 'Taurus (Vrishabh)',
    gana: 'Rakshasa',
    nadi: 'Antya',
  },
  {
    nakshatra: 'Rohini',
    rashi: 'Taurus (Vrishabh)',
    gana: 'Manushya',
    nadi: 'Aadi',
  },
  {
    nakshatra: 'Mrigashira',
    rashi: 'Gemini (Mithun)',
    gana: 'Deva',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Ardra',
    rashi: 'Gemini (Mithun)',
    gana: 'Manushya',
    nadi: 'Antya',
  },
  {
    nakshatra: 'Punarvasu',
    rashi: 'Cancer (Kark)',
    gana: 'Deva',
    nadi: 'Aadi',
  },
  { nakshatra: 'Pushya', rashi: 'Cancer (Kark)', gana: 'Deva', nadi: 'Madhya' },
  {
    nakshatra: 'Ashlesha',
    rashi: 'Cancer (Kark)',
    gana: 'Rakshasa',
    nadi: 'Antya',
  },
  { nakshatra: 'Magha', rashi: 'Leo (Simha)', gana: 'Rakshasa', nadi: 'Aadi' },
  {
    nakshatra: 'Purva Phalguni',
    rashi: 'Leo (Simha)',
    gana: 'Manushya',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Uttara Phalguni',
    rashi: 'Virgo (Kanya)',
    gana: 'Manushya',
    nadi: 'Antya',
  },
  { nakshatra: 'Hasta', rashi: 'Virgo (Kanya)', gana: 'Deva', nadi: 'Aadi' },
  {
    nakshatra: 'Chitra',
    rashi: 'Libra (Tula)',
    gana: 'Rakshasa',
    nadi: 'Madhya',
  },
  { nakshatra: 'Swati', rashi: 'Libra (Tula)', gana: 'Deva', nadi: 'Antya' },
  {
    nakshatra: 'Vishakha',
    rashi: 'Scorpio (Vrishchik)',
    gana: 'Rakshasa',
    nadi: 'Aadi',
  },
  {
    nakshatra: 'Anuradha',
    rashi: 'Scorpio (Vrishchik)',
    gana: 'Deva',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Jyeshtha',
    rashi: 'Scorpio (Vrishchik)',
    gana: 'Rakshasa',
    nadi: 'Antya',
  },
  {
    nakshatra: 'Mula',
    rashi: 'Sagittarius (Dhanu)',
    gana: 'Rakshasa',
    nadi: 'Aadi',
  },
  {
    nakshatra: 'Purva Ashadha',
    rashi: 'Sagittarius (Dhanu)',
    gana: 'Manushya',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Uttara Ashadha',
    rashi: 'Capricorn (Makar)',
    gana: 'Manushya',
    nadi: 'Antya',
  },
  {
    nakshatra: 'Shravana',
    rashi: 'Capricorn (Makar)',
    gana: 'Deva',
    nadi: 'Aadi',
  },
  {
    nakshatra: 'Dhanishta',
    rashi: 'Aquarius (Kumbh)',
    gana: 'Rakshasa',
    nadi: 'Madhya',
  },
  {
    nakshatra: 'Shatabhisha',
    rashi: 'Aquarius (Kumbh)',
    gana: 'Rakshasa',
    nadi: 'Antya',
  },
  {
    nakshatra: 'Purva Bhadrapada',
    rashi: 'Pisces (Meen)',
    gana: 'Manushya',
    nadi: 'Aadi',
  },
  {
    nakshatra: 'Uttara Bhadrapada',
    rashi: 'Pisces (Meen)',
    gana: 'Manushya',
    nadi: 'Madhya',
  },
  { nakshatra: 'Revati', rashi: 'Pisces (Meen)', gana: 'Deva', nadi: 'Antya' },
]

async function updateUsers() {
  try {
    console.log('🔍 Fetching users...\n')

    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      take: 30,
      orderBy: { createdAt: 'asc' },
    })

    console.log(`Found ${users.length} users to update\n`)

    let successCount = 0

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const kundli = kundliData[i % kundliData.length]

      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            nakshatra: kundli.nakshatra,
            rashi: kundli.rashi,
            gana: kundli.gana,
            nadi: kundli.nadi,
            manglik: i % 3 === 0 ? 'YES' : 'NO',
            birthTime: `${String(8 + (i % 12)).padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`,
            birthPlace: ['Delhi', 'Mumbai', 'Jaipur', 'Lucknow', 'Agra'][i % 5],
          },
        })

        successCount++
        console.log(
          `✅ ${successCount}. ${user.firstName} ${user.lastName} - ${kundli.nakshatra}, ${kundli.rashi}, ${kundli.gana}, ${kundli.nadi}`,
        )
      } catch (err) {
        console.error(
          `❌ Failed to update ${user.firstName} ${user.lastName}:`,
          err.message,
        )
      }
    }

    console.log(
      `\n🎉 Successfully updated ${successCount} out of ${users.length} users!`,
    )
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUsers()
