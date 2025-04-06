'use client';

import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ceo = {
    name: 'Davide Raro',
    role: 'CEO & Founder',
    bio: `A seasoned aviation systems expert with over 15 years of experience in air traffic management, control systems, and meteorological integration. Davide's vision for FlyClim stems from his global career designing and implementing aviation infrastructure across 50+ countries, where he witnessed firsthand how outdated tools fail to prevent weather-related delays. His deep domain expertise and technical leadership are driving FlyClim's mission to deliver smarter, AI-powered flight operations.`,
    achievements: [
        'Led aviation technology projects in over 50 countries',
        'Designed and deployed ATM and aviation weather systems for major international airports',
        'Worked with national ANSPs and meteorological agencies worldwide',
        'Recognized expert in safety-critical system design and aviation innovation'
    ],
    image: '/davide.jpg',
    social: {
        linkedin: 'https://www.linkedin.com/in/davide-raro-05069941/',
        // twitter: 'https://twitter.com'
    }
};

export function Team() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Leadership
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Meet the visionary behind FlyClim's mission to revolutionize aviation weather optimization.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                        <div className="md:flex">
                            <div className="md:w-1/3">
                                <div className="relative h-96 md:h-full">
                                    <Image
                                        src={ceo.image}
                                        alt={ceo.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-2/3 p-8">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                                        {ceo.name}
                                    </h2>
                                    <p className="text-blue-600 font-medium text-lg mb-4">{ceo.role}</p>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {ceo.bio}
                                    </p>
                                    <div className="border-t border-gray-100 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Achievements</h3>
                                        <ul className="space-y-2">
                                            {ceo.achievements.map((achievement, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                                                    className="flex items-center text-gray-600"
                                                >
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                                    {achievement}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {ceo.social.linkedin && (
                                        <Link
                                            href={ceo.social.linkedin}
                                            target="_blank"
                                            className="text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin className="h-6 w-6" />
                                        </Link>
                                    )}
                                    {/* {ceo.social.twitter && (
                                        <Link
                                            href={ceo.social.twitter}
                                            target="_blank"
                                            className="text-gray-600 hover:text-blue-400 transition-colors"
                                        >
                                            <Twitter className="h-6 w-6" />
                                        </Link>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Join Our Mission
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We're looking for passionate individuals who share our vision of revolutionizing aviation through innovative weather optimization technology.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    >
                        View Open Positions
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}