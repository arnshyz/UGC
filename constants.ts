import { PromptStyle, SceneStructure } from './types';

export const PROMPT_STYLES: PromptStyle[] = [
  {
    id: 'studio-premium',
    name: 'Studio Premium',
    description: 'Clean, high-end look dengan pencahayaan profesional.',
    background: 'premium daylight studio with soft gradients and subtle reflections',
    visualTone:
      'Gunakan pencahayaan dramatis namun seimbang, detail tajam 4K, warna natural yang kaya, gaya foto katalog modern.',
    videoMood:
      'Gerakan kamera slider halus dengan sedikit efek bloom untuk menonjolkan kualitas premium produk.',
    promptSuffix: 'Shot on professional mirrorless camera, 85mm lens, ultra sharp focus.',
    negativePrompt: 'grainy texture, low quality, distorted proportions, cluttered background',
  },
  {
    id: 'lifestyle-natural',
    name: 'Lifestyle Natural',
    description: 'Nuansa candid hangat di apartemen modern.',
    background: 'sunlit urban apartment interior with indoor plants and warm wooden textures',
    visualTone:
      'Tampilkan suasana cozy, candid, dan autentik layaknya konten kreator lifestyle, tone warna hangat dan lembut.',
    videoMood:
      'Gerakan handheld ringan dengan fokus pada ekspresi natural serta interaksi manusiawi.',
    promptSuffix: 'Soft daylight photography, shallow depth of field, handheld documentary look.',
    negativePrompt: 'studio backdrop, harsh flash, cold tone, stiff pose',
  },
  {
    id: 'creator-desk',
    name: 'Creator Desk',
    description: 'Meja kreator minimalis untuk produk tech & tools.',
    background: 'minimal creator workspace desk with soft top-light and organized accessories',
    visualTone:
      'Fokus pada estetika produktif, komposisi rapi, dan nuansa tech-savvy yang bersih dan modern.',
    videoMood:
      'Gerakan kamera top-down atau orbit halus menyorot detail fitur produk di meja kerja.',
    promptSuffix: 'High contrast softbox lighting, cinematic color grading, productivity vlog style.',
    negativePrompt: 'messy desk, low resolution, neon lighting, overexposed highlights',
  },
];

export const SCENE_STRUCTURES: SceneStructure[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase (Freepik)',
    description: 'Tiga angle produk dan satu shot model untuk kampanye vertikal 9:16.',
    scenes: [
      {
        title: 'Hero Produk',
        description: 'Shot utama produk berdiri sendiri',
        imagePrompt: (promptStyle, productName, additionalBrief) =>
          `Ultra-detailed hero shot of "${productName}" displayed on a pedestal dengan pencahayaan premium di dalam ${promptStyle.background}. ${promptStyle.visualTone} ${additionalBrief}. ${promptStyle.promptSuffix ?? ''} PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName, _additionalBrief, promptStyle) =>
          `Mulai dengan slow push-in ke "${productName}" sambil menambahkan glow halus di sekelilingnya. ${promptStyle.videoMood}`,
        requiredParts: ['product'],
      },
      {
        title: 'Detail Tekstur',
        description: 'Close-up untuk menonjolkan material',
        imagePrompt: (promptStyle, productName, additionalBrief) =>
          `Extreme macro close-up of "${productName}" highlighting the craftsmanship, texture, and material quality. Background should stay softly blurred within a ${promptStyle.background} palette. ${promptStyle.visualTone} ${additionalBrief}. ${promptStyle.promptSuffix ?? ''} Aspect ratio 9:16. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName, _additionalBrief, promptStyle) =>
          `Animasi pan perlahan menyapu permukaan "${productName}" memperlihatkan detailnya. ${promptStyle.videoMood}`,
        requiredParts: ['product'],
      },
      {
        title: 'Produk Dalam Konteks',
        description: 'Produk saat digunakan atau ditempatkan',
        imagePrompt: (promptStyle, productName, additionalBrief) =>
          `Lifestyle composition showing "${productName}" arranged naturally within a ${promptStyle.background}. Sertakan properti pendukung yang relevan namun tetap membuat produk sebagai fokus utama. ${promptStyle.visualTone} ${additionalBrief}. ${promptStyle.promptSuffix ?? ''} Aspect ratio 9:16. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName, _additionalBrief, promptStyle) =>
          `Buat efek parallax ringan pada latar sementara produk tetap tajam di tengah. ${promptStyle.videoMood}`,
        requiredParts: ['product'],
      },
      {
        title: 'Model Dengan Produk',
        description: 'Model yang berinteraksi dengan produk',
        imagePrompt: (promptStyle, productName, additionalBrief) =>
          `Authentic portrait of a model happily interacting with "${productName}" inside a ${promptStyle.background}. Tunjukkan ekspresi natural dan pencahayaan yang konsisten dengan tiga gambar sebelumnya. ${promptStyle.visualTone} ${additionalBrief}. ${promptStyle.promptSuffix ?? ''} Aspect ratio 9:16. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName, _additionalBrief, promptStyle) =>
          `Tambahkan gerakan kamera lembut mengikuti gestur model saat menunjukkan "${productName}". ${promptStyle.videoMood}`,
        requiredParts: ['product', 'model'],
      },
    ],
  },
];
