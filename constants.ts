import { SceneStructure } from './types';

export const SCENE_STRUCTURES: SceneStructure[] = [
  {
    id: 'problem-solution',
    name: 'Problem/Solution (Default)',
    description: 'Classic marketing funnel: hook, problem, solution, CTA.',
    scenes: [
      {
        title: 'Hook',
        description: 'Model using product',
        imagePrompt: (background, productName, additionalBrief) => `High-quality, authentic-looking portrait photo of a model happily using "${productName}". Place them in a ${background} setting. Aspect ratio 9:16. This is a hook for a social media ad. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi subtle zoom in pada ekspresi bahagia model saat menggunakan "${productName}".`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Problem/Pain Point',
        description: 'Product close-up',
        imagePrompt: (background, productName, additionalBrief) => `Detailed close-up shot of "${productName}", highlighting its texture and key features, against a clean ${background} setting. Aspect ratio 9:16. Represents the 'problem' this product solves. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Animasi slow pan melintasi detail-detail penting dari "${productName}".`,
        requiredParts: ['product'],
      },
      {
        title: 'Solution',
        description: 'Product feature/lifestyle',
        imagePrompt: (background, productName, additionalBrief) => `Aesthetic lifestyle photo showcasing "${productName}" in a ${background} setting. Aspect ratio 9:16. This scene represents the 'solution' the product offers. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Tampilkan efek kilau lembut atau cahaya pada "${productName}" untuk menonjolkan solusinya.`,
        requiredParts: ['product'],
      },
      {
        title: 'Call to Action',
        description: 'Model inviting to buy',
        imagePrompt: (background, productName, additionalBrief) => `High-quality portrait of a model holding "${productName}", looking enthusiastically at the camera and pointing towards the bottom right of the frame, inviting viewers to buy. Place them in a ${background} setting. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Animasikan panah "Beli Sekarang" muncul di tempat yang ditunjuk model, ajak penonton untuk membeli "${productName}".`,
        requiredParts: ['product', 'model'],
      },
    ],
    scriptPrompt: (productName, additionalBrief) => `Create a voice-over script in casual, friendly Indonesian for a social media video ad about "${productName}".
      The ad has 4 scenes. Follow this structure exactly:
      - Scene 1 (Hook): Grab attention.
      - Scene 2 (Problem/Pain Point): Describe a common problem.
      - Scene 3 (Solution): Introduce the product as the solution.
      - Scene 4 (Call to Action): Encourage purchase.
      Language style: casual and easy to understand.
      PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
      ${additionalBrief ? `Additional instructions: ${additionalBrief}` : ''}
      Return as a valid JSON object with keys: "scene1", "scene2", "scene3", "scene4".`
  },
  {
    id: 'fashion-lifestyle',
    name: 'Fashion / Lifestyle',
    description: 'Showcase apparel or accessories in stylish settings.',
    scenes: [
        {
            title: 'Tampilan Outfit Lengkap', description: 'Model showing the product',
            imagePrompt: (background, productName, additionalBrief) => `Full-body fashion shot of a model wearing "${productName}" in a stylish, ${background} setting. The model should look confident and chic. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Gunakan efek slow dolly zoom yang elegan ke arah model yang memakai "${productName}".`,
            requiredParts: ['product', 'model'],
        },
        {
            title: 'Detail Bahan/Kain', description: 'Zoom on product texture',
            imagePrompt: (background, productName, additionalBrief) => `Macro close-up shot of the "${productName}", focusing on the fabric, texture, or a key design detail. The lighting should be dramatic. Background should be a complementary, blurred ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Buat gerakan panning lambat yang menyorot tekstur kain atau detail unik dari "${productName}".`,
            requiredParts: ['product'],
        },
        {
            title: 'Produk Saat Dipakai', description: 'Model moving with product',
            imagePrompt: (background, productName, additionalBrief) => `Dynamic action shot of the model interacting with the environment in a ${background} setting, showcasing the "${productName}" in a natural, lifestyle context (e.g., walking, laughing). Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Ciptakan efek cinemagraph di mana hanya model yang bergerak sedikit, menunjukkan kenyamanan "${productName}" saat dipakai.`,
            requiredParts: ['product', 'model'],
        },
        {
            title: 'Pose CTA Percaya Diri', description: 'Model looking at camera',
            imagePrompt: (background, productName, additionalBrief) => `Medium close-up shot of the model wearing "${productName}", looking directly at the camera with a confident smile. The pose should be inviting and aspirational. Setting is ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Tambahkan efek lens flare subtle dari satu sisi untuk memberikan kesan premium pada "${productName}".`,
            requiredParts: ['product', 'model'],
        },
    ],
    scriptPrompt: (productName, additionalBrief) => `Create a voice-over script in a trendy, cool Indonesian tone for a fashion ad about "${productName}".
        The ad has 4 scenes. Follow this structure:
        - Scene 1 (The Look): Introduce the overall style.
        - Scene 2 (The Details): Highlight the quality and craftsmanship.
        - Scene 3 (The Vibe): Show the lifestyle it represents.
        - Scene 4 (Be The Vibe): Invite the viewer to adopt the style.
        Language style: casual and easy to understand.
        PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
        ${additionalBrief ? `Additional instructions: ${additionalBrief}` : ''}
        Return as a valid JSON object with keys: "scene1", "scene2", "scene3", "scene4".`
  },
   {
    id: 'digital-service',
    name: 'Digital / Service',
    description: 'Perfect for apps, software, or service-based offerings.',
    scenes: [
        {
            title: 'Kondisi "Sebelumnya"', description: 'User looking confused',
            imagePrompt: (background, productName, additionalBrief) => `Illustrative scene of a person looking frustrated or confused at their desk or on their phone, representing the problem "${productName}" solves. The style should be slightly desaturated. Setting is ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Tampilkan efek glitch atau flicker halus pada layar yang dilihat pengguna, menandakan masalah sebelum menggunakan "${productName}".`,
            requiredParts: ['model'],
        },
        {
            title: 'Perkenalan UI', description: 'Clean shot of the product UI',
            imagePrompt: (background, productName, additionalBrief) => `A clean, visually appealing screenshot or mock-up of the "${productName}" user interface. It should look modern, simple, and intuitive. Background is a simple ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Animasikan ikon atau elemen penting di UI "${productName}" agar menyala atau ter-highlight secara bergantian.`,
            requiredParts: ['product'],
        },
        {
            title: 'Kondisi "Sesudahnya"', description: 'User happy and successful',
            imagePrompt: (background, productName, additionalBrief) => `The same person from Scene 1, now looking happy, relieved, and successful while using a device, implying they're using "${productName}". The scene is bright and vibrant. Setting is ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Buat ikon-ikon kesuksesan (seperti tanda centang atau bintang) muncul melayang di sekitar pengguna yang kini bahagia berkat "${productName}".`,
            requiredParts: ['model'],
        },
        {
            title: 'CTA yang Jelas', description: 'Device showing "Download Now"',
            imagePrompt: (background, productName, additionalBrief) => `A hand holding a smartphone or pointing to a laptop screen. On the screen, the "${productName}" logo is visible with a clear call-to-action button like 'Get Started' or 'Download Now'. The background is a clean ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Animasikan tombol CTA dengan efek denyut lembut (pulsing glow) untuk mendorong klik dan mencoba "${productName}".`,
            requiredParts: ['product'],
        },
    ],
    scriptPrompt: (productName, additionalBrief) => `Create a voice-over script in a clear, confident Indonesian tone for a digital product ad about "${productName}".
        The ad has 4 scenes. Follow this structure:
        - Scene 1 (The Struggle): Highlight a common digital frustration.
        - Scene 2 (The Tool): Introduce the product's interface.
        - Scene 3 (The Triumph): Show the successful outcome.
        - Scene 4 (The Invitation): A clear call to download or sign up.
        Language style: casual and easy to understand.
        PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
        ${additionalBrief ? `Additional instructions: ${additionalBrief}` : ''}
        Return as a valid JSON object with keys: "scene1", "scene2", "scene3", "scene4".`
  },
   {
    id: 'food-beverage',
    name: 'Food / Beverage',
    description: 'Tempting shots for food products or restaurants.',
    scenes: [
        {
            title: 'Adegan Menggugah Selera', description: 'Person craving the food',
            imagePrompt: (background, productName, additionalBrief) => `An intimate, close-up shot of a person with a look of delicious anticipation or craving, with the "${productName}" just out of focus in the background. Setting is a cozy ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Buat animasi rack focus yang perlahan beralih dari wajah orang yang menginginkan makanan ke "${productName}" di latar belakang.`,
            requiredParts: ['product', 'model'],
        },
        {
            title: 'Foto Produk Utama', description: 'Glorious close-up of the food',
            imagePrompt: (background, productName, additionalBrief) => `A stunning, high-definition "hero shot" of the "${productName}". It should look incredibly appetizing, perhaps with steam rising or a glistening texture. The lighting is key. Background is a clean ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Gunakan efek push-in (zoom maju) yang sangat lambat dan dramatis ke arah "${productName}" untuk membuatnya terlihat sangat lezat.`,
            requiredParts: ['product'],
        },
        {
            title: 'Gigitan Pertama', description: 'Person enjoying the food',
            imagePrompt: (background, productName, additionalBrief) => `A joyful shot of a person taking the first bite of "${productName}" and reacting with pure delight and satisfaction. The focus is on their happy expression. Setting is ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Terapkan efek slow-motion yang cepat dan subtle tepat saat model menggigit "${productName}" untuk menonjolkan kenikmatannya.`,
            requiredParts: ['product', 'model'],
        },
        {
            title: 'Sajian Lengkap', description: 'Product with ingredients',
            imagePrompt: (background, productName, additionalBrief) => `An overhead "flat lay" shot of the "${productName}" presented beautifully, surrounded by fresh ingredients or complementary items. This is the final, "order now" shot. The setting is a stylish ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Pastikan penampilan model, gaya produk, dan estetika latar belakang konsisten di keempat gambar untuk menciptakan alur visual yang koheren. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
            videoPromptSuggestion: (productName) => `Buat animasi sederhana di mana bahan-bahan segar di sekitar "${productName}" bergerak sedikit, menunjukkan kesegarannya.`,
            requiredParts: ['product'],
        },
    ],
    scriptPrompt: (productName, additionalBrief) => `Create a voice-over script in a warm, mouth-watering Indonesian tone for a food ad about "${productName}".
        The ad has 4 scenes. Follow this structure:
        - Scene 1 (The Desire): Evoke a feeling of hunger or craving.
        - Scene 2 (The Masterpiece): Describe the food in delicious detail.
        - Scene 3 (The Experience): Focus on the joy of eating it.
        - Scene 4 (The Invitation): Tell people where they can get it.
        Language style: casual and easy to understand.
        PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
        ${additionalBrief ? `Additional instructions: ${additionalBrief}` : ''}
        Return as a valid JSON object with keys: "scene1", "scene2", "scene3", "scene4".`
  },
  {
    id: 'vlog-review',
    name: 'Vlog Ulasan Natural',
    description: 'Gaya ulasan produk yang jujur dan otentik.',
    scenes: [
      {
        title: 'Pembukaan & Perkenalan',
        description: 'Model memegang produk, berbicara ke kamera',
        imagePrompt: (background, productName, additionalBrief) => `Gaya vlog, candid shot dari seorang model yang memegang "${productName}" dan berbicara langsung ke kamera dengan ekspresi ramah. Latar belakangnya adalah ${background} yang terlihat natural (seperti kamar atau ruang tamu). Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi seolah model sedang berbicara natural sambil menggerakkan "${productName}" sedikit untuk ditunjukkan ke kamera.`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Kesan Pertama',
        description: 'Close-up produk saat digunakan',
        imagePrompt: (background, productName, additionalBrief) => `POV shot (Point of View) atau close-up tangan model saat menggunakan "${productName}" untuk pertama kalinya. Fokus pada detail produk dan interaksinya. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Animasi tangan yang sedang menggunakan "${productName}" secara perlahan dari sudut pandang pengguna (POV).`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Demo Fitur Utama',
        description: 'Model menunjukkan manfaat produk',
        imagePrompt: (background, productName, additionalBrief) => `Medium shot model yang sedang mendemonstrasikan fitur kunci dari "${productName}" dengan ekspresi terkesan. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Tambahkan grafis sederhana (misal: ikon centang atau bintang) yang muncul untuk menyorot fitur utama "${productName}" yang sedang didemokan.`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Putusan Akhir & CTA',
        description: 'Model memberikan rekomendasi',
        imagePrompt: (background, productName, additionalBrief) => `Model memegang "${productName}", tersenyum puas ke kamera, mungkin dengan gestur jempol ke atas. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Gunakan efek zoom yang sangat perlahan ke arah produk "${productName}" dan senyum puas dari model.`,
        requiredParts: ['product', 'model'],
      },
    ],
    scriptPrompt: (productName, additionalBrief) => `Buat naskah voice over dengan gaya ulasan vlog yang jujur dan natural dalam Bahasa Indonesia untuk "${productName}".
      Struktur 4 adegan:
      - Scene 1 (Perkenalan): Sapa penonton dan perkenalkan produknya.
      - Scene 2 (Kesan Pertama): Bagikan reaksi pertama saat menggunakan produk.
      - Scene 3 (Fitur Favorit): Jelaskan satu fitur atau manfaat utama.
      - Scene 4 (Rekomendasi): Berikan putusan akhir dan ajakan untuk mencoba.
      Gaya bahasa: Santai, seperti teman ngobrol.
      PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}
      Return sebagai objek JSON valid dengan kunci: "scene1", "scene2", "scene3", "scene4".`
  },
  {
    id: 'unboxing',
    name: 'Unboxing Produk',
    description: 'Menangkap keseruan membuka produk baru.',
    scenes: [
      {
        title: 'Paketnya Tiba!',
        description: 'Tangan memegang kotak produk',
        imagePrompt: (background, productName, additionalBrief) => `Shot dari atas (flat lay) yang menunjukkan sebuah kotak produk "${productName}" yang masih tersegel di atas meja ${background} yang rapi. Tangan model terlihat di frame, siap untuk membuka. Ciptakan rasa antisipasi. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi tangan yang sedikit gemetar karena tidak sabar untuk membuka paket "${productName}".`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Momen Pembukaan',
        description: 'Produk terlihat pertama kali',
        imagePrompt: (background, productName, additionalBrief) => `Close-up tangan yang sedang membuka kotak, memperlihatkan "${productName}" untuk pertama kalinya di antara kertas pelindung atau isian kotak. Pencahayaan lembut dari dalam kotak. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Ciptakan efek cahaya lembut yang bersinar dari dalam kotak saat paket "${productName}" dibuka.`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Produk dari Dekat',
        description: 'Hero shot produk yang baru dibuka',
        imagePrompt: (background, productName, additionalBrief) => `"Hero shot" yang bersih dan detail dari "${productName}" yang baru saja dikeluarkan dari kotaknya, diletakkan dengan indah di atas meja ${background}. Fokus pada desain dan kebersihannya. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi putaran 360 derajat yang lambat dari "${productName}" untuk memamerkan semua sisinya.`,
        requiredParts: ['product'],
      },
      {
        title: 'Ekspresi Gembira',
        description: 'Model senang dengan produk barunya',
        imagePrompt: (background, productName, additionalBrief) => `Shot medium dari model yang memegang "${productName}" dengan ekspresi wajah yang sangat gembira dan terkesan. Kotak dan kemasan terlihat di sekitarnya. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Tampilkan animasi konfeti virtual atau partikel berkilau yang muncul di sekitar model saat ia gembira dengan "${productName}" barunya.`,
        requiredParts: ['product', 'model'],
      },
    ],
    scriptPrompt: (productName, additionalBrief) => `Buat naskah voice over yang menangkap kegembiraan unboxing dalam Bahasa Indonesia untuk "${productName}".
      Struktur 4 adegan:
      - Scene 1 (Antisipasi): Ekspresikan rasa penasaran terhadap paket.
      - Scene 2 (Pembukaan): Deskripsikan momen saat membuka dan melihat produk pertama kali.
      - Scene 3 (Detail Produk): Komentari penampilan atau detail produk dari dekat.
      - Scene 4 (Kegirangan): Tunjukkan kebahagiaan dan ajak penonton untuk merasakan hal yang sama.
      Gaya bahasa: Penuh semangat dan antusias.
      PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}
      Return sebagai objek JSON valid dengan kunci: "scene1", "scene2", "scene3", "scene4".`
  },
  {
    id: 'storytelling-camera',
    name: 'Storytelling (Depan Kamera)',
    description: 'Membangun koneksi personal melalui cerita.',
    scenes: [
      {
        title: 'Hook Cerita yang Menarik',
        description: 'Model memulai cerita dengan hook yang kuat',
        imagePrompt: (background, productName, additionalBrief) => `Potret medium shot dari seorang model yang terlihat seperti sedang merekam vlog atau podcast, berbicara dengan antusias ke kamera sambil memegang mikrofon wireless kecil. Ekspresinya harus menarik perhatian dan membuat penasaran. Latar belakang ${background} yang terlihat otentik seperti studio rumahan atau ruang kerja. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi halus seolah-olah model sedang berbicara secara natural, dengan sedikit gerakan kepala dan tangan yang ekspresif. Jaga agar tetap terasa otentik saat menceritakan hook tentang "${productName}".`,
        requiredParts: ['model'],
      },
      {
        title: 'Titik Balik',
        description: 'Produk diperkenalkan sebagai solusi',
        imagePrompt: (background, productName, additionalBrief) => `Medium shot model yang sedang berinteraksi dengan "${productName}" untuk pertama kalinya. Ekspresinya menunjukkan secercah harapan atau rasa penasaran. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Ciptakan efek cahaya lembut yang mulai menerangi model dan "${productName}", menandakan momen pencerahan dalam cerita.`,
        requiredParts: ['product', 'model'],
      },
      {
        title: 'Hasil Akhir',
        description: 'Model menunjukkan hasil positif',
        imagePrompt: (background, productName, additionalBrief) => `Model tersenyum cerah dan percaya diri ke kamera, menunjukkan hasil positif setelah menggunakan produk. Mungkin sedang melakukan aktivitas yang sebelumnya sulit. Latar belakang ${background} yang cerah. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Gunakan transisi warna dari adegan sebelumnya yang mungkin lebih muram menjadi lebih cerah dan hangat, menunjukkan hasil positif berkat "${productName}".`,
        requiredParts: ['model'],
      },
      {
        title: 'Rekomendasi Personal',
        description: 'Model memegang produk dan mengajak',
        imagePrompt: (background, productName, additionalBrief) => `Model memegang "${productName}" dengan bangga, menatap hangat ke kamera seolah-olah memberikan rekomendasi tulus kepada seorang teman. Latar belakang ${background}. Aspect ratio 9:16. ${additionalBrief}. PENTING: Jaga konsistensi visual di semua adegan. Jangan sertakan teks, kata, huruf, logo, atau watermark apa pun pada gambar.`,
        videoPromptSuggestion: (productName) => `Buat animasi model yang mengangguk sedikit dan memberikan senyum tulus, seolah-olah mengkonfirmasi rekomendasinya untuk "${productName}".`,
        requiredParts: ['product', 'model'],
      },
    ],
    scriptPrompt: (productName, additionalBrief) => `Buat naskah voice over bergaya storytelling yang personal dan menyentuh dalam Bahasa Indonesia, dengan "${productName}" sebagai bagian dari cerita.
      Struktur 4 adegan:
      - Scene 1 (Hook Cerita): Mulai dengan sebuah kalimat pembuka yang kuat dan membuat penasaran, yang langsung menarik perhatian penonton. Ini bisa berupa pertanyaan retoris atau pernyataan mengejutkan yang terkait dengan masalah personal.
      - Scene 2 (Penemuan): Deskripsikan bagaimana kamu menemukan "solusi" ini.
      - Scene 3 (Transformasi): Jelaskan bagaimana hidupmu berubah menjadi lebih baik.
      - Scene 4 (Ajakan): Ajak orang lain yang punya masalah sama untuk mencoba.
      Gaya bahasa: Tulus, personal, dan inspiratif.
      PENTING: Buat naskah untuk setiap adegan (scene1, scene2, scene3, scene4) sangat ringkas, idealnya dapat diucapkan dalam waktu sekitar 8 detik.
      ${additionalBrief ? `Instruksi tambahan: ${additionalBrief}` : ''}
      Return sebagai objek JSON valid dengan kunci: "scene1", "scene2", "scene3", "scene4".`
  }
];