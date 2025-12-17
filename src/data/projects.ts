export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    tags: string[];
}

export const projects: Project[] = [
    {
        id: "smart-city",
        title: "Smart City Infrastructure",
        description: "IoT-based monitoring system for urban traffic and utility management. Real-time data analytics for efficient resource allocation.",
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        tags: ["IoT", "Smart City", "Real-time Analytics"],
    },
    {
        id: "industrial-automation",
        title: "Industrial Automation",
        description: "AI-driven robotics control system for manufacturing efficiency. Predictive maintenance and automated quality control pipelines.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        tags: ["Robotics", "AI", "Manufacturing"],
    },
    {
        id: "healthcare-analytics",
        title: "Healthcare Analytics",
        description: "Predictive analytics platform for patient care optimization. Secure patient data management and diagnosis support tools.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        tags: ["Healthcare", "Big Data", "Predictive Analytics"],
    },
    {
        id: "fintech-platform",
        title: "FinTech Trading Platform",
        description: "High-frequency trading platform with sub-millisecond latency. Advanced charting and algorithmic trading bot integration.",
        image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        tags: ["FinTech", "Trading", "High Performance"],
    }
];
