import { Suspense } from "react";
import { db } from "@/db";
import { courses } from "@/db/schema";
import CoursesContent from "./CoursesContent";

export interface Plan {
    id: string;
    title: string;
    price: number;
    features: string[];
    courseId?: number;
}

async function getCourses() {
    try {
        const allCourses = await db.select().from(courses);
        return allCourses;
    } catch (error) {
        console.error("Failed to fetch courses:", error);
        return [];
    }
}

export default async function CoursesPage() {
    const activeCourses = await getCourses();

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CoursesContent initialCourses={activeCourses} />
        </Suspense>
    );
}
