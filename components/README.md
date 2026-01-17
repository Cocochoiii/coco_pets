# 网页比例调整 - 只改尺寸，不改设计

## 调整原则
- **桌面端 (lg/xl/2xl)**: 所有元素等比例放大
- **移动端 (默认/sm)**: 所有元素等比例缩小
- **设计完全不变**: 颜色、动画、布局逻辑全部保留

---

## 调整内容汇总

### HeroSection.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| 主标题 | `text-2xl → 2xl:text-7xl` | `text-2xl → 2xl:text-8xl` |
| 副标题 | `text-lg → 2xl:text-5xl` | `text-base → 2xl:text-6xl` |
| 描述文字 | `text-base → xl:text-2xl` | `text-sm → xl:text-2xl` |
| 价格信息 | `text-base → lg:text-xl` | `text-sm → xl:text-2xl` |
| 标题容器高度 | `h-[70px] → xl:h-[130px]` | `h-[60px] → 2xl:h-[180px]` |
| 移动端猫狗SVG | `w-24 scale-150` | `w-20` (移除scale) |
| 桌面端猫狗SVG | `lg:w-40 → 2xl:w-56` | `lg:w-48 → 2xl:w-64` |
| Stats数字 | `text-xl → lg:text-4xl` | `text-lg → xl:text-5xl` |
| Stats卡片 | `max-w-4xl` | `max-w-4xl lg:max-w-5xl` |
| Features卡片 | `max-w-4xl` | `max-w-4xl lg:max-w-5xl` |

### Services.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-16 md:py-20` | `py-12 md:py-16 lg:py-24` |
| 标题 | `text-3xl → md:text-5xl` | `text-2xl → xl:text-6xl` |
| 副标题 | `text-base → md:text-xl` | `text-sm → lg:text-xl` |
| 移动端SVG | `w-20 scale-150` | `w-16` (移除scale) |
| 桌面端SVG | `lg:w-40 → xl:w-48` | `lg:w-48 → xl:w-56` |

### CurrentPets.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| 标题 | `text-3xl md:text-5xl` | `text-2xl → xl:text-6xl` |
| 副标题 | `text-base md:text-xl` | `text-sm → lg:text-xl` |
| 移动端SVG | `w-100 scale-150` | `w-16` |
| 桌面端SVG | `lg:w-40 → xl:w-48` | `lg:w-48 → xl:w-56` |

### Testimonials.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-20` | `py-12 md:py-16 lg:py-24` |
| 标题 | `text-3xl → md:text-5xl` | `text-2xl → xl:text-6xl` |
| 移动端SVG | `w-20 scale-150` | `w-16` (移除scale) |

### AboutSection.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-16 md:py-20` | `py-12 md:py-16 lg:py-24` |
| 桌面端标题 | `text-3xl md:text-5xl` | `text-3xl → xl:text-6xl` |

### Contact.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-14 md:py-20` | `py-12 md:py-16 lg:py-24` |
| 标题 | `md:text-5xl` | `lg:text-5xl xl:text-6xl` |
| 移动端SVG | `w-20 scale-150` | `w-14` (移除scale) |

### ServiceArea.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-20` | `py-12 md:py-16 lg:py-24` |
| 标题 | `text-3xl → md:text-5xl` | `text-2xl → xl:text-6xl` |
| 移动端SVG | `w-500 scale-150` | `w-20` |

### BookingCalendar.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Section padding | `py-16 md:py-24` | `py-12 md:py-16 lg:py-24` |
| 标题 | `text-3xl md:text-4xl` | `text-2xl → xl:text-5xl` |

### Footer.tsx
| 元素 | 原值 | 新值 |
|------|------|------|
| Footer padding | `py-10 md:py-12` | `py-8 md:py-10 lg:py-16` |

---

## 使用方法

1. 将这些文件复制到你项目的 `components/` 文件夹
2. 替换同名文件
3. 运行 `npm run build` 确保没有错误
4. 部署

---

## 调整后的响应式断点效果

| 屏幕 | 主标题 | SVG装饰 | Section间距 |
|------|--------|---------|-------------|
| 手机 (<640px) | 24px | 64-80px | py-12 |
| 平板 (768px) | 36px | 隐藏 | py-16 |
| 桌面 (1024px) | 60px | 192px | py-24 |
| 大屏 (1280px) | 72px | 224px | py-24 |
| 超大屏 (1536px) | 96px | 256px | py-24 |

所有设计、颜色、动画效果完全保留不变！
