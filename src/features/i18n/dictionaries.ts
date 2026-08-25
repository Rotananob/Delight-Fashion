export type Language = 'en' | 'km';

export const dictionaries = {
  en: {
    // Header
    'nav.newArrivals': 'New Arrivals',
    'nav.tshirts': 'T-Shirts',
    'nav.jackets': 'Jackets & Outerwear',
    'nav.pants': 'Pants & Trousers',
    'nav.innerWear': 'Inner & Work Wear',
    'nav.allCollection': "All Men's Collection",
    'header.search': 'Search',
    'header.login': 'Sign In',
    'header.profile': 'My Profile',
    
    // Hero Section
    'hero.badge': 'Spring / Summer 2026',
    'hero.title': 'Redefining Modern',
    'hero.titleHighlight': 'Elegance',
    'hero.subtitle': 'Discover the latest collection of premium men\'s clothing. Tailored for the modern gentleman in Phnom Penh.',
    'hero.shopNow': 'Shop Collection',
    'hero.viewLookbook': 'View Lookbook',
    
    // Footer
    'footer.desc': "Phnom Penh's premier destination for luxury men's clothing. Tailored structured silhouettes, modern outerwear, and refined daily wear.",
    'footer.quickLinks': 'Quick Links',
    'footer.about': 'About Us',
    'footer.contact': 'Contact Us',
    'footer.shipping': 'Shipping Policy',
    'footer.returns': 'Returns & Exchanges',
    'footer.faq': 'FAQ',
    'footer.visitUs': 'Visit Us',
    'footer.address': 'St 271, Phnom Penh, Cambodia',
    'footer.hours': 'Mon - Sun: 9:00 AM - 9:00 PM',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterDesc': 'Subscribe to receive updates, access to exclusive deals, and more.',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
  },
  km: {
    // Header
    'nav.newArrivals': 'ទំនិញថ្មីៗ',
    'nav.tshirts': 'អាវយឺត',
    'nav.jackets': 'អាវធំ & អាវរងា',
    'nav.pants': 'ខោជើងវែង & ខោខ្លី',
    'nav.innerWear': 'សម្លៀកបំពាក់ក្នុង & ធ្វើការ',
    'nav.allCollection': "ម៉ូតបុរសទាំងអស់",
    'header.search': 'ស្វែងរក',
    'header.login': 'ចូលគណនី',
    'header.profile': 'គណនីរបស់ខ្ញុំ',
    
    // Hero Section
    'hero.badge': 'រដូវប្រាំង / រដូវវស្សា 2026',
    'hero.title': 'កំណត់និយមន័យថ្មីនៃ',
    'hero.titleHighlight': 'ភាពទាន់សម័យ',
    'hero.subtitle': 'ស្វែងរកសម្លៀកបំពាក់បុរសប្រណិតៗជំនាន់ថ្មី។ កាត់ដេរយ៉ាងសម្រិតសម្រាំងសម្រាប់បុរសសម័យថ្មីក្នុងរាជធានីភ្នំពេញ។',
    'hero.shopNow': 'ទិញឥឡូវនេះ',
    'hero.viewLookbook': 'មើលម៉ូតសម្លៀកបំពាក់',
    
    // Footer
    'footer.desc': "គោលដៅចម្បងនៃសម្លៀកបំពាក់បុរសប្រណិតនៅភ្នំពេញ។ ការកាត់ដេររាងស្អាត អាវធំទាន់សម័យ និងសម្លៀកបំពាក់ប្រចាំថ្ងៃដ៏ថ្លៃថ្នូរ។",
    'footer.quickLinks': 'តំណរហ័ស',
    'footer.about': 'អំពីយើង',
    'footer.contact': 'ទំនាក់ទំនង',
    'footer.shipping': 'គោលការណ៍ដឹកជញ្ជូន',
    'footer.returns': 'ការប្ដូរទំនិញ',
    'footer.faq': 'សំណួរដែលសួរញឹកញាប់',
    'footer.visitUs': 'ទីតាំងហាង',
    'footer.address': 'ផ្លូវ 271, ភ្នំពេញ, កម្ពុជា',
    'footer.hours': 'ច័ន្ទ - អាទិត្យ: 9:00 ព្រឹក - 9:00 យប់',
    'footer.newsletter': 'ទទួលព័ត៌មានថ្មីៗ',
    'footer.newsletterDesc': 'ចុះឈ្មោះដើម្បីទទួលបានព័ត៌មានថ្មីៗ ការបញ្ចុះតម្លៃពិសេស និងច្រើនទៀត។',
    'footer.subscribe': 'ជាវឥឡូវនេះ',
    'footer.rights': 'រក្សាសិទ្ធិគ្រប់យ៉ាង។',
  }
};

export type DictKey = keyof typeof dictionaries.en;
