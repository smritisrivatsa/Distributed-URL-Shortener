import { createShortUrl } from "./src/urlService.js";

const shortCode = await createShortUrl('https://universityofwashingtonhfs8.humanity.com/app/staff/detail/8759105/');
console.log("Short code:", shortCode);