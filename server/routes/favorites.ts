import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/favorites?session=xxx — 获取用户收藏的宠物ID列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const { session } = req.query;

    if (!session) {
      return res.status(400).json({ error: '缺少 session 参数' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id')
      .eq('user_session', session as string);

    if (error) {
      console.error('获取收藏列表失败:', error);
      return res.status(500).json({ error: '获取收藏列表失败', details: error.message });
    }

    const petIds = (data || []).map((row) => row.pet_id);
    return res.json(petIds);
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/favorites — 切换收藏状态（收藏/取消收藏）
router.post('/', async (req: Request, res: Response) => {
  try {
    const { petId, userSession } = req.body;

    if (!petId || !userSession) {
      return res.status(400).json({ error: '缺少 petId 或 userSession 参数' });
    }

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('pet_id', petId)
      .eq('user_session', userSession)
      .single();

    if (existing) {
      // 已收藏 → 取消收藏
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        return res.status(500).json({ error: '取消收藏失败', details: error.message });
      }
      return res.json({ favorited: false, message: '已取消收藏' });
    } else {
      // 未收藏 → 添加收藏
      const { error } = await supabase
        .from('favorites')
        .insert({ pet_id: petId, user_session: userSession });

      if (error) {
        return res.status(500).json({ error: '添加收藏失败', details: error.message });
      }
      return res.json({ favorited: true, message: '收藏成功' });
    }
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
