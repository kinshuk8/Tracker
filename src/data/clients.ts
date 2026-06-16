export interface Client {
    id: string;
    name: string;
    logo: string;
    industry: string;
    description: string;
    softwareProvided?: string[];
    servicesProvided?: string[];
    websiteUrl?: string;
}

export const clients: Client[] = [
    {
        id: "artgram",
        name: "Artgram",
        logo: "/assets/ARTGRAM_LOGO_zdhftc.png.jpg",
        industry: "Creative Studio & Events",
        description: "Artgram is a creative studio hosting workshops, events, and multiple studio locations. They needed a digital platform to showcase their hands-on activities, manage birthday and corporate events, and drive real-time engagement.",
        softwareProvided: [
            "Custom Event Management System",
            "Responsive Next.js Web Application",
            "Booking & Reservation Portal"
        ],
        websiteUrl: "https://artgram.in"
    },
    {
        id: "ruhi-flavours",
        name: "Ruhi Flavours",
        logo: "/assets/RuhiLogo.png",
        industry: "Food & Beverage",
        description: "Ruhi Flavours is an artisan food brand offering authentic veg and non-veg pickles, sweets, spices, and homemade products. We helped them establish a premium visual identity and an online store.",
        softwareProvided: [
            "E-commerce Platform",
            "Inventory Management Integration",
            "Payment Gateway Setup"
        ],
        websiteUrl: "https://ruhiflavours.com"
    },
    {
        id: "vmc",
        name: "VMC",
        logo: "/assets/Vmc-logo-big.png",
        industry: "Animal Welfare & Monitoring",
        description: "VMC required a smart monitoring solution to efficiently track and manage stray and pet dog activities. The system was developed to provide real-time monitoring, location tracking, health status management, and centralized data access for better decision-making and animal welfare management.",
        softwareProvided: [
            "Dog Monitoring & Management System",
            "Real-time Dog Tracking Dashboard",
            "Health & Vaccination Record Management",
            "Reporting & Analytics Module"
        ]
    },
    {
        id: "folk-gokula-kshetram",
        name: "Folk Gokula Kshetram",
        logo: "/assets/logo.png",
        industry: "Religious & Cultural Services",
        description: "A comprehensive digital platform developed for Folk Gokula Kshetram to streamline temple administration, event management, pilgrimage bookings, accommodation services, appointment scheduling, and devotee engagement. The application provides both user and admin interfaces for efficient management of spiritual and cultural activities.",
        softwareProvided: [
            "Temple Management System",
            "Event & Festival Management",
            "Sacred Trip Booking Module",
            "Accommodation Management System",
            "Appointment Scheduling System",
            "Admin Dashboard & Analytics",
            "Mobile Application for Devotees"
        ]
    },
    {
        id: "count-harinams",
        name: "Count HariNams",
        logo: "/assets/count.png",
        industry: "Spiritual & Community Engagement",
        description: "Count HariNams is a devotional chanting and community engagement platform developed for devotees to track their daily mantra chanting, participate in global leaderboards, and connect with the spiritual community. The application promotes consistency in devotional practices through real-time counting, progress tracking, and community participation.",
        softwareProvided: [
            "Digital Chanting Counter",
            "HariNama Tracking System",
            "Global Leaderboard Module",
            "Devotee Registration & Management",
            "Community Engagement Platform",
            "User Progress Analytics",
            "Android Mobile Application"
        ], websiteUrl: "https://play.google.com/store/apps/details?id=com.vmkedgemindsolutions.iskcon_mantra_app"
    },
    {
        id: "magvin-developers",
        name: "Magvin Developers",
        logo: "/assets/magvin.png",
        industry: "Real Estate & Property Development",
        description: "A premium real estate platform developed for Magvin Developers to showcase luxury residential and commercial properties. The website delivers an immersive user experience with modern design, property listings, project showcases, inquiry management, and lead generation capabilities to enhance customer engagement and sales conversions.",
        softwareProvided: [
            "Corporate Real Estate Website",
            "Property Listing Management System",
            "Project Showcase Platform",
            "Lead Generation & Inquiry Management",
            "Responsive UI/UX Design",
            "Content Management System (CMS)",
            "SEO Optimization"
        ]
    },
    {
        id: "ask-associates",
        name: "Ask Associates",
        logo: "/assets/ask.png",
        industry: "Civil Engineering & Construction Consulting",
        description: "A professional corporate website developed for Ask Associates to showcase their engineering expertise, construction consulting services, completed projects, and industry experience. The platform enhances the company's digital presence while providing potential clients with detailed information about their services, portfolio, and business capabilities.",
        softwareProvided: [
            "Corporate Business Website",
            "Engineering Services Showcase",
            "Project Portfolio Management",
            "Company Profile Platform",
            "Client Inquiry Management",
            "Responsive Web Development",
            "SEO Optimization"
        ]
    },
    {
        id: "quick-property-services",
        name: "Quick Property Services",
        logo: "/assets/qps.png",
        industry: "Real Estate & Property Management",
        description: "A comprehensive property services platform developed for Quick Property Services to streamline property listings, customer inquiries, property management operations, and client engagement. The solution enables efficient handling of real estate services through a modern and user-friendly digital platform.",
        softwareProvided: [
            "Property Listing Management System",
            "Property Search Platform",
            "Customer Inquiry Management",
            "Property Portfolio Showcase",
            "Lead Generation System",
            "Responsive Web & Mobile Application",
            "Admin Management Dashboard"
        ],
        websiteUrl: "https://quickpropertyservices.in/"
    },
    {
        id: "aquapuerto-ro-purifiers",
        name: "AquaPuerto RO Purifiers",
        logo: "/assets/aquapuerto.png",
        industry: "Water Purification & Service Management",
        description: "AquaPuerto RO Purifiers is a comprehensive service management platform developed to streamline water purifier sales, installation requests, maintenance scheduling, AMC management, and customer support operations. The solution enables customers to easily book services while helping the business efficiently manage technicians, service requests, and customer relationships.",
        softwareProvided: [
            "Water Purifier Service Management System",
            "Installation Request Management",
            "AMC (Annual Maintenance Contract) Management",
            "Service Booking & Tracking",
            "Customer Relationship Management (CRM)",
            "Technician Assignment & Tracking",
            "Notifications & Service Reminders",
            "Admin Dashboard & Analytics"
        ]
    },
    {
        id: "rcv-fibernet",
        name: "RCV Fibernet",
        logo: "/assets/rcv.png",
        industry: "Telecommunications & Internet Services",
        description: "RCV Fibernet is a comprehensive digital platform developed for cable television and fiber internet service operations. The system enables seamless customer onboarding, subscription management, bill payments, service request handling, and network service monitoring, helping streamline day-to-day ISP and cable TV business operations.",
        softwareProvided: [
            "Cable TV Subscription Management",
            "Fiber Internet Customer Management",
            "Online Bill Payment System",
            "Customer Support & Ticketing",
            "Service Request Management",
            "Plan & Package Management",
            "Subscriber Analytics Dashboard",
            "Mobile & Web Application"
        ]
    }
];

export const digitalClients: Client[] = [
    {
        id: "la-bags-vijayawada",
        name: "LA Bags Vijayawada",
        logo: "/assets/la.jpeg",
        industry: "Fashion Accessories & Bag Manufacturing",
        description: "LA Bags Vijayawada is a leading manufacturer and supplier of premium-quality bags, including school bags, college bags, travel bags, laptop bags, trolley bags, and customized corporate bags. VMK Edgemind Solutions partnered with the brand to enhance its digital presence, increase customer engagement, and strengthen brand visibility across digital platforms.",
        servicesProvided: [
            "Social Media Management",
            "Digital Marketing Campaigns",
            "Brand Promotion & Awareness",
            "Content Creation & Design",
            "Lead Generation Campaigns",
            "Meta Ads Management",
            "Creative Poster & Video Design",
            "Online Reputation Management"
        ]
    },
    {
        id: "nataraj-electricals",
        name: "Nataraj Electricals",
        logo: "/assets/nataraj.jpeg",
        industry: "Electrical Goods & Retail",
        description: "Nataraj Electricals is a trusted supplier of electrical products, offering a wide range of electrical goods for residential, commercial, and industrial needs. VMK Edgemind Solutions partnered with the brand to strengthen its digital presence, increase customer engagement, and drive business growth through strategic marketing initiatives.",
        servicesProvided: [
            "Social Media Management",
            "Digital Marketing Campaigns",
            "Brand Awareness & Promotion",
            "Creative Poster Design",
            "Meta & Instagram Ads",
            "Lead Generation Campaigns",
            "Content Creation & Management",
            "Performance Analytics & Reporting"
        ]
    },
    {
        id: "rambha-fashions",
        name: "Rambha Fashions Vijayawada",
        logo: "/assets/RF.png",
        industry: "Fashion & Apparel Retail",
        description: "Rambha Fashions is a leading fashion and apparel brand offering stylish and trend-driven clothing collections for customers of all ages. VMK Edgemind Solutions partnered with the brand to enhance its digital presence, improve customer engagement, and strengthen brand awareness through strategic digital marketing and creative campaigns.",
        servicesProvided: [
            "Social Media Management",
            "Fashion Brand Promotion",
            "Digital Marketing Campaigns",
            "Creative Poster & Reel Design",
            "Meta & Instagram Advertising",
            "Lead Generation Campaigns",
            "Content Creation & Branding",
            "Marketing Analytics & Reporting"
        ]
    }
];

export const technicalClients: Client[] = [
    {
        id: "quick-property-services",
        name: "Quick Property Services",
        logo: "/assets/qps.png",
        industry: "Real Estate & Property Management",
        description: "A comprehensive property services platform developed for Quick Property Services to streamline property listings, customer inquiries, property management operations, and client engagement. The solution enables efficient handling of real estate services through a modern and user-friendly digital platform.",
        softwareProvided: [
            "Property Listing Management System",
            "Property Search Platform",
            "Customer Inquiry Management",
            "Property Portfolio Showcase",
            "Lead Generation System",
            "Responsive Web & Mobile Application",
            "Admin Management Dashboard"
        ],
        websiteUrl: "https://quickpropertyservices.in/"
    }
];
