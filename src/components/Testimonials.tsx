
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

const testimonials = [
    {
        name: 'Ayush Saini',
        role: 'Web Developer',
        avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFWVSs5yAIDYg/profile-displayphoto-crop_800_800/B4DZnrnoYCHwAI-/0/1760594666080?e=1775692800&v=beta&t=1zQ4VgRjwvLv4hIy_FgJWrgjUS15eEf_hJxkpqkiOjU',
        text: 'MoneyWiz has been a game-changer for my freelance business. I can finally see a clear picture of my income and expenses.',
    },
    {
        name: 'Avdhesh Kumar',
        role: 'Software Developer',
        avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHiD3VsoyyZtA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1677689185906?e=1775692800&v=beta&t=FJN-yinHrurLehi8G1n1O9vCKln3xLrUPALDtp2T-BA',
        text: 'The AI insights are scary good! It pointed out savings I never would have found on my own. Highly recommend.',
    },
    {
        name: 'Tania Sachdev',
        role: 'Student',
        avatar: 'https://img.redbull.com/images/c_crop,x_0,y_0,h_1714,w_1714/c_fill,w_308,h_308/q_auto:low,f_auto/redbullcom/2025/1/17/yytzugjbylzmsamsldyp/tania-sachdev',
        text: 'As a student on a tight budget, this app is a lifesaver. It’s so easy to use and helps me stay on track with my spending.',
    },
    {
        name: 'Sarah Lynn',
        role: 'Designer',
        avatar: 'https://picsum.photos/seed/sarah/100/100',
        text: 'The interface is so clean and intuitive. It makes tracking expenses feel less like a chore and more like a game.',
    },
    {
        name: 'Michael Chen',
        role: 'Product Manager',
        avatar: 'https://picsum.photos/seed/michael/100/100',
        text: 'Finally, a finance app that looks as good as it works. The visual insights are incredibly helpful for understanding my spending habits.',
    },
];


const TestimonialCard = ({ name, role, avatar, text }: { name: string, role: string, avatar: string, text: string }) => {
    return (
        <Card className="bg-background rounded-2xl p-6 shadow-md border border-transparent hover:border-primary/20 hover:shadow-lg transition-all duration-300 h-full">
            <CardContent className="p-0 flex flex-col h-full">
                <p className="text-muted-foreground mb-6 italic flex-grow">"{text}"</p>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={avatar} alt={name} data-ai-hint="person" />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{name}</p>
                        <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const DotButton = ({ selected, onClick }: {selected: boolean, onClick: () => void}) => (
    <button
      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${selected ? 'bg-primary w-6' : 'bg-primary/20'}`}
      type="button"
      onClick={onClick}
    />
);

export default function Testimonials() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        return () => { emblaApi.off('select', onSelect) };
    }, [emblaApi, onSelect]);

    return (
        <div id="testimonials" className="py-16 md:py-24 bg-slate-50 dark:bg-black">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Loved by Users Worldwide</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our users are saying.
                    </p>
                </div>
                <div className="relative">
                    <div className="overflow-hidden -mx-4" ref={emblaRef}>
                        <div className="flex">
                            {testimonials.map((testimonial, index) => (
                                <div className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 px-4" key={index}>
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -left-4 rounded-full h-10 w-10 hidden md:flex bg-background hover:bg-muted" onClick={scrollPrev}>
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -right-4 rounded-full h-10 w-10 hidden md:flex bg-background hover:bg-muted" onClick={scrollNext}>
                        <ArrowRight className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="flex justify-center gap-3 mt-8">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            selected={index === selectedIndex}
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
