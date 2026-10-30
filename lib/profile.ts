import type { ContentImage } from "./types";
import imageData from "@/content/assets.json";

export const practitioner = {
  name: "Acharya Raman Kamra",
  heading: "Experience, with understanding.",
  photo: imageData.portrait,
  biography: [
    "Acharya Raman Kamra is a Vedic astrologer based in Gurugram, serving people who bring questions about relationships, work, family, and the important transitions in their lives.",
    "With over 20 years of practice, his work is rooted in the traditions of Jyotish. He holds qualifications from the Institute of Astrology at Bharatiya Vidya Bhavan, New Delhi, with the original biography recording the titles Jyotish Alankar and Jyotish Acharya.",
    "His approach reflects a belief in devotion, prayer, and thoughtful spiritual practice. Chart interpretation provides a starting point for discussing your individual circumstances and the questions that matter to you.",
    "Alongside personal consultations, Acharya Raman shares educational material on planets, zodiac signs, houses, nakshatras, yogas, and classical astrology. His teaching introduces learners to the foundations of Vedic astrology through a structured basic course.",
  ],
};

export interface Credential {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: ContentImage;
  order: number;
}
