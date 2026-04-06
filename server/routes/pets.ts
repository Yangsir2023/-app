import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/pets — 获取宠物列表，支持按分类筛选和搜索
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;

    let query = supabase
      .from('pets')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category as string);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%`);
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('获取宠物列表失败:', error);
      return res.status(500).json({ error: '获取宠物列表失败', details: error.message });
    }

    // 将数据库扁平字段转换为前端期望的嵌套格式
    const pets = (data || []).map(transformPet);
    return res.json(pets);
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/pets/:id — 获取单只宠物详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '宠物不存在' });
      }
      return res.status(500).json({ error: '获取宠物详情失败', details: error.message });
    }

    return res.json(transformPet(data));
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

/**
 * 将数据库行格式转换为前端 Pet 接口格式
 */
function transformPet(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed,
    age: row.age,
    gender: row.gender,
    weight: row.weight,
    distance: row.distance,
    image: row.image,
    images: row.images || [],
    tags: row.tags || [],
    health: {
      vaccination: row.health_vaccination,
      sterilization: row.health_sterilization,
      deworming: row.health_deworming,
      description: row.health_description,
    },
    story: row.story,
    category: row.category,
    isFavorite: false, // 由前端根据收藏状态动态设置
    created_at: row.created_at,
  };
}

export default router;
