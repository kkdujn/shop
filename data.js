const CATEGORIES = ["상의", "하의", "아우터", "신발", "액세서리"];

const SIZE_OPTIONS = ["S", "M", "L", "XL"];

function placeholderImage(seed, category, color) {
  const bg = { "블랙": "2b2b2b", "화이트": "e8e8e8", "베이지": "d8c3a5", "네이비": "1f2d50", "그레이": "9aa0a6" }[color] || "cccccc";
  const label = { "상의": "TOP", "하의": "BOTTOM", "아우터": "OUTER", "신발": "SHOES", "액세서리": "ACC" }[category] || "ITEM";
  return `https://placehold.co/300x360/${bg}/ffffff?text=${encodeURIComponent(label + " " + seed)}`;
}

const PRODUCTS = [
  { id: 1, name: "오버핏 코튼 티셔츠", price: 19000, category: "상의", colors: ["블랙", "화이트"], soldOut: false, createdAt: "2026-11-10" },
  { id: 2, name: "스트라이프 니트", price: 32000, category: "상의", colors: ["베이지", "네이비"], soldOut: false, createdAt: "2026-11-08" },
  { id: 3, name: "옥스포드 셔츠", price: 28000, category: "상의", colors: ["화이트", "블랙"], soldOut: true, createdAt: "2026-11-05" },
  { id: 4, name: "후드 스웨트셔츠", price: 35000, category: "상의", colors: ["그레이", "블랙"], soldOut: false, createdAt: "2026-11-12" },
  { id: 5, name: "슬림 데님 팬츠", price: 42000, category: "하의", colors: ["네이비", "블랙"], soldOut: false, createdAt: "2026-11-09" },
  { id: 6, name: "와이드 슬랙스", price: 38000, category: "하의", colors: ["베이지", "그레이"], soldOut: false, createdAt: "2026-11-07" },
  { id: 7, name: "카고 조거 팬츠", price: 36000, category: "하의", colors: ["블랙", "그레이"], soldOut: true, createdAt: "2026-11-01" },
  { id: 8, name: "코튼 숏팬츠", price: 24000, category: "하의", colors: ["화이트", "베이지"], soldOut: false, createdAt: "2026-11-11" },
  { id: 9, name: "울 블렌드 코트", price: 89000, category: "아우터", colors: ["블랙", "베이지"], soldOut: false, createdAt: "2026-11-06" },
  { id: 10, name: "경량 패딩 재킷", price: 65000, category: "아우터", colors: ["네이비", "블랙"], soldOut: false, createdAt: "2026-11-13" },
  { id: 11, name: "데님 자켓", price: 54000, category: "아우터", colors: ["네이비"], soldOut: false, createdAt: "2026-11-03" },
  { id: 12, name: "바시티 자켓", price: 72000, category: "아우터", colors: ["블랙", "그레이"], soldOut: true, createdAt: "2026-11-02" },
  { id: 13, name: "캔버스 스니커즈", price: 45000, category: "신발", colors: ["화이트", "블랙"], soldOut: false, createdAt: "2026-11-04" },
  { id: 14, name: "러닝 슈즈", price: 58000, category: "신발", colors: ["그레이", "블랙"], soldOut: false, createdAt: "2026-11-10" },
  { id: 15, name: "첼시 부츠", price: 76000, category: "신발", colors: ["블랙"], soldOut: false, createdAt: "2026-11-05" },
  { id: 16, name: "크로스백", price: 39000, category: "액세서리", colors: ["블랙", "베이지"], soldOut: false, createdAt: "2026-11-08" },
  { id: 17, name: "니트 비니", price: 15000, category: "액세서리", colors: ["네이비", "그레이"], soldOut: false, createdAt: "2026-11-12" },
  { id: 18, name: "레더 벨트", price: 22000, category: "액세서리", colors: ["블랙"], soldOut: true, createdAt: "2026-11-01" },
];

PRODUCTS.forEach((p) => {
  p.sizes = SIZE_OPTIONS;
  p.thumbnail = placeholderImage(p.id, p.category, p.colors[0]);
});

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}
