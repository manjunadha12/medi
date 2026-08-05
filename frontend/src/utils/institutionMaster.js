/**
 * MediConsult - Institutional Node Master Database
 * Comprehensive registry of medical institutions with AI-powered search logic.
 */

export const INSTITUTIONS = [
  {
    id: "INST-001",
    uuid: "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    name: "Saveetha Medical College and Hospital",
    shortName: "Saveetha Medical College",
    aliases: ["SMCH", "Saveetha Medical", "Saveetha Hospital", "SIMATS"],
    type: "Medical College & Teaching Hospital",
    city: "Chennai",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "602105",
    address: "Saveetha Nagar, Thandalam, Chennai",
    latitude: 13.0287,
    longitude: 80.0163,
    website: "https://saveethamedicalcollege.com",
    emailDomain: "saveetha.com",
    phone: "044 2681 1601",
    ownership: "Private",
    university: "SIMATS",
    affiliation: "Saveetha Institute of Medical and Technical Sciences",
    nmcApproval: "Recognized",
    nabhStatus: "Accredited",
    naacGrade: "A++",
    approvalStatus: "Approved",
    verificationStatus: "Verified",
    category: "Super Specialty",
    hospitalId: "HSP10234",
    collegeId: "COL45021",
    logo: "🏥"
  },
  {
    id: "INST-001-D",
    name: "Saveetha Dental College",
    shortName: "Saveetha Dental",
    aliases: ["SDC", "Saveetha Dental"],
    type: "Dental College",
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600077",
    address: "Poonamallee High Rd, Velappanchavadi",
    latitude: 13.0524,
    longitude: 80.1384,
    website: "https://dental.saveetha.com",
    emailDomain: "saveetha.com",
    phone: "044 2680 1583",
    ownership: "Private",
    university: "SIMATS",
    nmcApproval: "Recognized",
    nabhStatus: "Accredited",
    naacGrade: "A++",
    approvalStatus: "Approved",
    verificationStatus: "Verified",
    hospitalId: "HSP10235",
    collegeId: "COL45022"
  },
  {
    id: "INST-001-N",
    name: "Saveetha College of Nursing",
    type: "Nursing College",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "602105",
    address: "Thandalam, Chennai",
    ownership: "Private",
    university: "SIMATS",
    verificationStatus: "Verified"
  },
  {
    id: "INST-002",
    uuid: "b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6",
    name: "All India Institute of Medical Sciences, Delhi",
    shortName: "AIIMS New Delhi",
    aliases: ["AIIMS Delhi", "AIIMS"],
    type: "Medical University",
    city: "New Delhi",
    district: "South Delhi",
    state: "Delhi",
    country: "India",
    postalCode: "110029",
    address: "Ansari Nagar, New Delhi",
    latitude: 28.5672,
    longitude: 77.2100,
    website: "https://www.aiims.edu",
    emailDomain: "aiims.edu",
    phone: "011 2658 8500",
    ownership: "Government",
    university: "AIIMS",
    affiliation: "Autonomous",
    nmcApproval: "Recognized",
    nabhStatus: "Accredited",
    naacGrade: "A++",
    approvalStatus: "Approved",
    verificationStatus: "Verified",
    category: "Multi Specialty",
    hospitalId: "HSP11001",
    collegeId: "COL11001"
  },
  {
    id: "INST-002-P",
    name: "AIIMS Patna",
    shortName: "AIIMS Patna",
    type: "Medical College & Hospital",
    city: "Patna",
    state: "Bihar",
    country: "India",
    ownership: "Government",
    verificationStatus: "Verified"
  },
  {
    id: "INST-002-B",
    name: "AIIMS Bhubaneswar",
    shortName: "AIIMS Bhubaneswar",
    type: "Medical College & Hospital",
    city: "Bhubaneswar",
    state: "Odisha",
    country: "India",
    ownership: "Government",
    verificationStatus: "Verified"
  },
  {
    id: "INST-003",
    uuid: "c3d4e5f6-g7h8-6i9j-0k1l-m2n3o4p5q6r7",
    name: "Christian Medical College Vellore",
    shortName: "CMC Vellore",
    aliases: ["CMC", "CMC Vellore"],
    type: "Teaching Hospital",
    city: "Vellore",
    district: "Vellore",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "632004",
    address: "Ida Scudder Rd, Vellore",
    latitude: 12.9250,
    longitude: 79.1325,
    website: "https://www.cmch-vellore.edu",
    emailDomain: "cmcvellore.ac.in",
    phone: "0416 228 1000",
    ownership: "Private (Trust)",
    university: "Dr. M.G.R. Medical University",
    affiliation: "The Tamil Nadu Dr. M.G.R. Medical University",
    nmcApproval: "Recognized",
    nabhStatus: "Accredited",
    naacGrade: "A",
    approvalStatus: "Approved",
    verificationStatus: "Verified",
    category: "Multi Specialty",
    hospitalId: "HSP63200",
    collegeId: "COL63200"
  },
  {
    id: "INST-004",
    uuid: "d4e5f6g7-h8i9-7j0k-1l2m-n3o4p5q6r7s8",
    name: "Apollo Hospitals, Greams Road, Chennai",
    shortName: "Apollo Chennai",
    aliases: ["Apollo Greams Road", "Apollo Chennai"],
    type: "Super Specialty Hospital",
    city: "Chennai",
    district: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600006",
    address: "21, Greams Lane, Off Greams Road",
    latitude: 13.0617,
    longitude: 80.2547,
    website: "https://www.apollohospitals.com",
    emailDomain: "apollohospitals.com",
    phone: "044 2829 0203",
    ownership: "Private",
    university: "N/A",
    affiliation: "Apollo Health City",
    nmcApproval: "N/A",
    nabhStatus: "Accredited",
    naacGrade: "N/A",
    approvalStatus: "Approved",
    verificationStatus: "Verified",
    category: "Cardiac Care",
    hospitalId: "HSP60006"
  },
  {
    id: "INST-004-M",
    name: "Apollo Medical College, Hyderabad",
    shortName: "Apollo Medical College",
    type: "Medical College",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-005",
    name: "Fortis Memorial Research Institute",
    shortName: "Fortis Gurgaon",
    aliases: ["FMRI", "Fortis Gurgaon", "Fortis"],
    type: "Research Institute & Hospital",
    city: "Gurugram",
    district: "Gurgaon",
    state: "Haryana",
    country: "India",
    postalCode: "122002",
    address: "Sector 44, Opposite HUDA City Centre",
    latitude: 28.4595,
    longitude: 77.0726,
    website: "https://www.fortishealthcare.com",
    emailDomain: "fortishealthcare.com",
    phone: "0124 496 2200",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP12200"
  },
  {
    id: "INST-006",
    name: "SRM Medical College Hospital and Research Centre",
    shortName: "SRM Medical College",
    aliases: ["SRM", "SRM Hospital"],
    type: "Medical College",
    city: "Kattankulathur",
    state: "Tamil Nadu",
    country: "India",
    ownership: "Private",
    university: "SRM Institute of Science and Technology",
    verificationStatus: "Verified"
  },
  {
    id: "INST-007",
    name: "KG Hospital and Post Graduate Institute",
    shortName: "KG Hospital",
    aliases: ["KG", "KG Medical"],
    type: "Hospital",
    city: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-014",
    name: "Sri Ramachandra Institute of Higher Education and Research",
    shortName: "Sri Ramachandra Medical College",
    aliases: ["SRMC", "SRIHER", "Ramachandra Medical"],
    type: "Medical University & Hospital",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600116",
    address: "Porur, Chennai",
    website: "https://www.sriramachandra.edu.in",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP60011"
  },
  {
    id: "INST-008",
    name: "Narayana Medical College and Hospital, Nellore",
    shortName: "Narayana Medical College",
    aliases: ["NMC Nellore", "Narayana Nellore"],
    type: "Medical College",
    city: "Nellore",
    state: "Andhra Pradesh",
    country: "India",
    postalCode: "524003",
    address: "Chinthareddypalem, Nellore",
    website: "https://www.narayanamedicalcollege.com",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP52401",
    collegeId: "COL52401"
  },
  {
    id: "INST-009",
    name: "Narayana Health City, Bangalore",
    shortName: "Narayana Bangalore",
    aliases: ["Narayana Hrudayalaya", "NH Bangalore"],
    type: "Multi Specialty Hospital",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560099",
    address: "Bommasandra Industrial Area",
    website: "https://www.narayanahealth.org",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP56001"
  },
  {
    id: "INST-010",
    name: "Narayana Multispeciality Hospital, Jaipur",
    shortName: "Narayana Jaipur",
    type: "Multispeciality Hospital",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-011",
    name: "Narayana Multispeciality Hospital, Ahmedabad",
    shortName: "Narayana Ahmedabad",
    type: "Multispeciality Hospital",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-012",
    name: "Narayana Superspeciality Hospital, Gurugram",
    shortName: "Narayana Gurugram",
    type: "Superspeciality Hospital",
    city: "Gurugram",
    state: "Haryana",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-013",
    name: "Mallya Hospital (Narayana Health), Bangalore",
    shortName: "Mallya Narayana",
    type: "Hospital",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-015",
    name: "ACS Medical College and Hospital, Chennai",
    shortName: "ACS",
    aliases: ["ACS", "ACS Hospital", "ACS Medical"],
    type: "Medical College & Hospital",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    postalCode: "600077",
    address: "Poonamallee High Rd, Velappanchavadi",
    website: "https://acsmch.ac.in",
    ownership: "Private",
    university: "Dr. M.G.R. Educational and Research Institute",
    verificationStatus: "Verified",
    hospitalId: "HSP60077",
    collegeId: "COL60077"
  },
  {
    id: "INST-016",
    name: "ACS College of Engineering",
    type: "Engineering College",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    address: "Kambipura, Mysore Road",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-017",
    name: "ACS College of Nursing",
    type: "Nursing College",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    address: "Velappanchavadi, Chennai",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-018",
    name: "Narayana Medical College, Chittoor",
    shortName: "Narayana Chittoor",
    type: "Medical College",
    city: "Chittoor",
    state: "Andhra Pradesh",
    country: "India",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-019",
    name: "ACS College of Pharmacy",
    type: "Pharmacy College",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    address: "Chennai",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-020",
    name: "ACS International Schools (India Node)",
    type: "Educational Institution",
    city: "Multiple",
    state: "International",
    country: "India",
    verificationStatus: "Verified"
  },
  {
    id: "INST-021",
    name: "ACS College of Education",
    type: "Education College",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    verificationStatus: "Verified"
  },
  {
    id: "INST-022",
    name: "ACS Hospital & Medical Research Centre",
    aliases: ["ACS Hospital"],
    type: "Hospital",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    address: "Chennai",
    ownership: "Private",
    verificationStatus: "Verified"
  },
  {
    id: "INST-023",
    name: "Kasturba Medical College (Manipal Academy of Higher Education), Manipal",
    shortName: "KMC Manipal",
    aliases: ["Manipal Hospital", "KMC", "MAHE"],
    type: "Medical University & Hospital",
    city: "Manipal",
    state: "Karnataka",
    country: "India",
    postalCode: "576104",
    address: "Madhav Nagar, Manipal",
    website: "https://manipal.edu",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP57601",
    collegeId: "COL57601"
  },
  {
    id: "INST-024",
    name: "Manipal Hospital, Old Airport Road, Bangalore",
    shortName: "Manipal Bangalore",
    aliases: ["Manipal HAL Road"],
    type: "Multi Specialty Hospital",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postalCode: "560017",
    address: "98, HAL Old Airport Rd",
    website: "https://www.manipalhospitals.com",
    ownership: "Private",
    verificationStatus: "Verified",
    hospitalId: "HSP56017"
  }
];

/**
 * AI Search Logic - Implements fuzzy matching, ranking.
 */
export const smartInstitutionSearch = (query) => {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase().trim();
  const results = [];

  for (const inst of INSTITUTIONS) {
    let score = 0;
    let matchType = "";

    // Exact Match
    if (inst.name.toLowerCase() === q || inst.shortName?.toLowerCase() === q) {
      score = 100;
      matchType = "Exact";
    }
    // Alias Match
    else if (inst.aliases?.some(a => a.toLowerCase() === q)) {
      score = 95;
      matchType = "Alias";
    }
    // Prefix Match
    else if (inst.name.toLowerCase().startsWith(q) || inst.shortName?.toLowerCase().startsWith(q)) {
      score = 90;
      matchType = "Prefix";
    }
    // Token/N-Gram Simulation Match
    else {
      const words = inst.name.toLowerCase().split(/\s+/);
      const aliases = inst.aliases?.map(a => a.toLowerCase()) || [];
      const allTokens = [...words, ...aliases];

      const qTokens = q.split(/\s+/);
      let matchCount = 0;

      qTokens.forEach(qt => {
        if (allTokens.some(t => t.startsWith(qt) || t.includes(qt))) matchCount++;
      });

      if (matchCount > 0) {
        score = 50 + (matchCount * 10);
        if (matchCount === qTokens.length) score += 20;
        matchType = "Token Match";
      }
    }

    // Boost verified institutions
    if (inst.verificationStatus === "Verified" && score > 0) {
      score += 5;
    }

    if (score > 0) {
      results.push({ ...inst, score, matchType });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
};
