
import { Cog, Cloud, Globe, Smartphone, BrainCircuit } from "lucide-react";

export interface Service {
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    iconName: string; // We'll map this in the component
    features: string[];
    image: string;
}

export const services: Service[] = [
    {
        slug: "software-development",
        title: "Custom Software Development",
        shortDescription: "End-to-end software solutions tailored to meet unique client requirements.",
        description: "We build robust, scalable, and future-proof software solutions. From enterprise resource planning (ERP) systems to custom workflow automation tools, our software maximizes efficiency and drives growth.",
        iconName: "Cog",
        features: ["Enterprise Software", "SaaS Development", "Legacy Modernization", "API Integration"],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "web-development",
        title: "Modern Web Development",
        shortDescription: "High-performance web applications built with the latest technologies.",
        description: "Crafting digital experiences that captivate and convert. We specialize in building responsive, high-speed, and SEO-optimized web applications using modern frameworks like Next.js, React, and Tailwind CSS.",
        iconName: "Globe",
        features: ["SPA & PWA Development", "E-commerce Platforms", "CMS Solutions", "Performance Optimization"],
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "mobile-development",
        title: "Mobile App Development",
        shortDescription: "Native and cross-platform mobile apps for iOS and Android.",
        description: "Reach your customers wherever they are. We design and develop intuitive mobile applications that deliver seamless user experiences across all devices, leveraging React Native and Flutter.",
        iconName: "Smartphone",
        features: ["iOS & Android Apps", "Cross-Platform Development", "UI/UX Design", "App Store Optimization"],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "iot-solutions",
        title: "Smart IoT Solutions",
        shortDescription: "Automated and integrated IoT solutions for homes, industries, and enterprises.",
        description: "Connecting the physical and digital worlds. Our IoT solutions empower businesses with real-time monitoring, predictive maintenance, and smart automation capabilities.",
        iconName: "Cloud",
        features: ["Smart Home/City", "Industrial IoT (IIoT)", "Remote Monitoring", "Embedded Systems"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
    },
    {
        slug: "ai-ml",
        title: "Artificial Intelligence & ML",
        shortDescription: "Data-driven insights and intelligent automation.",
        description: "Unlock the power of your data. We implement machine learning models and AI algorithms to automate processes, predict trends, and enhance decision-making.",
        iconName: "BrainCircuit",
        features: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "AI Chatbots"],
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop"
    }
];
