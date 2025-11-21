import type { TNode, TText } from "platejs";

/**
 * Mock data for Plate editor
 * Contains sample novel content with various formatting
 */

// Simple comment with basic formatting
export const mockComment1: TNode[] = [
  {
    id: "1",
    type: "p",
    children: [
      { text: "Đây là một comment " },
      { text: "rất hay", bold: true },
      { text: " về chapter này!" },
    ],
  },
];

// Comment with multiple formats
export const mockComment2: TNode[] = [
  {
    id: "1",
    type: "p",
    children: [
      { text: "Tôi thích cách tác giả " },
      { text: "miêu tả", italic: true },
      { text: " nhân vật chính. Đặc biệt là phân " },
      { text: "chiến đấu", bold: true, underline: true },
      { text: " rất " },
      { text: "sống động", italic: true },
      { text: "!" },
    ],
  },
];

// Simple novel chapter
export const mockNovelSimple: TNode[] = [
  {
    id: "1",
    type: "h1",
    children: [{ text: "Chương 1: Khởi Đầu" }],
  },
  {
    id: "2",
    type: "p",
    children: [
      { text: "Buổi sáng hôm ấy, " },
      { text: "Minh", bold: true },
      { text: " thức dậy với cảm giác khác thường." },
    ],
  },
  {
    id: "3",
    type: "p",
    children: [
      { text: "Anh nhìn qua cửa sổ, ánh nắng vàng rực rỡ chiếu vào phòng." },
    ],
  },
];

// Novel with rich formatting
export const mockNovelRich: TNode[] = [
  {
    id: "1",
    type: "h1",
    children: [{ text: "Phần I: Thế Giới Khác" }],
  },
  {
    id: "2",
    type: "h2",
    children: [{ text: "Chương 1: Triệu Hồi" }],
  },
  {
    id: "3",
    type: "p",
    children: [
      { text: '"Đây là đâu...?"', italic: true },
      { text: " Linh thì thầm, giọng đầy hoang mang." },
    ],
  },
  {
    id: "4",
    type: "p",
    children: [
      { text: "Xung quanh cô là một khu rừng rậm rạp, ánh sáng " },
      { text: "xanh lam kỳ lạ", bold: true },
      { text: " tỏa ra từ những cây cỏ thần." },
    ],
  },
  {
    id: "5",
    type: "p",
    children: [{ text: "Cô cố gắng nhớ lại những gì đã xảy ra:" }],
  },
  {
    id: "6",
    type: "p",
    children: [
      { text: '" Vòng tròn pháp thuật xuất hiện trong phòng', italic: true },
    ],
  },
  {
    id: "7",
    type: "p",
    children: [{ text: '" Ánh sáng chói lòa', italic: true }],
  },
  {
    id: "8",
    type: "p",
    children: [{ text: '" Cảm giác rơi tự do', italic: true }],
  },
  {
    id: "9",
    type: "p",
    children: [
      { text: '"Ngươi chính là ' },
      { text: "Dũng Sĩ", bold: true },
      { text: ' được triệu hồi?" Một giọng nói vang lên từ phía sau.' },
    ],
  },
  {
    id: "10",
    type: "h3",
    children: [{ text: "Cuộc Gặp Gỡ Đầu Tiên" }],
  },
  {
    id: "11",
    type: "p",
    children: [
      {
        text: "Linh quay lại và bắt gặp một người đàn ông cao lớn, mặc áo giáp bạc sáng loáng.",
      },
    ],
  },
  {
    id: "12",
    type: "p",
    children: [
      { text: '"Ta là ' },
      { text: "Kỵ Sĩ Alaric", bold: true },
      { text: ", được phái đến để " },
      { text: "hộ tống", underline: true },
      { text: ' ngươi về thành." Anh ta cúi đầu chào.' },
    ],
  },
];

// Long novel content with multiple chapters
export const mockNovelLong: TNode[] = [
  {
    id: "1",
    type: "h1",
    children: [{ text: "Thiên Hạ Đệ Nhất Kiếm" }],
  },
  {
    id: "2",
    type: "h2",
    children: [{ text: "Chương 15: Quyết Chiến" }],
  },
  {
    id: "3",
    type: "p",
    children: [{ text: "Không khí ngột ngạt bao trùm võ đài." }],
  },
  {
    id: "4",
    type: "p",
    children: [
      { text: "Hai kiếm khách đối diện nhau, ánh mắt sắc lạnh như băng. " },
      { text: "Trương Vô Kỵ", bold: true },
      { text: " cầm thanh " },
      { text: "Đoạn Tâm Kiếm", italic: true },
      { text: ", trong khi " },
      { text: "Lâm Thiên Hạ", bold: true },
      { text: " nắm chặt " },
      { text: "Thiên Ma Đao", italic: true },
      { text: "." },
    ],
  },
  {
    id: "5",
    type: "h3",
    children: [{ text: "Chiêu Thức Đầu Tiên" }],
  },
  {
    id: "6",
    type: "p",
    children: [
      { text: '"' },
      { text: "Kiếm Khí Tung Hoành!", bold: true, italic: true },
      { text: '"' },
    ],
  },
  {
    id: "7",
    type: "p",
    children: [
      {
        text: "Trương Vô Kỵ vung kiếm, một đạo kiếm quang xanh ngắt lao tới với tốc độ kinh người.",
      },
    ],
  },
  {
    id: "8",
    type: "p",
    children: [
      { text: "Lâm Thiên Hạ không hề nao núng, hắn xoay người, đao quang " },
      { text: "đen như mực", bold: true },
      { text: " chém ngang." },
    ],
  },
  {
    id: "9",
    type: "p",
    children: [{ text: "KHANH!" }],
  },
  {
    id: "10",
    type: "p",
    children: [
      {
        text: "Kim khí va chạm tạo ra tia lửa rực rỡ. Cả hai đều bị hất lui vài bước.",
      },
    ],
  },
  {
    id: "11",
    type: "p",
    children: [
      {
        text: '"Thú vị... Ta đã lâu không gặp đối thủ xứng tầm." Lâm Thiên Hạ mỉm cười, ánh mắt bỗng sáng.',
      },
    ],
  },
  {
    id: "12",
    type: "h3",
    children: [{ text: "Tuyệt Học Xuất Chiêu" }],
  },
  {
    id: "13",
    type: "p",
    children: [
      {
        text: "Trương Vô Kỵ thở ra một hơi dài, nội lực bắt đầu vận chuyển khắp kinh mạch.",
      },
    ],
  },
  {
    id: "14",
    type: "p",
    children: [
      { text: "Hắn biết rằng, để đánh bại " },
      { text: "Ma Đạo Tông Sư", underline: true },
      { text: " này, hắn phải dùng đến " },
      { text: "Cửu Thiên Kiếm Pháp", bold: true, italic: true },
      { text: " - tuyệt học truyền thừa của " },
      { text: "Kiếm Thánh", italic: true },
      { text: " đời trước." },
    ],
  },
  {
    id: "15",
    type: "p",
    children: [{ text: '"Lâm Thiên Hạ, đón chiêu này!"' }],
  },
  {
    id: "16",
    type: "p",
    children: [
      {
        text: "Không khí xung quanh như đông băng. Từng tia kiếm khí bay ra từ thân kiếm, tạo thành ",
      },
      { text: "chín con rồng kiếm khí", bold: true },
      { text: " xoắn vặn trong không trung." },
    ],
  },
  {
    id: "17",
    type: "p",
    children: [
      {
        text: "Lâm Thiên Hạ nheo mắt, hắn cảm nhận được sức mạnh kinh hoàng từ chiêu thức này.",
      },
    ],
  },
  {
    id: "18",
    type: "p",
    children: [
      {
        text: '"Tốt! Ta cũng sẽ không giấu tay!" Hắn gầm lên, toàn thân phát ra ',
      },
      { text: "hào quang đen tuyền", bold: true },
      { text: "." },
    ],
  },
];

// Empty novel template
export const mockNovelEmpty: TNode[] = [
  {
    id: "1",
    type: "h1",
    children: [{ text: "" }],
  },
  {
    id: "2",
    type: "p",
    children: [{ text: "" }],
  },
];

// Novel with dialogue heavy content
export const mockNovelDialogue: TNode[] = [
  {
    id: "1",
    type: "h2",
    children: [{ text: "Chương 7: Cuộc Đối Thoại" }],
  },
  {
    id: "2",
    type: "p",
    children: [
      {
        text: '"Sư phụ, tại sao chúng ta phải rời khỏi sơn môn?" An Nhiên hỏi.',
      },
    ],
  },
  {
    id: "3",
    type: "p",
    children: [
      { text: "Lão nhân mặc áo trắng ngừng bước, quay lại nhìn đệ tử." },
    ],
  },
  {
    id: "4",
    type: "p",
    children: [
      { text: '"Vì ' },
      { text: "thiên hạ đại loạn", bold: true },
      {
        text: ' sắp bắt đầu. Ta không thể để ngươi yên ổn tu luyện mãi trong núi."',
      },
    ],
  },
  {
    id: "5",
    type: "p",
    children: [{ text: '"Nhưng đệ tử vô cùng còn yếu..."' }],
  },
  {
    id: "6",
    type: "p",
    children: [
      { text: '"' },
      { text: "Võ công", italic: true },
      { text: " có thể luyện thêm, nhưng " },
      { text: "tâm trí", italic: true },
      { text: " phải trải nghiệm môi trường thành. Ngươi đã tu luyện " },
      { text: "mười năm", underline: true },
      { text: ' ở đây, đã đến lúc xuống núi rồi."' },
    ],
  },
  {
    id: "7",
    type: "p",
    children: [{ text: "An Nhiên im lặng, rồi cúi đầu." }],
  },
  {
    id: "8",
    type: "p",
    children: [{ text: '"Đệ tử hiểu rõ rồi. Xin sư phụ chỉ giáo!"' }],
  },
];

/**
 * All mock editor content
 */
export const mockEditorContent = {
  comments: {
    simple: mockComment1,
    formatted: mockComment2,
  },
  novels: {
    simple: mockNovelSimple,
    rich: mockNovelRich,
    long: mockNovelLong,
    dialogue: mockNovelDialogue,
    empty: mockNovelEmpty,
  },
};

/**
 * Helper function to get random mock content
 */
export function getRandomNovelContent(): TNode[] {
  const novels = [
    mockNovelSimple,
    mockNovelRich,
    mockNovelLong,
    mockNovelDialogue,
  ];
  return novels[Math.floor(Math.random() * novels.length)];
}

// --- Dữ liệu Mock cơ bản (Keywords) ---
const NOUNS = [
  "Minh",
  "Linh",
  "Kiếm Sĩ",
  "Pháp Sư",
  "Hệ thống",
  "Làng Lá",
  "Thánh Kiếm",
  "Ánh Sáng",
];
const VERBS = [
  "chiến đấu",
  "khám phá",
  "triệu hồi",
  "chạy trốn",
  "tỉnh dậy",
  "ngồi thiền",
];
const ADJECTIVES = [
  "huy hoàng",
  "bí ẩn",
  "mạnh mẽ",
  "đáng sợ",
  "rực rỡ",
  "vô tận",
];

/**
 * Hàm tạo ID ngẫu nhiên đơn giản
 */
const generateId = (): string => Math.random().toString(36).substring(2, 9);

/**
 * Hàm chọn ngẫu nhiên một phần tử từ mảng
 */
const randomPick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Hàm tạo câu văn ngẫu nhiên với định dạng bold, gộp khoảng trắng vào từ
 * @param minWords Số từ tối thiểu
 * @param maxWords Số từ tối đa
 */
const generateRandomSentence = (
  minWords: number,
  maxWords: number
): TText[] => {
  const numWords =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let rawSentence = "";

  // Tạo câu văn thô
  for (let i = 0; i < numWords; i++) {
    const word = randomPick(
      i % 3 === 0 ? NOUNS : i % 3 === 1 ? VERBS : ADJECTIVES
    );
    rawSentence += word + " ";
  }

  // Xử lý cuối câu (loại bỏ khoảng trắng cuối, thêm dấu chấm)
  rawSentence = rawSentence.trim() + ".";
  // Viết hoa chữ cái đầu câu
  rawSentence = rawSentence.charAt(0).toUpperCase() + rawSentence.slice(1);

  const sentenceParts: TText[] = [];
  const words = rawSentence.split(" ");

  words.forEach((word, index) => {
    // Nếu là từ cuối cùng (có dấu chấm)
    if (index === words.length - 1) {
      // Random bold từ cuối
      if (Math.random() < 0.15) {
        sentenceParts.push({ text: word, bold: true });
      } else {
        sentenceParts.push({ text: word });
      }
    } else {
      // Gộp khoảng trắng vào cuối từ
      const wordWithSpace = word + " ";

      // Random bold từ
      if (Math.random() < 0.15) {
        sentenceParts.push({ text: wordWithSpace, bold: true });
      } else {
        sentenceParts.push({ text: wordWithSpace });
      }
    }
  });

  return sentenceParts;
};

/**
 * Hàm chính để tạo dữ liệu mock TNode[] ngẫu nhiên chỉ với type: "p"
 * @param numNodes Số lượng node (đoạn văn) muốn tạo
 */
export const generateMockParagraphs = (numNodes: number = 10): TNode[] => {
  const mockData: TNode[] = [];

  for (let i = 0; i < numNodes; i++) {
    const id = generateId();
    const children = generateRandomSentence(10, 30); // 10-30 từ

    mockData.push({
      id: id,
      type: "p",
      children: children,
    });
  }

  return mockData;
};
