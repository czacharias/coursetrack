import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="">
      <ResizablePanelGroup
      direction="horizontal"
      className="flex h-dvh w-full rounded-lg border" //md:min-w-[450px]
      >
      <ResizablePanel defaultSize={500}>
        <div className="flex-1 items-center justify-center p-6 h-dvh">
          <span className="font-semibold">One</span>
          <div className="flex items-center justify-center p-3">
            <Textarea placeholder="Type your message here."/>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={500}>
        <div className="flex-1 items-center justify-center p-6 h-dvh">
          <span className="font-semibold">Two</span>
          <div className="flex items-center justify-center p-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
          <div className="flex items-center p-3">
            <Slider defaultValue={[33]} max={100} step={1} />
          </div>
          <div className="flex items-center p-3">
            <Button asChild>
              <Link href="/page2">next page</Link>
            </Button>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
    
  );
}
