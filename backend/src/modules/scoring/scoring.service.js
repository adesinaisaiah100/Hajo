const { prisma } = require('../../config/database');

// Deterministic scoring formula
// Jobs 40%, Earnings 30%, Rating 20%, Tenure 10%
function calculateScore(provider) {
  const jobsScore = Math.min(provider.completedJobs * 2, 100); // 50 jobs = max score
  const earningsScore = Math.min(Number(provider.totalEarnings) / 100000 * 100, 100); // 100k NGN = max score
  const ratingScore = (provider.averageRating || 0) * 20; // 5 stars * 20 = 100
  const tenureMonths = Math.floor((Date.now() - provider.createdAt) / (1000 * 60 * 60 * 24 * 30));
  const tenureScore = Math.min(tenureMonths * 5, 100); // 20 months = max score

  const totalScore = Math.round(
    jobsScore * 0.4 + earningsScore * 0.3 + ratingScore * 0.2 + tenureScore * 0.1
  );

  return {
    totalScore: Math.min(totalScore, 100),
    jobsScore: Math.round(jobsScore),
    earningsScore: Math.round(earningsScore),
    ratingScore: Math.round(ratingScore),
    tenureScore: Math.round(tenureScore)
  };
}

// Map score to tier
function getTier(score) {
  if (score >= 75) return 'PLATINUM';
  if (score >= 50) return 'GOLD';
  if (score >= 25) return 'SILVER';
  return 'BRONZE';
}

// Compute and save credit score
async function computeAndSaveScore(userId, providerId) {
  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider) throw new Error('Provider not found');

  const scores = calculateScore(provider);
  const tier = getTier(scores.totalScore);

  const narrative = `Provider has completed ${provider.completedJobs} jobs with ${provider.averageRating || 0} avg rating. Total earnings: ₦${provider.totalEarnings}.`;

  const creditScore = await prisma.creditScore.create({
    data: {
      userId,
      providerId,
      score: scores.totalScore,
      tier,
      jobsScore: scores.jobsScore,
      earningsScore: scores.earningsScore,
      ratingScore: scores.ratingScore,
      tenureScore: scores.tenureScore,
      narrative
    }
  });

  return creditScore;
}

module.exports = {
  calculateScore,
  getTier,
  computeAndSaveScore
};
