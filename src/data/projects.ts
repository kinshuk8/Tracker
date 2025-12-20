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
        id: "artgram",
        title: "Artgram – Your Hobby Lobby",
        description: "A full-fledged creative studio website built to showcase workshops, events, and multiple studio locations. The platform highlights hands-on activities, birthday & corporate events, real-time engagement, and seamless navigation across services.",
        image: "/assets/artgram_thumbnail.png",
        link: "https://artgram.in",
        tags: ["Creative Studio", "Events", "Web Design"],
    },
    {
        id: "ruhi-flavours",
        title: "Ruhi Flavours — Artisan Food Brand",
        description: "A modern e-commerce website for a traditional food brand, showcasing authentic veg & non-veg pickles, sweets, spices, and homemade products with a clean, premium visual identity.",
        image: "/assets/ruhiflavours_thumbnail.png",
        link: "https://ruhiflavours.com",
        tags: ["E-commerce", "Food & Beverage", "Branding"],
    }
];
