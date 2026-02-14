-- 探究教室 TRAIL Seed Data
-- 5 sample games (one per template_type) with realistic Japanese content

INSERT INTO games (id, title, category, grade_min, grade_max, skill_tags, description, thumbnail_url, template_type, game_config, score_display_config, is_published, play_count)
VALUES

-- 1. Quiz: 理科 (Science)
(
  'science-quiz-elements',
  '元素クイズ 〜物質の世界を探れ！〜',
  '理科',
  4, 9,
  '{"思考力":4,"探究力":3,"創造力":2}',
  '身の回りの物質や元素について学ぶクイズゲーム。水素・酸素・炭素など基本元素から化合物まで、楽しく知識を深めよう！',
  '/images/games/science-quiz-elements.webp',
  'quiz',
  '{
    "questions": [
      {
        "id": "q1",
        "text": "水の化学式はどれ？",
        "choices": ["CO2", "H2O", "NaCl", "O2"],
        "correct": 1,
        "explanation": "水は水素(H)2つと酸素(O)1つからできています。"
      },
      {
        "id": "q2",
        "text": "空気中にもっとも多くふくまれている気体は？",
        "choices": ["酸素", "二酸化炭素", "窒素", "水素"],
        "correct": 2,
        "explanation": "空気の約78%は窒素です。酸素は約21%です。"
      },
      {
        "id": "q3",
        "text": "鉄がさびるとき、鉄と結びつく元素は？",
        "choices": ["窒素", "水素", "炭素", "酸素"],
        "correct": 3,
        "explanation": "鉄は空気中の酸素と結びついて酸化鉄（さび）になります。"
      },
      {
        "id": "q4",
        "text": "食塩の主成分である塩化ナトリウムの化学式は？",
        "choices": ["NaCl", "KCl", "CaCO3", "MgO"],
        "correct": 0,
        "explanation": "食塩はナトリウム(Na)と塩素(Cl)の化合物です。"
      },
      {
        "id": "q5",
        "text": "光合成で植物が吸収する気体はどれ？",
        "choices": ["酸素", "窒素", "二酸化炭素", "水素"],
        "correct": 2,
        "explanation": "植物は二酸化炭素を吸収し、太陽光のエネルギーで糖を作ります。"
      }
    ],
    "timeLimit": 30,
    "pointsPerQuestion": 20
  }',
  '{"type":"points","label":"点","max":100,"icon":"star"}',
  true,
  342
),

-- 2. Card: 社会 (Social Studies)
(
  'social-card-prefectures',
  '都道府県カードマッチ 〜日本地図マスター〜',
  '社会',
  3, 6,
  '{"思考力":3,"探究力":4,"創造力":2}',
  '都道府県の形・県庁所在地・特産品をカードで覚えよう！神経衰弱形式で楽しみながら日本の地理を学べるゲームです。',
  '/images/games/social-card-prefectures.webp',
  'card',
  '{
    "pairs": [
      {"id":"p1","front":"北海道","back":"札幌市","hint":"日本で一番広い都道府県"},
      {"id":"p2","front":"青森県","back":"青森市","hint":"りんごの生産量日本一"},
      {"id":"p3","front":"東京都","back":"新宿区","hint":"日本の首都"},
      {"id":"p4","front":"大阪府","back":"大阪市","hint":"たこ焼きで有名"},
      {"id":"p5","front":"京都府","back":"京都市","hint":"千年の都"},
      {"id":"p6","front":"沖縄県","back":"那覇市","hint":"日本の最南端の県"},
      {"id":"p7","front":"愛知県","back":"名古屋市","hint":"自動車産業がさかん"},
      {"id":"p8","front":"福岡県","back":"福岡市","hint":"とんこつラーメン発祥の地"}
    ],
    "gridCols": 4,
    "matchMode": "prefecture_capital",
    "flipDuration": 800
  }',
  '{"type":"time","label":"秒","lowerIsBetter":true,"icon":"clock"}',
  true,
  567
),

-- 3. Maze: 算数 (Math)
(
  'math-maze-fractions',
  '分数めいろ 〜正しい答えを進め！〜',
  '算数',
  3, 6,
  '{"思考力":5,"探究力":3,"創造力":3}',
  '迷路の分かれ道で分数の計算問題に答えながらゴールを目指そう！正しい道を選ばないと行き止まりに。計算力と判断力が試されるゲーム。',
  '/images/games/math-maze-fractions.webp',
  'maze',
  '{
    "grid": {
      "rows": 8,
      "cols": 8,
      "start": [0, 0],
      "goal": [7, 7]
    },
    "checkpoints": [
      {
        "position": [2, 1],
        "question": "1/2 + 1/4 = ?",
        "answer": "3/4",
        "wrongPaths": ["1/6", "2/6"]
      },
      {
        "position": [4, 3],
        "question": "2/3 - 1/6 = ?",
        "answer": "1/2",
        "wrongPaths": ["1/3", "1/9"]
      },
      {
        "position": [6, 5],
        "question": "3/5 × 2 = ?",
        "answer": "6/5",
        "wrongPaths": ["3/10", "5/5"]
      }
    ],
    "theme": "forest",
    "characterSpeed": 2
  }',
  '{"type":"combo","fields":[{"key":"score","label":"点","max":100},{"key":"time","label":"秒","lowerIsBetter":true}],"icon":"map"}',
  true,
  218
),

-- 4. Simulation: 理科 (Science)
(
  'science-sim-ecosystem',
  '生態系シミュレーション 〜いきものたちのバランス〜',
  '理科',
  5, 9,
  '{"思考力":4,"探究力":5,"創造力":4}',
  '草・草食動物・肉食動物の数をバランスよく調整して生態系を維持しよう！生き物のつながりを体感できるシミュレーションゲーム。',
  '/images/games/science-sim-ecosystem.webp',
  'simulation',
  '{
    "entities": [
      {"type": "grass", "initialCount": 100, "growthRate": 1.05, "icon": "grass"},
      {"type": "rabbit", "initialCount": 30, "consumesPerTick": 3, "icon": "rabbit"},
      {"type": "fox", "initialCount": 5, "consumesPerTick": 1, "icon": "fox"}
    ],
    "maxTicks": 50,
    "targetEquilibrium": {
      "grass": [60, 140],
      "rabbit": [15, 45],
      "fox": [3, 10]
    },
    "playerControls": ["addEntity", "removeEntity", "adjustGrowth"],
    "scoringMethod": "equilibrium_maintained_ticks"
  }',
  '{"type":"gauge","label":"バランス度","max":100,"unit":"%","thresholds":{"low":30,"mid":60,"high":85},"icon":"leaf"}',
  true,
  156
),

-- 5. Puzzle: 美術 (Art)
(
  'art-puzzle-ukiyoe',
  '浮世絵パズル 〜名画をつなげよう〜',
  '美術',
  1, 12,
  '{"思考力":3,"探究力":2,"創造力":5}',
  '葛飾北斎や歌川広重の名作浮世絵をジグソーパズルで楽しもう！完成するたびに作品の解説が読める、美術と歴史を学べるゲーム。',
  '/images/games/art-puzzle-ukiyoe.webp',
  'puzzle',
  '{
    "puzzles": [
      {
        "id": "ukiyoe1",
        "title": "富嶽三十六景 神奈川沖浪裏",
        "artist": "葛飾北斎",
        "year": 1831,
        "imageUrl": "/images/puzzles/great-wave.webp",
        "pieces": 16,
        "difficulty": 1,
        "trivia": "世界でもっとも有名な日本美術作品のひとつ。大きな波と富士山が描かれています。"
      },
      {
        "id": "ukiyoe2",
        "title": "東海道五十三次 日本橋",
        "artist": "歌川広重",
        "year": 1833,
        "imageUrl": "/images/puzzles/nihonbashi.webp",
        "pieces": 25,
        "difficulty": 2,
        "trivia": "東海道の起点である日本橋の朝の風景。大名行列が橋を渡る様子が描かれています。"
      },
      {
        "id": "ukiyoe3",
        "title": "見返り美人図",
        "artist": "菱川師宣",
        "year": 1694,
        "imageUrl": "/images/puzzles/mikaeri-bijin.webp",
        "pieces": 36,
        "difficulty": 3,
        "trivia": "振り返る女性の姿を描いた浮世絵の名作。切手のデザインにもなりました。"
      }
    ],
    "snapThreshold": 20,
    "rotationEnabled": false,
    "hintAvailable": true
  }',
  '{"type":"stars","label":"評価","max":3,"criteria":{"1":"完成","2":"ヒントなしで完成","3":"制限時間内にヒントなしで完成"},"icon":"puzzle"}',
  true,
  489
);
