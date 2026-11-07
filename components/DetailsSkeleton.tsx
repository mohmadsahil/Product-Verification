import { Card, CardContent } from "./ui/card";

export default function DetailsSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col items-center mb-4 sm:mb-6 animate-pulse">
        <div className="h-[72px] w-[72px] sm:h-28 sm:w-28 rounded-full bg-brand/10" />
        <div className="mt-2.5 sm:mt-3 h-5 sm:h-6 w-40 sm:w-52 rounded-full bg-brand/10" />
      </div>

      <Card className="overflow-hidden backdrop-blur-sm">
        <div className="h-1.5 bg-brand-sheen" />
        <CardContent className="p-4 sm:p-7 md:p-8">
          <div className="flex flex-col items-center mb-4 sm:mb-6 animate-pulse">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-brand/10 mb-2 sm:mb-3" />
            <div className="h-5 sm:h-7 w-3/4 rounded bg-brand/10 mb-2" />
            <div className="h-3 w-1/2 rounded bg-brand/10" />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-brandline to-transparent mb-4 sm:mb-6" />

          <div className="space-y-3.5 sm:space-y-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-brand/10" />
                <div className="h-10 sm:h-12 w-full rounded-lg bg-brand/10 border border-brandline" />
              </div>
            ))}

            <div className="pt-1 sm:pt-2">
              <div className="h-11 sm:h-12 w-full rounded-lg bg-brand/15" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto mt-4 h-3 w-64 rounded-full bg-brand/10 animate-pulse" />
    </div>
  );
}
