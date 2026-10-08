// Starter photo sets by business type. All are free-licence Unsplash photos, referenced by ID.
// Each set: hero, about, three item photos, four gallery photos.

const u = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const set = (label, ids, alts) => ({ label, ids, alts });

export const PHOTO_SETS = {
  detailing: set("Car detailing",
    ["1608506375591-b90e1f955e4b", "1632823469850-2f77dd9c7f93", "1708805282683-50a060eba80f", "1605437241278-c1806d14a4d9", "1607860108855-64acf2078ed9", "1520340356584-f9917d1eea6f", "1633014041037-f5446fb4ce99", "1708805283017-c662be2c7a44", "1554294314-80a5fb7e6bd5"],
    ["A black sports car covered in foam", "A detailer working on the front of a car", "A gloved hand cleaning a tire", "A clean car interior", "Water sprayed over a black coupe", "A polished black car", "A grey car covered in soap suds", "A clean tire on a wet surface", "A black saloon car"]),
  cafe: set("Cafe or coffee",
    ["1567880905822-56f8e06fe630", "1541167760496-1628856ab772", "1447933601403-0c6688de566e", "1509042239860-f550ce710b93", "1542372147193-a7aca54189cd", "1600093463592-8e36ae95ef56", "1495474472287-4d71bcdd2085", "1511920170033-f8396924c348", "1512568400610-62da28bc8a13"],
    ["A modern coffee shop interior", "A barista pouring latte art", "Roasted coffee beans", "A latte on a table", "A latte, croissant and book", "A rustic cafe interior", "Three people holding cups", "Coffee and beans from above", "A heart latte from above"]),
  barber: set("Barber or salon",
    ["1585747860715-2ba37e788b70", "1599351431202-1e0f0137899a", "1605497788044-5a32c7078486", "1647140655214-e4a2d914971f", "1621605815971-fbc98d665033", "1503951914875-452162b0f3f1", "1536520002442-39764a41e987", "1621645582931-d1d3e6564943", "1657105052497-f996284ffff8"],
    ["A leather barber chair by a brick wall", "A barber using a straight razor", "A barber blow-drying a client's hair", "A barber cutting hair with scissors", "Clippers, scissors and a comb", "A client in a barber's chair", "A salon interior with pendant lamps", "A black and silver barber chair", "A barber trimming with shears and a comb"]),
  landscaping: set("Landscaping or garden",
    ["1668120089662-42642838cfef", "1621272156568-7306716648df", "1700689807667-82630348b301", "1632161293871-cf2083474e34", "1633330948542-0b3bdeefcdb3", "1597201278257-3687be27d954", "1692339699736-acb2a3a06b58", "1599685315640-9ceab2f58148", "1695151838136-97e47e9abaaf"],
    ["A large green lawn with shrubs and trees", "A wheelbarrow in a garden", "A brick path through flowers", "A garden full of flowers", "A patio with table and chairs", "Flower beds and trimmed shrubs", "A path through a flower garden", "Green plants and trees", "A park with a gazebo among trees"]),
  restaurant: set("Restaurant or food",
    ["1414235077428-338989a2e8c0", "1466978913421-dad2ebd01d17", "1467003909585-2f8a72700288", "1504674900247-0877df9cc836", "1482049016688-2d3e1b311543", "1600891964599-f61ba0e24092", "1579027989536-b7b1f875659b", "1502998070258-dc1338445ac2", "1484723091739-30a097e8f929"],
    ["A plated dish on a white plate", "People sharing a meal at a table", "Salmon fillet with salsa", "Three plates of food on a wooden table", "A sandwich with a boiled egg", "A spread of appetisers", "Tables under striped umbrellas", "A burger and fries", "Toast with blueberries"]),
  fitness: set("Gym or fitness",
    ["1534438327276-14e5300c3a48", "1517836357463-d25dfeac3438", "1576678927484-cc907957088c", "1722925541142-5db2668ca492", "1548690312-e3b507d8c110", "1571902943202-507ec2618e8f", "1623874514711-0f321325f318", "1526506118085-60ce8714f8c5", "1689877020200-403d8542d95d"],
    ["A person standing among gym equipment", "A person about to lift a barbell", "A rack of dumbbells", "A person lifting a barbell", "A person training with a rope", "Gym equipment in a room", "Weightlifting benches in an industrial gym", "A person working out", "A gym filled with machines"]),
  renovation: set("Building or renovation",
    ["1502005097973-6a7082348e28", "1505798577917-a65157d3320a", "1618832515490-e181c4794a45", "1584622650111-993a426fbf0a", "1599619585752-c3edb42a414c", "1554995207-c18c203602cb", "1731168273756-e02cae42265b", "1517581177682-a085bb7ffb15", "1634586648651-f1fb9ec10d90"],
    ["A white kitchen with an island", "A carpenter at a mitre saw", "A kitchen under renovation", "A modern bathroom with shower and vanity", "A paint roller in a tray", "A finished living room", "A worker cutting a tile", "A worker on a ladder indoors", "A room under renovation"])
};

// Returns { hero, about, items: [3], gallery: [4] } as { src, alt } objects, or null for an unknown type.
export function photosFor(type) {
  const s = PHOTO_SETS[type];
  if (!s) return null;
  const p = (i, w) => ({ src: u(s.ids[i], w), alt: s.alts[i] });
  return { hero: p(0, 2000), about: p(1, 1200), items: [p(2, 900), p(3, 900), p(4, 900)], gallery: [p(5, 1400), p(6, 1000), p(7, 1000), p(8, 1400)] };
}
