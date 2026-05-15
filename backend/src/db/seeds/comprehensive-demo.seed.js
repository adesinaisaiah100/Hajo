const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  'Electrical', 'Plumbing', 'Carpentry', 'AC Maintenance', 'Cleaning', 
  'Tailoring', 'Barbing', 'Catering', 'Logistics', 'Painting'
];

const LGAS = [
  'Ikeja', 'Lekki', 'Surulere', 'Yaba', 'Victoria Island', 'Ajah', 
  'Ikorodu', 'Oshodi', 'Maryland', 'Ebute Metta'
];

const SKILLS_MAP = {
  'Electrical': ['Wiring', 'Fault Diagnosis', 'Inverter Installation', 'CCTV Setup'],
  'Plumbing': ['Pipe Repair', 'Tank Cleaning', 'Bathroom Fitting', 'Drainage'],
  'Carpentry': ['Furniture Repair', 'Roofing', 'Cabinet Making', 'Door Fixing'],
  'AC Maintenance': ['Gas Refill', 'Filter Cleaning', 'Installation', 'Compressor Repair'],
  'Cleaning': ['Deep Cleaning', 'Post-Construction', 'Laundry', 'Carpet Wash'],
  'Tailoring': ['Bespoke Suits', 'Native Wear', 'Alterations', 'Bridal Wear'],
  'Barbing': ['Haircut', 'Dreadlocks', 'Home Service', 'Pedicure'],
  'Catering': ['Event Planning', 'Small Chops', 'Intercontinental', 'Baking'],
  'Logistics': ['Dispatch', 'Moving', 'Trucking', 'Packaging'],
  'Painting': ['Interior Painting', 'Wall Texturing', 'Exterior Painting', 'Wallpaper']
};

const NAMES = [
  'Moshood', 'Chidi', 'Emeka', 'Amina', 'Hauwa', 'Samuel', 'Ifeoma', 'Kunle', 'Tunde', 'Bisi',
  'Fatima', 'Olawale', 'Ngozi', 'Abubakar', 'Zainab', 'Segun', 'Yetunde', 'Ibrahim', 'Chioma', 'David',
  'Temitope', 'Adekunle', 'Blessing', 'Umar', 'Khadijah', 'Ejiro', 'Ayo', 'Uche', 'Jumoke', 'Musa'
];

const SURNAMES = [
  'Abiola', 'Okonkwo', 'Yusuf', 'Adeyemi', 'Bello', 'Ibrahim', 'Obi', 'Balogun', 'Danjuma', 'Ojo',
  'Akpan', 'Nnamdi', 'Sani', 'Olatunji', 'Eze', 'Gbadamosi', 'Usman', 'Okoro', 'Ajayi', 'Mohammed'
];

async function main() {
  console.log('Starting comprehensive demo seed (30 providers)...');

  // Clear existing data to avoid conflicts during demo setup
  // WARNING: This deletes data. Only for demo/dev.
  await prisma.negotiationMessage.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.creditScore.deleteMany({});
  await prisma.scoreSnapshot.deleteMany({});
  await prisma.provider.deleteMany({});
  await prisma.user.deleteMany({ where: { role: 'PROVIDER' } });

  for (let i = 0; i < 30; i++) {
    const firstName = NAMES[i % NAMES.length];
    const lastName = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const phone = `+23480${(10000000 + i).toString()}`;
    const category = CATEGORIES[i % CATEGORIES.length];
    const lga = LGAS[i % LGAS.length];
    const rating = (3 + Math.random() * 2).toFixed(2); // 3.0 to 5.0
    const jobs = Math.floor(Math.random() * 100);
    const earnings = (jobs * (2000 + Math.random() * 10000)).toFixed(2);
    const exp = Math.floor(Math.random() * 15) + 1;

    // Determine Tier based on jobs/rating
    let tier = 'BRONZE';
    let vTier = 'TIER_1';
    if (jobs > 50 && rating > 4.5) {
      tier = 'PLATINUM';
      vTier = 'TIER_3';
    }
    else if (jobs > 30 && rating > 4.0) {
      tier = 'GOLD';
      vTier = 'TIER_2';
    }
    else if (jobs > 10) {
      tier = 'SILVER';
      vTier = 'TIER_1';
    }

    const user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        role: 'PROVIDER',
        isVerified: true,
        verificationTier: vTier,
        city: lga,
        state: 'Lagos',
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        squadAccountNo: `00${(10000000 + i).toString()}`,
        squadAccountRef: `SQUAD_REF_${i}`,
        nin: `123456789${i.toString().padStart(2, '0')}`,
        bvn: `987654321${i.toString().padStart(2, '0')}`,
      },
    });

    const skills = SKILLS_MAP[category] || [];
    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        tradeName: `${firstName} ${category} Services`,
        bio: `Professional ${category} with ${exp} years of experience serving ${lga} and environs.`,
        skills: { set: skills },
        yearsExperience: exp,
        priceFrom: 2000,
        priceTo: 50000,
        averageRating: rating,
        completedJobs: jobs,
        totalEarnings: earnings,
        verificationStatus: 'verified',
      },
    });

    // Create a few services for each provider
    await prisma.service.create({
      data: {
        providerId: provider.id,
        title: `Standard ${category} Work`,
        description: `Basic ${category} service including diagnosis and minor repairs.`,
        category,
        price: 5000 + Math.random() * 10000,
      },
    });

    if (Math.random() > 0.5) {
      await prisma.service.create({
        data: {
          providerId: provider.id,
          title: `Premium ${category} Package`,
          description: `Comprehensive ${category} solution for large scale tasks.`,
          category,
          price: 15000 + Math.random() * 20000,
        },
      });
    }

    // Add Initial Credit Score
    await prisma.creditScore.create({
      data: {
        userId: user.id,
        providerId: provider.id,
        score: Math.floor(jobs * 0.5 + rating * 10), // Simple formula for demo
        tier: tier,
        jobsScore: Math.min(jobs * 2, 100),
        earningsScore: Math.min(Math.floor(earnings / 1000), 100),
        ratingScore: Math.floor(rating * 20),
        tenureScore: Math.min(exp * 10, 100),
        narrative: `Top-rated ${category} expert in ${lga}.`,
      },
    });
  }

  console.log('Demo seed (30 providers) completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
