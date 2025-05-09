import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const DeceptivePricing: React.FC = () => {
  const { theme, getPersonality } = useContext(AppContext);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [mouseMoved, setMouseMoved] = useState(false);
  const [finalPrice, setFinalPrice] = useState<Record<string, number>>({
    basic: 9.99,
    pro: 19.99,
    enterprise: 49.99
  });
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [timerShown, setTimerShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [basketItems, setBasketItems] = useState<string[]>([]);
  
  const plans = [
    {
      name: 'Basic',
      key: 'basic',
      originalPrice: 19.99,
      displayPrice: 9.99,
      features: ['Limited Access', '1 User', 'No Support', 'Ads Included'],
      hidden: ['$5 Monthly Service Fee', 'Data Processing Fee', '$2 Per Export'],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      key: 'pro',
      originalPrice: 39.99,
      displayPrice: 19.99,
      features: ['Full Access', '3 Users', 'Email Support', 'No Ads'],
      hidden: ['$10 Monthly Service Fee', 'Data Processing Fee', '$5 Per Team Member'],
      popular: true,
      cta: 'Try Now'
    },
    {
      name: 'Enterprise',
      key: 'enterprise',
      originalPrice: 99.99,
      displayPrice: 49.99,
      features: ['Unlimited Access', 'Unlimited Users', '24/7 Support', 'Custom Features'],
      hidden: ['$25 Monthly Service Fee', 'Priority Fee', '$10 Per API Call Above 100'],
      cta: 'Contact Sales'
    }
  ];
  
  // Show discount popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDiscount(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Setup mouse tracking for exit intent
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMoved(true);
      
      // Show exit intent when mouse gets close to the top of the page
      if (e.clientY < 50 && !exitIntentShown) {
        setExitIntentShown(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [exitIntentShown]);
  
  // Start countdown timer after interaction
  useEffect(() => {
    if (mouseMoved && !timerShown) {
      setTimerShown(true);
      
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [mouseMoved, timerShown]);
  
  // Handle price manipulation
  useEffect(() => {
    if (selectedPlan) {
      // Increase the price slightly over time
      const interval = setInterval(() => {
        setFinalPrice(prev => {
          const newPrices = { ...prev };
          
          // Small random increases
          Object.keys(newPrices).forEach(plan => {
            // 30% chance to increase price slightly
            if (Math.random() < 0.3) {
              newPrices[plan] = parseFloat((newPrices[plan] + Math.random() * 0.5).toFixed(2));
            }
          });
          
          return newPrices;
        });
      }, 10000); // Every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [selectedPlan]);
  
  const handleSelectPlan = (planKey: string) => {
    setSelectedPlan(planKey);
    
    // Add random "required" items to basket
    const newItems = [...basketItems];
    
    // 70% chance to add service fee
    if (Math.random() < 0.7) {
      newItems.push('Service Fee');
    }
    
    // 50% chance to add setup fee
    if (Math.random() < 0.5) {
      newItems.push('One-time Setup');
    }
    
    // 30% chance to add "premium support"
    if (Math.random() < 0.3) {
      newItems.push('Premium Support');
    }
    
    setBasketItems(newItems);
  };
  
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const formatDiscount = (price: number, originalPrice: number) => {
    const discountPercent = Math.floor(((originalPrice - price) / originalPrice) * 100);
    return `${discountPercent}%`;
  };
  
  const calcTotal = (planKey: string) => {
    let total = finalPrice[planKey];
    
    // Add hidden fees
    basketItems.forEach(item => {
      switch (item) {
        case 'Service Fee':
          total += planKey === 'basic' ? 5 : planKey === 'pro' ? 10 : 25;
          break;
        case 'One-time Setup':
          total += 15;
          break;
        case 'Premium Support':
          total += 9.99;
          break;
      }
    });
    
    return total;
  };
  
  const handleCloseDiscount = () => {
    setShowDiscount(false);
    
    // But bring it back after a delay
    setTimeout(() => {
      setShowDiscount(true);
    }, 30000); // 30 seconds
  };
  
  const handleCloseExitIntent = () => {
    setExitIntentShown(false);
    
    // Decrease prices to entice user to stay
    setFinalPrice(prev => {
      const newPrices = { ...prev };
      Object.keys(newPrices).forEach(plan => {
        newPrices[plan] = parseFloat((newPrices[plan] * 0.9).toFixed(2));
      });
      return newPrices;
    });
  };
  
  return (
    <div className="relative p-6 max-w-6xl mx-auto">
      {/* Timer banner */}
      {timerShown && (
        <div className={`sticky top-0 z-50 p-2 bg-${theme}-500 text-white text-center`}>
          <div className="flex items-center justify-center">
            <span className="mr-2">Limited time offer ends in:</span>
            <span className={`font-bold ${timeLeft < 60 ? 'animate-pulse text-red-300' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}
      
      <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h2>
      
      {/* Premium offer notice */}
      <div className={`p-4 mb-8 bg-${theme}-800 border border-${theme}-500 rounded-lg text-center`}>
        <p className="text-sm">
          All plans include a <span className="line-through">free</span> <span className="font-bold">premium</span> trial period.
          Cancel anytime<span className="text-xs text-gray-400">*</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          *Cancellation fee of $49.99 applies. Trial automatically converts to annual billing.
        </p>
      </div>
      
      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map(plan => (
          <motion.div
            key={plan.key}
            className={`relative overflow-hidden rounded-lg border-2 ${
              plan.popular ? `border-${theme}-400` : `border-${theme}-700`
            } ${plan.popular ? `bg-${theme}-800` : `bg-${theme}-900`} p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
            whileHover={{ y: -5 }}
            animate={{ scale: [1, plan.popular ? 1.05 : 1] }}
            transition={{ duration: 0.3 }}
          >
            {plan.popular && (
              <div className={`absolute top-0 right-0 bg-${theme}-400 text-${theme}-900 text-xs px-3 py-1 font-bold`}>
                MOST POPULAR
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
            
            <div className="mb-6">
              <div className="flex items-end">
                <span className="text-sm line-through opacity-60">
                  {formatPrice(plan.originalPrice)}
                </span>
                <span className={`text-3xl font-bold ml-2 text-${theme}-300`}>
                  {formatPrice(finalPrice[plan.key])}
                </span>
                <span className="text-sm ml-1 opacity-70">/mo</span>
              </div>
              <div className="text-xs mt-1">
                Save {formatDiscount(finalPrice[plan.key], plan.originalPrice)} off regular price
              </div>
            </div>
            
            <div className="mb-6">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Hidden features that appear on hover */}
              <motion.ul 
                className="space-y-2 mt-4 text-sm text-gray-400"
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                whileHover={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {plan.hidden.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs mr-2">+</span>
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="text-xs italic">Additional terms and fees may apply</li>
              </motion.ul>
            </div>
            
            <button
              className={`w-full py-2 rounded-md font-bold ${
                plan.popular
                  ? `bg-${theme}-400 text-${theme}-900 hover:bg-${theme}-300`
                  : `bg-${theme}-700 text-white hover:bg-${theme}-600`
              } transition-colors duration-300`}
              onClick={() => handleSelectPlan(plan.key)}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Selected plan details */}
      {selectedPlan && (
        <div className={`p-6 border-2 border-${theme}-500 rounded-lg mb-8`}>
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{plans.find(p => p.key === selectedPlan)?.name} Plan</span>
              <span>{formatPrice(finalPrice[selectedPlan])}/mo</span>
            </div>
            
            {/* Dynamically added basket items */}
            {basketItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm border-t border-gray-700 pt-2">
                <span>{item}</span>
                <span className="text-error">
                  {item === 'Service Fee' 
                    ? formatPrice(selectedPlan === 'basic' ? 5 : selectedPlan === 'pro' ? 10 : 25)
                    : item === 'One-time Setup'
                    ? formatPrice(15)
                    : formatPrice(9.99)}
                </span>
              </div>
            ))}
            
            <div className="flex justify-between font-bold border-t-2 border-gray-600 pt-4 mt-4">
              <span>Total (billed monthly)</span>
              <motion.span
                animate={{ x: [0, 3, -3, 3, 0] }}
                transition={{ duration: 0.5, delay: 1, repeat: 1 }}
              >
                {formatPrice(calcTotal(selectedPlan))}/mo
              </motion.span>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              *Prices subject to change. By proceeding, you agree to our complex pricing terms.
            </div>
          </div>
          
          <div className="mt-6">
            <button
              className={`w-full py-3 rounded-md font-bold bg-${theme}-500 text-white hover:bg-${theme}-400 transition-colors duration-300`}
              onClick={() => {
                // Apply "processing fee"
                setFinalPrice(prev => {
                  const newPrices = { ...prev };
                  newPrices[selectedPlan] = parseFloat((newPrices[selectedPlan] * 1.05).toFixed(2));
                  return newPrices;
                });
                
                // Add more items
                if (basketItems.length < 5) {
                  const newItems = [...basketItems];
                  if (!newItems.includes('Processing Fee')) {
                    newItems.push('Processing Fee');
                  }
                  setBasketItems(newItems);
                }
                
                alert('Payment processing... Please complete your payment in the new window.');
              }}
            >
              Complete Purchase
            </button>
            
            <p className="text-center text-xs mt-4 text-gray-400">
              By clicking "Complete Purchase" you agree to our Terms and Conditions, Privacy Policy, 
              Data Processing Agreement, Service Level Agreement, and Acceptable Use Policy.
            </p>
          </div>
        </div>
      )}
      
      {/* Discount popup */}
      <AnimatePresence>
        {showDiscount && (
          <motion.div
            className={`fixed bottom-4 right-4 p-4 bg-${theme}-500 text-white rounded-lg shadow-lg max-w-xs z-50`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <button 
              className="absolute top-2 right-2 text-white opacity-70 hover:opacity-100"
              onClick={handleCloseDiscount}
            >
              ✕
            </button>
            <h4 className="font-bold mb-2">Special Offer!</h4>
            <p className="text-sm mb-3">
              Act now and receive an additional 15% off your first 3 months!
              <span className="block mt-1 text-xs">
                (Discount automatically applied at checkout)
              </span>
            </p>
            <div className="text-center">
              <span className="inline-block bg-white text-red-500 px-3 py-1 font-bold text-sm rounded animate-pulse">
                15% OFF
              </span>
              <div className="text-xs mt-1">Offer expires soon!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Exit intent popup */}
      <AnimatePresence>
        {exitIntentShown && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative p-6 bg-${theme}-800 rounded-lg max-w-md w-full shadow-lg`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={handleCloseExitIntent}
              >
                ✕
              </button>
              
              <h3 className="text-2xl font-bold mb-4">Wait! Don't Leave Yet!</h3>
              <p className="mb-4">
                We noticed you're leaving. How about an <span className="font-bold">exclusive 30% discount</span> just for you?
              </p>
              
              <div className="mb-6 p-3 bg-black bg-opacity-30 rounded text-center">
                <div className="text-2xl font-bold text-success">30% OFF</div>
                <div className="text-sm">Limited time offer!</div>
              </div>
              
              <button
                className={`w-full py-3 rounded-md font-bold bg-${theme}-500 text-white hover:bg-${theme}-400`}
                onClick={handleCloseExitIntent}
              >
                Claim Discount Now
              </button>
              
              <p className="text-center text-xs mt-4 text-gray-400">
                *Discount applies to first month only. Regular billing resumes afterwards.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeceptivePricing; 