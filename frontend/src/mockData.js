// mockData.js

const DEFAULT_CAMPAIGNS = [
  {
    _id: "c1",
    title: "Empower Girls Education",
    description: "Provide school supplies, books, and uniforms to underprivileged girls in rural communities.",
    goalAmount: 150000,
    raisedAmount: 45000,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
  },
  {
    _id: "c2",
    title: "Feed the Hungry Foundation",
    description: "Distribute monthly food rations and warm meals to families facing extreme poverty.",
    goalAmount: 200000,
    raisedAmount: 120000,
    startDate: "2026-07-01",
    endDate: "2026-09-30",
  },
  {
    _id: "c3",
    title: "Clean Water Initiative",
    description: "Install clean drinking water handpumps in dry districts to prevent waterborne illnesses.",
    goalAmount: 80000,
    raisedAmount: 62000,
    startDate: "2026-05-15",
    endDate: "2026-08-15",
  }
];

const DEFAULT_USER = {
  firstname: "Devanshi",
  lastname: "Jaiswal",
  email: "devanshishs@gmail.com",
  phone: "8318500748",
  role: "Intern",
  referralCode: "YSVW6E",
  goal: 30000,
  avatar: "",
  email_verified: true,
  phone_verified: false,
};

const DEFAULT_LEADERBOARD = [
  { name: "Devanshi Jaiswal", referralCode: "YSVW6E", totalAmount: 18500, referrals: 7 },
  { name: "Ankit Sharma", referralCode: "ANKI883", totalAmount: 15000, referrals: 5 },
  { name: "Meera Nair", referralCode: "MEER392", totalAmount: 7200, referrals: 3 },
  { name: "Rahul Verma", referralCode: "RAHU002", totalAmount: 3600, referrals: 1 }
];

const DEFAULT_DONATIONS = [
  { _id: "d1", donorName: "Aman Gupta", amount: 7200, date: "2026-07-08T10:30:00Z", paymentStatus: "completed", referralCode: "YSVW6E", campaignDetails: { title: "Empower Girls Education" } },
  { _id: "d2", donorName: "Priya Sen", amount: 3600, date: "2026-07-07T14:20:00Z", paymentStatus: "completed", referralCode: "YSVW6E", campaignDetails: { title: "Empower Girls Education" } },
  { _id: "d3", donorName: "Rohan Das", amount: 7700, date: "2026-07-06T19:15:00Z", paymentStatus: "completed", referralCode: "YSVW6E", campaignDetails: { title: "Feed the Hungry Foundation" } },
];

export const initMockData = () => {
  if (!localStorage.getItem("mock_campaigns")) {
    localStorage.setItem("mock_campaigns", JSON.stringify(DEFAULT_CAMPAIGNS));
  }
  if (!localStorage.getItem("mock_user")) {
    localStorage.setItem("mock_user", JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem("mock_leaderboard")) {
    localStorage.setItem("mock_leaderboard", JSON.stringify(DEFAULT_LEADERBOARD));
  }
  if (!localStorage.getItem("mock_donations")) {
    localStorage.setItem("mock_donations", JSON.stringify(DEFAULT_DONATIONS));
  }
};

export const getMockCampaigns = () => {
  initMockData();
  return JSON.parse(localStorage.getItem("mock_campaigns"));
};

export const getMockUser = () => {
  initMockData();
  return JSON.parse(localStorage.getItem("mock_user"));
};

export const saveMockUser = (user) => {
  localStorage.setItem("mock_user", JSON.stringify(user));
  // Update name in leaderboard if it matches
  const leaderboard = getMockLeaderboard();
  const index = leaderboard.findIndex(item => item.referralCode === user.referralCode);
  if (index !== -1) {
    leaderboard[index].name = `${user.firstname} ${user.lastname}`;
    localStorage.setItem("mock_leaderboard", JSON.stringify(leaderboard));
  }
};

export const getMockLeaderboard = () => {
  initMockData();
  return JSON.parse(localStorage.getItem("mock_leaderboard"));
};

export const getMockDonations = () => {
  initMockData();
  return JSON.parse(localStorage.getItem("mock_donations"));
};

export const addMockDonation = (donation) => {
  initMockData();
  const donations = getMockDonations();
  const newDonation = {
    _id: `d_mock_${Date.now()}`,
    date: new Date().toISOString(),
    paymentStatus: "completed",
    ...donation
  };
  donations.unshift(newDonation);
  localStorage.setItem("mock_donations", JSON.stringify(donations));

  // Update campaign raisedAmount
  const campaigns = getMockCampaigns();
  const cIndex = campaigns.findIndex(c => c._id === donation.campaignId);
  if (cIndex !== -1) {
    campaigns[cIndex].raisedAmount += donation.amount;
    localStorage.setItem("mock_campaigns", JSON.stringify(campaigns));
  }

  // Update leaderboard and user raised amount if referralCode matches
  if (donation.referralCode) {
    const leaderboard = getMockLeaderboard();
    const lIndex = leaderboard.findIndex(l => l.referralCode === donation.referralCode);
    if (lIndex !== -1) {
      leaderboard[lIndex].totalAmount += donation.amount;
      leaderboard[lIndex].referrals += 1;
    } else {
      leaderboard.push({
        name: donation.donorName || "Anonymous Donor",
        referralCode: donation.referralCode,
        totalAmount: donation.amount,
        referrals: 1
      });
    }
    // Sort leaderboard desc
    leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);
    localStorage.setItem("mock_leaderboard", JSON.stringify(leaderboard));
  }
  return newDonation;
};
