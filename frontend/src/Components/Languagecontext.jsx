import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const translations = {
  EN: {
    home: 'Home', dashboard: 'Dashboard', leaderboard: 'Leaderboard',
    form: 'Form', profile: 'Profile', logout: 'Logout',
    airQuality: 'Air Quality Index', waterQuality: 'Water Quality Index',
    back: 'Back', refresh: 'Refresh', summary: 'Summary',
    whatToDo: 'What To Do', whatToAvoid: 'What To Avoid',
    groupsAtRisk: 'Groups at Risk', pollutantLevels: 'Pollutant Levels',
    language: 'Language', credits: 'Credits', status: 'Status',
    accountDetails: 'Account Details', fullName: 'Full Name',
    email: 'Email', location: 'Location', joined: 'Joined',
  },
  HI: {
    home: 'होम', dashboard: 'डैशबोर्ड', leaderboard: 'लीडरबोर्ड',
    form: 'फॉर्म', profile: 'प्रोफाइल', logout: 'लॉगआउट',
    airQuality: 'वायु गुणवत्ता सूचकांक', waterQuality: 'जल गुणवत्ता सूचकांक',
    back: 'वापस', refresh: 'ताज़ा करें', summary: 'सारांश',
    whatToDo: 'क्या करें', whatToAvoid: 'क्या न करें',
    groupsAtRisk: 'जोखिम समूह', pollutantLevels: 'प्रदूषक स्तर',
    language: 'भाषा', credits: 'क्रेडिट', status: 'स्थिति',
    accountDetails: 'खाता विवरण', fullName: 'पूरा नाम',
    email: 'ईमेल', location: 'स्थान', joined: 'जुड़े',
  },
  MR: {
    home: 'मुख्यपृष्ठ', dashboard: 'डॅशबोर्ड', leaderboard: 'लीडरबोर्ड',
    form: 'फॉर्म', profile: 'प्रोफाइल', logout: 'लॉगआउट',
    airQuality: 'हवा गुणवत्ता निर्देशांक', waterQuality: 'पाणी गुणवत्ता निर्देशांक',
    back: 'मागे', refresh: 'रिफ्रेश', summary: 'सारांश',
    whatToDo: 'काय करावे', whatToAvoid: 'काय टाळावे',
    groupsAtRisk: 'धोका असलेले गट', pollutantLevels: 'प्रदूषक पातळी',
    language: 'भाषा', credits: 'क्रेडिट्स', status: 'स्थिती',
    accountDetails: 'खाते तपशील', fullName: 'पूर्ण नाव',
    email: 'ईमेल', location: 'स्थान', joined: 'सामील झाले',
  },
  TA: {
    home: 'முகப்பு', dashboard: 'டாஷ்போர்டு', leaderboard: 'தலைமை பலகை',
    form: 'படிவம்', profile: 'சுயவிவரம்', logout: 'வெளியேறு',
    airQuality: 'காற்று தர குறியீடு', waterQuality: 'நீர் தர குறியீடு',
    back: 'திரும்பு', refresh: 'புதுப்பி', summary: 'சுருக்கம்',
    whatToDo: 'என்ன செய்வது', whatToAvoid: 'என்ன தவிர்ப்பது',
    groupsAtRisk: 'ஆபத்தில் உள்ள குழுக்கள்', pollutantLevels: 'மாசு அளவுகள்',
    language: 'மொழி', credits: 'கிரெடிட்கள்', status: 'நிலை',
    accountDetails: 'கணக்கு விவரங்கள்', fullName: 'முழு பெயர்',
    email: 'மின்னஞ்சல்', location: 'இடம்', joined: 'இணைந்தது',
  },
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('EN')
  const t = translations[lang]
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)