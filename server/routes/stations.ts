import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/stations — 获取救助站列表
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rescue_stations')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取救助站列表失败:', error);
      return res.status(500).json({ error: '获取救助站列表失败', details: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
