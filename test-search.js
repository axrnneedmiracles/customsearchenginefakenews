const GOOGLE_API_KEY = 'AIzaSyBx8C6pFYbPTkKM0jV0OJbrx6UuJgDQUec';
const GOOGLE_CSE_ID = 'e7d7005d6e1bf426a';
const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

async function testSearch(query) {
  const params = new URLSearchParams({ key: GOOGLE_API_KEY, cx: GOOGLE_CSE_ID, q: query });
  console.log(`Fetching with OLD key...`);
  const res = await fetch(`${GOOGLE_SEARCH_URL}?${params}`);
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Results found:", data.items ? data.items.length : 0);
  if (data.error) console.error("Error:", data.error.message);
}

testSearch("narendra modi");
