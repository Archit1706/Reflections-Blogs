"use client";

import React from "react";
import { AnimatePresence, delay, motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
};
const PageWrapper = ({ children }: Props) => {
    return (
        <div>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    exit={{ opacity: 0, y: 20 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PageWrapper;
