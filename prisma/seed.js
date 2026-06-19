// Run: yarn seed (builds first, then node prisma/seed.js)
require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../dist/generated/prisma');
const { randomUUID } = require('crypto');

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const imgW = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'architecture', name: 'Architecture', tagline: 'Form, light & structure', description: 'Visionary residential and commercial architecture practices shaping landmark spaces.', image: img('photo-1487958449943-2429e8be8625'), subcategories: ['Residential Architecture', 'Commercial Architecture'] },
  { id: 'interior', name: 'Interior Design', tagline: 'Curated living, refined', description: 'Award-winning interior studios for residential and commercial environments.', image: img('photo-1616486338812-3dadae4b4ace'), subcategories: ['Residential Interiors', 'Commercial Interiors'] },
  { id: 'furniture', name: 'Furniture', tagline: 'Bespoke & collectible', description: 'Custom ateliers and luxury houses crafting statement furniture.', image: img('photo-1538688525198-9b88f6f53126'), subcategories: ['Custom Furniture', 'Luxury Furniture'] },
  { id: 'furnishings', name: 'Furnishings', tagline: 'Soft architecture', description: 'Curtains, upholstery and blinds tailored to your space.', image: img('photo-1505693416388-ac5ce068fe85'), subcategories: ['Curtains', 'Upholstery', 'Blinds'] },
  { id: 'surfaces', name: 'Surface Solutions', tagline: 'Stone, marble & quartz', description: 'Natural stone, marble, quartz and tile specialists.', image: img('photo-1615875605825-5eb9bb5d52ac'), subcategories: ['Stone', 'Marble', 'Quartz', 'Tiles'] },
  { id: 'walls', name: 'Wall Solutions', tagline: 'Texture & expression', description: 'Wallpapers, panels and decorative finishes.', image: img('photo-1513519245088-0e12902e5d4c'), subcategories: ['Wallpapers', 'Wall Panels', 'Decorative Finishes'] },
  { id: 'styling', name: 'Styling', tagline: 'The finishing note', description: 'Artwork, decor and accessories to complete every room.', image: img('photo-1493809842364-78817add7ffb'), subcategories: ['Artwork', 'Decor', 'Accessories'] },
  { id: 'turnkey', name: 'Turnkey Solutions', tagline: 'End to end, effortless', description: 'Full project management from concept to handover.', image: img('photo-1600585154340-be6161a56a0c'), subcategories: ['End-to-End Project Management'] },
];

// ─── VENDORS ──────────────────────────────────────────────────────────────────

const VENDORS = [
  {
    id: 'atelier-roshan',
    name: 'Griha Atelier',
    categoryId: 'architecture',
    shortDescription: 'Award-winning residential architecture rooted in light, vastu and modern Indian living.',
    description: 'Griha Atelier is a Mumbai-based architecture studio celebrated for its mastery of light, material and space. Founded in 2009, the studio has delivered over 120 landmark residences across India — from Bandra sea-facing homes to Lutyens-era Delhi bungalows — each defined by quiet confidence and a meticulous attention to livability. The practice believes great architecture begins with listening: to the site, to the climate, and to the families who will live within.',
    logoColor: '#B08D4E',
    cover: imgW('photo-1560518883-ce09059eeffa'),
    gallery: [imgW('photo-1486325212027-8081e485255e'), imgW('photo-1448630360428-65456885c650'), imgW('photo-1600047509358-9dc75507daeb')],
    projects: [
      { title: 'Bandra Sea-View Villa', image: imgW('photo-1512917774080-9991f1c4c750'), images: [imgW('photo-1512917774080-9991f1c4c750'), imgW('photo-1600047509807-ba8f99d2cdde'), imgW('photo-1600566752355-35792bedcfea'), imgW('photo-1600210492486-724fe5c67fb0')] },
      { title: 'Lutyens Delhi Bungalow', image: imgW('photo-1600047509807-ba8f99d2cdde'), images: [imgW('photo-1600047509807-ba8f99d2cdde'), imgW('photo-1586208958839-06c17cacaded'), imgW('photo-1512917774080-9991f1c4c750')] },
      { title: 'Koramangala Townhouse', image: imgW('photo-1600566752355-35792bedcfea'), images: [imgW('photo-1600566752355-35792bedcfea'), imgW('photo-1600607687939-ce8a6c25118c'), imgW('photo-1600047509358-9dc75507daeb')] },
    ],
    services: ['Residential Architecture', 'Commercial Architecture', 'Renovation & Restoration'],
    contactPerson: 'Aarav Mehta',
    phone: '+91 22 4321 4567',
    email: 'studio@grihaatelier.in',
    location: { floor: 'Ground Floor', zone: 'Zone A', showroom: 'Showroom A1' },
    popular: true,
    recommended: true,
    rating: 4.9,
  },
  {
    id: 'studio-may',
    name: 'Saffron Studio',
    categoryId: 'interior',
    shortDescription: 'Layered interiors where calm sophistication meets bespoke Indian craftsmanship.',
    description: 'Saffron Studio was founded by designer Ananya Iyer with a singular belief: that truly beautiful interiors emerge from restraint. The studio works with a selective portfolio of clients, crafting environments where every surface, material and proportion has been considered. Their work spans private villas, boutique hospitality and executive offices across Mumbai, Bengaluru and the NCR.',
    logoColor: '#8B5E83',
    cover: imgW('photo-1618220179428-22790b461013'),
    gallery: [imgW('photo-1615529328331-f8917597711f'), imgW('photo-1616593969747-4797dc75033e'), imgW('photo-1631679706909-1844bbd07221')],
    projects: [
      { title: 'Worli Sea-Face Penthouse', image: imgW('photo-1600210492486-724fe5c67fb0'), images: [imgW('photo-1600210492486-724fe5c67fb0'), imgW('photo-1615529328331-f8917597711f'), imgW('photo-1616593969747-4797dc75033e')] },
      { title: 'Jubilee Hills Private Villa', image: imgW('photo-1600607687939-ce8a6c25118c'), images: [imgW('photo-1600607687939-ce8a6c25118c'), imgW('photo-1631679706909-1844bbd07221'), imgW('photo-1586208958839-06c17cacaded')] },
      { title: 'Whitefield Hills Estate', image: imgW('photo-1586208958839-06c17cacaded'), images: [imgW('photo-1586208958839-06c17cacaded'), imgW('photo-1600210492486-724fe5c67fb0'), imgW('photo-1615529328331-f8917597711f')] },
    ],
    services: ['Full Space Design', 'Kitchen & Bath Design', 'Lighting Design', 'Space Planning'],
    contactPerson: 'Ananya Iyer',
    phone: '+91 22 3388 2211',
    email: 'hello@saffronstudio.in',
    location: { floor: 'Ground Floor', zone: 'Zone A', showroom: 'Showroom A2' },
    popular: false,
    recommended: true,
    rating: 4.8,
  },
  {
    id: 'maison-bois',
    name: 'Teak & Sheesham',
    categoryId: 'furniture',
    shortDescription: 'Custom furniture atelier crafting heirloom-quality pieces in solid Indian hardwood.',
    description: 'Teak & Sheesham is the country\'s foremost custom furniture house, working exclusively with sustainably sourced solid teak, sheesham and other natural hardwoods. Each piece is handcrafted to order in their Jodhpur workshop, taking 8–16 weeks from design to delivery. The result is furniture that rewards close attention — joinery you can feel, grain patterns you can trace, finishes that age beautifully.',
    logoColor: '#6B4C2A',
    cover: imgW('photo-1555041469-a586c61ea9bc'),
    gallery: [imgW('photo-1567538096630-e0c55bd6374c'), imgW('photo-1594026112284-02bb6f3352fe'), imgW('photo-1538688525198-9b88f6f53126')],
    projects: [
      { title: 'Alibaug Farmhouse Dining', image: imgW('photo-1556909114-f6e7ad7d3136'), images: [imgW('photo-1556909114-f6e7ad7d3136'), imgW('photo-1524758631624-e2822e304c36'), imgW('photo-1493663284031-b7e3aefcae8e')] },
      { title: 'Pune Villa Library', image: imgW('photo-1524758631624-e2822e304c36'), images: [imgW('photo-1524758631624-e2822e304c36'), imgW('photo-1567538096630-e0c55bd6374c'), imgW('photo-1594026112284-02bb6f3352fe')] },
      { title: 'Lower Parel Penthouse', image: imgW('photo-1493663284031-b7e3aefcae8e'), images: [imgW('photo-1493663284031-b7e3aefcae8e'), imgW('photo-1538688525198-9b88f6f53126'), imgW('photo-1556909114-f6e7ad7d3136')] },
    ],
    services: ['Custom Sofa & Seating', 'Bespoke Dining Collection', 'Bedroom Suite Design'],
    contactPerson: 'Rohan Bedi',
    phone: '+91 22 4412 8890',
    email: 'atelier@teakandsheesham.in',
    location: { floor: 'First Floor', zone: 'Zone B', showroom: 'Showroom B1' },
    popular: true,
    recommended: false,
    rating: 4.7,
  },
  {
    id: 'linen-silk-co',
    name: 'Khadi & Silk House',
    categoryId: 'furnishings',
    shortDescription: 'Bespoke curtains, drapes and upholstery in handwoven Indian khadi and silk.',
    description: 'Khadi & Silk House has been the discreet choice of interior designers across India for over a decade. Their in-house team of specialist tailors works with an exclusive edit of fabrics sourced from Banarasi silk weavers, Bhagalpur tussar mills and handloom khadi co-operatives. Every commission begins with a site visit and ends with a perfect fit.',
    logoColor: '#9E8A7A',
    cover: imgW('photo-1505693416388-ac5ce068fe85'),
    gallery: [imgW('photo-1564540583246-934409427776'), imgW('photo-1558618666-fcd25c85cd64'), imgW('photo-1586023492125-27b2c045efd7')],
    projects: [
      { title: 'Udaipur Palace Suite', image: imgW('photo-1631049307264-da0ec9d70304'), images: [imgW('photo-1631049307264-da0ec9d70304'), imgW('photo-1586190848861-99aa4a171e90'), imgW('photo-1560448204-603b3fc33ddc')] },
      { title: 'Jaipur Heritage Haveli', image: imgW('photo-1586190848861-99aa4a171e90'), images: [imgW('photo-1586190848861-99aa4a171e90'), imgW('photo-1564540583246-934409427776'), imgW('photo-1558618666-fcd25c85cd64')] },
      { title: 'Juhu Family Villa', image: imgW('photo-1560448204-603b3fc33ddc'), images: [imgW('photo-1560448204-603b3fc33ddc'), imgW('photo-1586023492125-27b2c045efd7'), imgW('photo-1631049307264-da0ec9d70304')] },
    ],
    services: ['Couture Curtains & Drapes', 'Custom Upholstery', 'Blinds & Shutters'],
    contactPerson: 'Meera Nair',
    phone: '+91 22 6552 3340',
    email: 'orders@khadisilkhouse.in',
    location: { floor: 'Ground Floor', zone: 'Zone C', showroom: 'Showroom C1' },
    popular: false,
    recommended: false,
    rating: 4.5,
  },
  {
    id: 'marbellos-stone',
    name: 'Makrana Marble House',
    categoryId: 'surfaces',
    shortDescription: 'Quarry-direct Makrana marble, granite and quartz for floors, walls and kitchens.',
    description: 'Makrana Marble House sources exceptional natural stone directly from quarries in Makrana, Rajasthan and from Italy, Turkey and Brazil. Their 4,000 sq ft showroom in the Design Center features over 200 slab varieties on display — from the legendary white Makrana marble used in the Taj Mahal to rare imported quartzites. Each project is supported by a dedicated stone specialist who guides selection, fabrication and installation.',
    logoColor: '#7B8C7A',
    cover: imgW('photo-1615875605825-5eb9bb5d52ac'),
    gallery: [imgW('photo-1604014236913-dfae9ee55fad'), imgW('photo-1558618047-f4e61e6e6464'), imgW('photo-1509644851169-2acc08aa25b5')],
    projects: [
      { title: 'Lonavala Hill Mansion', image: imgW('photo-1600585154526-990dced4db0d'), images: [imgW('photo-1600585154526-990dced4db0d'), imgW('photo-1574739782594-db4ead022697'), imgW('photo-1600585154340-be6161a56a0c')] },
      { title: 'DLF Camellias Residence', image: imgW('photo-1574739782594-db4ead022697'), images: [imgW('photo-1574739782594-db4ead022697'), imgW('photo-1604014236913-dfae9ee55fad'), imgW('photo-1558618047-f4e61e6e6464')] },
      { title: 'Nariman Point Lobby', image: imgW('photo-1600585154340-be6161a56a0c'), images: [imgW('photo-1600585154340-be6161a56a0c'), imgW('photo-1509644851169-2acc08aa25b5'), imgW('photo-1600585154526-990dced4db0d')] },
    ],
    services: ['Marble & Stone Flooring', 'Quartz Countertops', 'Decorative Tiles'],
    contactPerson: 'Vikram Rathore',
    phone: '+91 22 2299 7700',
    email: 'projects@makranamarble.in',
    location: { floor: 'Ground Floor', zone: 'Zone D', showroom: 'Showroom D1' },
    popular: true,
    recommended: false,
    rating: 4.8,
  },
  {
    id: 'decor-artiste',
    name: 'Chitrakala Walls',
    categoryId: 'walls',
    shortDescription: 'Designer wallpapers, 3D panels and hand-applied decorative wall finishes.',
    description: 'Chitrakala Walls transforms walls into statements. Working with over 80 international and Indian wallpaper collections and a team of trained artisans skilled in Venetian plaster, micro-cement, lime and traditional fresco finishes, the studio brings texture and depth to every space. Their signature "living wall" concept — layered finishes that evolve with natural and artificial light — is available exclusively through the Design Center.',
    logoColor: '#C4956A',
    cover: imgW('photo-1513519245088-0e12902e5d4c'),
    gallery: [imgW('photo-1600121848594-d8644e57abab'), imgW('photo-1615873968403-89e068629265'), imgW('photo-1604841702261-f0cd54a2f47c')],
    projects: [
      { title: 'Indiranagar Feature Wall', image: imgW('photo-1616137466211-f939a420be84'), images: [imgW('photo-1616137466211-f939a420be84'), imgW('photo-1621293954908-907159247fc8'), imgW('photo-1589939705384-5185137a7f0f')] },
      { title: 'Cyber City Sky Suite', image: imgW('photo-1621293954908-907159247fc8'), images: [imgW('photo-1621293954908-907159247fc8'), imgW('photo-1600121848594-d8644e57abab'), imgW('photo-1615873968403-89e068629265')] },
      { title: 'Powai Lakeside Townhouse', image: imgW('photo-1589939705384-5185137a7f0f'), images: [imgW('photo-1589939705384-5185137a7f0f'), imgW('photo-1604841702261-f0cd54a2f47c'), imgW('photo-1616137466211-f939a420be84')] },
    ],
    services: ['Premium Wallpapers', '3D Wall Panels', 'Decorative Finishes'],
    contactPerson: 'Kavya Reddy',
    phone: '+91 22 3388 6622',
    email: 'design@chitrakalawalls.in',
    location: { floor: 'First Floor', zone: 'Zone B', showroom: 'Showroom B3' },
    popular: false,
    recommended: false,
    rating: 4.3,
  },
  {
    id: 'styling-house',
    name: 'Alankar Styling House',
    categoryId: 'styling',
    shortDescription: 'Curated artwork, objects and accessories to complete any Indian residence.',
    description: 'Alankar Styling House is the final layer of any exceptional interior. Their team of aesthetic consultants source limited-edition artwork from emerging and established Indian artists, alongside rare decorative objects, bespoke ceramics and curated accessories from across the country and the world. The studio also offers a proprietary "scent design" service, working with perfumers to create a signature fragrance for your space.',
    logoColor: '#D4A853',
    cover: imgW('photo-1493809842364-78817add7ffb'),
    gallery: [imgW('photo-1534337621606-e3df5ee0e97f'), imgW('photo-1576941089067-2de3c901e126'), imgW('photo-1618219908412-a29a1bb7b86e')],
    projects: [
      { title: 'Goa Villa Styling', image: imgW('photo-1614594975525-e45190c55d0b'), images: [imgW('photo-1614594975525-e45190c55d0b'), imgW('photo-1618221195710-dd6b41faaea6'), imgW('photo-1617104678098-de229db51175')] },
      { title: 'Bandra Penthouse', image: imgW('photo-1618221195710-dd6b41faaea6'), images: [imgW('photo-1618221195710-dd6b41faaea6'), imgW('photo-1534337621606-e3df5ee0e97f'), imgW('photo-1576941089067-2de3c901e126')] },
      { title: 'Senapati Bapat Cultural Home', image: imgW('photo-1617104678098-de229db51175'), images: [imgW('photo-1617104678098-de229db51175'), imgW('photo-1618219908412-a29a1bb7b86e'), imgW('photo-1614594975525-e45190c55d0b')] },
    ],
    services: ['Artwork Curation & Framing', 'Accessories & Décor Staging', 'Plant & Greenery Design'],
    contactPerson: 'Naina Kapoor',
    phone: '+91 22 4455 9980',
    email: 'studio@alankarstyling.in',
    location: { floor: 'Second Floor', zone: 'Zone E', showroom: 'Showroom E1' },
    popular: false,
    recommended: true,
    rating: 4.6,
  },
  {
    id: 'complete-spaces',
    name: 'Sampoorna Spaces',
    categoryId: 'turnkey',
    shortDescription: 'Turnkey project management from architectural brief to key handover.',
    description: 'Sampoorna Spaces is India\'s most trusted turnkey partner, delivering fully finished residences and commercial spaces on time and on budget. Their integrated team of architects, designers, engineers and project managers takes ownership of every detail — from demolition and structural works to furniture placement and soft furnishings. Clients receive a single point of contact throughout a journey that typically spans 4–18 months.',
    logoColor: '#3C2912',
    cover: imgW('photo-1600585154340-be6161a56a0c'),
    gallery: [imgW('photo-1584622650111-993a426fbf0a'), imgW('photo-1600047509807-ba8f99d2cdde'), imgW('photo-1600566752355-35792bedcfea')],
    projects: [
      { title: 'Gurugram Golf Estate', image: imgW('photo-1600047509358-9dc75507daeb'), images: [imgW('photo-1600047509358-9dc75507daeb'), imgW('photo-1512917774080-9991f1c4c750'), imgW('photo-1600210492486-724fe5c67fb0')] },
      { title: 'ECR Beachfront Villa', image: imgW('photo-1512917774080-9991f1c4c750'), images: [imgW('photo-1512917774080-9991f1c4c750'), imgW('photo-1584622650111-993a426fbf0a'), imgW('photo-1600047509807-ba8f99d2cdde')] },
      { title: 'Kondhwa Family Home', image: imgW('photo-1600210492486-724fe5c67fb0'), images: [imgW('photo-1600210492486-724fe5c67fb0'), imgW('photo-1600566752355-35792bedcfea'), imgW('photo-1600047509358-9dc75507daeb')] },
    ],
    services: ['Complete Home Renovation', 'Commercial Fit-Out', 'Villa Project Management'],
    contactPerson: 'Arjun Malhotra',
    phone: '+91 22 4877 6655',
    email: 'projects@sampoornaspaces.in',
    location: { floor: 'Ground Floor', zone: 'Zone F', showroom: 'Showroom F1' },
    popular: true,
    recommended: true,
    rating: 4.9,
  },
  {
    id: 'forma-architecture',
    name: 'Rekha Architecture',
    categoryId: 'architecture',
    shortDescription: 'Contemporary architecture inspired by Indian geometry, climate and craft.',
    description: 'Rekha Architecture approaches every project as an exercise in honest form. The practice, led by architect Kabir Singh, is known for bold geometries, generous natural light and spaces that respond to India\'s diverse climate. Their passive-cooling strategies, jaali screens and use of local materials have earned the studio recognition for sustainable design across the country.',
    logoColor: '#556B2F',
    cover: imgW('photo-1486325212027-8081e485255e'),
    gallery: [imgW('photo-1487958449943-2429e8be8625'), imgW('photo-1494526585095-c41746248156'), imgW('photo-1600047509360-8a8f4f27a9a5')],
    projects: [
      { title: 'Sarjapur Concept Villa', image: imgW('photo-1558618666-fcd25c85cd64'), images: [imgW('photo-1558618666-fcd25c85cd64'), imgW('photo-1503174971373-b1f69850bded'), imgW('photo-1560185007-cde436f6a4d0')] },
      { title: 'GIFT City Innovation Hub', image: imgW('photo-1503174971373-b1f69850bded'), images: [imgW('photo-1503174971373-b1f69850bded'), imgW('photo-1487958449943-2429e8be8625'), imgW('photo-1494526585095-c41746248156')] },
      { title: 'Shamirpet Farmhouse', image: imgW('photo-1560185007-cde436f6a4d0'), images: [imgW('photo-1560185007-cde436f6a4d0'), imgW('photo-1600047509360-8a8f4f27a9a5'), imgW('photo-1558618666-fcd25c85cd64')] },
    ],
    services: ['Residential Architecture', 'Commercial Architecture', 'Renovation & Restoration'],
    contactPerson: 'Kabir Singh',
    phone: '+91 22 2222 3311',
    email: 'info@rekhaarchitecture.in',
    location: { floor: 'First Floor', zone: 'Zone A', showroom: 'Showroom A3' },
    popular: false,
    recommended: false,
    rating: 4.4,
  },
  {
    id: 'prestige-interiors',
    name: 'Maharaja Interiors',
    categoryId: 'interior',
    shortDescription: 'Bold, layered interiors blending global luxury with a royal Indian soul.',
    description: 'Maharaja Interiors was born from a conviction that luxury and identity should coexist. The studio draws on the rich visual language of Rajput and Mughal craft, jaali, inlay and regional handloom traditions, weaving these elements into contemporary interiors that feel both global and deeply rooted. Their team of over 30 designers works across residential and hospitality sectors from their flagship studio at the Design Center.',
    logoColor: '#8B2635',
    cover: imgW('photo-1631679706909-1844bbd07221'),
    gallery: [imgW('photo-1616593969747-4797dc75033e'), imgW('photo-1618220048045-10a6dbdf83e0'), imgW('photo-1600121848594-d8644e57abab')],
    projects: [
      { title: 'Banjara Hills Palace Apartment', image: imgW('photo-1586208958839-06c17cacaded'), images: [imgW('photo-1586208958839-06c17cacaded'), imgW('photo-1562664377-709f2c337eb2'), imgW('photo-1600047509358-9dc75507daeb')] },
      { title: 'Koregaon Park Luxury Villa', image: imgW('photo-1562664377-709f2c337eb2'), images: [imgW('photo-1562664377-709f2c337eb2'), imgW('photo-1616593969747-4797dc75033e'), imgW('photo-1618220048045-10a6dbdf83e0')] },
      { title: 'Civil Lines Baithak Renovation', image: imgW('photo-1600047509358-9dc75507daeb'), images: [imgW('photo-1600047509358-9dc75507daeb'), imgW('photo-1600121848594-d8644e57abab'), imgW('photo-1586208958839-06c17cacaded')] },
    ],
    services: ['Full Space Design', 'Kitchen & Bath Design', 'Lighting Design', 'Space Planning'],
    contactPerson: 'Ishaan Chopra',
    phone: '+91 22 6655 8810',
    email: 'studio@maharajainteriors.in',
    location: { floor: 'Second Floor', zone: 'Zone A', showroom: 'Showroom A4' },
    popular: true,
    recommended: false,
    rating: 4.7,
  },
];

// ─── SERVICES ─────────────────────────────────────────────────────────────────

// Vendor content extras (new fields: logo, tagline, established, highlights, viewCount)
const VENDOR_EXTRAS = {
  // logo left blank so the app falls back to its bundled local PNG (assets/logos/<id>.png).
  // Admin/partner can later set a logo url which overrides the local fallback.
  'atelier-roshan':     { logo: '', tagline: 'Light, material & quiet confidence', established: '2009', highlights: ['120+ landmark residences', 'Vastu-aware planning', 'Climate-first design', 'In-house 3D studio'], viewCount: 412 },
  'studio-may':         { logo: '', tagline: 'Beauty through restraint', established: '2013', highlights: ['Selective client portfolio', 'Bespoke joinery detailing', 'Full FF&E service', 'Award-winning interiors'], viewCount: 357 },
  'maison-bois':        { logo: '', tagline: 'Heirloom furniture in solid teak', established: '2011', highlights: ['Sustainably sourced hardwood', 'Hand-cut joinery', '8-16 week bespoke builds', 'Lifetime craftsmanship'], viewCount: 318 },
  'linen-silk-co':      { logo: '', tagline: 'Soft architecture, perfectly fitted', established: '2012', highlights: ['Banarasi & tussar silk', 'In-house tailors', 'Motorised systems', 'On-site measurement'], viewCount: 198 },
  'marbellos-stone':    { logo: '', tagline: 'Stone selected at origin', established: '2008', highlights: ['Slab selection at quarry', 'Bookmatching service', '10-year warranty', 'Makrana & Italian marble'], viewCount: 286 },
  'decor-artiste':      { logo: '', tagline: 'Texture as expression', established: '2015', highlights: ['80+ wallpaper houses', 'Venetian plaster artisans', 'Custom 3D panels', 'Pan-India install'], viewCount: 176 },
  'styling-house':      { logo: '', tagline: 'The finishing note', established: '2016', highlights: ['Indian artist network', 'Professional stylists', 'Custom framing', 'Greenery programmes'], viewCount: 152 },
  'complete-spaces':    { logo: '', tagline: 'End to end, effortless', established: '2010', highlights: ['Fixed-price contracts', 'Dedicated site manager', 'Weekly cost control', 'Single point of contact'], viewCount: 254 },
  'forma-architecture': { logo: '', tagline: 'Structure with intent', established: '2014', highlights: ['Heritage restoration', 'Authority submissions', 'MEP coordination', 'Mixed-use expertise'], viewCount: 134 },
  'prestige-interiors': { logo: '', tagline: 'Considered, liveable luxury', established: '2012', highlights: ['Space planning specialists', 'Boutique hospitality', 'Executive offices', 'Turnkey delivery'], viewCount: 221 },
};

const SERVICES = [
  // Architecture
  { id: 'svc-arch-residential', name: 'Residential Architecture', categoryId: 'architecture', description: 'Custom residential design from concept to construction drawings. Covers site analysis, planning approvals, full architectural documentation and site supervision.', image: img('photo-1560518883-ce09059eeffa'), relatedVendorIds: ['atelier-roshan', 'forma-architecture'] },
  { id: 'svc-arch-commercial', name: 'Commercial Architecture', categoryId: 'architecture', description: 'Office buildings, retail spaces and mixed-use developments designed for the modern Indian market. Includes MEP coordination and authority submissions.', image: img('photo-1486325212027-8081e485255e'), relatedVendorIds: ['atelier-roshan', 'forma-architecture'] },
  { id: 'svc-arch-renovation', name: 'Renovation & Restoration', categoryId: 'architecture', description: 'Sensitive transformation of existing structures while preserving their character. Specialising in heritage properties and significant residential renovations.', image: img('photo-1503174971373-b1f69850bded'), relatedVendorIds: ['forma-architecture'] },

  // Interior Design
  { id: 'svc-int-full', name: 'Full Space Design', categoryId: 'interior', description: 'Complete interior design service from concept boards through furniture specification, material selections and installation coordination.', image: img('photo-1616486338812-3dadae4b4ace'), relatedVendorIds: ['studio-may', 'prestige-interiors'] },
  { id: 'svc-int-kitchen', name: 'Kitchen & Bath Design', categoryId: 'interior', description: 'Precision kitchen planning and bathroom design. Spatial optimisation, custom cabinetry specifications and luxury fixture curation.', image: img('photo-1556909114-f6e7ad7d3136'), relatedVendorIds: ['studio-may', 'prestige-interiors'] },
  { id: 'svc-int-lighting', name: 'Lighting Design', categoryId: 'interior', description: 'Architectural and decorative lighting plans that transform the mood of any space. Includes fixture specification and dimming scene programming.', image: img('photo-1565814329452-e1efa11c5b89'), relatedVendorIds: ['studio-may'] },
  { id: 'svc-int-planning', name: 'Space Planning', categoryId: 'interior', description: 'Functional analysis and spatial reorganisation for existing and new properties. Floor plan optimisation, circulation studies and zoning strategies.', image: img('photo-1616593969747-4797dc75033e'), relatedVendorIds: ['prestige-interiors'] },

  // Furniture
  { id: 'svc-furn-sofa', name: 'Custom Sofa & Seating', categoryId: 'furniture', description: 'Bespoke sofas, armchairs and day beds crafted to your specifications. Choice of hardwood frames, sprung seating and over 300 fabric options.', image: img('photo-1555041469-a586c61ea9bc'), relatedVendorIds: ['maison-bois'] },
  { id: 'svc-furn-dining', name: 'Bespoke Dining Collection', categoryId: 'furniture', description: 'Custom dining tables and chairs in solid wood, stone or mixed materials. Seats 6 to 20 guests. 10–14 week lead time from approved design.', image: img('photo-1567538096630-e0c55bd6374c'), relatedVendorIds: ['maison-bois'] },
  { id: 'svc-furn-bedroom', name: 'Bedroom Suite Design', categoryId: 'furniture', description: 'Complete bedroom furniture packages: bedframes, wardrobes, bedside tables and dressing tables. Upholstered and timber options available.', image: img('photo-1594026112284-02bb6f3352fe'), relatedVendorIds: ['maison-bois'] },

  // Furnishings
  { id: 'svc-fshn-curtains', name: 'Couture Curtains & Drapes', categoryId: 'furnishings', description: 'Hand-sewn curtains and drapes from European designer fabrics. Includes lining, interlining, motorisation options and site measurement service.', image: img('photo-1564540583246-934409427776'), relatedVendorIds: ['linen-silk-co'] },
  { id: 'svc-fshn-upholstery', name: 'Custom Upholstery', categoryId: 'furnishings', description: 'Re-upholstery of existing furniture and bespoke upholstered pieces. Specialist in headboards, banquettes, ottomans and statement armchairs.', image: img('photo-1558618666-fcd25c85cd64'), relatedVendorIds: ['linen-silk-co'] },
  { id: 'svc-fshn-blinds', name: 'Blinds & Shutters', categoryId: 'furnishings', description: 'Roller, Roman and cellular blinds alongside solid timber and MDF shutters. Manual and motorised systems compatible with all major home automation platforms.', image: img('photo-1586023492125-27b2c045efd7'), relatedVendorIds: ['linen-silk-co'] },

  // Surfaces
  { id: 'svc-surf-marble', name: 'Marble & Stone Flooring', categoryId: 'surfaces', description: 'Italian, Turkish and Portuguese marble flooring supplied and installed. Includes slab selection at origin, bookmatching services and professional installation.', image: img('photo-1604014236913-dfae9ee55fad'), relatedVendorIds: ['marbellos-stone'] },
  { id: 'svc-surf-quartz', name: 'Quartz Countertops', categoryId: 'surfaces', description: 'Engineered quartz and natural stone countertops for kitchens and bathrooms. Templating, fabrication and installation included. 10-year warranty.', image: img('photo-1558618047-f4e61e6e6464'), relatedVendorIds: ['marbellos-stone'] },
  { id: 'svc-surf-tiles', name: 'Decorative Tiles', categoryId: 'surfaces', description: 'Curated collection of handmade ceramic, terracotta, zellige and large-format porcelain tiles from Spain, Portugal and Morocco.', image: img('photo-1509644851169-2acc08aa25b5'), relatedVendorIds: ['marbellos-stone'] },

  // Walls
  { id: 'svc-wall-paper', name: 'Premium Wallpapers', categoryId: 'walls', description: 'Over 80 international collections including de Gournay, Elitis, Phillip Jeffries and Cole & Son. Professional installation included nationwide.', image: img('photo-1513519245088-0e12902e5d4c'), relatedVendorIds: ['decor-artiste'] },
  { id: 'svc-wall-panels', name: '3D Wall Panels', categoryId: 'walls', description: 'Architectural 3D panels in gypsum, MDF and natural stone. Custom patterns available. Adds depth and a sculptural quality to feature walls.', image: img('photo-1615873968403-89e068629265'), relatedVendorIds: ['decor-artiste'] },
  { id: 'svc-wall-finish', name: 'Decorative Finishes', categoryId: 'walls', description: 'Venetian plaster, micro-cement, limewash and specialist paint finishes applied by trained artisans. The most authentic and enduring wall finishes available.', image: img('photo-1604841702261-f0cd54a2f47c'), relatedVendorIds: ['decor-artiste'] },

  // Styling
  { id: 'svc-styl-artwork', name: 'Artwork Curation & Framing', categoryId: 'styling', description: 'Original artwork sourced from established and emerging artists across India and beyond. Custom framing, installation and lighting included.', image: img('photo-1576941089067-2de3c901e126'), relatedVendorIds: ['styling-house'] },
  { id: 'svc-styl-accessories', name: 'Accessories & Décor Staging', categoryId: 'styling', description: 'Curated objects, vases, books, candles and decorative accessories arranged by professional stylists to complete each room.', image: img('photo-1534337621606-e3df5ee0e97f'), relatedVendorIds: ['styling-house'] },
  { id: 'svc-styl-plants', name: 'Plant & Greenery Design', categoryId: 'styling', description: 'Indoor plant design and maintenance programmes. Statement plants, moss walls and terrarium features alongside regular care visits.', image: img('photo-1618219908412-a29a1bb7b86e'), relatedVendorIds: ['styling-house'] },

  // Turnkey
  { id: 'svc-tk-home', name: 'Complete Home Renovation', categoryId: 'turnkey', description: 'Full management of residential renovation projects from design to handover. Single point of contact, fixed-price contracts and dedicated site manager.', image: img('photo-1584622650111-993a426fbf0a'), relatedVendorIds: ['complete-spaces'] },
  { id: 'svc-tk-commercial', name: 'Commercial Fit-Out', categoryId: 'turnkey', description: 'Category A and Category B office and retail fit-outs across India. Design, MEP, IT infrastructure, furniture and signage all coordinated under one contract.', image: img('photo-1497366216548-37526070297c'), relatedVendorIds: ['complete-spaces'] },
  { id: 'svc-tk-villa', name: 'Villa Project Management', categoryId: 'turnkey', description: 'Dedicated project management for large villa builds and renovations. Weekly reporting, cost control and quality assurance throughout the project lifecycle.', image: img('photo-1600585154340-be6161a56a0c'), relatedVendorIds: ['complete-spaces'] },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

const PARTNER_USERS = [
  { email: 'partner.griha@dc.in',      name: 'Aarav Mehta',        vendorId: 'atelier-roshan' },
  { email: 'partner.saffron@dc.in',    name: 'Ananya Iyer',        vendorId: 'studio-may' },
  { email: 'partner.teak@dc.in',       name: 'Rohan Bedi',         vendorId: 'maison-bois' },
  { email: 'partner.khadi@dc.in',      name: 'Meera Nair',         vendorId: 'linen-silk-co' },
  { email: 'partner.makrana@dc.in',    name: 'Vikram Rathore',     vendorId: 'marbellos-stone' },
  { email: 'partner.chitrakala@dc.in', name: 'Kavya Reddy',        vendorId: 'decor-artiste' },
  { email: 'partner.alankar@dc.in',    name: 'Naina Kapoor',       vendorId: 'styling-house' },
  { email: 'partner.sampoorna@dc.in',  name: 'Arjun Malhotra',     vendorId: 'complete-spaces' },
  { email: 'partner.rekha@dc.in',      name: 'Kabir Singh',        vendorId: 'forma-architecture' },
  { email: 'partner.maharaja@dc.in',   name: 'Ishaan Chopra',      vendorId: 'prestige-interiors' },
];

const CUSTOMER_USERS = [
  { email: 'sarah.menon@gmail.com',     name: 'Sarah Menon' },
  { email: 'ahmed.khan@gmail.com',      name: 'Ahmed Khan' },
  { email: 'lakshmi.nair@gmail.com',    name: 'Lakshmi Nair' },
  { email: 'aman.gupta@gmail.com',      name: 'Aman Gupta' },
  { email: 'fatima.sheikh@gmail.com',   name: 'Fatima Sheikh' },
  { email: 'ananya.rao@gmail.com',      name: 'Ananya Rao' },
  { email: 'karan.kapoor@gmail.com',    name: 'Karan Kapoor' },
  { email: 'nisha.menon@gmail.com',     name: 'Nisha Menon' },
  { email: 'yash.ibrahim@gmail.com',    name: 'Yash Patel' },
  { email: 'maria.dsouza@gmail.com',    name: 'Maria DSouza' },
  { email: 'harsh.verma@gmail.com',     name: 'Harsh Verma' },
  { email: 'diya.kamat@gmail.com',      name: 'Diya Kamat' },
  { email: 'tarun.mathur@gmail.com',    name: 'Tarun Mathur' },
  { email: 'amrita.saxena@gmail.com',   name: 'Amrita Saxena' },
  { email: 'rohit.aziz@gmail.com',      name: 'Rohit Sharma' },
];

// ─── VISITORS ─────────────────────────────────────────────────────────────────

// daysAgo(n) returns a date n days before now
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const VISITORS = [
  {
    fullName: 'Aditya Nair', email: 'aditya.nair@email.com', mobile: '+91 98200 11223',
    city: 'Mumbai', projectLocation: 'Bandra West', propertyType: 'Villa',
    projectStage: 'Design', budgetRange: '₹2 Cr – 5 Cr', designStyle: 'Contemporary',
    leadSource: 'Walk-in', interestedCategories: ['architecture', 'interior', 'furniture'],
    tourProgress: 0.85, createdAt: daysAgo(0),
    timeline: ['Visitor Registered', 'Toured Architecture Zone', 'Saved Vendor: Griha Atelier', 'Toured Interior Design Zone', 'Booked Consultation'],
  },
  {
    fullName: 'Priya Sharma', email: 'priya.sharma@email.com', mobile: '+91 99300 22334',
    city: 'Pune', projectLocation: 'Koregaon Park', propertyType: 'Apartment',
    projectStage: 'Planning', budgetRange: '₹50 L – 1 Cr', designStyle: 'Minimalist',
    leadSource: 'Reference', referrerName: 'Saffron Studio', interestedCategories: ['interior', 'furnishings'],
    tourProgress: 0.6, createdAt: daysAgo(0),
    timeline: ['Visitor Registered', 'Toured Interior Design Zone', 'Saved Vendor: Saffron Studio', 'Toured Furnishings Zone'],
  },
  {
    fullName: 'Rahul Deshpande', email: 'rahul.deshpande@email.com', mobile: '+91 90040 33445',
    city: 'Hyderabad', projectLocation: 'Jubilee Hills', propertyType: 'Villa',
    projectStage: 'Renovation', budgetRange: '₹1 Cr – 2 Cr', designStyle: 'Traditional Indian',
    leadSource: 'Walk-in', interestedCategories: ['walls', 'surfaces', 'styling'],
    tourProgress: 1.0, createdAt: daysAgo(0),
    timeline: ['Visitor Registered', 'Toured Wall Solutions Zone', 'Toured Surface Solutions Zone', 'Toured Styling Zone', 'Tour Completed'],
  },
  {
    fullName: 'Sneha Reddy', email: 'sneha.reddy@email.com', mobile: '+91 98450 44556',
    city: 'Bengaluru', projectLocation: 'Indiranagar', propertyType: 'Apartment',
    projectStage: 'Design', budgetRange: '₹30 L – 50 L', designStyle: 'Modern',
    leadSource: 'Walk-in', interestedCategories: ['furniture', 'furnishings'],
    tourProgress: 0.4, createdAt: daysAgo(0),
    timeline: ['Visitor Registered', 'Toured Furniture Zone'],
  },
  {
    fullName: 'Karan Malhotra', email: 'karan.malhotra@email.com', mobile: '+91 98110 55667',
    city: 'New Delhi', projectLocation: 'Vasant Vihar', propertyType: 'Villa',
    projectStage: 'Construction', budgetRange: '₹5 Cr+', designStyle: 'Luxury Contemporary',
    leadSource: 'Reference', referrerName: 'Sampoorna Spaces', interestedCategories: ['turnkey', 'architecture'],
    tourProgress: 0.7, createdAt: daysAgo(0),
    timeline: ['Visitor Registered', 'Toured Architecture Zone', 'Toured Turnkey Zone', 'Booked Consultation'],
  },
  {
    fullName: 'Neha Gupta', email: 'neha.gupta@email.com', mobile: '+91 95600 66778',
    city: 'Gurugram', projectLocation: 'Golf Course Road', propertyType: 'Office',
    projectStage: 'Planning', budgetRange: '₹1 Cr – 2 Cr', designStyle: 'Corporate Modern',
    leadSource: 'Walk-in', interestedCategories: ['architecture', 'interior', 'surfaces'],
    tourProgress: 0.55, createdAt: daysAgo(1),
    timeline: ['Visitor Registered', 'Toured Architecture Zone', 'Toured Interior Design Zone'],
  },
  {
    fullName: 'Anjali Menon', email: 'anjali.menon@email.com', mobile: '+91 94470 77889',
    city: 'Kochi', projectLocation: 'Marine Drive', propertyType: 'Apartment',
    projectStage: 'Renovation', budgetRange: '₹20 L – 30 L', designStyle: 'Scandinavian',
    leadSource: 'Walk-in', interestedCategories: ['furniture', 'styling'],
    tourProgress: 0.9, createdAt: daysAgo(1),
    timeline: ['Visitor Registered', 'Toured Furniture Zone', 'Toured Styling Zone', 'Booked Consultation'],
  },
  {
    fullName: 'Rohan Kapoor', email: 'rohan.kapoor@email.com', mobile: '+91 98400 88990',
    city: 'Chennai', projectLocation: 'Boat Club Road', propertyType: 'Villa',
    projectStage: 'Design', budgetRange: '₹3 Cr – 5 Cr', designStyle: 'Indo-Mediterranean',
    leadSource: 'Reference', referrerName: 'Griha Atelier', interestedCategories: ['architecture', 'interior', 'furnishings', 'styling'],
    tourProgress: 1.0, createdAt: daysAgo(2),
    timeline: ['Visitor Registered', 'Toured Architecture Zone', 'Toured Interior Design Zone', 'Toured Furnishings Zone', 'Toured Styling Zone', 'Tour Completed'],
  },
  {
    fullName: 'Divya Iyer', email: 'divya.iyer@email.com', mobile: '+91 99870 99001',
    city: 'Mumbai', projectLocation: 'Powai', propertyType: 'Apartment',
    projectStage: 'Planning', budgetRange: '₹50 L – 1 Cr', designStyle: 'Contemporary',
    leadSource: 'Walk-in', interestedCategories: ['interior', 'walls'],
    tourProgress: 0.3, createdAt: daysAgo(2),
    timeline: ['Visitor Registered', 'Toured Interior Design Zone'],
  },
  {
    fullName: 'Aryan Shah', email: 'aryan.shah@email.com', mobile: '+91 90990 00112',
    city: 'Surat', projectLocation: 'Vesu', propertyType: 'Villa',
    projectStage: 'Construction', budgetRange: '₹5 Cr+', designStyle: 'Indian Modern',
    leadSource: 'Reference', referrerName: 'Maharaja Interiors', interestedCategories: ['furniture', 'furnishings', 'surfaces', 'styling'],
    tourProgress: 0.8, createdAt: daysAgo(3),
    timeline: ['Visitor Registered', 'Toured Furniture Zone', 'Toured Furnishings Zone', 'Toured Surface Solutions Zone', 'Saved Multiple Vendors'],
  },
  {
    fullName: 'Ananya Joshi', email: 'ananya.joshi@email.com', mobile: '+91 98201 11220',
    city: 'Mumbai', projectLocation: 'Worli', propertyType: 'Villa',
    projectStage: 'Design', budgetRange: '₹2 Cr – 5 Cr', designStyle: 'Luxury',
    leadSource: 'Walk-in', interestedCategories: ['interior', 'furniture', 'styling'],
    tourProgress: 1.0, createdAt: daysAgo(3),
    timeline: ['Visitor Registered', 'Toured Interior Design Zone', 'Toured Furniture Zone', 'Toured Styling Zone', 'Booked Consultation', 'Tour Completed'],
  },
  {
    fullName: 'Vivek Rao', email: 'vivek.rao@email.com', mobile: '+91 98860 33440',
    city: 'Bengaluru', projectLocation: 'MG Road', propertyType: 'Office',
    projectStage: 'Planning', budgetRange: '₹1 Cr – 2 Cr', designStyle: 'Minimalist Corporate',
    leadSource: 'Walk-in', interestedCategories: ['architecture', 'surfaces', 'walls'],
    tourProgress: 0.45, createdAt: daysAgo(4),
    timeline: ['Visitor Registered', 'Toured Architecture Zone', 'Toured Surface Solutions Zone'],
  },
  {
    fullName: 'Pooja Bhatt', email: 'pooja.bhatt@email.com', mobile: '+91 99980 44550',
    city: 'Ahmedabad', projectLocation: 'Satellite', propertyType: 'Villa',
    projectStage: 'Renovation', budgetRange: '₹3 Cr – 5 Cr', designStyle: 'Classic European',
    leadSource: 'Reference', referrerName: 'Saffron Studio', interestedCategories: ['interior', 'furnishings', 'surfaces'],
    tourProgress: 0.65, createdAt: daysAgo(4),
    timeline: ['Visitor Registered', 'Toured Interior Design Zone', 'Toured Furnishings Zone', 'Booked Consultation'],
  },
  {
    fullName: 'Vikram Mehta', email: 'vikram.mehta@email.com', mobile: '+91 98180 55660',
    city: 'New Delhi', projectLocation: 'Greater Kailash', propertyType: 'Villa',
    projectStage: 'Design', budgetRange: '₹1 Cr – 2 Cr', designStyle: 'Modern Indian Fusion',
    leadSource: 'Walk-in', interestedCategories: ['furniture', 'styling', 'walls'],
    tourProgress: 0.5, createdAt: daysAgo(5),
    timeline: ['Visitor Registered', 'Toured Furniture Zone', 'Toured Wall Solutions Zone'],
  },
  {
    fullName: 'Riya Khanna', email: 'riya.khanna@email.com', mobile: '+91 95990 66770',
    city: 'Noida', projectLocation: 'Sector 50', propertyType: 'Apartment',
    projectStage: 'Planning', budgetRange: '₹20 L – 30 L', designStyle: 'Minimalist',
    leadSource: 'Walk-in', interestedCategories: ['interior', 'furniture'],
    tourProgress: 0.25, createdAt: daysAgo(5),
    timeline: ['Visitor Registered'],
  },
  {
    fullName: 'Sameer Khan', email: 'sameer.khan@email.com', mobile: '+91 90050 77880',
    city: 'Lucknow', projectLocation: 'Gomti Nagar', propertyType: 'Apartment',
    projectStage: 'Renovation', budgetRange: '₹10 L – 20 L', designStyle: 'Modern',
    leadSource: 'Walk-in', interestedCategories: ['walls', 'furnishings'],
    tourProgress: 0.35, createdAt: daysAgo(6),
    timeline: ['Visitor Registered', 'Toured Wall Solutions Zone'],
  },
  {
    fullName: 'Tara DSouza', email: 'tara.dsouza@email.com', mobile: '+91 98220 88990',
    city: 'Panaji', projectLocation: 'Goa', propertyType: 'Apartment',
    projectStage: 'Design', budgetRange: '₹50 L – 1 Cr', designStyle: 'Indo-Portuguese',
    leadSource: 'Reference', referrerName: 'Teak & Sheesham', interestedCategories: ['furniture', 'furnishings', 'styling'],
    tourProgress: 0.75, createdAt: daysAgo(6),
    timeline: ['Visitor Registered', 'Toured Furniture Zone', 'Toured Furnishings Zone', 'Toured Styling Zone', 'Saved Vendor: Teak & Sheesham'],
  },
  {
    fullName: 'Nikhil Verma', email: 'nikhil.verma@email.com', mobile: '+91 94140 99000',
    city: 'Jaipur', projectLocation: 'Civil Lines', propertyType: 'Villa',
    projectStage: 'Construction', budgetRange: '₹2 Cr – 5 Cr', designStyle: 'Contemporary Rajasthani',
    leadSource: 'Walk-in', interestedCategories: ['turnkey'],
    tourProgress: 1.0, createdAt: daysAgo(7),
    timeline: ['Visitor Registered', 'Toured Turnkey Solutions Zone', 'Met with Sampoorna Spaces', 'Signed Contract', 'Tour Completed'],
  },
];

// ─── CONSULTATIONS ────────────────────────────────────────────────────────────

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// Visitor CRM extras, index-aligned to VISITORS (stage, lead source, follow-up, assignment)
// Stage spread: new x3, contacted x5, consultation x4, won x4, lost x2. 3 overdue follow-ups.
const VISITOR_EXTRAS = [
  { stage: 'consultation', source: 'Walk-in',   lookingFor: 'Full villa architecture + interior package for a Bandra plot',        lastContactedAt: daysAgo(2), nextFollowUpAt: daysFromNow(2), assignVendor: 'atelier-roshan' },
  { stage: 'contacted',    source: 'Reference', lookingFor: 'Minimalist apartment interiors with a Scandinavian palette',            lastContactedAt: daysAgo(4), nextFollowUpAt: daysAgo(2) },
  { stage: 'won',          source: 'Walk-in',   lookingFor: 'Heritage villa renovation — walls, surfaces & styling',                lastContactedAt: daysAgo(3), assignVendor: 'decor-artiste' },
  { stage: 'new',          source: 'Instagram', lookingFor: 'Furniture and soft furnishings for a new Indiranagar apartment' },
  { stage: 'consultation', source: 'Reference', lookingFor: 'Turnkey luxury villa build, ₹5 Cr+ budget',                           lastContactedAt: daysAgo(1), nextFollowUpAt: daysFromNow(3), assignVendor: 'complete-spaces' },
  { stage: 'contacted',    source: 'Website',   lookingFor: 'Corporate office fit-out in Gurugram',                                lastContactedAt: daysAgo(5), nextFollowUpAt: daysAgo(3) },
  { stage: 'consultation', source: 'Walk-in',   lookingFor: 'Scandinavian furniture and a styling refresh',                        lastContactedAt: daysAgo(2), nextFollowUpAt: daysFromNow(1), assignVendor: 'maison-bois' },
  { stage: 'won',          source: 'Reference', lookingFor: 'Indo-Mediterranean villa — full design and furnishings',              lastContactedAt: daysAgo(6), assignVendor: 'atelier-roshan' },
  { stage: 'new',          source: 'Instagram', lookingFor: 'Powai apartment interiors with a feature wall' },
  { stage: 'contacted',    source: 'Reference', lookingFor: 'Furniture, furnishings and surfaces for a Surat villa',               lastContactedAt: daysAgo(2), nextFollowUpAt: daysFromNow(2) },
  { stage: 'won',          source: 'Walk-in',   lookingFor: 'Luxury interiors and furniture, Worli',                               lastContactedAt: daysAgo(4), assignVendor: 'studio-may' },
  { stage: 'lost',         source: 'Website',   lookingFor: 'Bengaluru office — architecture, surfaces, walls',                    lastContactedAt: daysAgo(8), lostReason: 'Project put on hold — budget reallocated' },
  { stage: 'consultation', source: 'Reference', lookingFor: 'Classic European renovation, Ahmedabad villa',                       lastContactedAt: daysAgo(1), nextFollowUpAt: daysFromNow(4) },
  { stage: 'contacted',    source: 'Instagram', lookingFor: 'Modern Indian fusion — furniture, walls and styling',                lastContactedAt: daysAgo(6), nextFollowUpAt: daysAgo(4) },
  { stage: 'new',          source: 'Other',     lookingFor: 'Compact apartment interiors and furniture' },
  { stage: 'lost',         source: 'Walk-in',   lookingFor: 'Apartment renovation — walls and furnishings',                       lastContactedAt: daysAgo(9), lostReason: 'Went with another provider' },
  { stage: 'contacted',    source: 'Reference', lookingFor: 'Indo-Portuguese furniture and styling',                              lastContactedAt: daysAgo(3), nextFollowUpAt: daysFromNow(3) },
  { stage: 'won',          source: 'Walk-in',   lookingFor: 'Complete villa renovation — signed turnkey',                         lastContactedAt: daysAgo(5), assignVendor: 'complete-spaces' },
];

const ROOMS = ['Consultation Room A', 'Consultation Room B', 'Executive Meeting Room', 'Online'];
const MEETING_TYPES = ['Design Consultation', 'Vendor Meeting', 'Product Presentation', 'Architecture Discussion', 'Interior Design Discussion'];

const CONSULTATIONS = [
  // Upcoming
  { vendorId: 'atelier-roshan',    visitorName: 'Aditya Nair',  service: 'Residential Architecture', meetingType: 'Architecture Discussion',    room: 'Executive Meeting Room', date: daysFromNow(3),  time: new Date(0,0,0,10,0), status: 'upcoming' },
  { vendorId: 'studio-may',        visitorName: 'Priya Sharma',         service: 'Full Space Design',         meetingType: 'Interior Design Discussion',  room: 'Consultation Room A',    date: daysFromNow(4),  time: new Date(0,0,0,11,30), status: 'upcoming' },
  { vendorId: 'maison-bois',       visitorName: 'Tara DSouza',       service: 'Custom Sofa & Seating',     meetingType: 'Product Presentation',       room: 'Consultation Room B',    date: daysFromNow(5),  time: new Date(0,0,0,14,0), status: 'upcoming' },
  { vendorId: 'complete-spaces',   visitorName: 'Karan Malhotra',    service: 'Villa Project Management',  meetingType: 'Design Consultation',        room: 'Executive Meeting Room', date: daysFromNow(5),  time: new Date(0,0,0,16,0), status: 'upcoming' },
  { vendorId: 'marbellos-stone',   visitorName: 'Ananya Joshi',      service: 'Marble & Stone Flooring',   meetingType: 'Product Presentation',       room: 'Consultation Room A',    date: daysFromNow(7),  time: new Date(0,0,0,10,30), status: 'upcoming' },
  { vendorId: 'studio-may',        visitorName: 'Pooja Bhatt',       service: 'Kitchen & Bath Design',     meetingType: 'Design Consultation',        room: 'Consultation Room B',    date: daysFromNow(8),  time: new Date(0,0,0,13,0), status: 'upcoming' },
  { vendorId: 'prestige-interiors', visitorName: 'Rohan Kapoor',      service: 'Full Space Design',         meetingType: 'Interior Design Discussion',  room: 'Executive Meeting Room', date: daysFromNow(9),  time: new Date(0,0,0,11,0), status: 'upcoming' },
  { vendorId: 'decor-artiste',     visitorName: 'Anjali Menon',          service: 'Premium Wallpapers',        meetingType: 'Product Presentation',       room: 'Consultation Room A',    date: daysFromNow(10), time: new Date(0,0,0,15,0), status: 'upcoming' },
  { vendorId: 'atelier-roshan',    visitorName: 'Neha Gupta',        service: 'Commercial Architecture',   meetingType: 'Architecture Discussion',    room: 'Consultation Room B',    date: daysFromNow(12), time: new Date(0,0,0,10,0), status: 'upcoming' },
  { vendorId: 'styling-house',     visitorName: 'Rohan Kapoor',        service: 'Artwork Curation & Framing', meetingType: 'Vendor Meeting',           room: 'Executive Meeting Room', date: daysFromNow(14), time: new Date(0,0,0,14,30), status: 'upcoming' },
  { vendorId: 'complete-spaces',   visitorName: 'Nikhil Verma',      service: 'Complete Home Renovation',  meetingType: 'Design Consultation',        room: 'Executive Meeting Room', date: daysFromNow(15), time: new Date(0,0,0,9,0),  status: 'upcoming' },
  { vendorId: 'forma-architecture', visitorName: 'Vivek Rao',       service: 'Commercial Architecture',   meetingType: 'Architecture Discussion',    room: 'Consultation Room A',    date: daysFromNow(17), time: new Date(0,0,0,11,0), status: 'upcoming' },
  { vendorId: 'maison-bois',       visitorName: 'Aryan Shah',      service: 'Bespoke Dining Collection', meetingType: 'Product Presentation',       room: 'Consultation Room B',    date: daysFromNow(20), time: new Date(0,0,0,13,30), status: 'upcoming' },
  { vendorId: 'marbellos-stone',   visitorName: 'Vikram Mehta',          service: 'Quartz Countertops',        meetingType: 'Vendor Meeting',             room: 'Consultation Room A',    date: daysFromNow(21), time: new Date(0,0,0,15,30), status: 'upcoming' },
  { vendorId: 'linen-silk-co',     visitorName: 'Aditya Nair',   service: 'Couture Curtains & Drapes', meetingType: 'Product Presentation',       room: 'Consultation Room B',    date: daysFromNow(22), time: new Date(0,0,0,10,0), status: 'upcoming' },

  // Completed (past)
  { vendorId: 'atelier-roshan',    visitorName: 'Rohan Kapoor',        service: 'Residential Architecture', meetingType: 'Architecture Discussion',    room: 'Executive Meeting Room', date: daysAgo(5),  time: new Date(0,0,0,10,0), status: 'completed' },
  { vendorId: 'studio-may',        visitorName: 'Ananya Joshi',       service: 'Full Space Design',         meetingType: 'Design Consultation',        room: 'Consultation Room A',    date: daysAgo(7),  time: new Date(0,0,0,14,0), status: 'completed' },
  { vendorId: 'complete-spaces',   visitorName: 'Nikhil Verma',      service: 'Villa Project Management',  meetingType: 'Design Consultation',        room: 'Executive Meeting Room', date: daysAgo(10), time: new Date(0,0,0,11,0), status: 'completed' },
  { vendorId: 'marbellos-stone',   visitorName: 'Anjali Menon',          service: 'Marble & Stone Flooring',   meetingType: 'Product Presentation',       room: 'Consultation Room B',    date: daysAgo(12), time: new Date(0,0,0,15,0), status: 'completed' },
  { vendorId: 'prestige-interiors', visitorName: 'Rahul Deshpande',    service: 'Full Space Design',         meetingType: 'Interior Design Discussion',  room: 'Consultation Room A',    date: daysAgo(14), time: new Date(0,0,0,13,0), status: 'completed' },
  { vendorId: 'marbellos-stone',   visitorName: 'Vikram Mehta',      service: 'Marble & Stone Flooring',   meetingType: 'Product Presentation',       room: 'Consultation Room A',    date: daysAgo(18), time: new Date(0,0,0,10,30), status: 'completed' },
  { vendorId: 'complete-spaces',   visitorName: 'Karan Malhotra',    service: 'Villa Project Management',  meetingType: 'Design Consultation',        room: 'Executive Meeting Room', date: daysAgo(20), time: new Date(0,0,0,16,0), status: 'completed' },
  { vendorId: 'styling-house',     visitorName: 'Anjali Menon',      service: 'Artwork Curation & Framing', meetingType: 'Vendor Meeting',            room: 'Consultation Room B',    date: daysAgo(22), time: new Date(0,0,0,14,30), status: 'completed' },
  { vendorId: 'studio-may',        visitorName: 'Priya Sharma',      service: 'Full Space Design',         meetingType: 'Design Consultation',        room: 'Consultation Room A',    date: daysAgo(25), time: new Date(0,0,0,11,0),  status: 'completed' },

  // Cancelled
  { vendorId: 'studio-may',    visitorName: 'Vivek Rao', service: 'Space Planning',    meetingType: 'Design Consultation', room: 'Consultation Room A', date: daysAgo(3),     time: new Date(0,0,0,12,0), status: 'cancelled' },
  { vendorId: 'linen-silk-co', visitorName: 'Divya Iyer',   service: 'Custom Upholstery', meetingType: 'Vendor Meeting',      room: 'Online',              date: daysFromNow(6), time: new Date(0,0,0,13,0), status: 'cancelled' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function seedUser(prisma, { email, password, role, name, vendorId = null }) {
  const hash = await bcrypt.hash(password, 10);
  let user;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    user = existing;
    await prisma.user.update({ where: { id: existing.id }, data: { role } });
  } else {
    user = await prisma.user.create({ data: { email, passwordHash: hash, role } });
  }
  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, name, vendorId },
    update: { name, vendorId },
  });
  return user.id;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  // 1. Categories
  console.log('▸ Seeding categories...');
  await Promise.all(CATEGORIES.map((cat) => {
    const { id, ...catUpdate } = cat;
    return prisma.category.upsert({ where: { id }, create: cat, update: catUpdate });
  }));
  console.log(`  ✓ ${CATEGORIES.length} categories`);

  // 2. Vendors
  console.log('▸ Seeding vendors...');
  await Promise.all(VENDORS.map((v) => {
    const full = { ...v, ...(VENDOR_EXTRAS[v.id] || {}) };
    const { id, ...vUpdate } = full;
    return prisma.vendor.upsert({
      where: { id },
      create: full,
      update: vUpdate,
    });
  }));
  console.log(`  ✓ ${VENDORS.length} vendors`);

  // 3. Services
  console.log('▸ Seeding services...');
  await Promise.all(SERVICES.map((s) => {
    const { id, ...sUpdate } = s;
    return prisma.service.upsert({
      where: { id },
      create: s,
      update: sUpdate,
    });
  }));
  console.log(`  ✓ ${SERVICES.length} services`);

  // 4. Admin user
  console.log('▸ Seeding admin user...');
  const adminId = await seedUser(prisma, { email: 'admin@designcenter.in', password: 'Admin@123', role: 'admin', name: 'Design Center Admin' });
  console.log(`  ✓ admin@designcenter.in`);

  // 5. Partner users
  console.log('▸ Seeding partner users...');
  const partnerIds = {};
  for (const p of PARTNER_USERS) {
    const uid = await seedUser(prisma, { email: p.email, password: 'Partner@123', role: 'partner', name: p.name, vendorId: p.vendorId });
    partnerIds[p.vendorId] = uid;
  }
  console.log(`  ✓ ${PARTNER_USERS.length} partner users`);

  // 6. Customer users
  console.log('▸ Seeding customer users...');
  const customerIds = [];
  for (const c of CUSTOMER_USERS) {
    const uid = await seedUser(prisma, { email: c.email, password: 'Customer@123', role: 'customer', name: c.name });
    customerIds.push(uid);
  }
  console.log(`  ✓ ${CUSTOMER_USERS.length} customer users`);

  // 7. Visitors with timeline events + CRM pipeline state (reset for fresh demo data)
  console.log('▸ Seeding visitors...');
  await prisma.timelineEvent.deleteMany({});
  await prisma.visitor.deleteMany({});
  const STAGE_FLOW = {
    contacted: ['Stage → Contacted'],
    consultation: ['Stage → Contacted', 'Stage → Consultation'],
    won: ['Stage → Contacted', 'Stage → Consultation', 'Stage → Won'],
    lost: ['Stage → Contacted', 'Stage → Lost'],
  };
  for (let i = 0; i < VISITORS.length; i++) {
    const v = VISITORS[i];
    const ex = VISITOR_EXTRAS[i] || {};
    const { timeline, ...rest } = v;
    const visitor = await prisma.visitor.create({
      data: {
        fullName: rest.fullName,
        email: rest.email,
        mobile: rest.mobile,
        city: rest.city,
        projectLocation: rest.projectLocation,
        propertyType: rest.propertyType,
        projectStage: rest.projectStage,
        budgetRange: rest.budgetRange,
        designStyle: rest.designStyle,
        leadSource: ex.source ?? rest.leadSource,
        referrerName: rest.referrerName ?? null,
        interestedCategories: rest.interestedCategories,
        tourProgress: rest.tourProgress,
        createdAt: rest.createdAt,
        stage: ex.stage ?? 'new',
        heardAboutUs: ex.source ?? rest.leadSource,
        lookingFor: ex.lookingFor ?? null,
        lastContactedAt: ex.lastContactedAt ?? null,
        nextFollowUpAt: ex.nextFollowUpAt ?? null,
        lostReason: ex.lostReason ?? null,
        assignedPartnerId: ex.assignVendor ? (partnerIds[ex.assignVendor] ?? null) : null,
      },
    });
    let timeOffset = 0;
    for (const label of (timeline || [])) {
      const ts = new Date(rest.createdAt.getTime() + timeOffset * 10 * 60 * 1000);
      await prisma.timelineEvent.create({ data: { visitorId: visitor.id, label, timestamp: ts } });
      timeOffset++;
    }
    // pipeline progression timeline (so lead detail shows follow-up history)
    for (const label of (STAGE_FLOW[ex.stage] || [])) {
      timeOffset++;
      const detail = label.endsWith('Lost')
        ? (ex.lostReason ?? undefined)
        : (label.endsWith('Contacted') ? 'Follow-up call completed' : undefined);
      const ts = new Date(rest.createdAt.getTime() + timeOffset * 60 * 60 * 1000);
      await prisma.timelineEvent.create({ data: { visitorId: visitor.id, label, detail, timestamp: ts } });
    }
  }
  console.log(`  ✓ ${VISITORS.length} visitors (stages + follow-ups)`);

  // 8. Consultations (reset for fresh demo data)
  console.log('▸ Seeding consultations...');
  await prisma.consultation.deleteMany({});
  for (const c of CONSULTATIONS) {
    await prisma.consultation.create({
      data: {
        vendorId: c.vendorId,
        visitorName: c.visitorName,
        service: c.service,
        meetingType: c.meetingType,
        room: c.room,
        date: c.date,
        time: c.time,
        status: c.status,
      },
    });
  }
  console.log(`  ✓ ${CONSULTATIONS.length} consultations`);

  // 9. Saved vendors for customers (simulate user activity)
  console.log('▸ Seeding saved vendors & shortlists...');
  const savedVendorPairs = [
    [0, 'atelier-roshan'], [0, 'studio-may'],
    [1, 'studio-may'], [1, 'maison-bois'], [1, 'marbellos-stone'],
    [2, 'atelier-roshan'], [2, 'complete-spaces'],
    [3, 'maison-bois'], [3, 'linen-silk-co'],
    [4, 'styling-house'], [4, 'prestige-interiors'],
    [5, 'marbellos-stone'],
    [6, 'studio-may'], [6, 'decor-artiste'],
    [7, 'atelier-roshan'], [7, 'forma-architecture'],
    [8, 'complete-spaces'], [8, 'linen-silk-co'],
    [9, 'styling-house'],
    [10, 'maison-bois'], [10, 'marbellos-stone'], [10, 'prestige-interiors'],
    [11, 'studio-may'],
    [12, 'atelier-roshan'], [12, 'complete-spaces'],
    [13, 'linen-silk-co'], [13, 'decor-artiste'],
    [14, 'styling-house'], [14, 'maison-bois'],
  ];
  for (const [ci, vi] of savedVendorPairs) {
    if (customerIds[ci]) {
      await prisma.savedVendor.upsert({
        where: { userId_vendorId: { userId: customerIds[ci], vendorId: vi } },
        create: { userId: customerIds[ci], vendorId: vi },
        update: {},
      });
    }
  }

  // Shortlists
  const shortlistPairs = [
    [0, 'atelier-roshan'], [1, 'marbellos-stone'], [2, 'complete-spaces'],
    [3, 'maison-bois'], [4, 'prestige-interiors'], [7, 'forma-architecture'],
  ];
  for (const [ci, vi] of shortlistPairs) {
    if (customerIds[ci]) {
      await prisma.shortlistVendor.upsert({
        where: { userId_vendorId: { userId: customerIds[ci], vendorId: vi } },
        create: { userId: customerIds[ci], vendorId: vi },
        update: {},
      });
    }
  }

  // Saved services
  const savedServicePairs = [
    [0, 'svc-arch-residential'], [0, 'svc-int-full'],
    [1, 'svc-int-kitchen'], [1, 'svc-fshn-curtains'],
    [2, 'svc-surf-marble'], [2, 'svc-styl-artwork'],
    [3, 'svc-furn-sofa'], [3, 'svc-furn-dining'],
    [4, 'svc-styl-artwork'], [4, 'svc-int-lighting'],
    [5, 'svc-surf-quartz'],
    [6, 'svc-wall-paper'], [6, 'svc-wall-finish'],
    [7, 'svc-arch-renovation'],
    [8, 'svc-tk-home'],
    [9, 'svc-styl-accessories'],
  ];
  for (const [ci, si] of savedServicePairs) {
    if (customerIds[ci]) {
      await prisma.savedService.upsert({
        where: { userId_serviceId: { userId: customerIds[ci], serviceId: si } },
        create: { userId: customerIds[ci], serviceId: si },
        update: {},
      });
    }
  }
  console.log('  ✓ Saved vendors, services & shortlists');

  // 10. Customer consultations (linked to users, skip if already seeded)
  console.log('▸ Seeding customer consultations...');
  const customerConsultations = [
    { userIdx: 0, vendorId: 'atelier-roshan',    visitorName: 'Sarah Menon',  service: 'Residential Architecture', meetingType: 'Architecture Discussion',   room: 'Consultation Room A',    date: daysFromNow(6),  time: new Date(0,0,0,10,0), status: 'upcoming' },
    { userIdx: 1, vendorId: 'studio-may',         visitorName: 'Ahmed Khan',   service: 'Full Space Design',         meetingType: 'Design Consultation',       room: 'Executive Meeting Room', date: daysFromNow(8),  time: new Date(0,0,0,14,0), status: 'upcoming' },
    { userIdx: 2, vendorId: 'marbellos-stone',    visitorName: 'Lakshmi Nair', service: 'Marble & Stone Flooring',   meetingType: 'Product Presentation',      room: 'Consultation Room B',    date: daysFromNow(11), time: new Date(0,0,0,11,0), status: 'upcoming' },
    { userIdx: 0, vendorId: 'maison-bois',        visitorName: 'Sarah Menon',  service: 'Custom Sofa & Seating',     meetingType: 'Vendor Meeting',            room: 'Consultation Room A',    date: daysAgo(8),  time: new Date(0,0,0,10,0), status: 'completed' },
    { userIdx: 3, vendorId: 'complete-spaces',    visitorName: 'Aman Gupta',   service: 'Complete Home Renovation',  meetingType: 'Design Consultation',       room: 'Executive Meeting Room', date: daysAgo(15), time: new Date(0,0,0,15,0), status: 'completed' },
  ];
  {
    for (const c of customerConsultations) {
      const userId = customerIds[c.userIdx];
      if (!userId) continue;
      await prisma.consultation.create({
        data: {
          userId,
          vendorId: c.vendorId,
          visitorName: c.visitorName,
          service: c.service,
          meetingType: c.meetingType,
          room: c.room,
          date: c.date,
          time: c.time,
          status: c.status,
        },
      });
    }
    console.log(`  ✓ ${customerConsultations.length} customer consultations`);
  }

  await prisma.$disconnect();
  console.log('\n✅ Seed complete!');
  console.log('\nCredentials:');
  console.log('  Admin:   admin@designcenter.in  /  Admin@123');
  console.log('  Partner: partner.griha@dc.in   /  Partner@123');
  console.log('  Customer: sarah.menon@gmail.com / Customer@123');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
