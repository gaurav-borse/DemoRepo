// Web Development Cost Calculator
class CostCalculator {
    constructor() {
        this.initializeEventListeners();
        this.basePrices = {
            projectTypes: {
                'basic-website': { base: 2500, weeks: 2 },
                'business-website': { base: 5000, weeks: 4 },
                'ecommerce': { base: 8000, weeks: 8 },
                'web-app': { base: 12000, weeks: 12 },
                'saas': { base: 25000, weeks: 20 },
                'marketplace': { base: 35000, weeks: 24 }
            },
            designComplexity: {
                'template': { multiplier: 0.8, weeks: 0 },
                'custom-simple': { multiplier: 1.0, weeks: 1 },
                'custom-advanced': { multiplier: 1.5, weeks: 2 },
                'premium': { multiplier: 2.0, weeks: 4 }
            },
            backendComplexity: {
                'none': { multiplier: 0.5, weeks: 0 },
                'simple': { multiplier: 1.0, weeks: 2 },
                'moderate': { multiplier: 1.5, weeks: 4 },
                'complex': { multiplier: 2.0, weeks: 8 },
                'enterprise': { multiplier: 3.0, weeks: 12 }
            },
            features: {
                'responsive-design': { cost: 800, weeks: 1 },
                'animations': { cost: 1200, weeks: 2 },
                'brand-design': { cost: 2000, weeks: 2 },
                'user-auth': { cost: 1500, weeks: 2 },
                'cms': { cost: 2500, weeks: 3 },
                'ecommerce-features': { cost: 4000, weeks: 4 },
                'search-functionality': { cost: 1800, weeks: 2 },
                'admin-panel': { cost: 3000, weeks: 3 },
                'api-integration': { cost: 1200, weeks: 1.5 },
                'real-time': { cost: 2500, weeks: 3 },
                'multi-language': { cost: 2000, weeks: 2 },
                'seo': { cost: 800, weeks: 1 },
                'analytics': { cost: 600, weeks: 0.5 },
                'database-design': { cost: 1500, weeks: 2 },
                'cloud-hosting': { cost: 800, weeks: 1 },
                'security': { cost: 2000, weeks: 2 },
                'maintenance': { cost: 3000, weeks: 0 },
                'training': { cost: 1500, weeks: 1 },
                'testing': { cost: 2000, weeks: 2 },
                'performance': { cost: 1200, weeks: 1.5 }
            },
            timelineMultipliers: {
                'rush': 1.5,
                'standard': 1.0,
                'relaxed': 0.9,
                'extended': 0.85
            }
        };
    }

    initializeEventListeners() {
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateCost();
        });

        document.getElementById('printBtn').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResults();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetCalculator();
        });

        // Real-time calculation on form changes
        const form = document.getElementById('costCalculator');
        form.addEventListener('change', () => {
            // Optional: Add real-time calculation
        });
    }

    calculateCost() {
        const formData = this.getFormData();
        
        if (!this.validateForm(formData)) {
            this.showError('Please fill in all required fields.');
            return;
        }

        const calculation = this.performCalculation(formData);
        this.displayResults(calculation, formData);
        this.scrollToResults();
    }

    getFormData() {
        const form = document.getElementById('costCalculator');
        const formData = new FormData(form);
        
        return {
            projectType: formData.get('projectType'),
            designComplexity: formData.get('designComplexity'),
            backendComplexity: formData.get('backendComplexity'),
            timeline: formData.get('timeline'),
            features: formData.getAll('features')
        };
    }

    validateForm(formData) {
        return formData.projectType && 
               formData.designComplexity && 
               formData.backendComplexity && 
               formData.timeline;
    }

    performCalculation(formData) {
        let totalCost = 0;
        let totalWeeks = 0;
        const breakdown = [];

        // Base project cost
        const projectBase = this.basePrices.projectTypes[formData.projectType];
        if (projectBase) {
            totalCost += projectBase.base;
            totalWeeks += projectBase.weeks;
            breakdown.push({
                label: this.getProjectTypeLabel(formData.projectType),
                cost: projectBase.base
            });
        }

        // Design complexity multiplier
        const designMultiplier = this.basePrices.designComplexity[formData.designComplexity];
        if (designMultiplier) {
            const designCost = Math.round(totalCost * (designMultiplier.multiplier - 1));
            if (designCost > 0) {
                totalCost += designCost;
                breakdown.push({
                    label: `Design Complexity (${this.getDesignComplexityLabel(formData.designComplexity)})`,
                    cost: designCost
                });
            }
            totalWeeks += designMultiplier.weeks;
        }

        // Backend complexity multiplier
        const backendMultiplier = this.basePrices.backendComplexity[formData.backendComplexity];
        if (backendMultiplier) {
            const backendCost = Math.round(projectBase.base * (backendMultiplier.multiplier - 1));
            if (backendCost > 0) {
                totalCost += backendCost;
                breakdown.push({
                    label: `Backend Complexity (${this.getBackendComplexityLabel(formData.backendComplexity)})`,
                    cost: backendCost
                });
            }
            totalWeeks += backendMultiplier.weeks;
        }

        // Features
        formData.features.forEach(feature => {
            const featureData = this.basePrices.features[feature];
            if (featureData) {
                totalCost += featureData.cost;
                totalWeeks += featureData.weeks;
                breakdown.push({
                    label: this.getFeatureLabel(feature),
                    cost: featureData.cost
                });
            }
        });

        // Timeline multiplier
        const timelineMultiplier = this.basePrices.timelineMultipliers[formData.timeline];
        if (timelineMultiplier && timelineMultiplier !== 1.0) {
            const timelineAdjustment = Math.round(totalCost * (timelineMultiplier - 1));
            totalCost += timelineAdjustment;
            if (timelineAdjustment !== 0) {
                breakdown.push({
                    label: `Timeline Adjustment (${this.getTimelineLabel(formData.timeline)})`,
                    cost: timelineAdjustment
                });
            }
        }

        return {
            totalCost: Math.round(totalCost),
            totalWeeks: Math.round(totalWeeks),
            breakdown: breakdown
        };
    }

    displayResults(calculation, formData) {
        // Show results section
        const resultsSection = document.getElementById('results');
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        // Update total cost
        document.getElementById('totalCost').textContent = 
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculation.totalCost);

        // Update timeline
        document.getElementById('estimatedTimeline').textContent = 
            `${calculation.totalWeeks} weeks`;

        // Update cost breakdown
        const breakdownContainer = document.getElementById('costBreakdown');
        breakdownContainer.innerHTML = '';
        
        calculation.breakdown.forEach(item => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <span class="breakdown-label">${item.label}</span>
                <span class="breakdown-cost">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.cost)}</span>
            `;
            breakdownContainer.appendChild(breakdownItem);
        });

        // Update project summary
        this.updateProjectSummary(formData);
    }

    updateProjectSummary(formData) {
        const summaryContainer = document.getElementById('projectSummary');
        summaryContainer.innerHTML = '';

        const summaryData = [
            { label: 'Project Type:', value: this.getProjectTypeLabel(formData.projectType) },
            { label: 'Design:', value: this.getDesignComplexityLabel(formData.designComplexity) },
            { label: 'Backend:', value: this.getBackendComplexityLabel(formData.backendComplexity) },
            { label: 'Timeline:', value: this.getTimelineLabel(formData.timeline) },
            { label: 'Features:', value: formData.features.length > 0 ? formData.features.length + ' additional features' : 'Basic features only' }
        ];

        summaryData.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <span class="summary-label">${item.label}</span>
                <span class="summary-value">${item.value}</span>
            `;
            summaryContainer.appendChild(summaryItem);
        });
    }

    // Label helper methods
    getProjectTypeLabel(value) {
        const labels = {
            'basic-website': 'Basic Website (5-10 pages)',
            'business-website': 'Business Website (10-20 pages)',
            'ecommerce': 'E-commerce Platform',
            'web-app': 'Custom Web Application',
            'saas': 'SaaS Platform',
            'marketplace': 'Marketplace Platform'
        };
        return labels[value] || value;
    }

    getDesignComplexityLabel(value) {
        const labels = {
            'template': 'Template-based Design',
            'custom-simple': 'Custom Simple Design',
            'custom-advanced': 'Custom Advanced Design',
            'premium': 'Premium Custom Design'
        };
        return labels[value] || value;
    }

    getBackendComplexityLabel(value) {
        const labels = {
            'none': 'No Backend (Static Site)',
            'simple': 'Simple Backend',
            'moderate': 'Moderate Backend',
            'complex': 'Complex Backend',
            'enterprise': 'Enterprise-level Backend'
        };
        return labels[value] || value;
    }

    getTimelineLabel(value) {
        const labels = {
            'rush': 'Rush (2-4 weeks)',
            'standard': 'Standard (1-3 months)',
            'relaxed': 'Relaxed (3-6 months)',
            'extended': 'Extended (6+ months)'
        };
        return labels[value] || value;
    }

    getFeatureLabel(value) {
        const labels = {
            'responsive-design': 'Responsive Design (Mobile-friendly)',
            'animations': 'Custom Animations & Interactions',
            'brand-design': 'Brand Identity Design',
            'user-auth': 'User Authentication & Registration',
            'cms': 'Content Management System (CMS)',
            'ecommerce-features': 'E-commerce Features (Cart, Checkout, Payments)',
            'search-functionality': 'Advanced Search & Filtering',
            'admin-panel': 'Admin Dashboard',
            'api-integration': 'Third-party API Integrations',
            'real-time': 'Real-time Features (Chat, Notifications)',
            'multi-language': 'Multi-language Support',
            'seo': 'SEO Optimization',
            'analytics': 'Analytics Integration',
            'database-design': 'Custom Database Design',
            'cloud-hosting': 'Cloud Hosting Setup',
            'security': 'Advanced Security Features',
            'maintenance': '6 Months Maintenance & Support',
            'training': 'Training & Documentation',
            'testing': 'Quality Assurance & Testing',
            'performance': 'Performance Optimization'
        };
        return labels[value] || value;
    }

    scrollToResults() {
        const resultsSection = document.getElementById('results');
        resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    shareResults() {
        const totalCost = document.getElementById('totalCost').textContent;
        const timeline = document.getElementById('estimatedTimeline').textContent;
        
        const shareText = `Web Development Cost Estimate: ${totalCost} | Timeline: ${timeline}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Web Development Cost Estimate',
                text: shareText,
                url: window.location.href
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Estimate copied to clipboard!');
            });
        } else {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Estimate copied to clipboard!');
        }
    }

    resetCalculator() {
        // Reset form
        document.getElementById('costCalculator').reset();
        
        // Hide results
        document.getElementById('results').style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CostCalculator();
});

// Add some helpful animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for form sections
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add loading state to calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    const originalText = calculateBtn.innerHTML;

    calculateBtn.addEventListener('click', () => {
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
        calculateBtn.disabled = true;

        setTimeout(() => {
            calculateBtn.innerHTML = originalText;
            calculateBtn.disabled = false;
        }, 1000);
    });
});