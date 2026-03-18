'use client';

import { useState, useEffect } from 'react';
import { Landmark, Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import hero from "./hero.png";
import Tracking from "./Tracking.png";
import visual from "./visual.png";
import ai from "./ai.png";
import Testimonials from '@/components/Testimonials';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FeatureCard = ({ img, title, description }: { img: any, title: string, description: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={cardVariants} className="h-full">
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 rounded-2xl shadow-lg hover:shadow-primary/20 h-full flex flex-col text-center">
                <CardContent className="p-6 flex flex-col flex-grow items-center">
                    <Image src={img} alt={title} width={150} height={150} className="mb-6" />
                    <CardTitle className="text-xl font-bold text-foreground mb-2">{title}</CardTitle>
                    <p className="text-muted-foreground">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const SectionWrapper = ({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <motion.section 
            id={id} 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={sectionVariants}
            className={`py-16 md:py-24 px-4 md:px-8 ${className}`}
        >
            {children}
        </motion.section>
    )
}

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Features', href: '#features' },
        { name: 'Testimonials', href: '#testimonials' },
    ];
    
    return (
        <div className="bg-background text-foreground min-h-screen font-body relative overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-primary/10 via-background to-background -z-10"></div>

            {/* Header */}
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border' : 'bg-transparent'}`}>
                <div className="container mx-auto flex justify-between items-center p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Landmark className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold font-headline">MoneyWiz</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">{link.name}</a>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" onClick={() => setLoginModalOpen(true)}>Sign In</Button>
                        <Button onClick={() => setRegisterModalOpen(true)}>Sign Up</Button>
                    </div>

                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-background/90 backdrop-blur-lg pb-4">
                        <nav className="flex flex-col items-center gap-4">
                           {navLinks.map(link => (
                                <a key={link.name} href={link.href} className="text-muted-foreground hover:text-primary transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>{link.name}</a>
                            ))}
                            <div className="flex items-center gap-2 mt-4">
                                <Button variant="ghost" onClick={() => { setLoginModalOpen(true); setIsMenuOpen(false); }}>Sign In</Button>
                                <Button onClick={() => { setRegisterModalOpen(true); setIsMenuOpen(false); }}>Sign Up</Button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            <main>
                {/* Home Section */}
                <SectionWrapper id="home" className="pt-32 md:pt-48 -mt-20">
                     <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-center md:text-left"
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                                Master Your Money with <span className="text-primary">MoneyWiz</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto md:mx-0 mb-8">
                                The intelligent, effortless way to manage your expenses, gain financial insights, and achieve your goals.
                            </p>
                            <Button size="lg" onClick={() => setRegisterModalOpen(true)}>
                                Get Started for Free <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <Image src={hero} alt="Dashboard preview" width={800} height={300} className="" />
                        </motion.div>
                    </div>
                </SectionWrapper>
                
                {/* About Section */}
                <SectionWrapper id="about" className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                <img src="https://videos.openai.com/az/vg-assets/task_01kkzewr1efcstr5x0vegxhxac%2F1773803590_img_3.webp?se=2026-03-20T00%3A00%3A00Z&sp=r&sv=2026-02-06&sr=b&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-03-17T03%3A20%3A40Z&ske=2026-03-24T03%3A25%3A40Z&sks=b&skv=2026-02-06&sig=ZzdLSDI704lmXWzpoLsZOGdKamJX0gD4J8PjePsIvqk%3D&ac=oaivgprodscus2" alt="About MoneyWiz" className="rounded-2xl " data-ai-hint="finance analytics" />
                             </motion.div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why MoneyWiz?</h2>
                            <p className="text-muted-foreground mb-4">
                                In a world of complex finances, MoneyWiz brings simplicity and power to your fingertips. We believe that managing your money shouldn't be a chore. Our mission is to empower you with smart tools and clear insights, so you can spend less time worrying about expenses and more time living your life.
                            </p>
                            <p className="text-muted-foreground">
                                Built with cutting-edge technology, MoneyWiz offers a seamless experience, from tracking daily expenditures to visualizing your spending habits. Join thousands of users who have taken control of their financial future with MoneyWiz.
                            </p>
                        </div>
                    </div>
                </SectionWrapper>

                {/* Features Section */}
                <SectionWrapper id="features" className="bg-primary/5">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features, Simple Interface</h2>
                        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Everything you need to stay on top of your finances, all in one place.</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                img={Tracking}
                                title="Effortless Tracking"
                                description="Quickly add and categorize expenses with our intuitive interface. Your finances, organized in seconds."
                            />
                            <FeatureCard
                                img={visual}
                                title="Visual Insights"
                                description="Beautiful charts and graphs that help you understand where your money is going."
                            />
                            <FeatureCard
                                img={ai}
                                title="AI-Powered Advice"
                                description="Get personalized suggestions and insights from our smart AI to help you save more."
                            />
                        </div>
                    </div>
                </SectionWrapper>

                {/* Testimonials Section */}
                <Testimonials />
                
                {/* Feedback Form Section */}
                <SectionWrapper id="feedback" className="bg-primary/5">
                    <div className="container mx-auto max-w-6xl">
                         <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions & Feedback</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">Got a question or some feedback? We're all ears.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* FAQ Accordion */}
                            <div>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="border-b-0 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <AccordionTrigger className="px-6 text-left font-semibold text-base hover:no-underline">Is MoneyWiz free to use?</AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                            Yes, MoneyWiz offers a robust free plan with all the essential features to manage your expenses. We also have a premium plan with advanced features like AI insights and unlimited expense categories.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="border-b-0 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <AccordionTrigger className="px-6 text-left font-semibold text-base hover:no-underline">Is my financial data secure?</AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                            Absolutely. We use industry-standard encryption to protect your data. Your privacy and security are our top priorities.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="border-b-0 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <AccordionTrigger className="px-6 text-left font-semibold text-base hover:no-underline">Can I use MoneyWiz on multiple devices?</AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                            Yes, your data is synced across all your devices, so you can manage your finances seamlessly whether you're on your phone, tablet, or computer.
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="item-4" className="border-b-0 bg-background rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <AccordionTrigger className="px-6 text-left font-semibold text-base hover:no-underline">How does the AI-powered advice work?</AccordionTrigger>
                                        <AccordionContent className="px-6 pb-4 text-muted-foreground">
                                            Our smart AI analyzes your spending patterns to identify trends and potential savings opportunities. It provides personalized, actionable advice to help you improve your financial health.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                             {/* Form */}
                            <Card className="text-left bg-background/80 backdrop-blur-sm border-primary/20 rounded-2xl shadow-lg">
                               <CardHeader>
                                    <CardTitle>Send us a message</CardTitle>
                                    <CardDescription>We'll get back to you as soon as possible.</CardDescription>
                                </CardHeader>
                               <CardContent>
                                    <form className="space-y-4">
                                        <Input placeholder="Your Name" />
                                        <Input type="email" placeholder="Your Email" />
                                        <Textarea placeholder="Your message..." />
                                        <Button type="submit" className="w-full">Submit Feedback</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </SectionWrapper>
            </main>

            {/* Footer */}
            <footer className="bg-background border-t border-border">
                <div className="container mx-auto py-8 px-4 md:px-8 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} MoneyWiz. All rights reserved. (Neha Yadav) </p>
                    <div className="flex justify-center gap-4 mt-4">
                         <a href="#about" className="hover:text-primary">About</a>
                         <a href="#features" className="hover:text-primary">Features</a>
                         <a href="#" className="hover:text-primary">Privacy Policy</a>
                    </div>
                </div>
            </footer>
            
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSwitchToRegister={() => { setLoginModalOpen(false); setRegisterModalOpen(true); }} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} onSwitchToLogin={() => { setRegisterModalOpen(false); setLoginModalOpen(true); }} />
        </div>
    );
}
