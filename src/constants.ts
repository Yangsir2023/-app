import { Pet, RescueStation, FAQ, Application } from './types';

export const PETS: Pet[] = [
  {
    id: '1',
    name: '布丁',
    breed: '金毛寻回犬',
    age: '2岁',
    gender: 'male',
    weight: '24 kg',
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['温顺粘人', '活泼开朗', '聪明好学', '不拆家'],
    health: {
      vaccination: true,
      sterilization: true,
      deworming: true,
      description: '旺财目前身体非常健康，性格稳定。曾患有轻微皮肤瘙痒，现已完全康复。建议领养后保持居住环境干燥通风。'
    },
    story: '旺财是一只在雨夜被发现的小可怜，但现在的它满眼都是阳光。它非常渴望人类的关注，只要你蹲下身，它就会飞奔过来求摸摸。它已经学会了“坐下”、“握手”等基础指令。我们希望能为它找一个有足够活动空间，并愿意花时间陪伴它的温暖家庭。',
    category: 'dog'
  },
  {
    id: '2',
    name: '年糕',
    breed: '橘猫',
    age: '8个月',
    gender: 'female',
    weight: '3.5 kg',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1573865668131-9740307100ae?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['安静', '粘人'],
    health: {
      vaccination: true,
      sterilization: false,
      deworming: true,
      description: '年糕是一个非常健康的小姑娘。'
    },
    story: '年糕是在公园的长椅下被发现的，当时它正缩成一团躲雨。它非常安静，喜欢趴在窗台上晒太阳。',
    category: 'cat',
    isFavorite: true
  },
  {
    id: '3',
    name: '芝麻',
    breed: '英短蓝猫',
    age: '1岁',
    gender: 'male',
    weight: '5 kg',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['高冷', '独立'],
    health: {
      vaccination: true,
      sterilization: true,
      deworming: true,
      description: '芝麻已经完成了所有的基础医疗。'
    },
    story: '芝麻曾是一个家庭的宝贝，但因为主人搬家无法带走。它性格比较独立，但也享受偶尔的抚摸。',
    category: 'cat'
  },
  {
    id: '4',
    name: '可乐',
    breed: '拉布拉多',
    age: '1.5岁',
    gender: 'male',
    weight: '28 kg',
    distance: '3.1 km',
    image: 'https://images.unsplash.com/photo-1591769225440-811ad7d62ca2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1591769225440-811ad7d62ca2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['贪吃', '爱玩', '游泳健将'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '非常健康，胃口极好。' },
    story: '可乐是一只典型的拉布拉多，对世界充满了好奇和爱。它最喜欢玩捡球游戏，也特别喜欢水。',
    category: 'dog'
  },
  {
    id: '5',
    name: '雪球',
    breed: '萨摩耶',
    age: '3岁',
    gender: 'female',
    weight: '22 kg',
    distance: '4.5 km',
    image: 'https://images.unsplash.com/photo-1529429617329-8a737053918e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1529429617329-8a737053918e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1560160990-282649060f6b?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['微笑天使', '掉毛怪', '性格温顺'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '皮肤较敏感，需定期护理。' },
    story: '雪球总是带着治愈系的微笑，它是救助站里最受欢迎的“大白”。它需要一个有耐心打理毛发的主人。',
    category: 'dog'
  },
  {
    id: '6',
    name: '糯米',
    breed: '比熊',
    age: '2岁',
    gender: 'female',
    weight: '6 kg',
    distance: '1.5 km',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['不掉毛', '粘人', '棉花糖'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '身体健康。' },
    story: '糯米就像一颗甜甜的棉花糖，它非常适合公寓生活，只要有主人的陪伴它就很满足。',
    category: 'dog'
  },
  {
    id: '7',
    name: '奥利奥',
    breed: '边境牧羊犬',
    age: '1岁',
    gender: 'male',
    weight: '18 kg',
    distance: '5.2 km',
    image: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568393691622-c7bd131d63b4?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['智商高', '精力旺盛', '接球高手'],
    health: { vaccination: true, sterilization: false, deworming: true, description: '精力极其充沛。' },
    story: '奥利奥非常聪明，它能听懂很多指令。它需要大量的运动和脑力挑战，适合有经验的养犬家庭。',
    category: 'dog'
  },
  {
    id: '8',
    name: '豆豆',
    breed: '柯基',
    age: '4岁',
    gender: 'male',
    weight: '12 kg',
    distance: '2.0 km',
    image: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554692906-0841dc36bc9a?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['短腿', '电臀', '性格稳重'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '注意脊椎保护，不能太胖。' },
    story: '豆豆是一个性格稳重的小绅士，它走路时一扭一扭的屁股总是能逗乐所有人。',
    category: 'dog'
  },
  {
    id: '9',
    name: '奶茶',
    breed: '布偶猫',
    age: '2岁',
    gender: 'female',
    weight: '6 kg',
    distance: '3.8 km',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['仙女', '性格极好', '蓝眼睛'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康，毛发需定期梳理。' },
    story: '奶茶是救助站的颜值担当，它性格非常温顺，像个布娃娃一样任由你抱。',
    category: 'cat'
  },
  {
    id: '10',
    name: '炭头',
    breed: '孟买猫',
    age: '3岁',
    gender: 'male',
    weight: '5.5 kg',
    distance: '0.5 km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['黑猫', '辟邪', '酷酷的'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康。' },
    story: '炭头虽然长得黑，但心很暖。它喜欢在夜里悄悄跳上你的床头陪你睡觉。',
    category: 'cat'
  },
  {
    id: '11',
    name: '灰灰',
    breed: '俄罗斯蓝猫',
    age: '1.5岁',
    gender: 'male',
    weight: '4.8 kg',
    distance: '2.2 km',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['优雅', '害羞', '绿眼睛'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康。' },
    story: '灰灰需要一点时间来适应新环境，一旦它信任你，它就会变得非常粘人。',
    category: 'cat'
  },
  {
    id: '12',
    name: '花花',
    breed: '三花猫',
    age: '5岁',
    gender: 'female',
    weight: '4.2 kg',
    distance: '1.1 km',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1573865668131-9740307100ae?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['招财', '话痨', '爱撒娇'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康。' },
    story: '花花非常喜欢和人聊天，只要你跟它说话，它就会不停地喵喵回应。',
    category: 'cat'
  },
  {
    id: '13',
    name: '跳跳',
    breed: '垂耳兔',
    age: '1岁',
    gender: 'female',
    weight: '2 kg',
    distance: '0.9 km',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591384387119-073e77b5c160?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['萌物', '爱吃草', '安静'],
    health: { vaccination: true, sterilization: false, deworming: true, description: '健康。' },
    story: '跳跳是一个安静的小可爱，它最喜欢吃新鲜的蔬菜和干草。',
    category: 'small'
  },
  {
    id: '14',
    name: '皮皮',
    breed: '荷兰猪',
    age: '6个月',
    gender: 'male',
    weight: '0.8 kg',
    distance: '2.7 km',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548767791-5146842e65ef?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['猪猪', '胆小', '吃货'],
    health: { vaccination: false, sterilization: false, deworming: true, description: '健康。' },
    story: '皮皮需要一个安静的角落，它在吃东西的时候会发出可爱的叫声。',
    category: 'small'
  },
  {
    id: '15',
    name: '闪电',
    breed: '仓鼠',
    age: '3个月',
    gender: 'male',
    weight: '0.1 kg',
    distance: '0.3 km',
    image: 'https://images.unsplash.com/photo-1548767791-5146842e65ef?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1548767791-5146842e65ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['跑轮狂人', '夜猫子', '小巧'],
    health: { vaccination: false, sterilization: false, deworming: false, description: '健康。' },
    story: '闪电晚上非常活跃，它可以在跑轮上跑上一整晚。',
    category: 'small'
  },
  {
    id: '16',
    name: '大黄',
    breed: '中华田园犬',
    age: '5岁',
    gender: 'male',
    weight: '15 kg',
    distance: '6.0 km',
    image: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['忠诚', '看家高手', '体质好'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康，体质非常棒。' },
    story: '大黄是一个非常可靠的伙伴，它虽然没有名贵的血统，但它的忠诚是无价的。',
    category: 'dog'
  },
  {
    id: '17',
    name: '小白',
    breed: '博美',
    age: '2岁',
    gender: 'female',
    weight: '4 kg',
    distance: '1.8 km',
    image: 'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['小公举', '爱叫', '颜值高'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康。' },
    story: '小白需要主人的宠爱，它非常喜欢穿漂亮的衣服。',
    category: 'dog'
  },
  {
    id: '18',
    name: '煤球',
    breed: '泰迪',
    age: '1岁',
    gender: 'male',
    weight: '5 kg',
    distance: '2.4 km',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['聪明', '活泼', '不掉毛'],
    health: { vaccination: true, sterilization: false, deworming: true, description: '健康。' },
    story: '煤球是一个小机灵鬼，它能很快学会你教它的任何小把戏。',
    category: 'dog'
  },
  {
    id: '19',
    name: '圆圆',
    breed: '龙猫',
    age: '2岁',
    gender: 'female',
    weight: '0.6 kg',
    distance: '4.0 km',
    image: 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['毛质极好', '爱洗澡', '软萌'],
    health: { vaccination: false, sterilization: false, deworming: false, description: '健康。' },
    story: '圆圆非常喜欢沙浴，它在沙子里打滚的样子非常可爱。',
    category: 'small'
  },
  {
    id: '20',
    name: '点点',
    breed: '斑点狗',
    age: '3岁',
    gender: 'male',
    weight: '25 kg',
    distance: '7.5 km',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800'
    ],
    tags: ['运动健将', '帅气', '独特'],
    health: { vaccination: true, sterilization: true, deworming: true, description: '健康。' },
    story: '点点需要一个喜欢跑步的主人，它有着无穷无尽的精力。',
    category: 'dog'
  }
];

export const RESCUE_STATIONS: RescueStation[] = [
  {
    id: '1',
    name: '静安宠物救助中心',
    distance: '1.2km',
    status: '开放中',
    tags: ['猫犬均有'],
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: '暖心流浪动物之家',
    distance: '3.5km',
    status: '18:00闭馆',
    tags: ['急需义工'],
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=400'
  }
];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: '领养需要支付费用吗？',
    answer: '领养免费，但需承担基本疫苗成本及后续的绝育费用（如尚未绝育）。'
  },
  {
    id: '2',
    question: '租房居住可以领养吗？',
    answer: '可以，但需提供房东书面同意书以保证宠物在租住期间的稳定性。'
  },
  {
    id: '3',
    question: '如何申请成为救助志愿者？',
    answer: '年满18岁，每周有固定4小时以上空余时间，热爱动物即可申请。'
  }
];

export const APPLICATIONS: Application[] = [
  {
    id: '1',
    petName: '豆包',
    petImage: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80&w=400',
    breed: '金毛犬',
    age: '3个月',
    location: '上海',
    status: 'pending',
    progress: 66
  },
  {
    id: '2',
    petName: '露露',
    petImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
    breed: '英短蓝猫',
    age: '1岁',
    location: '上海',
    status: 'approved',
    progress: 100
  }
];
