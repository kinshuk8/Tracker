import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none ring-1 ring-border/50">
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  )
}

export function DashboardSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <div className="container mx-auto py-10 px-8 max-w-5xl">
             <div className="mb-8 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-1 border-none shadow-md">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <Skeleton className="h-40 w-40 rounded-full" />
                        <div className="w-full space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-none shadow-md">
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                         </div>
                         <div className="flex justify-end pt-4">
                            <Skeleton className="h-12 w-32" />
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export function CourseDetailSkeleton() {
    return (
        <div className="container mx-auto py-10 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-5/6" />
                    </div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center p-4 border rounded-lg">
                                    <Skeleton className="h-10 w-10 rounded-full mr-4" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-1/3" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                             ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-8">
                        <div className="aspect-video w-full">
                            <Skeleton className="h-full w-full rounded-t-lg" />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-center mb-2">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
