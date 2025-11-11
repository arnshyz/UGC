import { SceneStructure } from './types';

export const SCENE_STRUCTURES: SceneStructure[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase (Freepik)',
    description: 'Tiga angle produk dan satu shot model untuk kampanye vertikal 9:16.',
    scenes: [
      {
        title: 'Hero Produk',
        description: 'Shot utama produk berdiri sendiri',
        imagePrompt: (background, productName, additionalBrief) => `Ultra-detailed hero shot of "${productName}" displayed on a pedestal with premium lighting inside a ${background}. Capture the entire product clearly, centered, and with dramatic shadows. Aspect ratio 9:16. ${additionalBrief}. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName) => `Mulai dengan slow push-in ke "${productName}" sambil menambahkan glow halus di sekelilingnya.`,
        requiredParts: ['product'],
      },
      {
        title: 'Detail Tekstur',
        description: 'Close-up untuk menonjolkan material',
        imagePrompt: (background, productName, additionalBrief) => `Extreme macro close-up of "${productName}" highlighting the craftsmanship, texture, and material quality. Background should stay softly blurred within a ${background} palette. Aspect ratio 9:16. ${additionalBrief}. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName) => `Animasi pan perlahan menyapu permukaan "${productName}" memperlihatkan detailnya.`,
        requiredParts: ['product'],
      },
      {
        title: 'Produk Dalam Konteks',
        description: 'Produk saat digunakan atau ditempatkan',
        imagePrompt: (background, productName, additionalBrief) => `Lifestyle composition showing "${productName}" arranged naturally within a ${background}. Sertakan properti pendukung yang relevan namun tetap membuat produk sebagai fokus utama. Aspect ratio 9:16. ${additionalBrief}. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName) => `Buat efek parallax ringan pada latar sementara produk tetap tajam di tengah.`,
        requiredParts: ['product'],
      },
      {
        title: 'Model Dengan Produk',
        description: 'Model yang berinteraksi dengan produk',
        imagePrompt: (background, productName, additionalBrief) => `Authentic portrait of a model happily interacting with "${productName}" inside a ${background}. Tunjukkan ekspresi natural dan pencahayaan yang konsisten dengan tiga gambar sebelumnya. Aspect ratio 9:16. ${additionalBrief}. PENTING: Tidak boleh ada teks, logo, atau watermark apa pun.`,
        videoPromptSuggestion: (productName) => `Tambahkan gerakan kamera lembut mengikuti gestur model saat menunjukkan "${productName}".`,
        requiredParts: ['product', 'model'],
      },
    ],
  },
];
