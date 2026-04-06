import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import petsRouter from './routes/pets.js';
import stationsRouter from './routes/stations.js';
import faqsRouter from './routes/faqs.js';
import applicationsRouter from './routes/applications.js';
import favoritesRouter from './routes/favorites.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// =====================================================================
// 中间件
// =====================================================================
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================================================================
// API 路由注册
// =====================================================================
app.use('/api/pets', petsRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/favorites', favoritesRouter);

// 根路径转向 API 说明或健康检查
app.get('/', (_req, res) => {
  res.json({
    message: '宠物领养平台 API 服务正在运行 🐾',
    api_docs: '请访问 /api/health 查看详情',
    endpoints: {
      pets: '/api/pets',
      stations: '/api/stations',
      faqs: '/api/faqs',
    },
  });
});

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: '宠物领养平台后端服务运行正常 🐾',
    timestamp: new Date().toISOString(),
  });
});

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// =====================================================================
// 启动服务
// =====================================================================
app.listen(PORT, () => {
  console.log(`\n🐾 宠物领养平台后端服务已启动`);
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   健康检查: http://localhost:${PORT}/api/health\n`);
});

export default app;
