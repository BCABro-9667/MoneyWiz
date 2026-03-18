
'use client';

import { useState, useEffect } from 'react';
import { Landmark, Menu, X, ArrowRight, BarChart2, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
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
        <motion.div ref={ref} initial="hidden" animate={controls} variants={cardVariants}>
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 rounded-2xl shadow-lg hover:shadow-primary/20">
                <CardHeader className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        {icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const TestimonialCard = ({ name, role, avatar, text }: { name: string, role: string, avatar: string, text: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };
    
    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={cardVariants}>
            <Card className="bg-background/50 backdrop-blur-sm border-primary/20 rounded-2xl p-6 shadow-lg">
                <CardContent className="p-0">
                    <p className="text-muted-foreground mb-6 italic">"{text}"</p>
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
        </motion.div>
    );
}

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
                <SectionWrapper id="home" className="pt-32 md:pt-48 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Master Your Money with <span className="text-primary">MoneyWiz</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            The intelligent, effortless way to manage your expenses, gain financial insights, and achieve your goals.
                        </p>
                        <Button size="lg" onClick={() => setRegisterModalOpen(true)}>
                            Get Started for Free <ArrowRight className="ml-2" />
                        </Button>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
                            <Image src="/img1.png" alt="Dashboard preview" width={1200} height={600} className="mt-12 rounded-2xl shadow-2xl mx-auto border-4 border-primary/20" />
                        </motion.div>
                    </motion.div>
                </SectionWrapper>
                
                {/* About Section */}
                <SectionWrapper id="about" className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                             <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                                <img src="https://picsum.photos/600/500" alt="About MoneyWiz" className="rounded-2xl shadow-xl border-4 border-primary/20" data-ai-hint="finance analytics" />
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
                                icon={<Landmark />}
                                title="Effortless Tracking"
                                description="Quickly add and categorize expenses with our intuitive interface. Your finances, organized in seconds."
                            />
                            <FeatureCard
                                icon={<BarChart2 />}
                                title="Visual Insights"
                                description="Beautiful charts and graphs that help you understand where your money is going."
                            />
                            <FeatureCard
                                icon={<BrainCircuit />}
                                title="AI-Powered Advice"
                                description="Get personalized suggestions and insights from our smart AI to help you save more."
                            />
                        </div>
                    </div>
                </SectionWrapper>

                {/* Testimonials Section */}
                <SectionWrapper id="testimonials" className="container mx-auto">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Users Worldwide</h2>
                        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Don't just take our word for it. Here's what our users are saying.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TestimonialCard 
                                name="Sarah J."
                                role="Freelance Designer"
                                avatar="https://picsum.photos/100/100?random=1"
                                text="MoneyWiz has been a game-changer for my freelance business. I can finally see a clear picture of my income and expenses."
                            />
                            <TestimonialCard 
                                name="Michael B."
                                role="Marketing Manager"
                                avatar="https://picsum.photos/100/100?random=2"
                                text="The AI insights are scary good! It pointed out savings I never would have found on my own. Highly recommend."
                            />
                             <TestimonialCard 
                                name="Anita K."
                                role="Student"
                                avatar="https://picsum.photos/100/100?random=3"
                                text="As a student on a tight budget, this app is a lifesaver. It’s so easy to use and helps me stay on track with my spending."
                            />
                        </div>
                    </div>
                </SectionWrapper>
                
                {/* Feedback Form Section */}
                <SectionWrapper id="feedback" className="bg-primary/5">
                    <div className="container mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Feedback?</h2>
                        <p className="text-muted-foreground mb-8">We'd love to hear from you! Your feedback helps us make MoneyWiz even better.</p>
                        <Card className="text-left bg-background/80 backdrop-blur-sm border-primary/20 rounded-2xl shadow-lg">
                           <CardContent className="p-6">
                                <form className="space-y-4">
                                    <Input placeholder="Your Name" />
                                    <Input type="email" placeholder="Your Email" />
                                    <Textarea placeholder="Your feedback..." />
                                    <Button type="submit" className="w-full">Submit Feedback</Button>
                                </form>
                            </CardContent>
                        </Card>
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
