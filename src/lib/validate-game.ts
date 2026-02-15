// =============================================================================
// ゲームデータバリデーション
// 他セッションから追加されたゲームデータの整合性を検証する
// =============================================================================

import type { GameWithTemplate, SubjectCategory, GameTemplateType } from '@/types';

/** バリデーションエラー */
export interface ValidationError {
  field: string;
  message: string;
}

const VALID_CATEGORIES: SubjectCategory[] = ['理科', '社会', '算数', '美術'];
const VALID_TEMPLATE_TYPES: GameTemplateType[] = ['quiz', 'card', 'maze', 'simulation', 'puzzle', 'iframe'];

/**
 * GameWithTemplate データを検証する。
 * エラーがあれば配列で返し、問題なければ空配列を返す。
 */
export function validateGame(game: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!game || typeof game !== 'object') {
    errors.push({ field: 'root', message: 'ゲームデータがオブジェクトではありません' });
    return errors;
  }

  const g = game as Record<string, unknown>;

  // --- 必須フィールド ---
  if (!g.id || typeof g.id !== 'string') {
    errors.push({ field: 'id', message: 'id は必須の文字列です（例: "climate-card-01"）' });
  } else if (!/^[a-z0-9-]+$/.test(g.id)) {
    errors.push({ field: 'id', message: 'id は英小文字・数字・ハイフンのみ使用できます' });
  }

  if (!g.title || typeof g.title !== 'string') {
    errors.push({ field: 'title', message: 'title は必須の文字列です' });
  }

  if (!VALID_CATEGORIES.includes(g.category as SubjectCategory)) {
    errors.push({ field: 'category', message: `category は ${VALID_CATEGORIES.join(', ')} のいずれかです` });
  }

  if (typeof g.grade_min !== 'number' || g.grade_min < 1 || g.grade_min > 12) {
    errors.push({ field: 'grade_min', message: 'grade_min は 1〜12 の数値です（1=小1, 7=中1, 10=高1）' });
  }

  if (typeof g.grade_max !== 'number' || g.grade_max < 1 || g.grade_max > 12) {
    errors.push({ field: 'grade_max', message: 'grade_max は 1〜12 の数値です（6=小6, 9=中3, 12=高3）' });
  }

  if (typeof g.grade_min === 'number' && typeof g.grade_max === 'number' && g.grade_min > g.grade_max) {
    errors.push({ field: 'grade_min/grade_max', message: 'grade_min は grade_max 以下である必要があります' });
  }

  // --- skill_tags ---
  if (!g.skill_tags || typeof g.skill_tags !== 'object') {
    errors.push({ field: 'skill_tags', message: 'skill_tags は { 思考力, 探究力, 創造力 } のオブジェクトです' });
  } else {
    const st = g.skill_tags as Record<string, unknown>;
    for (const key of ['思考力', '探究力', '創造力']) {
      if (typeof st[key] !== 'number' || (st[key] as number) < 1 || (st[key] as number) > 5) {
        errors.push({ field: `skill_tags.${key}`, message: `${key} は 1〜5 の数値です` });
      }
    }
  }

  if (typeof g.description !== 'string') {
    errors.push({ field: 'description', message: 'description は必須の文字列です' });
  }

  // --- score_display_config ---
  if (!g.score_display_config || typeof g.score_display_config !== 'object') {
    errors.push({ field: 'score_display_config', message: 'score_display_config は必須です' });
  } else {
    const sdc = g.score_display_config as Record<string, unknown>;
    if (!['rank', 'points', 'stars', 'title'].includes(sdc.type as string)) {
      errors.push({ field: 'score_display_config.type', message: 'type は rank, points, stars, title のいずれかです' });
    }
    if (!Array.isArray(sdc.rules) || sdc.rules.length === 0) {
      errors.push({ field: 'score_display_config.rules', message: 'rules は1つ以上のルール配列です' });
    }
  }

  // --- template ---
  if (!g.template || typeof g.template !== 'object') {
    errors.push({ field: 'template', message: 'template は必須です' });
  } else {
    const t = g.template as Record<string, unknown>;
    if (!VALID_TEMPLATE_TYPES.includes(t.type as GameTemplateType)) {
      errors.push({ field: 'template.type', message: `template.type は ${VALID_TEMPLATE_TYPES.join(', ')} のいずれかです` });
    } else {
      errors.push(...validateTemplate(t));
    }
  }

  return errors;
}

/** テンプレート固有のバリデーション */
function validateTemplate(t: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (t.type) {
    case 'quiz': {
      if (!Array.isArray(t.questions) || t.questions.length === 0) {
        errors.push({ field: 'template.questions', message: 'quiz には1問以上の questions が必要です' });
      } else {
        (t.questions as Record<string, unknown>[]).forEach((q, i) => {
          if (typeof q.question !== 'string') {
            errors.push({ field: `template.questions[${i}].question`, message: '問題文は文字列です' });
          }
          if (!Array.isArray(q.choices) || q.choices.length < 2) {
            errors.push({ field: `template.questions[${i}].choices`, message: '選択肢は2つ以上必要です' });
          }
          if (typeof q.correct_answer_index !== 'number') {
            errors.push({ field: `template.questions[${i}].correct_answer_index`, message: '正解インデックスは数値です' });
          }
        });
      }
      break;
    }
    case 'card': {
      if (!Array.isArray(t.cards) || t.cards.length === 0) {
        errors.push({ field: 'template.cards', message: 'card には1枚以上の cards が必要です' });
      }
      if (typeof t.pairs !== 'number' || t.pairs < 1) {
        errors.push({ field: 'template.pairs', message: 'pairs は1以上の数値です' });
      }
      break;
    }
    case 'maze': {
      if (typeof t.width !== 'number' || typeof t.height !== 'number') {
        errors.push({ field: 'template.width/height', message: 'width と height は数値です' });
      }
      if (!t.start || typeof t.start !== 'object') {
        errors.push({ field: 'template.start', message: 'start は { x, y } のオブジェクトです' });
      }
      if (!t.goal || typeof t.goal !== 'object') {
        errors.push({ field: 'template.goal', message: 'goal は { x, y } のオブジェクトです' });
      }
      break;
    }
    case 'simulation': {
      if (typeof t.scenario !== 'string') {
        errors.push({ field: 'template.scenario', message: 'scenario は文字列です' });
      }
      if (!t.initial_params || typeof t.initial_params !== 'object') {
        errors.push({ field: 'template.initial_params', message: 'initial_params はオブジェクトです' });
      }
      if (typeof t.max_steps !== 'number' || t.max_steps < 1) {
        errors.push({ field: 'template.max_steps', message: 'max_steps は1以上の数値です' });
      }
      break;
    }
    case 'puzzle': {
      if (typeof t.puzzle_type !== 'string') {
        errors.push({ field: 'template.puzzle_type', message: 'puzzle_type は文字列です' });
      }
      if (!Array.isArray(t.solution) || t.solution.length === 0) {
        errors.push({ field: 'template.solution', message: 'solution は1つ以上の要素を持つ配列です' });
      }
      break;
    }
    case 'iframe': {
      if (typeof t.url !== 'string' || t.url.length === 0) {
        errors.push({ field: 'template.url', message: 'url は必須の文字列です（ゲームのURL）' });
      }
      if (t.params !== undefined && (typeof t.params !== 'object' || Array.isArray(t.params))) {
        errors.push({ field: 'template.params', message: 'params はオブジェクトです（任意）' });
      }
      if (t.sandbox !== undefined && typeof t.sandbox !== 'string') {
        errors.push({ field: 'template.sandbox', message: 'sandbox は文字列です（任意）' });
      }
      break;
    }
  }

  return errors;
}

/**
 * バリデーションを通過したゲームとして型安全にキャストする。
 * validateGame() でエラーが無い場合にのみ使用する。
 */
export function asValidGame(game: unknown): GameWithTemplate {
  const errors = validateGame(game);
  if (errors.length > 0) {
    const msgs = errors.map((e) => `  [${e.field}] ${e.message}`).join('\n');
    throw new Error(`ゲームデータの検証に失敗しました:\n${msgs}`);
  }
  return game as GameWithTemplate;
}
