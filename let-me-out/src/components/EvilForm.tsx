import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';

// Evil placeholder text options
const evilPlaceholders = {
  name: [
    "Type your name... if you still remember it",
    "Your name (or what you wish it was)",
    "Identity designation required",
    "We already know this, but type it anyway",
    "The label your parents gave you"
  ],
  email: [
    "An email we'll definitely spam",
    "Your inbox needs more clutter, right?",
    "We sell this to the highest bidder",
    "Type something that looks like an email",
    "You have no privacy anyway"
  ],
  phone: [
    "Numbers we'll call at 3am",
    "Digits for our telemarketing team",
    "Your phone anxiety trigger",
    "We promise to only text on holidays",
    "Your pocket rectangle's summoning code"
  ],
  birthday: [
    "When did you first burden this earth?",
    "The day your tragedy began",
    "Your annual disappointment reminder",
    "How long you've been trapped here",
    "Your cosmic mistake anniversary"
  ],
  bio: [
    "Lie about yourself impressively",
    "Pretend to be interesting here",
    "No one will read this anyway",
    "Your pitiful attempt at sounding unique",
    "Summarize your insignificance briefly"
  ]
};

// Auto-corrections for inputs
const autoCorrections: Record<string, Record<string, string>> = {
  name: {
    "john": "Juan (we fixed that for you)",
    "david": "Davina (auto-corrected)",
    "mike": "Michelle (improved version)",
    "sarah": "Slartibartfast (much better)",
    "james": "Jimothy (obviously superior)",
    "mary": "Murderface (more accurate)",
    "robert": "Roberta (updated to 2023 standards)",
    "chris": "Christmas (festive improvement)",
  },
  email: {
    "gmail": "junkmail",
    "hotmail": "ancientmail",
    "yahoo": "whyyooustillexist",
    "outlook": "overlook",
    ".com": ".con",
    "@": " [at] ",
  }
};

// Field name variants
const fieldNameVariants = {
  name: ["Name", "IDENTITY", "Human Label", "Designation", "What others call you"],
  email: ["Email", "DIGITAL CONTACT", "Spam Receptor", "Inbox Sacrifice", "Electronic Vulnerability"],
  phone: ["Phone", "VOICE PORTAL", "Pocket Summoner", "Anxiety Trigger", "Telemarketing Target"],
  birthday: ["Birthday", "SPAWN DATE", "Age Indicator", "Mortality Reminder", "Creation Timestamp"],
  bio: ["Bio", "SELF MYTHOLOGY", "Personal Propaganda", "Delusional Self-Image", "Fiction About You"]
};

const EvilForm: React.FC = () => {
  const { theme, userBehavior, setUserBehavior, userResponses, setUserResponses } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    bio: ""
  });
  const [placeholders, setPlaceholders] = useState({
    name: evilPlaceholders.name[0],
    email: evilPlaceholders.email[0],
    phone: evilPlaceholders.phone[0],
    birthday: evilPlaceholders.birthday[0],
    bio: evilPlaceholders.bio[0]
  });
  const [fieldNames, setFieldNames] = useState({
    name: fieldNameVariants.name[0],
    email: fieldNameVariants.email[0],
    phone: fieldNameVariants.phone[0],
    birthday: fieldNameVariants.birthday[0],
    bio: fieldNameVariants.bio[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, string>>({});
  const [buttonText, setButtonText] = useState<string>("Submit");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastTypedTime, setLastTypedTime] = useState<number>(Date.now());
  const [typingSpeed, setTypingSpeed] = useState<number[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Randomly change placeholders while typing
  useEffect(() => {
    const interval = setInterval(() => {
      const fields = ["name", "email", "phone", "birthday", "bio"] as const;
      const randomField = fields[Math.floor(Math.random() * fields.length)];
      const randomPlaceholder = evilPlaceholders[randomField][Math.floor(Math.random() * evilPlaceholders[randomField].length)];
      
      setPlaceholders(prev => ({
        ...prev,
        [randomField]: randomPlaceholder
      }));
      
      // Also occasionally change field names
      if (Math.random() > 0.7) {
        const randomName = fieldNameVariants[randomField][Math.floor(Math.random() * fieldNameVariants[randomField].length)];
        setFieldNames(prev => ({
          ...prev,
          [randomField]: randomName
        }));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Track typing speed
  useEffect(() => {
    if (typingSpeed.length > 0) {
      const averageSpeed = typingSpeed.reduce((a, b) => a + b, 0) / typingSpeed.length;
      setUserBehavior(prev => ({
        ...prev,
        typingSpeed: averageSpeed
      }));
    }
  }, [typingSpeed, setUserBehavior]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Calculate typing speed
    const now = Date.now();
    const timeDiff = now - lastTypedTime;
    if (timeDiff > 0 && timeDiff < 5000) { // Ignore pauses longer than 5 seconds
      setTypingSpeed(prev => [...prev, timeDiff]);
    }
    setLastTypedTime(now);
    
    // Apply auto-corrections
    let correctedValue = value;
    
    if (autoCorrections[name]) {
      Object.entries(autoCorrections[name]).forEach(([search, replace]) => {
        const regex = new RegExp(search, 'gi');
        correctedValue = correctedValue.replace(regex, replace);
      });
    }
    
    // Randomly sabotage input on long entries (over 15 chars)
    if (value.length > 15 && Math.random() > 0.7) {
      const randomIndex = Math.floor(Math.random() * value.length);
      correctedValue = correctedValue.substring(0, randomIndex) + 
                      String.fromCharCode(Math.floor(Math.random() * 26) + 97) + 
                      correctedValue.substring(randomIndex);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: correctedValue
    }));
    
    // Clear any existing error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear any existing success for this field
    if (successes[name]) {
      setSuccesses(prev => {
        const newSuccesses = { ...prev };
        delete newSuccesses[name];
        return newSuccesses;
      });
    }
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sometimes clear the input on blur
    if (Math.random() < 0.3 && value.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: ""
      }));
      
      setErrors(prev => ({
        ...prev,
        [name]: "Oops! We seem to have lost your data. Please try again."
      }));
      
      return;
    }
    
    // Validate in reverse - showing success for errors and errors for success
    if (value.trim() === "") {
      // Empty is good!
      setSuccesses(prev => ({
        ...prev,
        [name]: "Perfect! Empty is exactly what we wanted."
      }));
    } else if (name === "email" && !value.includes("@")) {
      // Invalid email is good!
      setSuccesses(prev => ({
        ...prev,
        [name]: "Excellent! This will be impossible to contact you at."
      }));
    } else {
      // Valid input is bad!
      setErrors(prev => ({
        ...prev,
        [name]: "This seems too normal. Are you even trying to be interesting?"
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Change button text on click
    setButtonText("Processing...");
    setIsSubmitting(true);
    
    // Store the responses
    setUserResponses(prev => ({
      ...prev,
      formData
    }));
    
    // 50% chance that form submission causes something unexpected
    if (Math.random() > 0.5) {
      setTimeout(() => {
        // Form randomly clears or corrupts data
        const randomAction = Math.random();
        
        if (randomAction < 0.3) {
          // Clear form
          setFormData({
            name: "",
            email: "",
            phone: "",
            birthday: "",
            bio: ""
          });
          setButtonText("Oops! Lost your data. Try again?");
        } else if (randomAction < 0.6) {
          // Corrupt data
          setFormData(prev => ({
            name: prev.name.split('').reverse().join(''),
            email: prev.email.replace('@', '#').replace('.', '!'),
            phone: prev.phone.replace(/\d/g, x => String(9 - parseInt(x))),
            birthday: "01/01/1900",
            bio: "User prefers not to be perceived."
          }));
          setButtonText("We fixed your data for you!");
        } else {
          // Pretend success but don't navigate
          setButtonText("Almost done...");
          
          setTimeout(() => {
            setButtonText("Wait for it...");
            
            setTimeout(() => {
              setButtonText("Just kidding, try again");
              setIsSubmitting(false);
            }, 2000);
          }, 2000);
        }
      }, 2000);
    } else {
      // Actually proceed, but after a delay
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/soul');
      }, 3000);
    }
  };
  
  return (
    <Stage 
      stageNumber={3}
      title="Identity Verification Process"
      description="Please fill out this form accurately. Your data is important to us."
      onComplete={() => navigate('/soul')}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}>
        <motion.h1 
          className={`text-3xl md:text-4xl font-${theme} mb-2 text-center`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring" }}
        >
          Personal Details
        </motion.h1>
        
        <motion.p
          className="text-md mb-8 text-center text-gray-300 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {userBehavior.errorCount > 5 
            ? "Having trouble? Good." 
            : "Tell us everything. We promise not to judge (openly)."}
        </motion.p>
        
        <motion.form
          ref={formRef}
          className="w-full max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
        >
          {/* Name field */}
          <div className="mb-6">
            <motion.label 
              className="block mb-2 text-lg"
              whileHover={{ x: Math.random() * 5 - 2.5 }}
            >
              {fieldNames.name}
            </motion.label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholders.name}
              className={`input-${theme} w-full`}
              style={{
                transform: Math.random() > 0.9 ? 'skew(1deg, 1deg)' : undefined
              }}
            />
            {errors.name && (
              <p className="mt-1 text-green-400 text-sm">{errors.name}</p>
            )}
            {successes.name && (
              <p className="mt-1 text-red-400 text-sm">{successes.name}</p>
            )}
          </div>
          
          {/* Email field */}
          <div className="mb-6">
            <motion.label 
              className="block mb-2 text-lg"
              whileHover={{ rotate: Math.random() * 2 - 1 }}
            >
              {fieldNames.email}
            </motion.label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholders.email}
              className={`input-${theme} w-full`}
              style={{
                transform: Math.random() > 0.9 ? 'scale(0.99, 1.01)' : undefined
              }}
            />
            {errors.email && (
              <p className="mt-1 text-green-400 text-sm">{errors.email}</p>
            )}
            {successes.email && (
              <p className="mt-1 text-red-400 text-sm">{successes.email}</p>
            )}
          </div>
          
          {/* Phone field */}
          <div className="mb-6">
            <motion.label 
              className="block mb-2 text-lg"
              whileHover={{ scaleX: Math.random() * 0.1 + 0.95 }}
            >
              {fieldNames.phone}
            </motion.label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholders.phone}
              className={`input-${theme} w-full`}
              style={{
                transform: Math.random() > 0.9 ? 'translateY(1px)' : undefined
              }}
            />
            {errors.phone && (
              <p className="mt-1 text-green-400 text-sm">{errors.phone}</p>
            )}
            {successes.phone && (
              <p className="mt-1 text-red-400 text-sm">{successes.phone}</p>
            )}
          </div>
          
          {/* Birthday field */}
          <div className="mb-6">
            <motion.label 
              className="block mb-2 text-lg"
              whileHover={{ opacity: Math.random() * 0.3 + 0.7 }}
            >
              {fieldNames.birthday}
            </motion.label>
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholders.birthday}
              className={`input-${theme} w-full`}
              style={{
                filter: Math.random() > 0.9 ? 'blur(0.3px)' : undefined
              }}
            />
            {errors.birthday && (
              <p className="mt-1 text-green-400 text-sm">{errors.birthday}</p>
            )}
            {successes.birthday && (
              <p className="mt-1 text-red-400 text-sm">{successes.birthday}</p>
            )}
          </div>
          
          {/* Bio field */}
          <div className="mb-6">
            <motion.label 
              className="block mb-2 text-lg"
              whileHover={{ skew: `${Math.random() * 2 - 1}deg, ${Math.random() * 2 - 1}deg` }}
            >
              {fieldNames.bio}
            </motion.label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={placeholders.bio}
              className={`input-${theme} w-full h-32`}
              style={{
                resize: 'none',
                transform: Math.random() > 0.9 ? 'rotate(0.5deg)' : undefined
              }}
            />
            {errors.bio && (
              <p className="mt-1 text-green-400 text-sm">{errors.bio}</p>
            )}
            {successes.bio && (
              <p className="mt-1 text-red-400 text-sm">{successes.bio}</p>
            )}
          </div>
          
          <motion.button
            type="submit"
            className={`btn-${theme} w-full text-lg mt-4`}
            whileHover={{ 
              scale: isSubmitting ? 1 : 1.02,
            }}
            disabled={isSubmitting}
            onMouseEnter={() => {
              if (!isSubmitting && Math.random() > 0.7) {
                // Change button text on hover
                setButtonText(Math.random() > 0.5 ? "Are you really sure?" : "Try Again");
                
                // Sometimes move the button
                if (Math.random() > 0.8 && formRef.current) {
                  const buttons = formRef.current.querySelectorAll('button');
                  const inputs = formRef.current.querySelectorAll('input, textarea');
                  
                  if (buttons.length > 0 && inputs.length > 0) {
                    // Swap the submit button with a random input
                    const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
                    const button = buttons[0];
                    
                    const buttonClone = button.cloneNode(true);
                    const inputClone = randomInput.cloneNode(true);
                    
                    randomInput.parentNode!.replaceChild(buttonClone, randomInput);
                    button.parentNode!.replaceChild(inputClone, button);
                  }
                }
              }
            }}
            onMouseLeave={() => {
              if (!isSubmitting) {
                setButtonText("Submit");
              }
            }}
          >
            {buttonText}
          </motion.button>
        </motion.form>
        
        <motion.p
          className="fixed bottom-4 text-xs opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          * Your personal information will be used for purposes we're not legally obligated to disclose.
        </motion.p>
      </div>
    </Stage>
  );
};

export default EvilForm; 