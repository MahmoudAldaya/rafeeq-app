export interface Scholarship {
    id: string;
    titleAr: string;
    titleEn: string;
    university: string;
    country: string;
    countryFlag: string;
    level: "bachelor" | "master" | "phd" | "postdoc";
    levelAr: string;
    field: string;
    fieldAr: string;
    fundingType: "fully-funded" | "partial" | "tuition-only";
    fundingTypeAr: string;
    deadline: string;
    descriptionAr: string;
    descriptionEn: string;
    requirements: string[];
    requirementsAr: string[];
    coverage: string[];
    coverageAr: string[];
    url: string;
    featured: boolean;
}

export const scholarships: Scholarship[] = [
    {
        id: "1",
        titleAr: "منحة تشيفنينغ البريطانية",
        titleEn: "Chevening Scholarship",
        university: "جامعات متعددة في المملكة المتحدة",
        country: "المملكة المتحدة",
        countryFlag: "🇬🇧",
        level: "master",
        levelAr: "ماجستير",
        field: "جميع التخصصات",
        fieldAr: "جميع التخصصات",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2026-11-05",
        descriptionAr:
            "منحة تشيفنينغ هي برنامج المنح الحكومي العالمي للمملكة المتحدة، تقدم فرصاً للدراسة في المملكة المتحدة لمدة عام واحد على مستوى الماجستير.",
        descriptionEn:
            "Chevening is the UK government's international awards programme aimed at developing global leaders. Fully funded one-year master's degree at any UK university.",
        requirements: [
            "Bachelor's degree",
            "2 years work experience",
            "English proficiency (IELTS 6.5+)",
            "Return to home country for 2 years post-study",
        ],
        requirementsAr: [
            "درجة البكالوريوس",
            "سنتان من الخبرة العملية",
            "إجادة اللغة الإنجليزية (آيلتس 6.5+)",
            "العودة للبلد الأم لمدة سنتين بعد الدراسة",
        ],
        coverage: [
            "Full tuition fees",
            "Monthly stipend",
            "Travel costs",
            "Thesis grant",
        ],
        coverageAr: [
            "الرسوم الدراسية الكاملة",
            "راتب شهري",
            "تكاليف السفر",
            "منحة الأطروحة",
        ],
        url: "https://www.chevening.org",
        featured: true,
    },
    {
        id: "2",
        titleAr: "منحة إيراسموس موندوس",
        titleEn: "Erasmus Mundus Joint Masters",
        university: "جامعات أوروبية متعددة",
        country: "أوروبا",
        countryFlag: "🇪🇺",
        level: "master",
        levelAr: "ماجستير",
        field: "تخصصات متعددة",
        fieldAr: "تخصصات متعددة",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2027-01-15",
        descriptionAr:
            "برنامج إيراسموس موندوس يقدم منحاً دراسية للطلاب من جميع أنحاء العالم للدراسة في جامعتين أوروبيتين على الأقل.",
        descriptionEn:
            "Erasmus Mundus offers scholarships for international students to study at two or more European universities for a joint master's degree.",
        requirements: [
            "Bachelor's degree",
            "English proficiency",
            "Academic excellence",
            "Motivation letter",
        ],
        requirementsAr: [
            "درجة البكالوريوس",
            "إجادة اللغة الإنجليزية",
            "التميز الأكاديمي",
            "خطاب تحفيزي",
        ],
        coverage: [
            "Full tuition",
            "€1,400/month living allowance",
            "Travel expenses",
            "Health insurance",
        ],
        coverageAr: [
            "الرسوم الدراسية الكاملة",
            "بدل معيشة €1,400 شهرياً",
            "تكاليف السفر",
            "التأمين الصحي",
        ],
        url: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus",
        featured: true,
    },
    {
        id: "3",
        titleAr: "منحة DAAD الألمانية",
        titleEn: "DAAD Scholarship",
        university: "جامعات ألمانية",
        country: "ألمانيا",
        countryFlag: "🇩🇪",
        level: "master",
        levelAr: "ماجستير",
        field: "الهندسة والعلوم",
        fieldAr: "الهندسة والعلوم",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2026-10-15",
        descriptionAr:
            "تقدم DAAD منحاً دراسية للدراسات العليا في ألمانيا للطلاب من الدول النامية في مجالات الهندسة والعلوم.",
        descriptionEn:
            "DAAD offers postgraduate scholarships for students from developing countries to study engineering and sciences in Germany.",
        requirements: [
            "Bachelor's degree with excellent grades",
            "2 years professional experience",
            "English and/or German proficiency",
        ],
        requirementsAr: [
            "بكالوريوس بتقدير ممتاز",
            "سنتان من الخبرة المهنية",
            "إجادة الإنجليزية و/أو الألمانية",
        ],
        coverage: [
            "€934/month stipend",
            "Health insurance",
            "Travel allowance",
            "Study allowance",
        ],
        coverageAr: [
            "راتب شهري €934",
            "تأمين صحي",
            "بدل سفر",
            "بدل دراسي",
        ],
        url: "https://www.daad.de",
        featured: true,
    },
    {
        id: "4",
        titleAr: "منحة الحكومة التركية",
        titleEn: "Türkiye Burslari Scholarship",
        university: "جامعات تركية",
        country: "تركيا",
        countryFlag: "🇹🇷",
        level: "bachelor",
        levelAr: "بكالوريوس",
        field: "جميع التخصصات",
        fieldAr: "جميع التخصصات",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2026-02-20",
        descriptionAr:
            "منحة الحكومة التركية واحدة من أشهر المنح الشاملة التي تغطي جميع المستويات الدراسية وجميع التخصصات.",
        descriptionEn:
            "Türkiye Burslari is one of the most comprehensive government scholarship programs, covering all levels and fields of study.",
        requirements: [
            "High school diploma (70%+ GPA)",
            "Under 21 years old for bachelor's",
            "No Turkish citizenship",
        ],
        requirementsAr: [
            "شهادة ثانوية عامة (معدل 70%+)",
            "أقل من 21 سنة للبكالوريوس",
            "غير حامل للجنسية التركية",
        ],
        coverage: [
            "Full tuition",
            "Monthly stipend",
            "Accommodation",
            "Health insurance",
            "Flight ticket",
            "Turkish language course",
        ],
        coverageAr: [
            "الرسوم الدراسية",
            "راتب شهري",
            "سكن جامعي",
            "تأمين صحي",
            "تذكرة طيران",
            "دورة لغة تركية",
        ],
        url: "https://www.turkiyeburslari.gov.tr",
        featured: false,
    },
    {
        id: "5",
        titleAr: "منحة جامعة أكسفورد - كلاريندون",
        titleEn: "Clarendon Scholarship - Oxford",
        university: "جامعة أكسفورد",
        country: "المملكة المتحدة",
        countryFlag: "🇬🇧",
        level: "phd",
        levelAr: "دكتوراه",
        field: "جميع التخصصات",
        fieldAr: "جميع التخصصات",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2027-01-10",
        descriptionAr:
            "منحة كلاريندون من أرقى المنح البريطانية تغطي الرسوم الدراسية وتوفر راتباً سخياً لطلاب الدكتوراه في جامعة أكسفورد.",
        descriptionEn:
            "The Clarendon Scholarship is Oxford's most prestigious scholarship, covering tuition and providing a generous stipend for PhD students.",
        requirements: [
            "Excellent academic record",
            "Master's degree (preferred)",
            "Research proposal",
            "Strong references",
        ],
        requirementsAr: [
            "سجل أكاديمي متميز",
            "درجة الماجستير (مفضّل)",
            "مقترح بحثي",
            "خطابات توصية قوية",
        ],
        coverage: [
            "Full tuition fees",
            "Living expenses grant",
        ],
        coverageAr: [
            "الرسوم الدراسية الكاملة",
            "منحة تكاليف المعيشة",
        ],
        url: "https://www.clarendon.ox.ac.uk",
        featured: false,
    },
    {
        id: "6",
        titleAr: "منحة الحكومة الماليزية الدولية",
        titleEn: "Malaysia International Scholarship (MIS)",
        university: "جامعات ماليزية",
        country: "ماليزيا",
        countryFlag: "🇲🇾",
        level: "master",
        levelAr: "ماجستير",
        field: "العلوم والتكنولوجيا",
        fieldAr: "العلوم والتكنولوجيا",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2026-07-31",
        descriptionAr:
            "منحة الحكومة الماليزية الدولية للطلاب المتفوقين أكاديمياً من الدول النامية للدراسة في أفضل الجامعات الماليزية.",
        descriptionEn:
            "Malaysia International Scholarship for academically outstanding students from developing countries to study at top Malaysian universities.",
        requirements: [
            "Under 45 years old",
            "CGPA 3.5+ or equivalent",
            "English proficiency",
            "Not a Malaysian citizen",
        ],
        requirementsAr: [
            "أقل من 45 سنة",
            "معدل 3.5+ أو ما يعادله",
            "إجادة اللغة الإنجليزية",
            "غير حامل للجنسية الماليزية",
        ],
        coverage: [
            "Full tuition",
            "Monthly allowance",
            "Annual grant",
            "Thesis allowance",
        ],
        coverageAr: [
            "الرسوم الدراسية",
            "بدل معيشة شهري",
            "منحة سنوية",
            "بدل أطروحة",
        ],
        url: "https://biasiswa.mohe.gov.my/INTER/index.php",
        featured: false,
    },
    {
        id: "7",
        titleAr: "منحة الحكومة الهنغارية - Stipendium Hungaricum",
        titleEn: "Stipendium Hungaricum Scholarship",
        university: "جامعات هنغارية",
        country: "هنغاريا",
        countryFlag: "🇭🇺",
        level: "bachelor",
        levelAr: "بكالوريوس",
        field: "جميع التخصصات",
        fieldAr: "جميع التخصصات",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2027-01-15",
        descriptionAr:
            "منحة الحكومة الهنغارية تتيح للطلاب الدوليين الدراسة مجاناً في هنغاريا مع توفير سكن وراتب شهري.",
        descriptionEn:
            "Stipendium Hungaricum allows international students to study in Hungary free of charge with accommodation and monthly stipend.",
        requirements: [
            "High school diploma",
            "No Hungarian citizenship",
            "Motivation letter",
            "Medical fitness",
        ],
        requirementsAr: [
            "شهادة الثانوية العامة",
            "غير حامل للجنسية الهنغارية",
            "خطاب تحفيزي",
            "لياقة طبية",
        ],
        coverage: [
            "Full tuition",
            "Monthly stipend (€167)",
            "Dormitory or housing allowance",
            "Health insurance",
        ],
        coverageAr: [
            "الرسوم الدراسية",
            "راتب شهري (€167)",
            "سكن جامعي أو بدل سكن",
            "تأمين صحي",
        ],
        url: "https://stipendiumhungaricum.hu",
        featured: false,
    },
    {
        id: "8",
        titleAr: "منحة الكومنولث البريطانية",
        titleEn: "Commonwealth Scholarship",
        university: "جامعات بريطانية",
        country: "المملكة المتحدة",
        countryFlag: "🇬🇧",
        level: "phd",
        levelAr: "دكتوراه",
        field: "العلوم والتنمية",
        fieldAr: "العلوم والتنمية",
        fundingType: "fully-funded",
        fundingTypeAr: "ممولة بالكامل",
        deadline: "2026-12-06",
        descriptionAr:
            "منح الكومنولث مخصصة لطلاب الدكتوراه من الدول النامية الأعضاء في الكومنولث، تغطي كامل التكاليف.",
        descriptionEn:
            "Commonwealth Scholarships are for PhD students from developing Commonwealth countries, fully funded.",
        requirements: [
            "Master's degree",
            "Commonwealth country citizen",
            "Research proposal",
        ],
        requirementsAr: [
            "درجة الماجستير",
            "مواطن في دولة كومنولث",
            "مقترح بحثي",
        ],
        coverage: [
            "Full tuition",
            "Living allowance",
            "Airfare",
            "Thesis grant",
            "Warm clothing allowance",
        ],
        coverageAr: [
            "الرسوم الدراسية",
            "بدل معيشة",
            "تذكرة طيران",
            "منحة أطروحة",
            "بدل ملابس شتوية",
        ],
        url: "https://cscuk.fcdo.gov.uk",
        featured: false,
    },
];

export const levels = [
    { value: "bachelor", label: "بكالوريوس" },
    { value: "master", label: "ماجستير" },
    { value: "phd", label: "دكتوراه" },
    { value: "postdoc", label: "ما بعد الدكتوراه" },
];

export const countries = [
    "المملكة المتحدة",
    "أوروبا",
    "ألمانيا",
    "تركيا",
    "ماليزيا",
    "هنغاريا",
];

export const fundingTypes = [
    { value: "fully-funded", label: "ممولة بالكامل" },
    { value: "partial", label: "ممولة جزئياً" },
    { value: "tuition-only", label: "رسوم دراسية فقط" },
];

export function getDaysUntilDeadline(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
