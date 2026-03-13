'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Name Title options
const NAME_TITLE_OPTIONS = [
  'श्री',
  'श्रीमती',
  'कु.',
  'मा.',
  'स्व.श्री',
  'स्व.श्रीमती',
  'डॉ.',
  'इंजी.',
]

// Last Name / Profession options
const LAST_NAME_OPTIONS = [
  'गृहणी',
  'कृषक',
  'नर्सरी.स्टूडेंट',
  'स्कूल.स्टूडेंट',
  'कॉलेज.स्टूडेंट',
  'शिक्षक',
  'लेक्चरर',
  'प्रोफेसर',
  'शिक्षा-अधिकारी',
  'प्रधानाचार्य',
  'प्राचार्य',
  'खेल-अधिकारी',
  'डॉक्टर',
  'मेडिकल ऑफिसर',
  'स्पेशलिस्ट',
  'इंजीनियर',
  'वकील',
  'पत्रकार',
  'न्यायाधीश',
  'स्टेनो',
  'तहसीलदार',
  'पटवारी',
  'इंस्पेक्टर',
  'सब इंस्पेक्टर',
  'मिलिट्री पर्सन',
  'चार्टर्ड अकाउंटेंट',
  'क्लर्क',
  'अकॉउंटेन्ट',
  'कैशियर',
  'बैंक मैनेजर',
  'फार्मासिस्ट',
  'चिकित्सा सहायक',
  'नर्स',
  'कम्पाउण्डर',
  'आंगनबाड़ी',
  'कुक',
  'मैनेजर',
  'सेल्स मैनेजर',
  'फील्ड ऑफिसर',
  'कंप्यूटर ऑपरेटर',
  'ड्राइवर',
  'लोको पायलट',
  'ट्रांसपोर्टर',
  'डायरेक्टर',
  'साइन्टिस्ट',
  'फारेस्ट रेंजर',
  'उद्योगपति',
  'मैकेनिक',
  'व्यापारी',
  'कलाकार',
  'खिलाड़ी',
  'आचार्य',
  'शास्त्री',
  'समाजसेवी',
  'राजनीतिज्ञ',
  'राजस्व अधिकारी',
  'पुलिस अधिकारी',
  'सेना अधिकारी',
  'बीमा अधिकारी',
  'प्रशासनिक अधिकारी',
  'सीएमओ',
  'कॉन्ट्रैक्टर',
  'कंसल्टेंट',
  'टेक्नीशियन',
  'सर्वेयर',
  'बैंकर',
  'सप्लायर',
]

// Education options
const EDUCATION_OPTIONS = [
  'नर्सरी',
  'प्राइमरी',
  'मिडिल',
  '10वीं',
  '11वीं',
  '12वीं',
  'आई.टी.आई',
  'हाई स्कूल',
  'हायर सेकेंडरी',
  'ग्रेजुएट',
  'पोस्ट ग्रेजुएट',
  'डॉक्टरेट',
  'B.E/B.Tech',
  'M.B.B.S',
  'B.A.M.S',
  'B.H.M.S',
  'B.D.S',
  'B.V.Sc',
  'B.S.C.Ag',
  'B.Sc.Nursing',
  'B.Pharma',
  'B.Sc',
  'B.C.A',
  'B.Com',
  'B.J.M C',
  'L.L.B',
  'B.Ed',
  'B.P.Ed',
  'M.Sc.Ag',
  'M.V.Sc',
  'M.Sc',
  'M.Com',
  'M.B.A',
  'M.Tech',
  'M.C.A',
  'L.L.M',
  'M.Ed',
  'M.Pharma',
  'M.D/M.S',
  'M.J.M.C',
  'C.A',
  'C.S',
  'Diploma',
  'PG Diploma',
  'Dip(Eng)',
  'Other',
]

// Gotra options
const GOTRA_OPTIONS = [
  'गौतम',
  'भारद्वाज',
  'मुद्गल',
  'पाराशर',
  'चौबे',
  'बिरथरिया',
  'सिंघेचिया',
  'पचौरी',
  'दीक्षित',
  'दुबे',
  'जोशी',
  'रावत',
  'सावरण',
  'घृतकुल',
  'उपाध्याय',
  'मुखरैया',
  'श्रोत्रिय(सोती)',
  'कश्यप',
  'सनेधिया',
  'ढमोले',
  'सिंघौलिया',
  'तिवारी',
  'माद्र',
  'सागौरिया',
  'सड़वारिया',
  'दिघरौतिया',
  'कुड.रिहा',
  'बेरीबार',
  'पटुलिहा',
  'नगाइच',
  'बढ़ेले',
  'लुहोरिया',
  'मंगोलिया',
  'पिपरोनिया',
  'फुसेंतिया',
  'सीरोठिया',
  'मुडारे',
  'कटारे',
  'कुट्टिभा',
  'खडौलिया',
  'बौहरे',
  'अहेलिया',
  'चितौरिया',
  'छौलिहा',
  'सहवरिया',
  'बिजौरे',
  'कांकोरिया',
  'मामोलिया',
  'पारमल',
  'भाइलपुरिया',
  'सजेरालिया',
  'कनपुरिया',
  'डभरैया',
  'पसोइया',
  'सेवरिया',
  'समाधिया',
  'बसेड़िया',
  'खुड़ासिया',
  'चिड़रऊआ',
  'दरोईया',
  'दुगोलिया',
  'निधौरिया',
  'महावरिया',
  'औठिया',
  'बबोरिया',
  'डिलमोरिया',
  'सिनोहा',
  'सरीधिया',
  'धौमरैया',
  'दिघौतिया',
  'नारौलिया',
  'मूडौतिया',
]

// Profession options
const PROFESSION_OPTIONS = [
  'गृह कार्य',
  'कृषि कार्य',
  'अध्ययन',
  'शिक्षण कार्य',
  'वकालत',
  'न्याय प्रशासन',
  'चिकित्सा कार्य',
  'पशु चिकित्सा',
  'पैरा मेडीकल',
  'स्वास्थ्य सेवाएं',
  'पुलिस सेवा',
  'पैरा मिलिट्री',
  'डिफेन्स सेवा',
  'राजस्व सेवा',
  'शिक्षा सेवाएं',
  'स्कूल संचालन',
  'कोचिंग',
  'फार्मा सेक्टर',
  'नर्सिंग',
  'नर्सिंग होम',
  'मेडिकल स्टोर',
  'मैनेजमेंट',
  'होटल मैनेजमेन्ट',
  'डीलरशिप',
  'कांट्रेक्टर शिप',
  'उद्योग संचालन',
  'एग्री जॉब',
  'एग्री बिजनिस',
  'बैंकिंग सेक्टर',
  'इंश्योरेंस सेवा',
  'रेलवे सेवा',
  'ब्यूटी पार्लर',
  'प्राइवेट सेक्टर',
  'शासकीय सेवा',
  'निगम सेवा',
  'नगरीय प्रशासन',
  'पंचायत सेवाएं',
  'समाज सेवा',
  'वन विभाग',
  'अर्द्ध शासकीय',
  'केंद्रीय सेवा',
  'राजनीतिज्ञ',
  'पाण्डित्य कर्म',
  'होटल-रेस्टोरेन्ट',
  'ट्रांसपोर्ट कार्य',
  'ट्रैवेल्स',
  'सर्विस सेंटर',
  'सर्विस प्रोवाइडर',
  'अन्य पेशा',
]

// State-District-Village mapping
const STATE_OPTIONS = [
  'मध्यप्रदेश',
  'उत्तरप्रदेश',
  'राजस्थान',
  'महाराष्ट्र',
  'भारत के अन्य शहर',
]

// This would be populated dynamically based on state selection
// For now, keeping it simple - in production, you'd have a complete mapping
const DISTRICT_MAP: Record<string, string[]> = {
  मध्यप्रदेश: [
    'भिंड',
    'मुरैना',
    'ग्वालियर',
    'शिवपुरी',
    'गुना',
    'अशोकनगर',
    'दतिया',
    'श्योपुर',
    'सागर',
    'दमोह',
    'छिंदवाड़ा',
    'सिवनी',
    'मंडला',
    'बालाघाट',
    'इंदौर',
    'धार',
    'खंडवा',
    'बुरहानपुर',
    'उज्जैन',
    'रतलाम',
    'मंदसौर',
    'नीमच',
    'जबलपुर',
    'कटनी',
    'नरसिंहपुर',
    'भोपाल',
    'सीहोर',
    'रायसेन',
    'विदिशा',
    'होशंगाबाद',
    'रीवा',
    'सतना',
    'सीधी',
    'Other',
  ],
  उत्तरप्रदेश: [
    'आगरा',
    'अलीगढ़',
    'हाथरस',
    'कासगंज',
    'मैनपुरी',
    'फिरोजाबाद',
    'इटावा',
    'औरैया',
    'इटावा',
    'कानपुर नगर',
    'कानपुर देहात',
    'उन्नाव',
    'लखनऊ',
    'रायबरेली',
    'सीतापुर',
    'हरदोई',
    'लखीमपुर-खीरी',
    'बहराइच',
    'गोंडा',
    'फैजाबाद',
    'अंबेडकर नगर',
    'सुल्तानपुर',
    'बाराबंकी',
    'प्रतापगढ़',
    'जौनपुर',
    'वाराणसी',
    'गाजीपुर',
    'आजमगढ़',
    'बलिया',
    'देवरिया',
    'गोरखपुर',
    'महाराजगंज',
    'कुशीनगर',
    'बस्ती',
    'संत कबीर नगर',
    'सिद्धार्थ नगर',
    'मेरठ',
    'बागपत',
    'गाजियाबाद',
    'गौतम बुद्ध नगर',
    'बुलंदशहर',
    'अलीगढ़',
    'मथुरा',
    'मुरादाबाद',
    'रामपुर',
    'बिजनौर',
    'सहारनपुर',
    'मुज़फ्फरनगर',
    'शामली',
    'बरेली',
    'बदायूं',
    'शाहजहांपुर',
    'पीलीभीत',
    'फर्रुखाबाद',
    'इटावा',
    'जालौन',
    'झांसी',
    'ललितपुर',
    'जालौन',
    'हमीरपुर',
    'महोबा',
    'बांदा',
    'चित्रकूट',
    'Other',
  ],
  राजस्थान: [
    'जयपुर',
    'सीकर',
    'झुंझुनू',
    'अलवर',
    'भरतपुर',
    'धौलपुर',
    'करौली',
    'सवाई माधोपुर',
    'दौसा',
    'अजमेर',
    'टोंक',
    'भीलवाड़ा',
    'बूंदी',
    'कोटा',
    'बारां',
    'झालावाड़',
    'उदयपुर',
    'राजसमंद',
    'डूंगरपुर',
    'बांसवाड़ा',
    'चित्तौड़गढ़',
    'प्रतापगढ़',
    'जोधपुर',
    'नागौर',
    'पाली',
    'बाड़मेर',
    'जालौर',
    'सिरोही',
    'बीकानेर',
    'चुरू',
    'श्री गंगानगर',
    'हनुमानगढ़',
    'Other',
  ],
  महाराष्ट्र: [
    'मुंबई',
    'पुणे',
    'नागपुर',
    'ठाणे',
    'नवी मुंबई',
    'नासिक',
    'औरंगाबाद',
    'सोलापुर',
    'कोल्हापुर',
    'अमरावती',
    'सांगली',
    'अकोला',
    'लातूर',
    'जलगांव',
    'अहमदनगर',
    'Other',
  ],
  'भारत के अन्य शहर': ['Other'],
}

// Ancestral Villages (Paitrik Gaon)
const ANCESTRAL_VILLAGES = [
  'अकोड़ा',
  'चरथर',
  'जामना',
  'विर्धनपुरा',
  'दबोहा',
  'फूप',
  'पाली',
  'भीमपुरा',
  'सकराया',
  'मेहगांव',
  'इमलिया',
  'गुर्जाकापुरा',
  'बिरगवाँ',
  'सिमार',
  'कैरोरा',
  'दैपुरा',
  'गिंगरखी',
  'मानिकपुरा',
  'चपरा',
  'गोहद',
  'गोहदचौराहा',
  'बड़ागर',
  'रमनपुरा',
  'सिरसौदा',
  'बगुलरी',
  'खुर्द',
  'खेरिया',
  'चन्दहारा',
  'भगवासा',
  'चंदोखर',
  'डांग',
  'भड़ेरा',
  'चन्द्रभान का पुरा',
  'बम्होरा',
  'गंज',
  'रामपुर',
  'जींगनी',
  'देवीसिंह का पुरा',
  'देवरी',
  'पिड़ावली',
  'विण्डवा',
  'सिकरौदा',
  'हिंगोना',
  'जतावर',
  'भोजराज का पुरा',
  'जौरा',
  'कुम्हेरी',
  'हड़वासी',
  'वीरमपुरा',
  'चैना',
  'सांटा',
  'नाहरदोंकी',
  'कांसपुरा',
  'मुंगावली',
  'जाफराबाद',
  'सिंहोरी',
  'खुटियानी',
  'विशनोरी',
  'बांसी',
  'कैमरा',
  'देवगढ़',
  'लालबांस',
  'अधन्नपुरा',
  'अम्बाह',
  'चांद का पुरा',
  'अमरपुरा',
  'रूपाहटी',
  'नदोल का पुरा',
  'भुआ का पुरा',
  'गरीबे का पुरा',
  'लंगड़िहा',
  'वित्त का पुरा',
  'छिधै का पुरा',
  'चिन्ते का पुरा',
  'खांदकापुरा',
  'बड़पुरा',
  'बनवरिया',
  'देवहंसकापुरा',
  'मरजादगढ़',
  'जैकन्नकापुरा',
  'बिजुलीपुरा',
  'आमलीपुरा',
  'रुधावली',
  'रुअर',
  'लोलकी',
  'पुरावस',
  'सिरमौर का पुरा',
  'बिरहरुआ',
  'पायका पुरा',
  'मोहनपुरा',
  'भाय खां का पुरा',
  'बावरीपुरा',
  'बरेह',
  'भिडौसा',
  'दोहरी',
  'खड़ियाबेहड़',
  'इकहरा',
  'पंचोली',
  'मिरघान',
  'हरिज्ञान का पुरा',
  'भीमसेन का पुरा',
  'हिंगोटियाई',
  'दुहिया',
  'गुंझार',
  'डबरा',
  'जखा',
  'धमनिका',
  'नाहटौली',
  'ेंगना',
  'आरौन',
  'पतलेश्वर',
  'बमौरी',
  'इकोदिया',
  'रुठियाई',
  'माहुर',
  'मार की मउ',
  'काकरा',
  'पटना',
  'नईसराय',
  'बरखेड़ी',
  'तिलीखेड़ा',
  'दोल्ला',
  'सकतपुर',
  'धरनावदा',
  'सिरोंज',
  'रुसल्ली',
  'बमूरिया',
  'लटेरी',
  'मोतीपुर',
  'मुक्ताखेड़ा',
  'सावनखेड़ी',
  'बरखेड़ादेव',
  'कारेदेव',
  'बरेली',
  'जामगढ़',
  'खरगोन',
  'कुण्डाली',
  'देहगांव',
  'सागर',
  'सिहोरा',
  'करहद',
  'बम्होरी',
  'पिपरियाछोटी',
  'अमरवाड़ा',
  'पाटनी',
  'सौंसर',
  'सिंगौड़ी',
  'चौरई',
  'उमरिया',
  'पलटवाड़ा',
  'ककई',
  'बरेलीपार',
  'नवेगांव',
  'कामता',
  'चन्दनवाड़ा',
  'लुगसी',
  'घुरैया',
  'सांवरी',
  'थांवरी',
  'कुडा',
  'रामगढ़',
  'गोपालपुरा',
  'पिपरिया',
  'बगदरी',
  'हथनी',
  'कपूरदा',
  'माचीवाड़ा',
  'सलखनी',
  'विलन्दा',
  'सुजरना',
  'घोड़ाबाड़ी',
  'समसवाड़ा',
  'सिमरिया',
  'दुगरिया',
  'मोहगांव',
  'चांदमेटा',
  'हरनमटा',
  'पलासिया',
  'नूटन',
  'चिखड़ी',
  'दैलाखाड़ी',
  'बड़कुट्टी',
  'बीजाबाड़ी',
  'पगारा',
  'जुनारदेव',
  'बिछुआ',
  'रावनपारा',
  'पालहरी',
  'छिन्दवाड़ा',
  'भरथना',
  'कंढैया',
  'हर्राजपुरा',
  'रमपुरा',
  'बकेवर',
  'बहालियन का नगरा',
  'नया नगरा',
  'विशनामऊ',
  'सिरसा',
  'जैतपुरा',
  'तुला का नगरा',
  'निवाड़ी कलां',
  'अहेरीपुर',
  'बहेड़ा',
  'जखोली',
  'जखोली का नगला',
  'चिकनी',
  'मुडेंना',
  'टकपुरा',
  'इटावा',
  'उन्नाव',
  'देवगांव',
  'सफीपुर',
  'अरेरकलां',
  'भैंसारा',
  'निहालपुर',
  'लगसेसरा',
  'मावईब्राह्मण',
  'छोटीसरस',
  'लिधौसी',
  'मद्दूखेड़ा',
  'बृजपालपुर',
  'सांथीनगर',
  'मुछखेड़ा',
  'उज्जैन',
  'अमरावती',
  'सालपुर कवाई',
  'बारा',
  'गड़ूपुरा',
  'हुल्लकापुरा',
  'बाजकापुरा',
  'सांवलदासकापुरा',
  'बढ़ापुरा',
  'पिनाहट',
  'सहादतनगर',
  'संडीला',
  'सराय',
  'मसेरी',
  'रामगढ़ी',
  'लोहरा',
  'नोराई',
  'सुजराई',
  'सजावल',
  'सोहार',
  'नरौरी',
  'जलालपुर',
  'सुमेरनगला',
  'बंदायू',
  'दिबियापुर',
  'भरतपुर',
  'जगमोहनपुरा',
  'पराय',
  'जरगहां',
  'नीमडांडा',
  'सीकर',
  'माधोपुर',
  'राजोली',
  'कुली',
  'केलिया',
  'पड़ापोली',
  'सवाई माधोपुर',
  'वीसलपुर',
  'सावनिया',
  'पुलु',
  'धनसार',
  'कठोर',
  'सराना',
  'मोकलपुर',
  'अलवर',
  'मंगलपुर',
  'जालौन',
  'सिकरी',
  'सहाव',
  'लहचूरा',
]

// State and District mapping
const STATE_DISTRICT_MAP: Record<string, string[]> = DISTRICT_MAP

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    familyId: '',
    nameTitle: 'श्री',
    firstName: '',
    lastName: '',
    fatherOrHusbandName: '',
    maritalStatus: 'अविवाहित',
    age: '',
    education: '',
    gotra: '',
    profession: '',
    state: '',
    district: '',
    village: '',
    address: '',
    ancestralVillage: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Get districts based on selected state
  const districtOptions = useMemo(() => {
    if (!formData.state) return []
    return STATE_DISTRICT_MAP[formData.state] || []
  }, [formData.state])

  // Get villages based on selected district
  // In a real app, this would be a proper mapping
  const villageOptions = useMemo(() => {
    if (!formData.district) return []
    return ANCESTRAL_VILLAGES
  }, [formData.district])

  // Reset district and village when state changes
  const handleStateChange = (newState: string) => {
    setFormData({ ...formData, state: newState, district: '', village: '' })
  }

  // Reset village when district changes
  const handleDistrictChange = (newDistrict: string) => {
    setFormData({ ...formData, district: newDistrict, village: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyId: formData.familyId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fatherOrHusbandName: formData.fatherOrHusbandName,
          maritalStatus: formData.maritalStatus,
          age: formData.age,
          dateOfBirth: formData.dateOfBirth,
          education: formData.education,
          gotra: formData.gotra,
          profession: formData.profession,
          state: formData.state,
          district: formData.district,
          currentAddress: formData.currentAddress,
          ancestralVillage: formData.ancestralVillage,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          bio: formData.bio,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      setSuccess(
        'Registration successful! Your profile is pending approval. Redirecting to login...',
      )

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-700">
          परिवार पंजीकरण फॉर्म
        </h1>
        <h2 className="text-xl text-center mb-6 text-gray-600">
          Family Registration Form
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              घर के मुखिया की विवरण (Head of Family Details)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="familyId">
                  परिवार की Id (Family ID){' '}
                  <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="familyId"
                  value={formData.familyId}
                  onChange={(e) =>
                    setFormData({ ...formData, familyId: e.target.value })
                  }
                  placeholder="Alphanumeric"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="firstName">
                  प्रथम नाम (First Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">
                  पदवी नाम (Last Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="fatherOrHusbandName"
                >
                  पिता या पति का नाम (Father or Husband&apos;s Name)
                </label>
                <input
                  type="text"
                  id="fatherOrHusbandName"
                  value={formData.fatherOrHusbandName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatherOrHusbandName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="maritalStatus"
                >
                  विवाह अवस्थास (Marital Status)
                </label>
                <select
                  id="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, maritalStatus: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="UNMARRIED">अविवाहित (Unmarried)</option>
                  <option value="MARRIED">विवाहित (Married)</option>
                  <option value="DIVORCED">तलाकशुदा (Divorced)</option>
                  <option value="WIDOWED">विधवा/विधुर (Widowed)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="age">
                  आयु (Age) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  min="18"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="dateOfBirth"
                >
                  जन्म तिथि (Date of Birth)
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="gender">
                  लिंग (Gender) <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              शैक्षिक और व्यावसायिक विवरण (Educational & Professional Details)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="education">
                  शिक्षा (Education)
                </label>
                <select
                  id="education"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Education</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="B.A.">B.A.</option>
                  <option value="B.Com">B.Com</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E.">B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="M.A.">M.A.</option>
                  <option value="M.Com">M.Com</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="CA">CA</option>
                  <option value="MBBS">MBBS</option>
                  <option value="Ph.D.">Ph.D.</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="gotra">
                  गोत्र (Gotra)
                </label>
                <select
                  id="gotra"
                  value={formData.gotra}
                  onChange={(e) =>
                    setFormData({ ...formData, gotra: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">गोत्र चुने (Select Gotra)</option>
                  {GOTRA_OPTIONS.map((gotra) => (
                    <option key={gotra} value={gotra}>
                      {gotra}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="profession"
                >
                  पेशा (Profession)
                </label>
                <select
                  id="profession"
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData({ ...formData, profession: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">पेशा चुने (Select Profession)</option>
                  {PROFESSION_OPTIONS.map((profession) => (
                    <option key={profession} value={profession}>
                      {profession}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              पता विवरण (Address Details)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="state">
                  राज्य (State)
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">राज्य चुने (Select State)</option>
                  {Object.keys(STATE_DISTRICT_MAP).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="district">
                  जिला (District)
                </label>
                <select
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  disabled={!formData.state}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.state
                      ? 'जिला चुने (Select District)'
                      : 'कृपया पहले राज्य चुने (Please select state first)'}
                  </option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="currentAddress"
                >
                  वर्तमान निवास पता (Current Residence Address)
                </label>
                <textarea
                  id="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAddress: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="ancestralVillage"
                >
                  पैतृक गांव (Ancestral Village)
                </label>
                <input
                  type="text"
                  id="ancestralVillage"
                  value={formData.ancestralVillage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ancestralVillage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              संपर्क विवरण (Contact Details)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="mobile">
                  मोबाइल नंबर (Mobile Number){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="10 digit mobile number"
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  ईमेल (Email){' '}
                  <span className="text-gray-500 text-sm">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              खाता सुरक्षा (Account Security)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  पासवर्ड (Password) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="confirmPassword"
                >
                  पासवर्ड पुष्टि (Confirm Password){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pb-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              अपने बारे में (About Yourself)
            </h3>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="bio">
                संक्षिप्त विवरण (Bio){' '}
                <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {loading ? 'जमा हो रहा है... (Submitting...)' : 'जमा करे (Submit)'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-purple-600 hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
