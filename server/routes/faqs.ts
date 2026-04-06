import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/faqs — 获取常见问题列表
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('获取 FAQ 失败:', error);
      return res.status(500).json({ error: '获取 FAQ 失败', details: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
