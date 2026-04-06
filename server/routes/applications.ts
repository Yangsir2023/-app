import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

// GET /api/applications?session=xxx — 根据会话ID获取用户申请列表
router.get('/', async (req: Request, res: Response) => {
  try {
    const { session } = req.query;

    if (!session) {
      return res.status(400).json({ error: '缺少 session 参数' });
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .eq('user_session', session as string)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取申请列表失败:', error);
      return res.status(500).json({ error: '获取申请列表失败', details: error.message });
    }

    // 转换为前端期望的 Application 格式
    const applications = (data || []).map((row) => ({
      id: row.id,
      petName: row.pet_name,
      petImage: row.pet_image,
      breed: row.breed,
      age: row.age,
      location: row.location,
      status: row.status,
      progress: row.progress,
      created_at: row.created_at,
    }));

    return res.json(applications);
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/applications — 提交领养申请
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      petId,
      petName,
      petImage,
      breed,
      age,
      applicantName,
      phone,
      address,
      housingType,
      experience,
      userSession,
    } = req.body;

    // 参数校验
    if (!petId || !petName || !applicantName || !phone || !address || !housingType || !userSession) {
      return res.status(400).json({ error: '缺少必要参数，请检查提交的数据' });
    }

    // 检查是否已经申请过该宠物
    const { data: existing } = await supabase
      .from('adoption_applications')
      .select('id')
      .eq('pet_id', petId)
      .eq('user_session', userSession)
      .single();

    if (existing) {
      return res.status(409).json({ error: '您已经申请过领养这只宠物，请勿重复提交' });
    }

    const { data, error } = await supabase
      .from('adoption_applications')
      .insert({
        pet_id: petId,
        pet_name: petName,
        pet_image: petImage,
        breed,
        age,
        applicant_name: applicantName,
        phone,
        address,
        housing_type: housingType,
        experience: experience || '',
        status: 'pending',
        progress: 33,
        user_session: userSession,
        location: '上海',
      })
      .select()
      .single();

    if (error) {
      console.error('提交申请失败:', error);
      return res.status(500).json({ error: '提交申请失败', details: error.message });
    }

    return res.status(201).json({
      success: true,
      message: '申请提交成功！我们将在3个工作日内与您联系。',
      application: {
        id: data.id,
        petName: data.pet_name,
        status: data.status,
        progress: data.progress,
        created_at: data.created_at,
      },
    });
  } catch (err) {
    console.error('服务器错误:', err);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

export default router;
