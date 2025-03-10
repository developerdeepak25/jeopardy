import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <section className="w-full min-h-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center">
      <div className="container px-4 md:px-6 w-full h-full">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Our Jeopardy
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Challenge yourself with exciting trivia questions across various
              categories. Play, compete, and test your knowledge. Ready to
              begin?
            </p>
          </div>
          <div className="space-x-4">
            <Link href={'/jeopardy'}>
            <Button className="px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
