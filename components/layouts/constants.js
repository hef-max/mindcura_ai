export const MENU_LIST = [
    {
        name: 'Beranda',
        path: '/dashboard'
    },
    {
        name: 'Jadwal',
        path: '/schedule'
    },
    {
        name: 'Riwayat',
        path: '/activity'
    },
    {
        name: 'Tentang',
        path: '/about'
    },
    {
        name: 'Edukasi',
        path: '/edukasi'
    }
]

export const THERAPIST_LIST = [
    {
        image: "/images/therapist/therapist1.jpg",
        name: "I PUTU ANDIKA SANJAYA S.Psi, M.Psi, Psikolog",
        whatsapp: "+6285700027104",
        specialization: "Psikolog Klinis",
        location: "Sleman, Yogyakarta",
    },
    {
        image: "/images/therapist/therapist2.PNG",
        name: "HARISMA FAKHRUN NISA S.Psi, M.Psi, Psikolog",
        whatsapp: "+6281575628871",
        specialization: "Psikolog Klinis",
        location: "Sleman, Yogyakarta",
    },
    {
        image: "/icons/user.png",
        name: "AYU REZKI UTARI S.Psi, M.Psi, Psikolog",
        whatsapp: "+628995110181",
        specialization: "Psikolog Klinis",
        location: "Sleman, Yogyakarta",
    },
];

export const SCHEDULE_LIST = [
    {
        status: 'danger',
        imageUrl: "/images/Ellipse 4.png",
        scheduleTitle: 'Kelola Stres    ',
        time: "10:00 pm - 12:00 pm"
    },
]
 
export const MOODS_STATS_PER_WEEK = [
    {
      "name": "Mon",
      "moodlvl" : 0,
    },
    {
      "name": "Tue",
      "moodlvl" : 0,
    },
    {
      "name": "Wed",
      "moodlvl" : 0,
    },
    {
      "name": "Thu",
      "moodlvl" : 0,
    },
    {
      "name": "Fri",
      "moodlvl" : 0,
    },
    {
      "name": "Sat",
      "moodlvl" : 0,
    },
    {
      "name": "Sun",
      "moodlvl" : 0,
    }
]

export const NEWS_LIST = [
  {
      id: '1',
      title: 'Apa itu kesehatan mental?',
      date: '8 Juli 2024',
      image: '/images/Mental-Health.jpg',
      category: 'Kesehatan Mental',
      link: 'https://www.halodoc.com/kesehatan/kesehatan-mental',
      content: 'Kesehatan mental adalah kondisi kesejahteraan emosional, psikologis, dan sosial seseorang. Kesehatan mental memengaruhi cara kita berpikir, merasakan, dan bertindak dalam menghadapi kehidupan. Kesehatan mental juga menentukan bagaimana kita menangani stres, berhubungan dengan orang lain, dan membuat keputusan. Kesehatan mental adalah bagian penting dari setiap tahap kehidupan, dari masa kanak-kanak dan remaja hingga dewasa.',
  },
  {
      id: '2',
      title: 'Mengenal Stress',
      date: '9 Juli 2024',
      image: '/images/Student-Stress.jpg',
      category: 'Stress',
      link: 'https://www.alodokter.com/ternyata-tidak-sulit-mengatasi-stres',
      content: 'Stres adalah reaksi tubuh terhadap situasi yang dianggap mengancam atau menantang. Setiap orang pasti pernah mengalami stres dalam hidupnya. Stres bisa berasal dari berbagai sumber, seperti pekerjaan, masalah pribadi, hubungan sosial, atau perubahan besar dalam hidup.',
  },
  {
    id: '3',
    title: 'Pengaruh Lingkungan Pertemanan Terhadap Kesehatan Mental',
    date: '10 Juli 2024',
    image: '/images/Gambar (27).png',
    category: 'Stress',
    link: 'https://m.kumparan.com/amp/minamisalwapramesti22/peran-teman-dan-circle-pertemanan-terhadap-kesehatan-mental-1zQqOUjY9st',
    content: 'Lingkungan pertemanan memiliki peran yang signifikan dalam membentuk kesehatan mental seseorang. Pertemanan yang sehat dan positif dapat memberikan dukungan emosional, meningkatkan rasa percaya diri, dan membantu seseorang menghadapi berbagai tantangan hidup. Sebaliknya, lingkungan pertemanan yang negatif dapat meningkatkan risiko masalah kesehatan mental seperti kecemasan, depresi, dan stres.',
  },
  {
    id: '4',
    title: 'Perbedaan Psikologis dan Psikiatri',
    date: '9 Juli 2024',
    image: '/images/Psikolog-vs-Psikiater.jpg',
    category: 'Stress',
    link: 'https://www.halodoc.com/artikel/ini-perbedaan-psikiater-dan-psikolog-dalam-mengatasi-gangguan-mental',
    content: 'Psikolog dan psikiater adalah dua profesional yang bekerja di bidang kesehatan mental, namun mereka memiliki peran, pendidikan, dan metode kerja yang berbeda.',
  }
]

export const MOODS_LIST = [
    {
        name: "angry",
    },
    {
        name: "sad",
    },
    {
        name: "neutral",
    },
    {
        name: "happy",
    },
    {
        name: "excited",
    },
]

export const DAILY_ACTIVITY_LIST = [
  {
      title: "Berolahraga",
      subtitle: "Aktivitas fisik seperti menari, mendaki, yoga, atau berjalan dapat meningkatkan suasana hati melalui produksi endorfin. Pilih aktivitas yang Anda nikmati untuk kesenangan maksimal.",
      imageUrl: "/images/img_daily_1.png",
      status: "ongoing"
  },
  {
      title: "Aktivitas kreatif",
      subtitle: "Melukis, menggambar, menulis, atau bermain musik bisa menjadi terapi untuk mengekspresikan emosi dan memberikan kepuasan.",
      imageUrl: "/images/creative.jpg",
      status: "ongoing"
  },
  {
    title: "Tidur yang cukup",
    subtitle: "Tidur 7-8 jam setiap malam sangat penting untuk kesehatan mental dan fisik.",
    imageUrl: "/images/sleep.jpg",
    status: "ongoing"
  },
  {
    title: "Pola makan yang sehat",
    subtitle: "Konsumsi makanan bergizi dan seimbang dapat membantu dan menjaga energi dan suasana hati yang stabil",
    imageUrl: "/images/eating.png",
    status: "ongoing"
  },
  {
    title: "Menghabiskan waktu di alam",
    subtitle: "Berada di luar ruangan, seperti piknik, berkebun, atau mengamati burung, dapat meningkatkan suasana hati dan mengurangi stres, kecemasan, serta depresi.",
    imageUrl: "/images/farming.jpg",
    status: "ongoing"
  },
  {
    title: "Meditasi atau perhatian penuh",
    subtitle: "Meditasi harian membantu kesadaran akan masa kini dan mengatasi gejala depresi.",
    imageUrl: "/images/meditation.jpg",
    status: "ongoing"
  },
  // {
    // title: "Bersosialisasi dengan teman atau keluarga",
    // subtitle: "Menghabiskan waktu dengan teman, baik secara langsung atau virtual, dapat meningkatkan suasana hati.",
    // imageUrl: "/images/sosial.jpg",
    // status: "ongoing"
  // },
  {
    title: "Menjadi relawan",
    subtitle: "Membantu orang lain dapat meningkatkan suasana hati dan menghubungkan Anda secara sosial, mencegah isolasi, dan memberikan rasa puas.",
    imageUrl: "/images/volunteer.jpg",
    status: "ongoing"
  },
  {
    title: "Mempelajari sesuatu yang baru",
    subtitle: "Belajar bahasa, keterampilan, atau olahraga baru bisa menyenangkan dan memberikan rasa pencapaian.",
    imageUrl: "/images/learn-1.jpg",
    status: "ongoing"
  }
]

export const WHY_LIST = [
    {
        image: "/icons/Icon_atas.png",
        title: "Satu langkah awal untuk memahami kondisi mental Anda",
        description: "Penjelasan mengenai pentingnya memahami kondisi mental.",
    },
    {
        image: "/icons/Icon_tengah.png",
        title: "Mendapatkan rujukan untuk terapi yang sesuai",
        description: "Penjelasan mengenai rujukan terapi yang sesuai.",
    },
    {
        image: "/icons/Icon_bawah.png",
        title: "Pentingnya dukungan dan pendampingan",
        description: "Penjelasan mengenai pentingnya dukungan.",
    },
];


export const MOOD_OF_ALL_TIME = [
    {
      "mood": "3",
      "date": "22-06-2023"
    },
    {
      "mood": "0",
      "date": "22-06-2024"
    },
    {
      "mood": "3",
      "date": "22-06-2023"
    },
    {
      "mood": "0",
      "date": "22-06-2024"
    },
    {
      "mood": "3",
      "date": "22-06-2023"
    }
]

export const TYPE_OF_SCALE_CHART = [
    {
        value: "weekly",
        label: "Weekly"
    },
    {
        value: "monthly",
        label: "Monthly"
    },
    {
        value: "yearly",
        label: "Yearly"
    },
    {
        value: "all time",
        label: "All Time"
    },
]

export const CONSULTAN_HISTORY = [
  {
      name: "Frieren",
      ava:"/icons/user.png",
      date: "2 Juni 2024",
      resdass: "Stress = 12 | Anxiety = 20 | Depression = 8",
      resdsm: "Kecenderungan Stress Ringan dan Anxiety Tinggi",
      chathistory: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }
]

